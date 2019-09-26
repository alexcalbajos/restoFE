import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime, pairwise, startWith } from 'rxjs/operators';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output,
    Renderer2, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { Cart } from '../../../../models/checkout/cart.model';
import {
    CheckoutValidationResponse
} from '../../../../models/checkout/checkout-validation-response.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';

@Component({
    selector: 'ri-checkout-cart',
    templateUrl: 'checkout-cart.component.html',
    styleUrls: ['checkout-cart.component.scss']
})
export class CheckoutCartComponent implements OnInit, AfterViewInit, OnDestroy {
    dataLoaded: boolean;
    cart: Cart;
    automaticValidationResponse: CheckoutValidationResponse;
    groupedProducts: any;
    fixedElementInitialPosition: number;
    @Output() readonly validateCart: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('fixedElement') fixedElement: ElementRef;

    constructor(
        private cartService: CartService,
        private router: Router,
        private checkoutService: CheckoutService,
        private elementRef: ElementRef,
        private renderer2: Renderer2) { }

    ngOnInit(): void {
        this.checkoutService.automaticValidationResponse$.pipe(untilDestroyed(this))
            .subscribe((automaticValidationResponse: CheckoutValidationResponse) => {
                this.automaticValidationResponse = automaticValidationResponse;
            });

        this.cartService.cart$.pipe(untilDestroyed(this))
            .pipe(startWith(undefined))
            .pipe(pairwise())
            .subscribe((cartPair: Array<Cart>) => {
                const oldCart: Cart = cartPair[0];
                const cart: Cart = cartPair[1];

                this.cart = cart;
                this.groupedProducts = cart.isMultiOrder ? _.groupBy(cart.products, 'clientFullName') : undefined;

                if (!cart.numberOfProducts) {
                    this.router.navigate([oldCart.provider.provider_url]);
                }
            });

        this.checkoutService.dataLoaded$.pipe(untilDestroyed(this)).pipe(debounceTime(500)).subscribe((dataLoaded: boolean) => {
            this.dataLoaded = dataLoaded;
        });

        this.checkoutService.setDataLoadedTimeout();
    }

    ngAfterViewInit(): void {
        const header: Element = document.getElementsByTagName('ri-header')[0];

        if (header) {
            const headerBottom: number = header.getBoundingClientRect().bottom;
            this.fixedElementInitialPosition = this.elementRef.nativeElement.offsetTop - headerBottom;
        }
    }

    ngOnDestroy(): void {
        this.checkoutService._dataLoaded.next(false);

        clearInterval(this.checkoutService.dataLoadedInterval);

        this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed');
        this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed-at-bottom');
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

    onValidateCart(): void {
        this.validateCart.emit();
    }
}
