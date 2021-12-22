import { Injectable } from "@angular/core";
import { GroupStorageService } from "./group-storage.service";
import { LocalStorageService } from "./local-storage.service";
import { SharedServices } from "./shared-services";

@Injectable({
    providedIn: 'root'
})
export class ConsumerAuthService {

    constructor(private lStorageService: LocalStorageService,
        private shared_services: SharedServices,
        private groupService: GroupStorageService) {

    }
    setLoginData(data, post_data, mod) {
        this.groupService.setitemToGroupStorage('ynw-user', data);
        this.lStorageService.setitemonLocalStorage('isBusinessOwner', 'false');
        delete post_data['password'];
        this.lStorageService.setitemonLocalStorage('ynw-credentials', JSON.stringify(post_data));
    }

    goThroughConsumerLogin(loginId?, countryCode?, password?) {
        return new Promise((resolve) => {
            if (password) {
                const data = {
                    'countryCode': countryCode,
                    'loginId': loginId,
                    'password': password,
                    'mUniqueId': null
                };
                console.log(data);
                this.shared_services.ConsumerLogin(data).subscribe(
                    (loginInfo: any) => {
                        this.setLoginData(loginInfo, data, 'consumer');
                        this.lStorageService.setitemonLocalStorage('bpwd', data.password);
                        resolve(true);
                    },
                    (error) => {
                        if (error.status === 401 && error.error === 'Session already exists.') {
                            const activeUser = this.lStorageService.getitemfromLocalStorage('ynw-user');
                            if (!activeUser) {
                                this.shared_services.ConsumerLogout().subscribe(
                                    () => {
                                        this.shared_services.ConsumerLogin(data).subscribe(
                                            (loginInfo) => {
                                                this.setLoginData(loginInfo, data, 'consumer');
                                                this.lStorageService.setitemonLocalStorage('jld', data.password);
                                                this.lStorageService.setitemonLocalStorage('qrp', data.password);
                                                resolve(true);
                                            });
                                    })
                            } else {
                                resolve(true);
                            }
                        } else {
                            resolve(false);
                        }
                    }
                );
            } else {
                const bPwd = this.lStorageService.getitemfromLocalStorage('bpwd');
                let bUser = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
                const isProvider = this.lStorageService.getitemfromLocalStorage('isBusinessOwner');
                bUser = JSON.parse(bUser);
                if (bUser && bPwd || (isProvider && isProvider === 'true')) {
                    const data = {
                        'countryCode': bUser.countryCode,
                        'loginId': bUser.loginId,
                        'password': bPwd,
                        'mUniqueId': null
                    };
                    this.shared_services.ConsumerLogin(data).subscribe(
                        (loginInfo: any) => {
                            this.setLoginData(loginInfo, data, 'consumer');
                            this.lStorageService.setitemonLocalStorage('bpwd', data.password);
                            resolve(true);
                        },
                        (error) => {
                            if (error.status === 401 && error.error === 'Session already exists.') {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }
                    );
                } else {
                    resolve(false);
                }
            }

        });
    }
}