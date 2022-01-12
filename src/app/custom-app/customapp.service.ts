import { Injectable } from '@angular/core';
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

  getBusinessProfile() {
    console.log(this.businessJsons);
    return this.businessJsons['businessProfile'];
  }

//   showCommunicate(provid) {
//     this.commdialogRef = this.dialog.open(AddInboxMessagesComponent, {
//       width: '50%',
//       panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
//       disableClose: true,
//       data: {
//         caption: 'Enquiry',
//         user_id: provid,
//         userId: this.userId,
//         source: 'consumer-common',
//         type: 'send',
//         terminologies: this.terminologiesjson,
//         name: this.businessjson.businessName,
//         typeOfMsg: 'single'
//       }
//     });
//     this.commdialogRef.afterClosed().subscribe(() => {
//     });
//   }

}
