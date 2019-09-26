import { Component, Input } from '@angular/core';

@Component({
    selector: 'ri-provider-rating',
    templateUrl: 'provider-rating.component.html',
    styleUrls: ['provider-rating.component.scss']
})
export class ProviderRatingComponent {
    @Input() rating: number;
    @Input() showMeta: boolean;
    @Input() ratingCount: number;

    getRatingClass(): string {
        if (this.rating >= 89) {
            return 'lg';
        } else if (this.rating >= 79) {
            return 'md';
        } else if (this.rating >= 69) {
            return 'sm';
        } else {
            return 'xs';
        }
    }
}
