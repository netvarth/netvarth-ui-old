import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { SessionStorageService } from "./session-storage.service";

@Injectable({
    providedIn: 'root'
})

export class GroupStorageService {
    constructor(private sessionStorageService: SessionStorageService, private lStorageService: LocalStorageService) {}

    public getGroup() {
        if (this.sessionStorageService.getitemfromSessionStorage('tabId')) {
          return this.sessionStorageService.getitemfromSessionStorage('accountid');
        } else {
          return 0;
        }
      }
    
      public setitemToGroupStorage(itemname, itemvalue) {
        const group = this.getGroup();
        let groupObj = {};
        if (this.lStorageService.getitemfromLocalStorage(group)) {
          groupObj = JSON.parse(this.lStorageService.getitemfromLocalStorage(group));
          if (groupObj) {
            groupObj[itemname] = itemvalue;
          }
        } else {
          groupObj[itemname] = itemvalue;
        }
        this.lStorageService.setitemonLocalStorage(group, JSON.stringify(groupObj));
      }
      public getitemFromGroupStorage(itemname, type?) {
        let group;
        if (type) {
          group = 0;
        } else {
          group = this.getGroup();
        }
        if (this.lStorageService.getitemfromLocalStorage(group)) {
          const groupObj = JSON.parse(this.lStorageService.getitemfromLocalStorage(group));
          if (groupObj[itemname] || (itemname === 'isCheckin' && groupObj[itemname] !== undefined)) {
            return groupObj[itemname];
          }
        }
      }
      public removeitemFromGroupStorage(itemname) {
        const group = this.getGroup();
        const groupObj = JSON.parse(this.lStorageService.getitemfromLocalStorage(group));
        if (groupObj[itemname]) {
          delete groupObj[itemname];
          this.lStorageService.setitemonLocalStorage(group, JSON.stringify(groupObj));
        }
      }
}
