import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable({
    providedIn: 'root'
  })

  /**
   * S3 Presigned Url Processor s
   */
export class S3UrlProcessor {

    /**
     * 
     * @param servicemeta To call httpGet Method
     */
    constructor(
        private servicemeta: ServiceMeta
    ) {}

    /**
     * Method which returns the Presigned Urls
     * @param accountUniqueId The Unique Id which represents S3 Bucket for a particular Account
     * @param listOfUrlTypes Type of the Url eg. services, businessProfile etc.
     * @returns { "services": 'https://presigned1/services', "businessProfile": 'https://presigned1/services'}
     */ 
    getPresignedUrls(accountUniqueId, userId, listOfUrlTypes) {
        let path = 'provider/account/settings/config/'+ accountUniqueId;
        if (userId) {
            path = path + '/' + userId;
        }
        path = path + '/' + listOfUrlTypes;
        return this.servicemeta.httpGet(path);
    }
}
