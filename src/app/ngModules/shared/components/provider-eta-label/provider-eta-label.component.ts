import { Component, Input } from '@angular/core';

import { Provider } from '../../../../models/provider/provider.model';

@Component({
    selector: 'ri-provider-eta-label',
    templateUrl: './provider-eta-label.component.html',
    styleUrls: ['./provider-eta-label.component.scss']
})
export class ProviderEtaLabelComponent {
    @Input() provider: Provider;
}
