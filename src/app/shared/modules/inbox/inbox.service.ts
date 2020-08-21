import {Injectable} from '@angular/core';
import { ServiceMeta } from '../../services/service-meta';

@Injectable()

export class InboxServices {

    constructor(private servicemeta: ServiceMeta) {}

    getInbox(usertype) {
        return this.servicemeta.httpGet(usertype + '/communications');
    }

    postInboxReply(consumerId, data, usertype) {
        let url = '';
        if (usertype === 'provider') {
         url = usertype + '/communications/' + consumerId;
        } else {
         url = usertype + '/communications?account=' + consumerId;
        }
        return this.servicemeta.httpPost(url, data);
    }

    getBussinessProfile() {
      return this.servicemeta.httpGet('provider/bProfile');
    }
    readProviderMessages(providerId, messageIds) {
        const url = 'consumer/communications/readMessages/' + providerId + '/' + messageIds;
        return this.servicemeta.httpPut(url);
     }
}

