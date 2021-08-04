import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
export let projectConstants: any = {};
import { TranslateService } from '@ngx-translate/core';
import {I18nService} from '../app/shared/services/i18n-service';
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
    private lStorageService: LocalStorageService,
    public translate: TranslateService,
    private i18nService: I18nService, 
  ) { 
    this.translate.setDefaultLang('en');
    this.translate.use('en'); 
    this.changeLocale('en');
  }
  languages = [
    {value: 'en', viewValue: 'English'},
    {value: 'hd', viewValue: 'Hindhi'},
    {value: 'kan', viewValue: 'Kannada'},
    {value: 'tel',viewValue:'Telugu'},
    {value: 'mal',viewValue:'Malayalam'},
    {value: 'tam',viewValue:'Tamil'}
  ];

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
    if (pVersion && pVersion !== cVersion) {
      this.lStorageService.clearLocalstorage();
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    } else {
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    }
  }
  changeLocale(locale: string) {
   
    this.translate.use(locale); 
     this.i18nService.changeLocale(locale);
       
  }
}

