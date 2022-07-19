import { Injectable } from "@angular/core";
import { ServiceMeta } from "../../../../shared/services/service-meta";

@Injectable()
export class LeadsService {
  constructor(private servicemeta: ServiceMeta) { }

  /**
   * 
   * @param body 
   * @returns 
   */
  uploadFile(body) {
    const url = 'provider/questionnaire/upload/file';
    return this.servicemeta.httpPost(url, body);
  }

  

}