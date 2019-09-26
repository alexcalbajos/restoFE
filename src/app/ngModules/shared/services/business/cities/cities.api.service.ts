import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { City } from '../../../../../models/address/city.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';

@Injectable()
export class CitiesApiService {
    constructor(private http: HttpWrapperService) { }

    getClosest(lat: number, lng: number): Observable<City> {
        const params: HttpParams = new HttpParams()
            .set('latitude', lat.toString())
            .set('longitude', lng.toString());

        return this.http.get('cities/closest.json', params);
    }

    getAll(): any {
        return this.http.get(`cities.json?${new Date().getTime()}`);
    }
}
