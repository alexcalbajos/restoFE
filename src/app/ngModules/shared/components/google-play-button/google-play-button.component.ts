import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ri-google-play-button',
    templateUrl: 'google-play-button.component.html',
    styleUrls: ['google-play-button.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GooglePlayButtonComponent {
    openAndroid(): void {
        window.open('https://play.google.com/store/apps/details?id=com.ri.restoin');
    }
}
