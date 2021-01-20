import { Injectable } from "@angular/core";
import { SessionStorageService } from "./session-storage.service";

@Injectable({
    providedIn: 'root'
})

export class GroupStorageService {
    constructor(private sessionStorageService: SessionStorageService) {}

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
        if (localStorage.getItem(group)) {
          groupObj = JSON.parse(localStorage.getItem(group));
          if (groupObj) {
            groupObj[itemname] = itemvalue;
          }
        } else {
          groupObj[itemname] = itemvalue;
        }
        localStorage.setItem(group, JSON.stringify(groupObj));
      }
      public getitemFromGroupStorage(itemname, type?) {
        let group;
        if (type) {
          group = 0;
        } else {
          group = this.getGroup();
        }
        if (localStorage.getItem(group)) {
          const groupObj = JSON.parse(localStorage.getItem(group));
          if (groupObj[itemname] || (itemname === 'isCheckin' && groupObj[itemname] !== undefined)) {
            return groupObj[itemname];
          }
        }
      }
      public removeitemFromGroupStorage(itemname) {
        const group = this.getGroup();
        const groupObj = JSON.parse(localStorage.getItem(group));
        if (groupObj[itemname]) {
          delete groupObj[itemname];
          localStorage.setItem(group, JSON.stringify(groupObj));
        }
      }
}
