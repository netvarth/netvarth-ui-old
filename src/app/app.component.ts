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
    const cVersion = version.desktop;
    const pVersion = this.lStorageService.getitemfromLocalStorage('version');
    if (pVersion && pVersion !== cVersion) {
      this.lStorageService.clearLocalstorage();
      this.lStorageService.removeitemfromLocalStorage('config');
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    } else {
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    }
    projectConstants = this.globalService.getGlobalConstants();
    if (!this.lStorageService.getitemfromLocalStorage('config')) {
      this.lStorageService.setitemonLocalStorage('config', projectConstants);
    }
  }
}

