import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
export let projectConstants: any = {};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Root class of Jaldee Application
 */
export class AppComponent implements OnInit {
  
  // not used
  title = 'app';

  /**
   * 
   * @param globalService 
   * @param lStorageService 
   */
  constructor(
    private globalService: GlobalService,
    private lStorageService: LocalStorageService
  ) { }

  /**
   * Init Method
   * if version is null or different this method clears local storage items from a list.
   * sets the current version in the local storage
   * @returns projectConstants which represents the constant variables used in jaldee UI
   * 
   */
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
        // this.lStorageService.clearLocalstorage();
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

