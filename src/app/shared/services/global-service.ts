import { Injectable } from '@angular/core';
import { SharedServices } from './shared-services';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class GlobalService {
    public globalConstants: any = null;

    constructor(private shared_services: SharedServices, private lStorageService: LocalStorageService) {
    }
    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.shared_services.getS3Url().then(
                (s3Url: any) => {
                    this.shared_services.getUIConfig(s3Url).subscribe(
                        (config: any) => {
                            this.globalConstants = config;
                            this.lStorageService.setitemonLocalStorage('config', config);
                            resolve(true);
                        }, (error) => {
                            if (this.lStorageService.getitemfromLocalStorage('config')) {
                                this.globalConstants = this.lStorageService.getitemfromLocalStorage('config');
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
