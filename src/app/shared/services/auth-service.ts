import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ProviderDataStorageService } from "../../business/services/provider-datastorage.service";
import { GroupStorageService } from "./group-storage.service";
import { LocalStorageService } from "./local-storage.service";
import { SessionStorageService } from "./session-storage.service";
import { SharedServices } from "./shared-services";

@Injectable({
    providedIn: 'root'
})
/**
 * 
 * Service handles authentication
 */
export class AuthService {
    private subject = new Subject<any>();
    private API_ERROR = 'There was a problem while connecting to our server. Please try again.';
    constructor(private shared_services: SharedServices,
        private lStorageService: LocalStorageService,
        private groupService: GroupStorageService,
        private sessionStorageService: SessionStorageService,
        private providerDataStorage: ProviderDataStorageService,
        private router: Router
    ) {

    }
    /**
     * Set Credentials and User Type (provider/consumer) in Local Storage
     * @param data 
     * @param post_data 
     * @param mod 
     */
    setLoginData(data, post_data, mod) {
        this.groupService.setitemToGroupStorage('ynw-user', data);
        this.lStorageService.setitemonLocalStorage('isBusinessOwner', (mod === 'provider') ? 'true' : 'false');
        if (post_data['password']) {
            delete post_data['password'];
        }
        this.lStorageService.setitemonLocalStorage('ynw-credentials', JSON.stringify(post_data));
    }
    /**
     * To Check whether Provider already logged in or not. Return logged status true/false 
     */
    goThroughBusinessLogin() {
        return new Promise((resolve) => {
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
                this.shared_services.ProviderLogin(data).subscribe(
                    (loginInfo: any) => {
                        this.setLoginData(loginInfo, data, 'provider');
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
        });
    }
    /**
     * Logout from Business account
     */
    providerLogout() {
        const promise = new Promise<void>((resolve, reject) => {
            this.shared_services.ProviderLogout()
                .subscribe(() => {
                    this.providerDataStorage.setWeightageArray([]);
                    this.lStorageService.clearLocalstorage();
                    this.sessionStorageService.clearSessionStorage();
                    resolve();
                },
                    error => {
                        resolve();
                    }
                );
        });
        return promise;
    }



    // Copying -------- Shared Functions

    logout() {
        this.doLogout()
            .then(
                data => {
                    this.router.navigate(['/home']);
                },
                error => {
                }
            );
    }

    logoutNoRedirect() {
        this.doLogout()
            .then(
                data => {
                },
                error => {
                }
            );
    }

    logoutFromJaldee(srcUrl?) {
        const promise = new Promise<void>((resolve, reject) => {
            const isProvider = this.lStorageService.getitemfromLocalStorage('isBusinessOwner');
            const isCustomProvider = this.lStorageService.getitemfromLocalStorage('busLoginId');
            console.log("isProvider:" + isProvider);
            const customId = this.lStorageService.getitemfromLocalStorage('customId');
            const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
            if (isProvider === 'true') {
                this.providerLogout().then(
                    () => {
                        if (isCustomProvider) {
                            this.router.navigate(['business', isCustomProvider, 'login']);
                        } else {
                            this.router.navigate(['business', 'login']);
                        }
                        resolve();
                    }
                )
            } else {
                this.consumerLogout().then(
                    () => {
                        this.lStorageService.removeitemfromLocalStorage('authToken');
                        if (customId) {
                            if (reqFrom === 'cuA') {
                                this.router.navigate(['customapp', customId]);
                            } else if (reqFrom === 'CUSTOM_WEBSITE') {
                                let source = this.lStorageService.getitemfromLocalStorage('source');
                                this.lStorageService.removeitemfromLocalStorage('reqFrom');
                                this.lStorageService.removeitemfromLocalStorage('source');
                                window.location.href = source;
                            } else {
                                if (srcUrl) {
                                    this.router.navigateByUrl(srcUrl).then();
                                } else {
                                    this.router.navigate([customId]).then(
                                        ()=> {
                                            window.location.reload();
                                        }
                                    );
                                }

                            }
                        } else {
                            this.router.navigate(['/']);
                        }
                        this.lStorageService.removeitemfromLocalStorage('customId');
                        resolve();
                    }
                )
            }
        });
        return promise;
    }

    doLogout() {
        const promise = new Promise<void>((resolve, reject) => {
            if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true') {
                this.providerLogout()
                    .then(
                        data => {
                            resolve();
                        }
                    );
            } else {
                this.consumerLogout()
                    .then(
                        data => {
                            resolve();
                        }
                    );
            }
        });
        return promise;
    }

    private consumerLogout() {
        const promise = new Promise<void>((resolve, reject) => {
            this.shared_services.ConsumerLogout()
                .subscribe(data => {
                    this.lStorageService.clearLocalstorage();
                    this.sessionStorageService.clearSessionStorage();
                    // this.clearSessionStorage();
                    resolve();
                },
                    error => {
                        resolve();
                    }
                );
        });
        return promise;
    }

    consumerLogin(post_data, moreParams?) {
        console.log(post_data);
        post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
        this.sendMessage({ ttype: 'main_loading', action: true });
        const promise = new Promise((resolve, reject) => {
            this.shared_services.ConsumerLogin(post_data)
                .subscribe(
                    data => {
                        // let pre_header = post_data.countryCode.split('+')[1] + "-" + post_data.loginId;
                        // if (this.lStorageService.getitemfromLocalStorage('authToken')) {
                        //     this.lStorageService.setitemonLocalStorage("pre-header", pre_header);
                        // }
                        resolve(data);
                        this.setLoginData(data, post_data, 'consumer');
                        if (moreParams === undefined) {
                            this.router.navigate(['/consumer']);
                        } else {
                            if (moreParams['bypassDefaultredirection'] === 1) {
                                // const mtemp = '1';
                            } else {
                                this.router.navigate(['/consumer']);
                            }
                        }
                    },
                    error => {
                        this.sendMessage({ ttype: 'main_loading', action: false });
                        if (error.status === 401) {
                            // Not registred consumer or session alredy exists
                            reject(error);
                            // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                        } else {
                            if (error.error && typeof (error.error) === 'object') {
                                error.error = this.API_ERROR;
                            }
                            reject(error);
                        }
                    });
        });
        return promise;
    }

    consumerLoginViaGmail(post_data) {
        const _this = this;
        post_data.mUniqueId = _this.lStorageService.getitemfromLocalStorage('mUniqueId');
        const promise = new Promise((resolve, reject) => {
            _this.shared_services.ConsumerLogin(post_data).subscribe(data => {
                _this.setLoginData(data, post_data, 'consumer');
                resolve(data);
            }, error => {
                _this.sendMessage({ ttype: 'main_loading', action: false });
                if (error.status === 401) {
                    // Not registred consumer or session alredy exists
                    reject(error);
                    // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                } else {
                    if (error.error && typeof (error.error) === 'object') {
                        error.error = _this.API_ERROR;
                    }
                    reject(error);
                }
            });
        });
        return promise;
    }

    consumerAppLogin(post_data) {
        // post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
        console.log(post_data);
        this.sendMessage({ ttype: 'main_loading', action: true });
        const promise = new Promise((resolve, reject) => {
            this.shared_services.ConsumerLogin(post_data)
                .subscribe(
                    data => {                        
                        resolve(data);
                        this.setLoginData(data, post_data, 'consumer');
                    },
                    error => {
                        this.sendMessage({ ttype: 'main_loading', action: false });
                        if (error.status === 401) {
                            // Not registred consumer or session alredy exists
                            reject(error);
                            // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                        } else {
                            if (error.error && typeof (error.error) === 'object') {
                                error.error = this.API_ERROR;
                            }
                            reject(error);
                        }
                    });
        });
        return promise;
    }

    businessLogin(post_data) {
        this.sendMessage({ ttype: 'main_loading', action: true });
        const promise = new Promise((resolve, reject) => {
            this.shared_services.ProviderLogin(post_data)
                .subscribe(
                    data => {
                        this.providerDataStorage.setWeightageArray([]);
                        this.lStorageService.setitemonLocalStorage('popupShown', 'false');
                        this.setLoginData(data, post_data, 'provider');
                        resolve(data);
                    },
                    error => {
                        this.sendMessage({ ttype: 'main_loading', action: false });
                        if (error.status === 401) {
                            reject(error);
                            // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                        } else {
                            if (error.error && typeof (error.error) === 'object') {
                                console.log("Error 1:", error);
                                error.error = this.API_ERROR;
                            }
                            reject(error);
                        }
                    });
        });
        return promise;
    }

    providerLogin(post_data) {
        this.sendMessage({ ttype: 'main_loading', action: true });
        const promise = new Promise((resolve, reject) => {
            this.shared_services.ProviderLogin(post_data)
                .subscribe(
                    data => {
                        this.providerDataStorage.setWeightageArray([]);
                        this.lStorageService.setitemonLocalStorage('popupShown', 'false');
                        this.setLoginData(data, post_data, 'provider');
                        resolve(data);
                        this.router.navigate(['/provider']);
                    },
                    error => {
                        this.sendMessage({ ttype: 'main_loading', action: false });
                        if (error.status === 401) {
                            reject(error);
                            // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                        } else {
                            if (error.error && typeof (error.error) === 'object') {
                                error.error = this.API_ERROR;
                            }
                            reject(error);
                        }
                    });
        });
        return promise;
    }

    adminLogin(post_data, type) {
        this.sendMessage({ ttype: 'main_loading', action: true });
        const promise = new Promise((resolve, reject) => {
            this.shared_services.adminLogin(post_data, type)
                .subscribe(
                    data => {
                        resolve(data);
                        this.setLoginData(data, post_data, 'provider');
                        this.router.navigate(['/provider']);
                    },
                    error => {
                        this.sendMessage({ ttype: 'main_loading', action: false });
                        if (error.status === 401) {
                            reject(error);
                            // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                        } else {
                            if (error.error && typeof (error.error) === 'object') {
                                error.error = this.API_ERROR;
                            }
                            reject(error);
                        }
                    });
        });
        return promise;
    }
    sendMessage(message: any) {
        this.subject.next(message);
    }
    clearMessage() {
        this.subject.next();
    }
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    /**
     * To check whether user logged in or not
     * @returns true/false
     */
    goThroughLogin() {
        if (this.lStorageService.getitemfromLocalStorage('reqFrom') === 'cuA') {
            const _this = this;
            let qrusr = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
            console.log("Entered to goThroughLogin Method");
            return new Promise((resolve) => {
                // if (_this.lStorageService.getitemfromLocalStorage('pre-header') && _this.lStorageService.getitemfromLocalStorage('authToken')) {
                //     resolve(true);
                // } else 
                if (_this.lStorageService.getitemfromLocalStorage('appId') && _this.lStorageService.getitemfromLocalStorage('installId') && qrusr) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        } else if (this.lStorageService.getitemfromLocalStorage('authorization')) {
            return new Promise((resolve) => {
                resolve(true);
            });
        } else {
            return new Promise((resolve) => {
                const qrpw = this.lStorageService.getitemfromLocalStorage('qrp');
                let qrusr = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
                let customId = this.lStorageService.getitemfromLocalStorage('customId');
                qrusr = JSON.parse(qrusr);
                if (!customId && qrusr && qrpw) {
                    const data = {
                        'countryCode': qrusr.countryCode,
                        'loginId': qrusr.loginId,
                        'password': qrpw,
                        'mUniqueId': null
                    };
                    this.shared_services.ConsumerLogin(data).subscribe(
                        (loginInfo: any) => {
                            this.setLoginData(loginInfo, data, 'consumer');
                            this.lStorageService.setitemonLocalStorage('qrp', data.password);
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
                } else if(customId && qrusr){
                    resolve(true);
                } else {
                    resolve(false);
            }
            });
        }
    }

    consumerSignupViaGoogle(post_data) {
        this.sendMessage({ ttype: 'main_loading', action: true });
        const promise = new Promise((resolve, reject) => {
            this.shared_services.signUpConsumer(post_data)
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.sendMessage({ ttype: 'main_loading', action: false });
                        if (error.status === 401) {
                            // Not registred consumer or session alredy exists
                            reject(error);
                            // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                        } else {
                            if (error.error && typeof (error.error) === 'object') {
                                error.error = this.API_ERROR;
                            }
                            reject(error);
                        }
                    });

        })
        return promise;
    }

    consumerAppSignup(post_data) {
        // post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
        this.sendMessage({ ttype: 'main_loading', action: true });
        const promise = new Promise((resolve, reject) => {
            this.shared_services.signUpConsumer(post_data)
                .subscribe(
                    data => {
                        // let pre_header = post_data.countryCode.split('+')[1] + "-" + post_data.loginId;
                        // if (this.lStorageService.getitemfromLocalStorage('authToken')) {
                        //     this.lStorageService.setitemonLocalStorage("pre-header", pre_header);
                        // }                       
                        resolve(data);
                        // if (moreParams === undefined) {
                        //     this.router.navigate(['/consumer']);
                        // } else {
                        //     if (moreParams['bypassDefaultredirection'] === 1) {
                        //         // const mtemp = '1';
                        //     } else {
                        //         this.router.navigate(['/consumer']);
                        //     }
                        // }
                    },
                    error => {
                        this.sendMessage({ ttype: 'main_loading', action: false });
                        if (error.status === 401) {
                            // Not registred consumer or session alredy exists
                            reject(error);
                            // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
                        } else {
                            if (error.error && typeof (error.error) === 'object') {
                                error.error = this.API_ERROR;
                            }
                            reject(error);
                        }
                    });
        });
        return promise;
    }
}