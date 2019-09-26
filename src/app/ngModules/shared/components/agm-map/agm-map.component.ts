import { untilDestroyed } from 'ngx-take-until-destroy';
import { interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { AgmMap } from '@agm/core';
import {
    AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { OrderStatus } from '../../../../enums/order-status.enum';
import { PointAddress } from '../../../../models/address/address.model';
import { Order } from '../../../../models/order/order.model';
import { OrdersApiService } from '../../../shared/services/business/orders/orders.api.service';

@Component({
    selector: 'ri-agm-map',
    templateUrl: 'agm-map.component.html',
    styleUrls: ['agm-map.component.scss']
})
export class AgmMapComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() mapHeight: string;
    @Input() orderId: number;
    @Output() readonly statusChanged: EventEmitter<Order> = new EventEmitter<Order>();
    clientMarker: PointAddress;
    sellingPointMarker: PointAddress;
    deliveryManMarker: PointAddress;
    allMarkers: Array<PointAddress> = [];
    order: Order;
    lastStatus: number;
    timerSubscription: Subscription;
    mapInstance: any;
    showBetaOptions: boolean;

    @ViewChild('agmMap') agmMap: AgmMap;

    constructor(private ordersApiService: OrdersApiService) { }

    ngOnInit(): void {
        this.agmMap.mapReady.subscribe((mapInstance: any) => {
            this.mapInstance = mapInstance;

            let time: number = 30000;

            if (!environment.production) {
                time = 3000000;
                this.showBetaOptions = true;
            }

            this.timerSubscription = interval(time).pipe(untilDestroyed(this)).pipe(startWith(0)).subscribe(() => {
                this.checkOrder();
            });
        });
    }

    ngAfterViewInit(): void {
        (document.getElementsByTagName('agm-map')[0] as HTMLElement).style.height = this.mapHeight;
    }

    ngOnDestroy(): void {/**/ }

    checkOrder(): void {
        this.ordersApiService.getFromTracking(this.orderId).subscribe((order: Order) => {
            this.order = order;

            this.centerMap();
            this.handleOrderStatus();
        });
    }

    changeStatus(clientStatus: number): void {
        if (environment.production) {
            return;
        }

        this.order.client_side_status = clientStatus;

        const dummyDeliveryMan: any = {
            first_name: 'Bruce',
            latitude: 41.3842,
            longitude: 2.1021,
            mobile: '+33667072752',
            num_deliveries: 21,
            note_avg: 5
        };

        this.order.delivery_men_id = undefined;

        if (clientStatus === OrderStatus.PickingOrder) {
            this.order.delivery_men_id = dummyDeliveryMan;
        }

        if (clientStatus === OrderStatus.Delivering) {
            this.order.delivery_men_id = dummyDeliveryMan;
            this.order.delivery_men_id.latitude = 41.392719;
            this.order.delivery_men_id.longitude = 2.144034;
        }

        this.centerMap();
        this.handleOrderStatus();
    }

    private handleOrderStatus(): void {
        if (this.lastStatus && this.lastStatus === this.order.client_side_status) {
            return;
        }

        this.lastStatus = this.order.client_side_status;
        this.statusChanged.emit(this.order);
    }

    private centerMap(): void {
        this.setMarkers();
        const bounds: any = this.getMapBounds();
        this.mapInstance.fitBounds(bounds);
    }

    private setMarkers(): void {
        this.allMarkers = [];
        this.clientMarker = undefined;
        this.sellingPointMarker = undefined;
        this.deliveryManMarker = undefined;

        if (this.order.address) {
            this.clientMarker = {
                lat: this.order.address.lat,
                lng: this.order.address.lng
            };
            this.allMarkers.push(this.clientMarker);
        }

        if (this.order.selling_point) {
            this.sellingPointMarker = {
                lat: this.order.selling_point.latitude,
                lng: this.order.selling_point.longitude
            };
            this.allMarkers.push(this.sellingPointMarker);
        }

        if (this.order.delivery_men_id) {
            this.deliveryManMarker = {
                lat: this.order.delivery_men_id.latitude,
                lng: this.order.delivery_men_id.longitude
            };
            this.allMarkers.push(this.deliveryManMarker);
        }
    }

    private getMapBounds(): google.maps.LatLngBounds {
        const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();

        this.allMarkers.forEach((marker: PointAddress) => {
            bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
        });

        return bounds;
    }
}
