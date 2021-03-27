import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable({
    providedIn: 'root'
})
export class MeetService {
    constructor(private servicemeta: ServiceMeta) { }

    isProviderReady(uuid) {
        const url = 'consumer/appointment/videocall/ready/' + uuid;
        return this.servicemeta.httpPut(url);
    }
    isConsumerReady(uuid) {
        const path = 'provider/appointment/videocall/ready/' + uuid;
        return this.servicemeta.httpPut(path);
    }
    getStatus(uuid) {
        const path = 'provider/appointment/video/status/' + uuid;
        return this.servicemeta.httpGet(path);
    }
    // getVideoIdForService(uuid, usertype) {
    //     const path = usertype + '/appointment/videoid/link/' + uuid;
    //     return this.servicemeta.httpGet(path);
    //   }
    //   getJaldeeVideoAccessToken(videoId) {
    //     const path = 'provider/appointment/video/link/' + videoId;
    //     return this.servicemeta.httpGet(path);
    //   }

}