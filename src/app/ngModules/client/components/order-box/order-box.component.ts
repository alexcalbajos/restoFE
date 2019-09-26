import * as _ from 'lodash';

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MqAlias } from '../../../../enums/media-query-alias.enum';
import { MessageType } from '../../../../enums/message-type.enum';
import { OrderStatus } from '../../../../enums/order-status.enum';
import { Order, OrderDetail } from '../../../../models/order/order.model';
import { Product } from '../../../../models/provider/product.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { OrdersApiService } from '../../../shared/services/business/orders/orders.api.service';
import {
    ProvidersApiService
} from '../../../shared/services/business/providers/providers.api.service';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';
import { MediaQueryService } from '../../../shared/services/helpers/media-query.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';
import {
    OrderDetailsDialogComponent
} from '../order-details-dialog/order-details-dialog.component';

@Component({
    selector: 'ri-order-box',
    templateUrl: './order-box.component.html',
    styleUrls: ['./order-box.component.scss']
})
export class OrderBoxComponent implements OnInit, OnChanges {
    @Input() order: Order;
    @Input() boxClass: string;
    @Input() hideViewDetails: boolean;
    @Output() readonly selectedOrder: EventEmitter<Order> = new EventEmitter<Order>();
    detailsButtonClass: string;
    reorderButtonClass: string;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private cartService: CartService,
        private providersService: ProvidersService,
        private providersApiService: ProvidersApiService,
        private router: Router,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private toasterWrapperService: ToasterWrapperService,
        public mediaQueryService: MediaQueryService,
        private ordersApiService: OrdersApiService) { }

    ngOnInit(): void {
        this.order.selling_point.provider.sanitizedLogo =
            this.sanitizer.bypassSecurityTrustStyle(`url(${this.order.selling_point.provider.logo_url})`);

        if (this.order.selling_point.provider.sanitizedLogo.changingThisBreaksApplicationSecurity.includes('undefined')) {
            this.order.selling_point.provider.sanitizedLogo =
                this.sanitizer.bypassSecurityTrustStyle(`url(${this.order.selling_point.provider.logo_app_internal_list})`);
        }
    }

    ngOnChanges(): void {
        this.orderChanged();
    }

    viewDetails(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
        }

        if (this.mediaQueryService._mediaChange.getValue().value < MqAlias.Md) {
            const dialog: MatDialogRef<OrderDetailsDialogComponent> = this.dialog.open(OrderDetailsDialogComponent, {
                data: this.order,
                autoFocus: false,
                panelClass: 'mobile'
            });

            dialog.afterClosed().subscribe((orderStatus: number) => {
                if (orderStatus) {
                    this.order.client_side_status = orderStatus;
                    this.orderChanged();
                }
            });
        } else {
            this.selectedOrder.emit(this.order);
        }
    }

    reorder(event: MouseEvent): void {
        event.stopPropagation();

        this.ordersApiService.get(this.order.id).subscribe((order: Order) => {
            this.providersApiService
                .get(order.provider.link, order.city.id, this.staticConfig.brandId)
                .subscribe((response: GenericResponse) => {
                    if (response.data) {
                        this.cartService.clearCart();
                        order.details.forEach((orderDetail: OrderDetail) => {
                            const product: Product = this.providersService.getProductFromOrderDetailAndProvider(orderDetail, response.data);
                            if (product) {
                                this.cartService.addProduct(product);
                            }
                        });
                        this.router.navigateByUrl('/checkout/validation');
                    } else if (response.errors) {
                        this.toasterWrapperService.show('PROVIDER_NOT_FOUND', MessageType.Error);
                    }
                });
        });
    }

    private orderChanged(): void {
        this.detailsButtonClass = this.getDetailsButtonClass();
        this.reorderButtonClass = this.getReorderButtonClass();
    }

    private getReorderButtonClass(): string {
        if (this.order.client_side_status === OrderStatus.Delivered) {
            return 'main-color';
        }
    }

    private getDetailsButtonClass(): string {
        if (this.order.client_side_status !== OrderStatus.Delivered) {
            return 'accent-color';
        }
    }
}
