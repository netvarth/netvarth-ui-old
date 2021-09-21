import { ErrorHandler } from '@angular/core';
import { SharedServices } from '../../services/shared-services';

export class GlobalErrorHandler implements ErrorHandler {

    constructor(public shared_services: SharedServices) {

    }

    handleError(error: any): void {
        console.log(error);
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        } else {
            // this.shared_services.callHealth(error.message).subscribe();
        }
    }
}
