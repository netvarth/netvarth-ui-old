import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
export let projectConstants: any = {};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
/**
 * Root class of Jaldee Application
 */
export class AppComponent implements OnInit, AfterViewInit {
  /**
   * 
   * @param globalService 
   * @param lStorageService 
   */

  constructor(
    private globalService: GlobalService,
    private lStorageService: LocalStorageService
  ) {
    
   }
  /**
   * Init Method
   * if version is null or different this method clears local storage items from a list.
   * sets the current version in the local storage
   * @returns projectConstants which represents the constant variables used in jaldee UI
   * 
   */
  ngOnInit() {
    let token = this.lStorageService.getitemfromLocalStorage('authToken');
    if (token) {
      let regexToReplace = /\-/gi;
      let authToken = token.replace(regexToReplace, "&");
      this.lStorageService.setitemonLocalStorage('authToken', authToken);
    }

    projectConstants = this.globalService.getGlobalConstants();

    if(projectConstants){
      return false;
    }
    const cVersion = version.desktop;
    const pVersion = this.lStorageService.getitemfromLocalStorage('version');
    if (pVersion && pVersion !== cVersion) {
      this.lStorageService.clearLocalstorage();
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    } else {
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    }
  }
  ngAfterViewInit () {
    document.getElementById('globalLoading').remove();
  }
}

