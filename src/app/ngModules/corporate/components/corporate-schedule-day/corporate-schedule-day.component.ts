import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DaySchedule, Schedule } from '../../../../models/corporate/schedule.model';

@Component({
    selector: 'ri-corporate-schedule-day',
    templateUrl: 'corporate-schedule-day.component.html',
    styleUrls: ['corporate-schedule-day.component.scss']
})
export class CorporateScheduleDayComponent implements OnInit {
    @Input() day: DaySchedule;
    @Input() morningSchedules: Array<Schedule>;
    @Input() eveningSchedules: Array<Schedule>;
    @Output() readonly hourChanged: EventEmitter<void> = new EventEmitter<void>();
    invalidMorning: boolean;
    invalidEvening: boolean;
    incompleteMorning: boolean;
    incompleteEvening: boolean;

    ngOnInit(): void {
        if (!this.day.morningStart) {
            this.day.morningStart = this.morningSchedules[0];
        }

        if (!this.day.morningEnd) {
            this.day.morningEnd = this.morningSchedules[0];
        }

        if (!this.day.eveningStart) {
            this.day.eveningStart = this.eveningSchedules[0];
        }

        if (!this.day.eveningEnd) {
            this.day.eveningEnd = this.eveningSchedules[0];
        }
    }

    validate(): boolean {
        this.day.isValid = true;
        this.invalidMorning = false;
        this.invalidEvening = false;
        this.incompleteMorning = false;
        this.incompleteEvening = false;

        if ((this.day.morningStart.date && !this.day.morningEnd.date) ||
            (!this.day.morningStart.date && this.day.morningEnd.date)) {
            this.day.isValid = false;
            this.invalidMorning = true;
            this.incompleteMorning = true;
        } else if (this.day.morningStart.date >= this.day.morningEnd.date) {
            this.day.isValid = false;
            this.invalidMorning = true;
            this.incompleteMorning = false;
        }

        if ((this.day.eveningStart.date && !this.day.eveningEnd.date) ||
            (!this.day.eveningStart.date && this.day.eveningEnd.date)) {
            this.day.isValid = false;
            this.invalidEvening = true;
            this.incompleteEvening = true;
        } else if (this.day.eveningStart.date >= this.day.eveningEnd.date) {
            this.day.isValid = false;
            this.invalidEvening = true;
            this.incompleteEvening = false;
        }

        return this.day.isValid;
    }

    onMorningChange(): void {
        this.invalidMorning = false;
        this.hourChanged.emit();
    }

    onEveningChange(): void {
        this.invalidEvening = false;
        this.hourChanged.emit();
    }
}
