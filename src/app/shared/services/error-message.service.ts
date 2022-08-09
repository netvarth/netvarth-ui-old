import { Injectable } from "@angular/core";

Injectable({
    providedIn: 'root'
})

export class ErrorMessagingService {

    API_ERROR = 'There was a problem while connecting to our server. Please try again.';

    constructor() {
    }
    getApiError(error) {
        console.log("Get Api Error:", error);
        if (error.error && typeof error.error === 'string') {
            return error.error;
        } else if (typeof error === 'string') {
            return error;
        } else {
            return this.API_ERROR;
        }
    }
}
