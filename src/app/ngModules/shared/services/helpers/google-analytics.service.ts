import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';

@Injectable()
export class GooglAnalyticsService {
    sendPageView(url: string): void {
        (window as any).ga('set', 'page', url);
        (window as any).ga('send', 'pageview');
    }

    sendDataLayer(): void {
        (window as any).ga('send', 'tracking', (window as any).dataLayer);
    }

    pushEvent(eventValue: string, eventKey: string = 'event'): void {
        if (!(window as any).dataLayer) return;

        (window as any).dataLayer.push({ [eventKey]: eventValue });
    }

    pushObject(object: any): void {
        if (!(window as any).dataLayer) return;

        (window as any).dataLayer.push(object);
    }

    empty(): void {
        if (!(window as any).dataLayer) return;

        (window as any).dataLayer = [];
    }

    // tslint:disable
    initAnalytics(): void {
        let analyticsId: string = environment.googleAnalyticsId;

        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * (new Date() as any); a = s.createElement(o),
                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        (window as any).ga('create', analyticsId, 'auto');
    }

    initTagManager(countryCode: string): void {
        let tagId: string;

        switch (countryCode) {
            case 'es':
                tagId = environment.googleTagManagerIdEs;
                break;
            case 'fr':
                tagId = environment.googleTagManagerIdFr;
                break;
        }

        (function (w, d, s, l, i) {
            w[l] = w[l] || []; w[l].push({
                'gtm.start':
                    new Date().getTime(), event: 'gtm.js'
            }); let f = d.getElementsByTagName(s)[0],
                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; (j as any).async = true; (j as any).src =
                    '//www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', tagId);
    }
}
