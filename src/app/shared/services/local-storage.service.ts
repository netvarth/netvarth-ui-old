// import { isPlatformBrowser } from "@angular/common";
// import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
/**
 * Handle Local Storage related actions
 */
export class LocalStorageService {

    /* holds the variables which not removed by clearLocalstorage() method */
    dont_delete_localstorage = ['ynw-locdet', 'ynw-createprov', 'supportName', 'supportPass', 'userType', 'version', 'activeSkin', 'mUniqueId'];
    
    /**
     * Default constructor
     */
    constructor(
        // @Inject(PLATFORM_ID) private platformId: object
        ) {
    }

    /**
     * function to get local storage item value
     * @param itemname name of variable
     */
    public getitemfromLocalStorage(itemname) {
        // if (isPlatformBrowser(this.platformId)) {
            let storage = window.localStorage;
            if (storage.getItem(itemname) !== 'undefined') {
                return JSON.parse(storage.getItem(itemname));
            }
        // }
        // return null;
    }
    /**
     * // function to set local storage item value
     * @param itemname name of variable 
     * @param itemvalue value to set
     */
    public setitemonLocalStorage(itemname, itemvalue) {
        let storage = window.localStorage;
        // if (isPlatformBrowser(this.platformId)) {
            storage.setItem(itemname, JSON.stringify(itemvalue));
        // }
    }
    /**
     * Method to remove an item from local storage
     * @param itemname item to be removed
     */
    public removeitemfromLocalStorage(itemname) {
        // if (isPlatformBrowser(this.platformId)) {
            let storage = window.localStorage;
            storage.removeItem(itemname);
        // }
    }
    /**
     * Method to clear the local storage items except the ones contained in 'dont_delete_localstorage'
     */
    public clearLocalstorage() {
        let storage = window.localStorage;
        // if (isPlatformBrowser(this.platformId)) {
            this.removeitemfromLocalStorage('ynw-credentials');
            for (let index = 0; index < storage.length; index++) {
                if (this.dont_delete_localstorage.indexOf(storage.key(index)) === -1) {
                    storage.removeItem(storage.key(index));
                    index = index - 1; // manage index after remove
                }
            }
        // }
    }
}
