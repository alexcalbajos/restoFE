import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageType } from '../../../enums/message-type.enum';
import { GenericResponse } from '../../../models/response/generic-response.model';
import {
    OrdersApiService
} from '../../../ngModules/shared/services/business/orders/orders.api.service';
import { OrdersService } from '../../../ngModules/shared/services/business/orders/orders.service';
import {
    ToasterWrapperService
} from '../../../ngModules/shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-paypal-redirect-page',
    templateUrl: 'paypal-redirect-page.component.html',
    styleUrls: ['paypal-redirect-page.component.scss']
})
export class PaypalRedirectPageComponent implements OnInit {
    @HostBinding('class') class: string = 'template-page';

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private ordersService: OrdersService,
        private toasterWrapperService: ToasterWrapperService,
        private ordersApiService: OrdersApiService) { }

    ngOnInit(): void {
        const status: string = this.activatedRoute.snapshot.params.status;

        if (status === 'complete') {
            this.ordersApiService
                .confirmPaypal(this.activatedRoute.snapshot.queryParams.locale, this.activatedRoute.snapshot.queryParams.token)
                .subscribe((response: GenericResponse) => {
                    if (response.data) {
                        this.ordersService.orderCompleted(response.data.orderId, response.data.total_ft);
                    } else if (response.errors) {
                        this.toasterWrapperService.show(response.errors[0].message, MessageType.Error);
                    }
                });
        }

        if (status === 'cancel') {
            this.router.navigateByUrl('/checkout/validation');
        }
    }
}
