import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ri-legal',
    templateUrl: 'legal.component.html',
    styleUrls: ['legal.component.scss']
})
export class LegalComponent implements OnInit {
    @HostBinding('class') class: string = 'top-margin-container';
    @Input() numberOfAreas: number;
    @Input() prefix: string;
    @Input() title: string;
    desc: string;
    areaIds: Array<number> = [];
    areaTitles: Array<string> = [];
    areaDescriptions: Array<string> = [];

    constructor(private translateService: TranslateService) { }

    ngOnInit(): void {
        for (let i: number = 0; i < this.numberOfAreas; i++) {
            this.areaIds.push(i);
        }

        this.getTranslations();

        this.translateService.onLangChange.subscribe(() => {
            this.getTranslations();
        });
    }

    getTranslations(): void {
        this.translateService.get(`${this.prefix}_DESC`).subscribe((rawHtml: string) => {
            this.desc = rawHtml;
        });

        this.areaTitles = [];
        this.areaDescriptions = [];
        this.areaIds.forEach((areaId: number) => {
            this.translateService.get(`${this.prefix}_${areaId + 1}_TITLE`).subscribe((rawHtml: string) => {
                this.areaTitles.push(rawHtml);
            });

            this.translateService.get(`${this.prefix}_${areaId + 1}_DESC`).subscribe((rawHtml: string) => {
                this.areaDescriptions.push(rawHtml);
            });
        });
    }
}
