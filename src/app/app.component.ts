import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { SharedFunctions } from './shared/functions/shared-functions';
import { LocalStorageService } from './shared/services/local-storage.service';
export let projectConstants: any = {};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private globalService: GlobalService,
    private shared_functions: SharedFunctions,
    private lStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    projectConstants = this.globalService.getGlobalConstants();
    const cVersion = version.desktop;
    const pVersion = this.lStorageService.getitemfromLocalStorage('version');
    if ((pVersion && pVersion !== cVersion) || !pVersion) {
      const ynw_user = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
      if(ynw_user) {
        const phone_number = ynw_user.loginId;
        const password = this.lStorageService.getitemfromLocalStorage('jld');
        if (!ynw_user.mUniqueId) {
          if (localStorage.getItem('mUniqueId')) {
            ynw_user.mUniqueId = localStorage.getItem('mUniqueId');
            this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw_user);
          }
        }
        const post_data = {
          'countryCode': '+91',
          'loginId': phone_number,
          'password': password,
          'mUniqueId': ynw_user.mUniqueId
        };
        // this.shared_functions.clearLocalstorage();
        this.shared_functions.doLogout().then(
          () => {
          this.shared_functions.providerLogin(post_data);
          this.lStorageService.setitemonLocalStorage('version', cVersion);
        });
      } else {
        this.lStorageService.setitemonLocalStorage('version', cVersion);
      }
    }
  }
}
