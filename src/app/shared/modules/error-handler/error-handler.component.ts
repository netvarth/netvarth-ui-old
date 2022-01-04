import { ErrorHandler } from '@angular/core';
import { SharedServices } from '../../services/shared-services';

export class GlobalErrorHandler implements ErrorHandler {

    constructor(public shared_services: SharedServices) {

    }

    handleError(error: any): void {
        const mailError = {};
        mailError['source']='Shanthidham';
        mailError['errorName']=error.name;
        mailError['errorMessage']=error.message;
        mailError['errorStack'] = error.stack;
        console.log('inside global error');
       console.log(error);
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }else{
            this.shared_services.callHealth(mailError).subscribe();
        }
    }
}
