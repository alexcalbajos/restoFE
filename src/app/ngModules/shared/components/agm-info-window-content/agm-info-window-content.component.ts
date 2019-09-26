import { Component, Input } from '@angular/core';

@Component({
    selector: 'ri-agm-info-window-content',
    templateUrl: 'agm-info-window-content.component.html',
    styleUrls: ['agm-info-window-content.component.scss']
})
export class AgmInfoWindowContentComponent {
    @Input() imgSrc: any;
    @Input() name: string;
    @Input() phone: string;
}
