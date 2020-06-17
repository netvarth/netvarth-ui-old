import { Injectable } from '@angular/core';
import { SharedServices } from './shared-services';
import { GlobalFunctions } from '../functions/global-functions';

@Injectable()
export class GlobalService {
    public globalConstants: any = null;

    constructor (private shared_services: SharedServices, private global_functions: GlobalFunctions) {
    }
    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.shared_services.getS3Url().then(
                    (s3Url: any) => {
                        const curdate = new Date();
                        const cdate = new Date(Date.UTC(curdate.getUTCFullYear(), curdate.getUTCMonth(), curdate.getUTCDate(), curdate.getUTCHours(),
                        curdate.getUTCMinutes(), curdate.getUTCSeconds(), curdate.getUTCMilliseconds()));
                        this.shared_services.getUIConfig(s3Url, cdate.toISOString()).subscribe(
                            (config: any) => {
                                this.globalConstants = config;
                                this.global_functions.setitemonLocalStorage('config', config);
                                resolve(true);
                            }, (error) => {
                                if (this.global_functions.getitemfromLocalStorage('config')) {
                                    this.globalConstants = this.global_functions.getitemfromLocalStorage('config');
                                    resolve(true);
                                } else {
                                    resolve(true);
                                }
                            }
                        );
                    }
                );
      });
    }
    public getGlobalConstants() {
        return this.globalConstants;
    }
}
