import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
/**
 * Handle Session Storage related actions
 */
export class SessionStorageService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    }
    /**
     * Method to set an item on session storage
     * @param itemname 
     * @param itemvalue 
     */
    public setitemOnSessionStorage(itemname, itemvalue) {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem(itemname, JSON.stringify(itemvalue));
        }
    }
    /**
     * Method to get an item from session storage
     * @param itemname 
     */
    public getitemfromSessionStorage(itemname) { // function to get local storage item value
        if (isPlatformBrowser(this.platformId)) {
            if (sessionStorage.getItem(itemname) !== 'undefined') {
                return JSON.parse(sessionStorage.getItem(itemname));
            }
        }
    }
    /**
     * Method to remove an item from session storage
     * @param itemname 
     */
    public removeitemfromSessionStorage(itemname) {
        sessionStorage.removeItem(itemname);
    }
    /**
     * Method to clear all the items from session storage
     */
    public clearSessionStorage() {
        for (let index = 0; index < sessionStorage.length; index++) {
            sessionStorage.removeItem(sessionStorage.key(index));
            index = index - 1; // manage index after remove
        }
    }
}
