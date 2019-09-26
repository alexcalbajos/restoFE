import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment';
import { STATIC_VERSION } from '../../../../_root/static/version';
import { MetaData } from '../../../../models/meta/meta-data.model';
import { StringWrapperService } from './string-wrapper.service';

@Injectable()
export class MetaService {
    constructor(
        @Inject(STATIC_VERSION) private staticVersion: number,
        private stringWrapperService: StringWrapperService,
        private translateService: TranslateService,
        private title: Title) { }

    setMeta(metaData: MetaData): void {
        this.setOpenGraphTags(metaData);

        if (metaData.title) {
            this.translateService.get(metaData.title, metaData.titleTranslationParam).subscribe((title: string) => {
                this.title.setTitle(title);
            });
        }

        if (metaData.description) {
            this.translateService.get(metaData.description, metaData.descriptionTranslationParam).subscribe((description: string) => {
                this.editMetaTag('description', description, 'name');
            });
        }

        if (metaData.canonicalUrl) {
            this.createCanonicalLink(metaData.canonicalUrl);
        } else {
            const oldCanonical: any = document.querySelector('link[rel="canonical"]');
            if (oldCanonical) oldCanonical.remove();
        }
    }

    private setOpenGraphTags(metaData: MetaData): void {
        metaData.openGraph = metaData.openGraph ? metaData.openGraph : {};

        const image: string = metaData.openGraph.image ?
            metaData.openGraph.image : `${environment.assetsBaseUrl}images/facebook/og-image.jpg?v=${this.staticVersion}`;
        this.editMetaTag('og:image', image, 'property', 'image');

        const url: string = metaData.openGraph.url ?
            metaData.openGraph.url : window.location.href;
        this.editMetaTag('og:url', url, 'property');

        const title: string = metaData.openGraph.title ? metaData.openGraph.title : metaData.title || 'title';
        const titleParams: string = metaData.openGraph.titleTranslationParam ?
            metaData.openGraph.titleTranslationParam : metaData.titleTranslationParam || 'titleParams';
        this.translateService.get(title, titleParams).subscribe((titleTranslation: string) => {
            this.editMetaTag('og:title', this.stringWrapperService.beautifyOpenGraphTitle(titleTranslation), 'property');
        });

        const description: string = metaData.openGraph.description ? metaData.openGraph.description : metaData.description || 'description';
        const descriptionParams: string = metaData.openGraph.descriptionTranslationParam ?
            metaData.openGraph.descriptionTranslationParam : metaData.descriptionTranslationParam || 'descriptionParams';
        this.translateService.get(description, descriptionParams).subscribe((descriptionTranslation: string) => {
            this.editMetaTag('og:description', descriptionTranslation, 'property');
        });
    }

    private createCanonicalLink(url: string): void {
        const link: HTMLLinkElement = document.createElement('link');

        link.setAttribute('rel', 'canonical');
        link.setAttribute('content', url);

        document.head.appendChild(link);
    }

    private editMetaTag(name: string, content: string, selector: string, itemprop?: string): void {
        const metaTag: HTMLElement = document.querySelector(`meta[${selector}="${name}"]`);

        if (metaTag) {
            metaTag.setAttribute('content', content);
            if (itemprop) {
                metaTag.setAttribute('itemprop', itemprop);
            }
        }
    }
}
