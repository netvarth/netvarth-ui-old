import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {
    constructor() {

    }

    public getitemfromLocalStorage(itemname) { // function to get local storage item value
        if (localStorage.getItem(itemname) !== 'undefined') {
            return JSON.parse(localStorage.getItem(itemname));
        }
    }

    public setitemonLocalStorage(itemname, itemvalue) { // function to set local storage item value
        localStorage.setItem(itemname, JSON.stringify(itemvalue));
    }

    public removeitemfromLocalStorage(itemname) {
        localStorage.removeItem(itemname);
    }

}
