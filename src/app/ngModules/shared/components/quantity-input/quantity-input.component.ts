import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ri-quantity-input',
    templateUrl: 'quantity-input.component.html',
    styleUrls: ['quantity-input.component.scss']
})
export class QuantityInputComponent {
    @Input() qty: number;
    @Input() disableDelete: boolean;
    @Input() disableAdd: boolean;
    @Output() readonly qtyChange: EventEmitter<number> = new EventEmitter<number>();

    plus(event: any): void {
        event.stopPropagation();

        if (!this.qty) {
            this.qty = 0;
        }

        this.qtyChange.emit(this.qty + 1);
    }

    minus(event: any): void {
        event.stopPropagation();

        if (this.disableDelete && this.qty - 1 <= 0) {
            this.qty = 1;
        } else {
            this.qty--;
        }

        this.qtyChange.emit(this.qty);
    }

    preventDefault(event: any): void {
        event.preventDefault();
        event.stopPropagation();
    }
}
