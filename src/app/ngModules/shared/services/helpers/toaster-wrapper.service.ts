import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToasterWrapperService {
    constructor(
        private snackBar: MatSnackBar,
        private translateService: TranslateService) { }

    show(messageKey: string, type: string, messageParam?: any): void {
        this.translateService.get(messageKey, messageParam)
            .subscribe((messageTranslation: string) => {
                this.snackBar.open(messageTranslation, undefined, {
                    duration: 5000,
                    panelClass: `snack-${type}`
                });
            });
    }
}
