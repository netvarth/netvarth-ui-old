import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class SessionStorageService {
    constructor() {

    }

    public setitemOnSessionStorage(itemname, itemvalue) {
        sessionStorage.setItem(itemname, JSON.stringify(itemvalue));
    }

    public getitemfromSessionStorage(itemname) { // function to get local storage item value
        if (sessionStorage.getItem(itemname) !== 'undefined') {
            return JSON.parse(sessionStorage.getItem(itemname));
        }
    }

    public removeitemfromSessionStorage(itemname) {
        sessionStorage.removeItem(itemname);
    }
}
