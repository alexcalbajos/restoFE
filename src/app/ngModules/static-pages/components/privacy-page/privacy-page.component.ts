import { Component, OnInit } from '@angular/core';

import { MetaService } from '../../../shared/services/helpers/meta.service';

@Component({
    selector: 'ri-privacy-page',
    templateUrl: 'privacy-page.component.html',
    styleUrls: ['privacy-page.component.scss']
})
export class PrivacyPageComponent implements OnInit {
    constructor(private metaService: MetaService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'PRIVACY_POLICY_TITLE',
            description: 'page.home.description'
        });
    }
}
