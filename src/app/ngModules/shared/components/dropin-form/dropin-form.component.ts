import { take } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MessageType } from '../../../../enums/message-type.enum';
import { Client } from '../../../../models/client/client.model';
import { CreditCardsParams } from '../../../../models/payment/credit-cards-params.model';
import { CreditCard } from '../../../../models/payment/payment.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { ClientService } from '../../../shared/services/business/client/client.service';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';
import { DropinService } from '../../services/helpers/dropin.service';
import { ToasterWrapperService } from '../../services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-dropin-form',
    templateUrl: 'dropin-form.component.html',
    styleUrls: ['dropin-form.component.scss']
})
export class DropinFormComponent implements OnInit {
    @Input() submitButtonSelector: string;
    @Output() readonly dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly dropinError: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly cardSaved: EventEmitter<CreditCard> = new EventEmitter<CreditCard>();
    dropinInstance: any;

    constructor(
        private toasterWrapperService: ToasterWrapperService,
        private clientService: ClientService,
        private paymentsApiService: PaymentsApiService,
        private dropinService: DropinService) { }

    ngOnInit(): void {
        this.prepareDropinContainer();
    }

    addCard(): void {
        this.dropinService.getDropinPaymentMethod(this.dropinInstance).pipe(take(1))
            .subscribe((dropinPaymentMethod: any) => {
                if (dropinPaymentMethod.error) {
                    this.toasterWrapperService.show('ERR_1608', MessageType.Error);
                    this.dataLoaded.emit(true);
                    this.dropinError.emit();
                } else {
                    this.dataLoaded.emit(false);
                    this.paymentsApiService.add(this.getRequestParams(dropinPaymentMethod))
                        .subscribe((response: GenericResponse) => {
                            if (response.errors) {
                                this.prepareDropinContainer();
                                this.toasterWrapperService.show(`ERR_${response.errors[0].code}`, MessageType.Error);
                            } else if (response.data) {
                                this.dataLoaded.emit(true);
                                this.cardSaved.emit(response.data);
                                this.toasterWrapperService.show('CARD_ADDED', MessageType.Success);
                            }
                        });
                }
            });
    }

    prepareDropinContainer(): void {
        this.paymentsApiService.getBraintreeToken()
            .subscribe((braintreeToken: string) => {
                this.dropinService.getDropinInstance('DropinContainer', braintreeToken).pipe(take(1))
                    .subscribe((dropinInstance: any) => {
                        this.dropinInstance = dropinInstance;
                        this.dataLoaded.emit(true);
                    });
            });
    }

    private getRequestParams(payload: any): CreditCardsParams {
        const client: Client = this.clientService._client.getValue();

        return {
            credct_type_id: 1,
            credit_card_pan: payload.details.lastFour,
            cvv: '999',
            expiring_month: '12',
            expiring_year: '2099',
            name: `${client.first_name} ${client.last_name}`,
            nonce: payload.nonce,
            save_for_display: true,
            device_data: payload.deviceData
        };
    }

}
