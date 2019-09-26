import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { environment } from '../../../environments/environment';
import { MessageType } from '../../enums/message-type.enum';
import { LoggerService } from '../../ngModules/shared/services/helpers/logger.service';
import {
    ToasterWrapperService
} from '../../ngModules/shared/services/helpers/toaster-wrapper.service';

@Injectable()
export class CustomErrorHandlerService implements ErrorHandler {
    constructor(
        private injector: Injector,
        private toasterWrapperService: ToasterWrapperService) { }

    handleError(error: any): void {
        if (error.message === 'stop thread') return;

        const loggerService: LoggerService = this.injector.get(LoggerService);

        if (error.message && error.message.includes('Loading chunk')) {
            loggerService.log(error.message, MessageType.Error);
            location.reload();
        } else {
            const messageToShow: string = !environment.production && error.message ? error.message : 'WE_ARE_SORRY';
            this.toasterWrapperService.show(messageToShow, MessageType.Error);
            loggerService.log(error.message, MessageType.Error);

            if (!environment.production) {
                throw error;
            }
        }
    }
}
