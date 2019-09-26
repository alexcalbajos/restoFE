import { Directive, HostListener, Input } from '@angular/core';

import { ScrollService } from '../services/helpers/scroll.service';

@Directive({ selector: '[ri-scroll-anchor]' })
export class ScrollAnchorDirective {
    @Input() params: { scrollTo: string, container?: string, offSet?: number };

    constructor(private scrollService: ScrollService) { }

    @HostListener('click') onClick(): void {
        this.scrollService.scrollTo(this.params.scrollTo, this.params.container, this.params.offSet);
    }
}
