import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { SitemapPair } from '../../../../../models/address/sitemap.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';

@Injectable()
export class StaticPagesApiService {

    constructor(private http: HttpWrapperService) { }

    getSitemap(countryId: number): Observable<Array<SitemapPair>> {
        return this.http.get(`sitemap/${countryId}.json`);
    }
}
