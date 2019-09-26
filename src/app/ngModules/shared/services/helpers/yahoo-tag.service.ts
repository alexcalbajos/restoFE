import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';

declare var YAHOO: any;

@Injectable()
export class YahooTagService {
    interestedUser(): void {
        (window as any).dotq = (window as any).dotq || [];
        (window as any).dotq.push(
            {
                projectId: environment.yahooProjectId,
                properties: {
                    pixelId: environment.yahooPixelId,
                    qstrings: {
                        et: 'custom',
                        ea: 'visite'
                    }
                }
            });
    }

    confirmedConversion(): void {
        (window as any).dotq = (window as any).dotq || [];
        (window as any).dotq.push(
            {
                projectId: environment.yahooProjectId,
                properties: {
                    pixelId: environment.yahooPixelId,
                    qstrings: {
                        et: 'custom',
                        ea: 'conversion'
                    }
                }
            });
    }

    // tslint:disable
    initTag(): void {
        (function (w, d, t, r, u) { w[u] = w[u] || []; w[u].push({ 'projectId': environment.yahooProjectId, 'properties': { 'pixelId': environment.yahooPixelId } }); var s = d.createElement(t); (s as any).src = r; (s as any).async = true; (s as any).onload = (s as any).onreadystatechange = function () { var y, rs = this.readyState, c = w[u]; if (rs && rs != "complete" && rs != "loaded") { return } try { y = YAHOO.ywa.I13N.fireBeacon; w[u] = []; w[u].push = function (p) { y([p]) }; y(c) } catch (e) { } }; var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; par.insertBefore(s, scr) })(window, document, "script", "https://s.yimg.com/wi/ytc.js", "dotq");
    }
}
