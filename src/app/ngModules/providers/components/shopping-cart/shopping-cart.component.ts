import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit,
    Output, Renderer2, ViewChild
} from '@angular/core';

import { Cart } from '../../../../models/checkout/cart.model';
import { Client } from '../../../../models/client/client.model';
import { Provider } from '../../../../models/provider/provider.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ClientService } from '../../../shared/services/business/client/client.service';

@Component({
    selector: 'ri-shopping-cart',
    templateUrl: 'shopping-cart.component.html',
    styleUrls: ['shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() provider: Provider;
    cart: Cart;
    client: Client;
    fixedElementInitialPosition: number;
    @Output() readonly validateCart: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('fixedElement') fixedElement: ElementRef;

    constructor(
        private clientService: ClientService,
        private renderer2: Renderer2,
        private elementRef: ElementRef,
        private cartService: CartService) { }

    ngOnInit(): void {
        this.cartService.cart$.pipe(untilDestroyed(this)).subscribe((cart: Cart) => {
            this.cart = cart;
        });

        this.clientService.client$.pipe(untilDestroyed(this)).subscribe((client: Client) => {
            this.client = client;
        });
    }

    ngAfterViewInit(): void {
        const header: Element = document.getElementsByTagName('ri-header')[0];

        if (header) {
            const headerBottom: number = header.getBoundingClientRect().bottom;
            this.fixedElementInitialPosition = this.elementRef.nativeElement.offsetTop - headerBottom;
        }
    }

    ngOnDestroy(): void {
        this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed');
        this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed-at-bottom');
    }

    onValidateCart(): void {
        this.validateCart.emit();
    }

    @HostListener('window:scroll') toggleFixedElementPosition(): void {
        const modalIsOn: boolean = document.getElementsByTagName('html')[0].classList.contains('cdk-global-scrollblock');
        let isFixed: boolean;

        if (window.scrollY > this.fixedElementInitialPosition) {
            this.renderer2.addClass(this.fixedElement.nativeElement, 'fixed');
            this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed-at-bottom');
            isFixed = true;
        }

        if (this.fixedElement.nativeElement.getBoundingClientRect().bottom >=
            this.elementRef.nativeElement.getBoundingClientRect().bottom) {
            this.renderer2.addClass(this.fixedElement.nativeElement, 'fixed-at-bottom');
            this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed');
            isFixed = true;
        }

        if (!isFixed && !modalIsOn) {
            this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed');
            this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed-at-bottom');
        }
    }
}
