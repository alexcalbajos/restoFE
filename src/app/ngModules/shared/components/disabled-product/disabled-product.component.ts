import { Component, Input } from '@angular/core';

@Component({
    selector: 'ri-disabled-product',
    templateUrl: 'disabled-product.component.html',
    styleUrls: ['disabled-product.component.scss']
})
export class DisabledProductComponent {
    @Input() name: string;
    @Input() qty: number;
    @Input() price: number;
}
