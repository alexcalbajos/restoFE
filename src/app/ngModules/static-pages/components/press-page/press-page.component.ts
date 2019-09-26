import { Component, OnInit } from '@angular/core';

import { MetaService } from '../../../shared/services/helpers/meta.service';

@Component({
    selector: 'ri-press-page',
    templateUrl: 'press-page.component.html',
    styleUrls: ['press-page.component.scss']
})
export class PressPageComponent implements OnInit {
    reports: Array<number> = [0, 1, 2, 3, 4, 5];

    constructor(private metaService: MetaService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'PRESS_TITLE',
            description: 'page.home.description'
        });
    }
}
