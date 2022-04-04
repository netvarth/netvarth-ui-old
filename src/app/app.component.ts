import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
export let projectConstants: any = {};
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
  ) { }

  /**
   * Init Method
   * if version is null or different this method clears local storage items from a list.
   * sets the current version in the local storage
   * @returns projectConstants which represents the constant variables used in jaldee UI
   * 
   */
  ngOnInit() {
    // this.lStorageService.setitemonLocalStorage('ios', true);
    // this.lStorageService.setitemonLocalStorage('authToken', 'abcd'.toString());
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
  
  // languages = [
  //   {value: 'en', viewValue: 'English'},
  //   {value: 'hd', viewValue: 'Hindi'},
  //   {value: 'kan', viewValue: 'Kannada'},
  //   {value: 'tel',viewValue:'Telugu'},
  //   {value: 'mal',viewValue:'Malayalam'},
  //   {value: 'tam',viewValue:'Tamil'}
  // ];
  //  langselected='English';
  //  changeLocale(locale: string,languagename) {
  //   this.langselected=languagename;
  //   console.log('lang',this.langselected)
 
  //    this.translate.use(locale); 
  
  //     this.i18nService.changeLocale(locale);
        
  //  }
}

