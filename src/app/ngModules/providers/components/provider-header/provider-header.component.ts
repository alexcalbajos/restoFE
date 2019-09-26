import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Provider } from '../../../../models/provider/provider.model';

@Component({
    selector: 'ri-provider-header',
    templateUrl: 'provider-header.component.html',
    styleUrls: ['provider-header.component.scss']
})
export class ProviderHeaderComponent implements OnInit {
    @Input() provider: Provider;

    @ViewChild('container') container: ElementRef;

    constructor(private renderer2: Renderer2) { }

    ngOnInit(): void {
        const gradient: string = 'linear-gradient(270deg, rgba(255, 255, 255, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%)';
        this.renderer2.setStyle(this.container.nativeElement,
            'background', `${gradient}, url("${this.provider.providers_top1165}") center`);
    }
}
