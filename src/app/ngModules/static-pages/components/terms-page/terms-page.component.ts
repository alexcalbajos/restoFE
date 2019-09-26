import { Component, OnInit } from '@angular/core';

import { MetaService } from '../../../shared/services/helpers/meta.service';

@Component({
    selector: 'ri-terms-page',
    templateUrl: 'terms-page.component.html',
    styleUrls: ['terms-page.component.scss']
})
export class TermsPageComponent implements OnInit {
    constructor(private metaService: MetaService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'TOS_TITLE',
            description: 'page.home.description'
        });
    }
}
