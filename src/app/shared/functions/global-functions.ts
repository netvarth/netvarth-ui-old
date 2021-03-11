import { Injectable } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";
@Injectable()
export class GlobalFunctions {
  constructor(private lStorageService: LocalStorageService) {

  }

  public getitemfromLocalStorage(itemname) { // function to get local storage item value
    if (this.lStorageService.getitemfromLocalStorage(itemname) !== 'undefined') {
      return JSON.parse(this.lStorageService.getitemfromLocalStorage(itemname));
    }
  }

  public setitemonLocalStorage(itemname, itemvalue) { // function to set local storage item value
    this.lStorageService.setitemonLocalStorage(itemname, JSON.stringify(itemvalue));
  }
}
