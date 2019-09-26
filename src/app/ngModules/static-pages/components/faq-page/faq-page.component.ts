import { Component, OnInit } from '@angular/core';

import { MetaService } from '../../../shared/services/helpers/meta.service';

@Component({
    selector: 'ri-faq-page',
    templateUrl: 'faq-page.component.html',
    styleUrls: ['faq-page.component.scss']
})
export class FaqPageComponent implements OnInit {
    constructor(private metaService: MetaService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'FAQ',
            description: 'page.home.description'
        });
    }
}
