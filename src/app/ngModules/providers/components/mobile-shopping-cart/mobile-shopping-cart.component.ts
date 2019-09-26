import { untilDestroyed } from 'ngx-take-until-destroy';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Cart } from '../../../../models/checkout/cart.model';
import { Provider } from '../../../../models/provider/provider.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ZopimService } from '../../../shared/services/helpers/zopim.service';
import {
    ShoppingCartDialogComponent
} from '../shopping-cart-dialog/shopping-cart-dialog.component';

@Component({
    selector: 'ri-mobile-shopping-cart',
    templateUrl: 'mobile-shopping-cart.component.html',
    styleUrls: ['mobile-shopping-cart.component.scss']
})
export class MobileShoppingCartComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() provider: Provider;
    cart: Cart;
    shoppingCartDialogOpened: boolean;
    @Output() readonly validateCart: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private zopimService: ZopimService,
        private elementRef: ElementRef,
        private dialog: MatDialog,
        private cartService: CartService) { }

    ngOnInit(): void {
        this.cartService.cart$.pipe(untilDestroyed(this)).subscribe((cart: Cart) => {
            this.cart = cart;
            if (!this.shoppingCartDialogOpened) {
                setTimeout(() => this.zopimService.moveChatButton(this.elementRef.nativeElement.offsetHeight));
            }
        });
    }

    ngAfterViewInit(): void {
        this.zopimService.moveChatButton(this.elementRef.nativeElement.offsetHeight);
    }

    ngOnDestroy(): void {
        this.zopimService.moveChatButton(0);
    }

    viewCart(): void {
        this.shoppingCartDialogOpened = true;

        const dialog: MatDialogRef<ShoppingCartDialogComponent> = this.dialog.open(ShoppingCartDialogComponent, {
            autoFocus: false,
            panelClass: 'mobile',
            data: this.elementRef.nativeElement.offsetHeight
        });

        dialog.afterClosed().subscribe(() => {
            this.shoppingCartDialogOpened = false;
            this.zopimService.moveChatButton(this.elementRef.nativeElement.offsetHeight);
        });
    }

    onValidateCart(): void {
        this.validateCart.emit();
    }
}
