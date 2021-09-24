import { ErrorHandler, Injector, Injectable} from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { Router} from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    userData: any;

    constructor(public shared_services: SharedServices,private injector:Injector) {



    }




    handleError(error: any): void {
    
       
        console.log(error.name);

        console.log(error.message);
       
        const router = this.injector.get(Router);
        const userData = this.shared_services.getUserData();
        const userInfo: any = {};
        if (userData.userName) {
            userInfo.name = userData.userName;
        }
        if (userData.id) {
            userInfo.id = userData.id;
        }
        if (userData.primaryPhoneNumber) {
            userInfo.phonenumber = userData.primaryPhoneNumber;
        }
        if (userData.sector) {
            userInfo.sector = userData.sector;
        }
        if (userData.subSector) {
            userInfo.subsector = userData.subSector;
        }
        if (userData.isProvider) {
            userInfo.type = 'Provider'
        } else {
            userInfo.type = 'Consumer'
        }
        const mailError = {};
        mailError['userInfo'] = userInfo;
        mailError['url']=router.url;
        mailError['errorName']=error.name;
        mailError['errorMessage']=error.message;
        mailError['errorStack'] = error.stack;
        console.log("Error Happened" + JSON.stringify(userInfo));
        console.log(error);
        console.log('inside global error');
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        } else {
            console.log(mailError);
            this.shared_services.callHealth(mailError).subscribe();
        }
    }
}
