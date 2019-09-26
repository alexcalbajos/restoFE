import { Injectable } from '@angular/core';

@Injectable()
export class DatesHelperService {
    clearInvalidDate(entity: any, dateKey: string): void {
        if (entity[dateKey] && entity[dateKey][0] === '-') {
            entity[dateKey] = '';
        }
    }

    getDateForSafari(dateFromResponse: string): Date {
        const dateVals: Array<string> = dateFromResponse.split('-');

        return new Date(
            parseInt(dateVals[0], 10),
            parseInt(dateVals[1], 10) - 1,
            parseInt(dateVals[2], 10)
        );
    }
}
