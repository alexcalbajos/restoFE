import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { ContactParams } from '../../../../../models/notifications/contact-params.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';

@Injectable()
export class NotificationsApiService {
    constructor(private http: HttpWrapperService) { }

    sendContact(contactParams: ContactParams): Observable<boolean> {
        return this.http.post('notifications/send_contact.json', contactParams);
    }

    sendProblem(problem: string, orderId: number): Observable<boolean> {
        return this.http.post('notifications/send_problem.json', { problem, orderId });
    }
}
