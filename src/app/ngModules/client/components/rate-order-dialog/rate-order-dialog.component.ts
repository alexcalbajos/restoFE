import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

import { MessageType } from '../../../../enums/message-type.enum';
import { Order } from '../../../../models/order/order.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { OrdersApiService } from '../../../shared/services/business/orders/orders.api.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-rate-order-dialog',
    templateUrl: 'rate-order-dialog.component.html',
    styleUrls: ['rate-order-dialog.component.scss']
})
export class RateOrderDialogComponent implements OnInit {
    rating: number;
    comments: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public order: Order,
        public dialogRef: MatDialogRef<RateOrderDialogComponent>,
        private sanitizer: DomSanitizer,
        private toasterWrapperService: ToasterWrapperService,
        private ordersApiService: OrdersApiService) { }

    ngOnInit(): void {
        this.order.selling_point.provider.sanitizedLogo =
            this.sanitizer.bypassSecurityTrustStyle(`url(${this.order.selling_point.provider.logo_url})`);

        if (this.order.selling_point.provider.sanitizedLogo.changingThisBreaksApplicationSecurity.includes('undefined')) {
            this.order.selling_point.provider.sanitizedLogo =
                this.sanitizer.bypassSecurityTrustStyle(`url(${this.order.selling_point.provider.logo_app_internal_list})`);
        }
    }

    onRatingChanges(event: any): void {
        this.rating = event;
    }

    submitRating(): void {
        this.ordersApiService.addRating(this.order.id, this.comments, this.rating)
            .subscribe((addRatingResponse: GenericResponse) => {
                if (addRatingResponse.errors) {
                    this.toasterWrapperService.show(addRatingResponse.errors[0].message, MessageType.Error);
                } else {
                    this.dialogRef.close();
                    this.order.rating = {
                        note_avg: addRatingResponse.data
                    };
                }
            });
    }
}
