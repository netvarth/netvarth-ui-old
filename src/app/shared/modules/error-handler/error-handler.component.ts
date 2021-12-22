import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    userData: any;
    constructor(public shared_services: SharedServices,
        private injector: Injector) {

    }

    handleError(error: any): void {
        const router = this.injector.get(Router);
        const userData = this.shared_services.getUserData();
        const mailError = {};
        const userInfo: any = {};
        if (userData) {
            if (userData.userName) {
                userInfo['name'] = userData.userName;
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

            mailError['userInfo'] = userInfo;
        }
        mailError['url'] = router.url;
        mailError['errorName'] = error.name;
        mailError['errorMessage'] = error.message;
        mailError['errorStack'] = error.stack;
        console.log('inside global error');
        this.shared_services.callHealth(JSON.stringify(mailError)).subscribe();
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
    }
}
