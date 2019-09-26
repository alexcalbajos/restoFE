import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class HistoryService {
    history: Array<string> = [];

    constructor(private router: Router) { }

    init(): void {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.history.unshift(event.url);
            }
        });
    }

    getRedirectUrl(): string {
        let url: string = '/';

        for (const urlFromHistory of this.history) {
            if (!urlFromHistory.includes('auth')) {
                url = urlFromHistory;
                break;
            }
        }

        return url;
    }
}
