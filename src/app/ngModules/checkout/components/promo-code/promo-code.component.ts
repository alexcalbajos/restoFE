import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ChangePromoCodeComponent } from '../change-promo-code/change-promo-code.component';

@Component({
    selector: 'ri-promo-code',
    templateUrl: 'promo-code.component.html',
    styleUrls: ['promo-code.component.scss']
})
export class PromoCodeComponent {
    constructor(private dialog: MatDialog) { }

    openDialog(): void {
        this.dialog.open(ChangePromoCodeComponent, {
            autoFocus: false,
            panelClass: 'small-dialog'
        });
    }
}
