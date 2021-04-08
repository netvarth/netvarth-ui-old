import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable({
    providedIn: 'root'
})
export class MeetService {
    constructor(private servicemeta: ServiceMeta) { }

    isProviderReady(post_data) {
        return this.servicemeta.httpPut('consumer/appointment/videocall/ready', post_data);
    }
    // isConsumerReady(post_data) {
    //     const path = 'provider/appointment/videocall/ready/' , post_data;
    //     return this.servicemeta.httpPut(path);
    // }
    isConsumerReady(post_data) {
        return this.servicemeta.httpPut('provider/appointment/videocall/ready', post_data);
      }
    getStatus(uuid) {
        const path = 'provider/appointment/video/status/' + uuid;
        return this.servicemeta.httpGet(path);
    }
    
    // getVideoList(countrycode,phonenumber) {
    //     const url = 'consumer/appointment/meeting/'+ countrycode+ '/' + phonenumber;
    //     return this.servicemeta.httpGet(url);
    //   }
    // getVideoIdForService(uuid, usertype) {
    //     const path = usertype + '/appointment/videoid/link/' + uuid;
    //     return this.servicemeta.httpGet(path);
    //   }
    //   getJaldeeVideoAccessToken(videoId) {
    //     const path = 'provider/appointment/video/link/' + videoId;
    //     return this.servicemeta.httpGet(path);
    //   }

}