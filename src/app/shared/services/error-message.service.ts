import { Injectable } from "@angular/core";
import { Messages } from "../constants/project-messages";

Injectable({
    providedIn: 'root'
})

export class ErrorMessagingService {
    constructor() {
    }
    getApiError(error) {
        if (error.error && typeof error.error === 'string') {
            return error.error;
        } else if (typeof error === 'string') {
            return error;
        } else {
            return Messages.API_ERROR;
        }
    }
}
