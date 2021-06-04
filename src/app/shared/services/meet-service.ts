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
    isConsumerReady(post_data) {
        return this.servicemeta.httpPut('provider/appointment/videocall/ready/', post_data);
    }
    isConsumerReadyMeet(post_data) {
        // alert('1')
        return this.servicemeta.httpPut('provider/video/adhoc/ready', post_data);
    }
    getStatus(uuid) {
        const path = 'provider/appointment/video/status/' + uuid;
        return this.servicemeta.httpGet(path);
    }
    setJaldeeVideoRecording(status) {
        const url = 'provider/video/settings/' + status;
        return this.servicemeta.httpPut(url);
    }
    getJaldeeVideoSettings() {
        const url = 'provider/account/settings';
        return this.servicemeta.httpGet(url);
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
    linkExpired(id) {
        const url = 'provider/video/adhoc/' + id + '/link/status';
        return this.servicemeta.httpGet(url);
      }
      getStats(id) {
        const url = 'provider/video/adhoc/' + id + '/status';
        return this.servicemeta.httpGet(url);
      }

}