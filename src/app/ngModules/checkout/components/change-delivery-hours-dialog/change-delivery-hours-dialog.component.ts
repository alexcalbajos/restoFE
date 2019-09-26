import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DeliveryDay, DeliveryHour } from '../../../../models/provider/delivery-day.model';
import {
    DeliveryHoursService
} from '../../../shared/services/business/delivery-hours/delivery-hours.service';

@Component({
    selector: 'ri-change-delivery-hours-dialog',
    templateUrl: 'change-delivery-hours-dialog.component.html',
    styleUrls: ['change-delivery-hours-dialog.component.scss']
})
export class ChangeDeliveryHoursDialogComponent implements OnInit {
    deliveryDays: Array<DeliveryDay>;
    deliveryHours: Array<DeliveryHour>;
    selectedDay: DeliveryDay;
    selectedHour: DeliveryHour;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private deliveryHoursService: DeliveryHoursService,
        public dialogRef: MatDialogRef<ChangeDeliveryHoursDialogComponent>) { }

    ngOnInit(): void {
        this.deliveryDays = this.data.deliveryDays;
        this.setSelectedDay();
        this.deliveryHoursService.setWeekdayTranslation(this.deliveryDays);
    }

    submit(): void {
        this.dialogRef.close({ deliveryDay: this.selectedDay, deliveryHour: this.selectedHour });
    }

    setSelectedDay(): void {
        if (this.data.selectedDay && this.data.selectedHour) {
            this.selectedDay = this.data.selectedDay;
            this.deliveryHours = this.data.selectedDay.hours;
            this.selectedHour = this.data.selectedHour;
        } else {
            this.selectedDay = this.deliveryDays[0];
            this.setSelectedHour(this.selectedDay);
        }
    }

    setSelectedHour(selectedDay: DeliveryDay): void {
        this.deliveryHours = selectedDay.hours;
        this.selectedHour = this.deliveryHours[0];
    }
}
