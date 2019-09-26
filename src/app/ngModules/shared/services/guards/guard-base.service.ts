import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MessageType } from '../../../../enums/message-type.enum';
import { HistoryService } from '../helpers/history.service';
import { ToasterWrapperService } from '../helpers/toaster-wrapper.service';

@Injectable()
export class GuardBaseService {
    constructor(
        private toasterWrapperService: ToasterWrapperService,
        private router: Router,
        private historyService: HistoryService) { }

    goBack(): void {
        if (this.historyService.history.length > 1) {
            this.router.navigateByUrl(this.historyService.history[0]);
        } else {
            this.router.navigateByUrl('/');
        }

        this.toasterWrapperService.show('UNAUTHORIZED', MessageType.Warning);
    }
}
