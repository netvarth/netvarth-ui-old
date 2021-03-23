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
     * Method which returns the Jsons
     * @param accountUniqueId The Unique Id which represents S3 Bucket for a particular Account
     * @param listOfUrlTypes Type of the Url eg. services, businessProfile etc.
     * @returns { "services": 'services.json', "businessProfile": businessprofile.json}
     */ 
    getJsonsbyTypes(accountUniqueId, userId, listOfUrlTypes) {
        let path = 'provider/account/settings/config/'+ accountUniqueId;
        if (userId) {
            path = path + '/' + userId;
        }
        path = path + '/' + listOfUrlTypes;
        return this.servicemeta.httpGet(path);
    }

    /**
     * 
     * @param jsonStr_Obj 
     */
    getJson(jsonStr_Obj) {
        if(typeof jsonStr_Obj === 'object') {
            return jsonStr_Obj;
        } else {
            return JSON.parse(jsonStr_Obj);
        }
    }
}
