import { ErrorHandler } from '@angular/core';
import { SharedServices } from '../../services/shared-services';

export class GlobalErrorHandler implements ErrorHandler {

    constructor(public shared_services: SharedServices) {

    }

    handleError(error: any): void {
        console.log("Error Happened");
        console.log(error);
        this.shared_services.callHealth(error.message).subscribe();
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
    }
}
