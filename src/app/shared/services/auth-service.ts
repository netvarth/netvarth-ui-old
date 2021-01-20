import { Injectable } from "@angular/core";
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
    constructor(private shared_services: SharedServices,
        private lStorageService: LocalStorageService,
        private groupService: GroupStorageService,
        private sessionStorageService: SessionStorageService) {

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
        delete post_data['password'];
        this.lStorageService.setitemonLocalStorage('ynw-credentials', JSON.stringify(post_data));
    }
/**
 * To Check whether Provider already logged in or not. Return logged status true/false 
 */
    goThroughBusinessLogin() {
        return new Promise((resolve) => {
            const bPwd = this.lStorageService.getitemfromLocalStorage('bpwd');
            const bUser = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
            const isProvider = this.lStorageService.getitemfromLocalStorage('isBusinessOwner');

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
            //   this.providerDataStorage.setWeightageArray([]);
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

}