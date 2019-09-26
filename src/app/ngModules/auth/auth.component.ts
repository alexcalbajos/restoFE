import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HistoryService } from '../shared/services/helpers/history.service';

@Component({
    selector: 'ri-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.scss']
})

export class AuthComponent {
    constructor(
        private router: Router,
        private historyService: HistoryService) { }

    clientAuthenticated(): void {
        this.router.navigate([this.historyService.getRedirectUrl()]);
    }
}
