import * as Bowser from 'bowser';

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Client } from '../../../../models/client/client.model';
import { ClientService } from '../business/client/client.service';
import { HistoryService } from './history.service';
import { MediaQueryService } from './media-query.service';

@Injectable()
export class LoggerService {
    private lastExecutionTime: number;
    private itemsCollection: AngularFirestoreCollection<any>;

    constructor(
        private historyService: HistoryService,
        private mediaQueryService: MediaQueryService,
        private afs: AngularFirestore,
        private clientService: ClientService) {
        this.itemsCollection = this.afs.collection<any>('logs');
    }

    log(text: string, type: string, ignoreTime: boolean = false): void {
        const item: any = {
            location: this.historyService.history[0],
            date: new Date().getTime(),
            device: this.mediaQueryService._mediaChange.getValue().suffix,
            browser: JSON.stringify(Bowser.parse(window.navigator.userAgent).browser)
        };

        if (item.browser && item.browser.includes('PhantomJS')) {
            return;
        }

        if (type) {
            item.type = type;
        }

        if (text) {
            item.text = text;
        }

        if (this.historyService.history[1]) {
            item.previousLocation = this.historyService.history[1];
        }

        const client: Client = this.clientService._client.getValue();
        if (client && client.id) {
            item.clientId = client.id;
        }

        if (client && client.email) {
            item.clientEmail = client.email;
        }

        if (ignoreTime) {
            this.itemsCollection.add(item);
        } else if (!this.lastExecutionTime ||
            item.date > this.lastExecutionTime + 60000) {
            this.lastExecutionTime = item.date;
            this.itemsCollection.add(item);
        }
    }
}
