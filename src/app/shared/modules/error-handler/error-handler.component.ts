import { ErrorHandler } from '@angular/core';
import { SharedServices } from '../../services/shared-services';

export class GlobalErrorHandler implements ErrorHandler {

    constructor(public shared_services: SharedServices) {

    }

    handleError(error: any): void {

        this.shared_services.callHealth(error.message);

        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
    }
}
