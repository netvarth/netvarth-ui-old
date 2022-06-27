import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(private servicemeta: ServiceMeta) { }

    /**
     * 
     * @param customId 
     * @returns return the uniqueid which represents S3
     */
    getBusinessUniqueId(customId) {
        return this.servicemeta.httpGet('provider/business/' + customId);
    }

}