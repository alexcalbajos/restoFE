import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { CardVerification } from '../../../../models/payment/card-verification.model';
import { PaymentsService } from '../business/payment/payments.service';

declare let braintree: any;

@Injectable()
export class BraintreeService {
    _iframe: Subject<any> = new Subject();
    $iframe: Observable<any> = this._iframe.asObservable();
    _cardVerification: Subject<CardVerification> = new Subject();
    $cardVerification: Observable<CardVerification> = this._cardVerification.asObservable();

    constructor(private paymentsService: PaymentsService) { }

    getThreeDSecureInstance(authorization: string): Observable<any> {
        const _clientInstance: Subject<any> = new Subject<any>();
        const $clientInstance: Observable<any> = _clientInstance.asObservable();

        const _threeDSecureInstance: Subject<any> = new Subject<any>();
        const $threeDSecureInstance: Observable<any> = _threeDSecureInstance.asObservable();

        braintree.client.create({
            authorization
        }, (clientErr: any, clientInstance: any) => {
            if (clientErr) {
                throw clientErr;
            }

            _clientInstance.next(clientInstance);
        });

        $clientInstance.subscribe((client: string) => {
            braintree.threeDSecure.create({
                client
            }, (threeDSecureErr: any, threeDSecureInstance: any) => {
                if (threeDSecureErr) {
                    throw threeDSecureErr;
                }

                _threeDSecureInstance.next(threeDSecureInstance);
            });
        });

        return $threeDSecureInstance;
    }

    verifyCard(threeDSecureInstance: any, amount: number, nonce: string): void {
        threeDSecureInstance.verifyCard({
            amount: Math.round(amount * 100) / 100,
            nonce,
            addFrame: (addErr: any, iframe: any): void => {
                if (addErr) {
                    throw addErr;
                }

                this._iframe.next(iframe);
            },
            removeFrame: (): void => {
                this._iframe.next(undefined);
            }
        }, (verifyErr: any, verifyResp: any) => {
            if (verifyErr) {
                this._cardVerification.next(undefined);
            }

            if (verifyResp) {
                this._cardVerification.next(verifyResp);
            }
        });
    }

    getDeviceData(authorization: string): Observable<string> {
        const _deviceData: Subject<any> = new Subject<any>();
        const $deviceData: Observable<any> = _deviceData.asObservable();

        braintree.client.create({
            authorization
        }, (err: any, clientInstance: any) => {
            if (err) return;

            braintree.dataCollector.create({
                client: clientInstance,
                kount: true
            }, (error: any, dataCollectorInstance: any) => {
                if (error) return;

                _deviceData.next(this.paymentsService.prepareDeviceData(dataCollectorInstance.deviceData));
            });
        });

        return $deviceData;
    }

    isCardVerificationValid(cardVerification: CardVerification): boolean {
        if (!cardVerification || !cardVerification.nonce) return false;

        if (cardVerification.liabilityShiftPossible && cardVerification.liabilityShifted) {
            return true;
        }

        if (!cardVerification.liabilityShiftPossible && !cardVerification.liabilityShifted) {
            return true;
        }

        return false;
    }
}
