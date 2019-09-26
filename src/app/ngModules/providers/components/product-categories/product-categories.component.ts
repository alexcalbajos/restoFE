import * as $ from 'jquery';
import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest } from 'rxjs';

import {
    AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2,
    ViewChild
} from '@angular/core';

import { Cart } from '../../../../models/checkout/cart.model';
import { ProductCategory } from '../../../../models/provider/product-category.model';
import { Product } from '../../../../models/provider/product.model';
import { Provider } from '../../../../models/provider/provider.model';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { MediaQueryService } from '../../../shared/services/helpers/media-query.service';
import { ScrollService } from '../../../shared/services/helpers/scroll.service';

@Component({
    selector: 'ri-product-categories',
    templateUrl: 'product-categories.component.html',
    styleUrls: ['product-categories.component.scss']
})
export class ProductCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() provider: Provider;
    cart: Cart;
    otherCategories: Array<ProductCategory> = [];
    fixedElementInitialPosition: number;

    @ViewChild('fixedElement') fixedElement: ElementRef;

    constructor(
        private scrollService: ScrollService,
        private mediaQueryService: MediaQueryService,
        private elementRef: ElementRef,
        private sessionAddressService: SessionAddressService,
        private renderer2: Renderer2) { }

    ngOnInit(): void {
        this.provider.categories.forEach((category: ProductCategory) => {
            category.scrollToSelector = `ri-product-category[data='${category.id}'] .category-name`;
            category.scrollOffset = (document.querySelector('ri-header') as HTMLElement).offsetHeight * 2;

            category.products.forEach((product: Product) => {
                if (category.show_images && !product.image_app_list) {
                    product.image_app_list = '/assets/images/no_photo.png';
                }

                product.shortDescription = _.truncate(product.description, { length: 40 });
                product.shortName = _.truncate(product.name, { length: 32 });
            });
        });
    }

    ngAfterViewInit(): void {
        combineLatest(
            this.mediaQueryService.mediaChange$,
            this.sessionAddressService.sessionAddress$
        ).pipe(untilDestroyed(this)).subscribe(() => {
            this.runListeners();
        });
    }

    ngOnDestroy(): void {/**/ }

    scrollToCategory(category: ProductCategory): void {
        const scrollToSelector: string = `ri-product-category[data='${category.id}'] .category-name`;

        const header: Element = document.getElementsByTagName('ri-header')[0];
        const categoriesHeader: Element = document.getElementById('CategoriesHeader');

        if (header && categoriesHeader) {
            const headerHeight: number = header.getBoundingClientRect().height;
            const categoriesHeaderHeight: number = categoriesHeader.getBoundingClientRect().height;

            this.scrollService.scrollTo(scrollToSelector, undefined, headerHeight + categoriesHeaderHeight);
        }
    }

    runListeners(): void {
        const header: Element = document.getElementsByTagName('ri-header')[0];
        const titleBar: Element = document.getElementsByTagName('ri-provider-title-bar')[0];

        if (!header || !titleBar) return;

        const headerHeight: number = header.getBoundingClientRect().height;
        const titleBarBottom: number = titleBar.getBoundingClientRect().bottom;

        this.fixedElementInitialPosition = titleBarBottom + document.documentElement.scrollTop - headerHeight;

        setTimeout(() => {
            this.hideCategoriesOverflow();
            this.setFixedElementWidth();
        });
    }

    @HostListener('window:scroll') toggleFixedElementPosition(): void {
        const modalIsOn: boolean = document.getElementsByTagName('html')[0].classList.contains('cdk-global-scrollblock');

        if (window.scrollY > this.fixedElementInitialPosition) {
            this.renderer2.addClass(this.fixedElement.nativeElement, 'fixed');
        } else if (!modalIsOn) {
            this.renderer2.removeClass(this.fixedElement.nativeElement, 'fixed');
        }
    }

    @HostListener('window:resize') private hideCategoriesOverflow(): void {
        this.otherCategories = [];

        const categoriesHeader: Element = $('#CategoriesHeader')[0];
        const others: JQuery = $('#CategoriesHeader #Others');

        if (!categoriesHeader || !others[0]) return;

        const containerTop: number = categoriesHeader.getBoundingClientRect().top;

        this.checkCategories(containerTop);

        let othersTop: number = others[0].getBoundingClientRect().top;

        while (othersTop && othersTop !== containerTop) {
            this.checkOthersMenu();
            othersTop = others[0].getBoundingClientRect().top;
        }

        if (!this.otherCategories.length) {
            others.addClass('hide');
        } else {
            others.removeClass('hide');
        }
    }

    @HostListener('window:resize') private setFixedElementWidth(): void {
        const fixedElementContainerWidth: number = this.elementRef.nativeElement.offsetWidth;
        this.renderer2.setStyle(this.fixedElement.nativeElement, 'width', `${fixedElementContainerWidth}px`);
    }

    private checkCategories(containerTop: number): void {
        this.provider.categories.forEach((category: ProductCategory) => {
            const categoryElement: JQuery = $(`#${category.id}`);

            if (!categoryElement[0]) return;

            categoryElement.removeClass('hide');
            const categoryTop: number = categoryElement[0].getBoundingClientRect().top;
            if (categoryTop !== containerTop) {
                categoryElement.addClass('hide');
                this.otherCategories.push(category);
            }
        });
    }

    private checkOthersMenu(): void {
        const lastCategoryElement: JQuery = $('#CategoriesHeader h4.nav').not('.hide').last();
        lastCategoryElement.addClass('hide');

        const categoryId: string = lastCategoryElement.attr('id');
        const lastCategory: ProductCategory = _.find(this.provider.categories, { id: Number(categoryId) });
        this.otherCategories.unshift(lastCategory);
    }
}
