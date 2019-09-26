import * as _ from 'lodash';

import {
    Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren
} from '@angular/core';

import { ApiSchedule, DaySchedule, Schedule } from '../../../../models/corporate/schedule.model';
import {
    CorporateScheduleDayComponent
} from '../corporate-schedule-day/corporate-schedule-day.component';

@Component({
    selector: 'ri-corporate-schedule-table',
    templateUrl: 'corporate-schedule-table.component.html',
    styleUrls: ['corporate-schedule-table.component.scss']
})
export class CorporateScheduleTableComponent implements OnInit {
    @Input() selectedSchedules: Array<ApiSchedule>;
    @Input() morningSchedules: Array<Schedule>;
    @Input() eveningSchedules: Array<Schedule>;
    @Output() readonly hourChanged: EventEmitter<void> = new EventEmitter<void>();
    @ViewChildren('dayComponents') dayComponents: QueryList<CorporateScheduleDayComponent>;

    days: Array<DaySchedule> = [
        { name: 'WEEKDAY_MONDAY' },
        { name: 'WEEKDAY_TUESDAY' },
        { name: 'WEEKDAY_WEDNESDAY' },
        { name: 'WEEKDAY_THURSDAY' },
        { name: 'WEEKDAY_FRIDAY' },
        { name: 'WEEKDAY_SATURDAY' },
        { name: 'WEEKDAY_SUNDAY' }
    ];

    ngOnInit(): void {
        if (this.selectedSchedules) {
            this.getSchedulesFromApiSchedules();
        }
    }

    getSchedulesFromApiSchedules(): void {
        this.selectedSchedules.forEach((selectedSchedule: ApiSchedule, index: number) => {
            if (index % 2 === 0) {
                this.days[Number(selectedSchedule.day) - 1].morningStart =
                    _.find(this.morningSchedules, { value: selectedSchedule.start });

                this.days[Number(selectedSchedule.day) - 1].morningEnd =
                    _.find(this.morningSchedules, { value: selectedSchedule.end });
            } else {
                this.days[Number(selectedSchedule.day) - 1].eveningStart =
                    _.find(this.eveningSchedules, { value: selectedSchedule.start });

                this.days[Number(selectedSchedule.day) - 1].eveningEnd =
                    _.find(this.eveningSchedules, { value: selectedSchedule.end });
            }
        });
    }

    getApiSchedulesFromSchedules(): string {
        const apiSchedules: Array<string> = [];

        this.days.forEach((day: DaySchedule, index: number) => {
            const apiDay: any = {
                morning: {
                    start: day.morningStart.value,
                    end: day.morningEnd.value
                },
                evening: {
                    start: day.eveningStart.value,
                    end: day.eveningEnd.value
                }
            };

            apiSchedules.push(`"${index + 1}":${JSON.stringify(apiDay)}`);
        });

        return `{${apiSchedules.join(',')}}`;
    }

    validate(): boolean {
        let result: boolean = true;

        this.dayComponents.forEach((dayComponent: CorporateScheduleDayComponent) => {
            const dayValidation: boolean = dayComponent.validate();

            if (result) {
                result = dayValidation;
            }
        });

        return result;
    }

    onHourChange(): void {
        this.hourChanged.emit();
    }
}
