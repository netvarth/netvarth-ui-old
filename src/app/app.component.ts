import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
export let projectConstants: any = {};
import {I18nService} from '../app/shared/services/i18n-sevice';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Root class of Jaldee Application
 */
export class AppComponent implements OnInit, AfterViewInit {
  
  // not used
  title = 'app';
  /**
   * 
   * @param globalService 
   * @param lStorageService 
   */

  constructor(
    private globalService: GlobalService,
    private lStorageService: LocalStorageService,
    public translate: TranslateService,
    private i18nService: I18nService, 
  ) { }

  /**
   * Init Method
   * if version is null or different this method clears local storage items from a list.
   * sets the current version in the local storage
   * @returns projectConstants which represents the constant variables used in jaldee UI
   * 
   */
  ngOnInit() {
    this.translate.use('en'); 
    this.i18nService.changeLocale('en');

    projectConstants = this.globalService.getGlobalConstants();
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

