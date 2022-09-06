import { Injectable } from '@angular/core';
import { projectConstantsLocal } from '../shared/constants/project-constants';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { ServiceMeta } from '../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CustomappService {


  templateJson;
  accountEncId: any;
  custId;
  businessJsons: any;
  accountConfig;
  newsFeed: any = [];
  constructor(private lStorageService: LocalStorageService, private servicemeta: ServiceMeta) { }

  /**
   * 
   * @param templateJson 
   */
  setTemplateJson(templateJson) {
    this.templateJson = templateJson;
  }

  /**
   * 
   * @returns template input json
   */
  getTemplateJson() {
    return this.templateJson;
  }

  /**
   * 
   */
  setBusinessJsons(businessJsons) {
    this.businessJsons = businessJsons;
  }
  /**
   * 
   * @param accountEncId 
   */
  setAccountEncId(accountEncId) {
    this.accountEncId = accountEncId;
    this.custId = this.accountEncId;
  }

  setAccountConfig(accountConfig) {
    this.accountConfig = accountConfig;
  }

  /**
   * 
   * @returns account Encription Id
   */
  getAccountEncId() {
    return this.accountEncId;
  }

  getDonationServices() {
    return this.businessJsons['donationServices'];
  }

  getSystemDate() {
    return this.servicemeta.httpGet('provider/server/date');
  }
  
  /**
   * 
   * @param accountId 
   * @returns account  Id
   */
  getAccountId() {
    return this.getBusinessProfile().id;
  }

  /**
   * 
   * @returns custom Id
   */
  getCustId() {
    return this.custId;
  }

  checkLogin() {
    const login = (this.lStorageService.getitemfromLocalStorage('ynw-credentials')) ? true : false;
    return login;
  }
  getGallery() {
    if(this.businessJsons['gallery']){
      return this.businessJsons['gallery'];
    } else {
      return [];
    }  
  }
  getLocations() {
    return this.businessJsons['location'];
  }

  getAccountSettings() {
    return this.businessJsons['settings'];
  }
  getApptSettings() {
    return this.businessJsons['appointmentsettings'];
  }
  getTerminologies(): any {
    return this.businessJsons['terminologies'];
  }

  getDepartments() {
    return this.businessJsons['departmentProviders'];
  }

  getBusinessProfile() {
    console.log(this.businessJsons);
    return this.businessJsons['businessProfile'];
  }

  getUsers() {
    return this.businessJsons['departmentProviders'];
  }

  getAccountConfig() {
    return this.accountConfig;
  }
  setNews(uniqueId) {
    this.getNews(uniqueId).subscribe(
      (news: any) => {
        console.log(news);
        this.newsFeed = news;
      }
    ) 
  }
  getNewsFeed() {
    return this.newsFeed;
  }
  getNews(uniqueId) {
    const url = projectConstantsLocal.UIS3PATH + uniqueId + "/news_feed.json?"+ new Date();
    return this.servicemeta.httpGet(url);
  }

}
