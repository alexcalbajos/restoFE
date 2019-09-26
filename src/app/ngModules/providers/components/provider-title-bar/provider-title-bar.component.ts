import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Provider } from '../../../../models/provider/provider.model';
import { AllergiesDialogComponent } from '../allergies-dialog/allergies-dialog.component';
import {
    ProviderDetailsDialogComponent
} from '../provider-details-dialog/provider-details-dialog.component';

@Component({
    selector: 'ri-provider-title-bar',
    templateUrl: 'provider-title-bar.component.html',
    styleUrls: ['provider-title-bar.component.scss']
})
export class ProviderTitleBarComponent {
    @Input() provider: Provider;

    constructor(private dialog: MatDialog) { }

    openProviderDetailsDialog(): void {
        this.dialog.open(ProviderDetailsDialogComponent, {
            data: this.provider
        });
    }

    openAllergiesDialog(): void {
        this.dialog.open(AllergiesDialogComponent, {
            data: this.provider
        });
    }
}
