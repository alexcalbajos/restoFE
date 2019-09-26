import { Injectable } from '@angular/core';

@Injectable()
export class StringWrapperService {
    toUpperCaseFirst(stringToModify: string): string {
        stringToModify = stringToModify.toLocaleLowerCase();

        return stringToModify.charAt(0).toUpperCase() + stringToModify.slice(1);
    }

    beautifyOpenGraphTitle(title: string): string {
        if (title) {
            if (title.charAt(title.length - 1) === '.') {
                title = title.slice(0, -1);
            }
        }

        return this.toUpperCaseFirst(title);
    }
}
