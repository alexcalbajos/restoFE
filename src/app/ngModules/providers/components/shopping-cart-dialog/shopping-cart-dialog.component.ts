import { untilDestroyed } from 'ngx-take-until-destroy';

import {
    AfterViewInit, Component, ElementRef, HostBinding, Inject, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cart } from '../../../../models/checkout/cart.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ZopimService } from '../../../shared/services/helpers/zopim.service';

@Component({
    selector: 'ri-shopping-cart-dialog',
    templateUrl: 'shopping-cart-dialog.component.html',
    styleUrls: ['shopping-cart-dialog.component.scss']
})
export class ShoppingCartDialogComponent implements OnInit, OnDestroy, AfterViewInit {
    @HostBinding('class') class: string = 'mobile-component';
    cart: Cart;
    @ViewChild('mobileBottomRow') mobileBottomRow: ElementRef;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: number,
        private zopimService: ZopimService,
        public dialogRef: MatDialogRef<ShoppingCartDialogComponent>,
        private cartService: CartService) { }

    ngOnInit(): void {
        this.cartService.cart$.pipe(untilDestroyed(this)).subscribe((cart: Cart) => {
            this.cart = cart;

            if (cart.total === 0) {
                this.dialogRef.close();
            }
        });
    }

    ngAfterViewInit(): void {
        this.zopimService.moveChatButton(this.mobileBottomRow.nativeElement.offsetHeight);
    }

    ngOnDestroy(): void {
        this.zopimService.moveChatButton(this.data);
    }
}
