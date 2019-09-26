import {
    AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, Renderer2, ViewChild
} from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

import { ProvidersService } from '../../../shared/services/business/providers/providers.service';

@Component({
    selector: 'ri-providers-filters',
    templateUrl: 'providers-filters.component.html',
    styleUrls: ['providers-filters.component.scss']
})
export class ProvidersFiltersComponent implements AfterViewInit {
    fixedVerticalElementInitialPosition: number;
    @Output() readonly newList: EventEmitter<MatSelectionList> = new EventEmitter<MatSelectionList>();

    @ViewChild('fixedVerticalElement') fixedVerticalElement: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private renderer2: Renderer2,
        public providersService: ProvidersService) { }

    ngAfterViewInit(): void {
        const fixedVerticalNativeElement: any = this.fixedVerticalElement.nativeElement;

        if (fixedVerticalNativeElement) {
            this.fixedVerticalElementInitialPosition = fixedVerticalNativeElement.getBoundingClientRect().top;
        }
    }

    newSelection(list: MatSelectionList): void {
        this.newList.emit(list);
    }

    @HostListener('window:scroll') toggleFixedElementPosition(): void {
        const providerFilters: any = this.elementRef.nativeElement;
        const fixedVerticalNativeElement: any = this.fixedVerticalElement.nativeElement;

        if (!providerFilters || !fixedVerticalNativeElement) return;

        const providerFiltersRect: any = providerFilters.getBoundingClientRect();
        const fixedVerticalElementRect: any = fixedVerticalNativeElement.getBoundingClientRect();

        if (providerFiltersRect.bottom < fixedVerticalElementRect.bottom) {
            this.renderer2.addClass(this.fixedVerticalElement.nativeElement, 'absolute');
        } else if (fixedVerticalElementRect.top >= this.fixedVerticalElementInitialPosition) {
            this.renderer2.removeClass(this.fixedVerticalElement.nativeElement, 'absolute');
        }
    }
}
