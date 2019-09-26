import { Component, OnInit } from '@angular/core';

import { CartService } from '../../../shared/services/business/cart/cart.service';

@Component({
    selector: 'ri-cutlery',
    templateUrl: 'cutlery.component.html',
    styleUrls: ['cutlery.component.scss']
})
export class CutleryComponent implements OnInit {
    checked: boolean;

    constructor(private cartService: CartService) { }

    ngOnInit(): void {
        this.checked = this.cartService._cart.getValue().cutlery;
    }

    change(): void {
        this.cartService._cart.next({ ...this.cartService._cart.getValue(), cutlery: this.checked });
    }
}
