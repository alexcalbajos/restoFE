import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';

declare var UET: any;

@Injectable()
export class BingTagService {
    confirmedConversion(conversionValue: number): void {
        (window as any).uetq = (window as any).uetq || [];
        (window as any).uetq.push('event', 'clickbutton',
            {
                event_category: 'commande',
                event_label: 'validationcommande',
                event_value: '1',
                revenue_value: conversionValue.toString()
            });
    }

    // tslint:disable
    initTag(): void {
        (function (w, d, t, r, u) { var f, n, i; w[u] = w[u] || [], f = function () { var o = { ti: environment.bingId }; (o as any).q = w[u], w[u] = new UET(o), w[u].push("pageLoad") }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () { var s = this.readyState; s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null) }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i) })(window, document, "script", "//bat.bing.com/bat.js", "uetq");
    }
}
