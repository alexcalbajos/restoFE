import { Injectable } from '@angular/core';

@Injectable()
export class BrowserService {
    isIE(): boolean {
        const isMs: boolean = navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1;
        const isEdge: boolean = this.isEdge();

        return isMs && !isEdge;
    }

    isEdge(): boolean {
        return window.navigator.userAgent.indexOf('Edge') > -1;
    }
}
