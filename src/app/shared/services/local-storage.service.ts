import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
/**
 * Handle Local Storage related actions
 */
export class LocalStorageService {

    // holds the variables which not removed by clearLocalstorage() method
    dont_delete_localstorage = ['ynw-locdet', 'ynw-createprov', 'supportName', 'supportPass', 'userType', 'version', 'activeSkin', 'jld', 'qrp', 'qB', 'bpwd','isBusinessOwner'];

    constructor() {
    }

    /**
     * function to get local storage item value
     * @param itemname name of variable
     */
    public getitemfromLocalStorage(itemname) {
        if (localStorage.getItem(itemname) !== 'undefined') {
            return JSON.parse(localStorage.getItem(itemname));
        }
    }
    /**
     * // function to set local storage item value
     * @param itemname name of variable 
     * @param itemvalue value to set
     */
    public setitemonLocalStorage(itemname, itemvalue) {
        localStorage.setItem(itemname, JSON.stringify(itemvalue));
    }
    /**
     * Method to remove an item from local storage
     * @param itemname item to be removed
     */
    public removeitemfromLocalStorage(itemname) {
        localStorage.removeItem(itemname);
    }
    /**
     * Method to clear the local storage items except the ones contained in 'dont_delete_localstorage'
     */
    public clearLocalstorage() {
        this.removeitemfromLocalStorage('ynw-credentials');
        for (let index = 0; index < localStorage.length; index++) {
            if (this.dont_delete_localstorage.indexOf(localStorage.key(index)) === -1) {
                localStorage.removeItem(localStorage.key(index));
                index = index - 1; // manage index after remove
            }
        }
    }
}
