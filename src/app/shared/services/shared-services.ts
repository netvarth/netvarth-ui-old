import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceMeta } from './service-meta';

@Injectable()

export class SharedServices {

    constructor(private servicemeta: ServiceMeta, private http: HttpClient) {

    }

    ConsumerLogin(body) {
        return this.servicemeta.httpPost('consumer/login', body);
        // set no_redirect_path in interceptor to avoid redirect on 401
    }

    ProviderLogin(body) {
        return this.servicemeta.httpPost('provider/login', body);
        // set no_redirect_path in interceptor to avoid redirect on 401

    }

    ConsumerLogout() {
        return this.servicemeta.httpDelete('consumer/login');
    }

    ProviderLogout() {
        return this.servicemeta.httpDelete('provider/login');
    }

    forgotPassword(type = 'consumer', phonenumber) {
      return this.servicemeta.httpPost(type + '/login/reset/' + phonenumber);
    }

    OtpValidate(type = 'consumer', otp) {
      const path = type + '/login/reset/' + otp + '/validate';
      return this.servicemeta.httpPost(path);
    }

    changePassword(type = 'consumer', otp, body) {
      const path = type + '/login/reset/' + otp;
      return this.servicemeta.httpPut(path, body);
    }

    bussinessDomains() {
      const path = 'ynwConf/businessDomains';
      return this.servicemeta.httpGet(path);
    }

    getPackages() {
      // const path = 'accounts/license/packages';
      const path = 'provider/license/packages';
      return this.servicemeta.httpGet(path);
    }

    signUpProvider(body) {
      // return this.servicemeta.httpPost('accounts', body);
      return this.servicemeta.httpPost('provider', body);
    }

    signUpConsumer(body) {
      // return this.servicemeta.httpPost('consumers', body);
      return this.servicemeta.httpPost('consumer', body);
    }

    OtpSignUpProviderValidate(otp) {
      // const path = 'accounts/' + otp + '/verify';
      const path = 'provider/' + otp + '/verify';
      return this.servicemeta.httpPost(path);
    }

    OtpSignUpConsumerValidate(otp) {
      // const path = 'consumers/' + otp + '/verify';
      const path = 'consumer/' + otp + '/verify';
      return this.servicemeta.httpPost(path);
    }

    ConsumerSetPassword(otp, body) {
      // const path = 'consumers/' + otp + '/activate';
      const path = 'consumer/' + otp + '/activate';
      return this.servicemeta.httpPut(path, body);
    }
    ProviderSetPassword(otp, body) {
      // const path = 'accounts/' + otp + '/activate';
      const path = 'provider/' + otp + '/activate';
      return this.servicemeta.httpPut(path, body);
    }

    /* By Sony - Starts here*/

    GetsearchLocation(params) {
      return this.servicemeta.httpGet('provider/search/suggester/location', '', params);
    }

    /* NEW_GetProviders(url, params) {
      url = url + '/suggester';
      const pass_params = {
        'start': 0,
        'return': 'title',
        'fq': '',
        'q': "'" + params.q + "'",
        'size': 10 ,
        'q.parser': 'structured', // 'q.parser'
        'q.options': '', // 'q.options'
        'sort': 'title asc'
      };
     return this.servicemeta.httpGet(url, '', pass_params);
    }*/

    GetProviders(url, params) {
      url = url + '/suggest';
     return this.servicemeta.httpGet(url, '', params);
    }

    DocloudSearch(url, params) {
       url = url + '/search';
       // rebuilding the parameters to accomodate q.parser and q.options
       const pass_params = {
        'start': params.start,
       // 'return': params.return,
        'fq': params.fq,
        'q': params.q,
        'size': params.size ,
        'q.parser': params.parser, // 'q.parser'
        'q.options': params.options, // 'q.options'
        'q.sort': 'distance asc,' + params.sort,
        'expr.distance': params.distance
      };
      return this.servicemeta.httpGet(url, '', pass_params);
    }

    /* By Sony - Ends here */

    getProfile(id, origin?) {
      let path;
      // const path = 'consumer/' + id;
      if (origin === 'provider') {
        path = origin + '/profile/' + id;
      } else if (origin === 'consumer') {
        path = origin + '/' + id;
      }
      return this.servicemeta.httpGet(path);
    }

    updateProfile(data, origin) {
      return this.servicemeta.httpPatch(origin , data);
    }

    changePasswordProfile(data, origin?) {
      // return this.servicemeta.httpPut('consumers/login/chpwd' , data);
      const url = origin + '/login/chpwd';
      return this.servicemeta.httpPut( url , data);
    }

    verifyNewPhone(phonenumber, origin?) {
      // const path = 'consumers/login/verifyLogin/' + phonenumber;
      const path = origin + '/login/verifyLogin/' + phonenumber;
      return this.servicemeta.httpPost(path);
    }

    verifyNewPhoneOTP(otp, body, origin?) {
      // const path = 'consumers/login/' + otp + '/verifyLogin';
      const path = origin + '/login/' + otp + '/verifyLogin';
      return this.servicemeta.httpPut(path, body);
    }

    // addFavProvider(id) {
    //   return this.servicemeta.httpPost('consumer/accounts/' + id);
    // }

    getFavProvider() {
      return this.servicemeta.httpGet('consumer/providers');
    }

    gets3url(src?) {
      let url = '';
      switch (src) {
        case 'consumer':
          url = 'consumer/login/s3Url';
        break;
        case 'provider':
          url = 'provider/login/s3Url';
        break;
        default: // case if parameter is blank
          url = 'consumer/login/s3Url';
        break;
      }
      return this.servicemeta.httpGet(url);
    }

    getCloudUrl() {
      // const url = 'accounts/ynwConf/searchDomain';
      const url = 'ynwConf/searchDomain';
      return this.servicemeta.httpGet(url);
    }

    getbusinessprofiledetails_json(id, s3url, section, UTCstring) {

      let gurl = '';
      section = section + '.json';
      if (UTCstring !== null) {
        gurl = s3url + '/' + id + '/' + section + '?modifiedDate=' + UTCstring;
      } else {
        gurl = s3url + '/' + id + '/' + section;
      }
      // console.log('url'+url);
      return this.servicemeta.httpGet(gurl);
    }

    getAllSearchlabels() {
      const path = 'ynwConf/searchLabels';
      return this.servicemeta.httpGet(path);
    }

    getServicesByLocationId(locid) {
      if (locid) {
        const url = 'consumer/waitlist/services/' + locid;
        return this.servicemeta.httpGet(url);
      }
    }
    getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
      const dd = (pdate !== undefined) ? '/' + pdate + '?account=' + accountid  : '';
      const url = 'consumer/waitlist/queues/' + locid + '/' + servid + dd;
      return this.servicemeta.httpGet(url);
    }

    addCheckin(accountid, postData) {
      return this.servicemeta.httpPost('consumer/waitlist?account=' + accountid, postData);
    }
    getConsumerFamilyMembers() {
      return this.servicemeta.httpGet('consumer/familyMember');
    }
    addMembers(data) {
      return this.servicemeta.httpPost('consumer/familyMember', data);
    }
    editMember(data) {
      return this.servicemeta.httpPut('consumer/familyMember', data);
    }
    getAuditLogs(cat, subcat, action, sdate, startfrom, limit) {
      let retparam = this.buildAuditlogParams(cat, subcat, action, sdate);
      if (startfrom !== '') {
        if (retparam !== '') {
          retparam += '&';
        }
        retparam += 'from=' + startfrom;
      }
      if (limit !== '') {
        if (retparam !== '') {
          retparam += '&';
        }
        retparam += 'count=' + limit;
      }
      if (retparam !== '') {
        retparam = '?' + retparam;
      }
      const url = 'provider/auditlogs' + retparam;
      return this.servicemeta.httpGet(url);
    }
    getAuditLogsTotalCnt(cat, subcat, action, sdate) {
      let retparam = this.buildAuditlogParams(cat, subcat, action, sdate);
      if (retparam !== '') {
        retparam = '?' + retparam;
      }
      const url = 'provider/auditlogs/count' + retparam;
      return this.servicemeta.httpGet(url);
    }
    buildAuditlogParams(cat, subcat , action, sdate) {
      let param = '';
      if (cat !== '') {
        param += 'category-eq=' + cat;
      }
      if (subcat !== '') {
        if (param !== '') {
          param += '&';
        }
        param += 'subCategory-eq=' + subcat;
      }
      if (action !== '') {
        if (param !== '') {
          param += '&';
        }
        param += 'action-eq=' + action;
      }
      if (sdate !== '') {
        if (param !== '') {
          param += '&';
        }
        param += 'date-eq=' + sdate;
      }
      return param;
    }

    getAlerts(ackStatus, sdate, startfrom, limit) {
      let retparam = this.buildAlertsParams(ackStatus, sdate);
      if (startfrom !== '') {
        if (retparam !== '') {
          retparam += '&';
        }
        retparam += 'from=' + startfrom;
      }
      if (limit !== '') {
        if (retparam !== '') {
          retparam += '&';
        }
        retparam += 'count=' + limit;
      }
      if (retparam !== '') {
        retparam = '?' + retparam;
      }
      const url = 'provider/alerts' + retparam;
      return this.servicemeta.httpGet(url);
    }
    getAlertsTotalCnt(ackStatus, sdate) {
      let retparam = this.buildAlertsParams(ackStatus, sdate);
      if (retparam !== '') {
        retparam = '?' + retparam;
      }
      const url = 'provider/alerts/count' + retparam;
      return this.servicemeta.httpGet(url);
    }
    buildAlertsParams(ackStatus, sdate) {
      let param = '';
      if (ackStatus !== '') {
        param += 'ackStatus-eq=' + ackStatus;
      }
      /*if (subcat !== '') {
        if (param !== '') {
          param += '&';
        }
        param += 'subCategory-eq=' + subcat;
      }
      if (action !== '') {
        if (param !== '') {
          param += '&';
        }
        param += 'action-eq=' + action;
      }*/
      if (sdate !== '') {
        if (param !== '') {
          param += '&';
        }
        param += 'createdDate-eq=' + sdate;
      }
      return param;
    }
    acknowledgeAlert(id) {
      return this.servicemeta.httpPut('provider/alerts/' + id);
    }
    setAcceptOnlineCheckin(status) {
      const url = 'provider/settings/waitlistMgr/onlineCheckIns/' + status;
      return this.servicemeta.httpPut(url);
    }
    getWaitlistMgr() {
      const url = 'provider/settings/waitlistMgr/';
      return this.servicemeta.httpGet(url);
    }

    getPaymentStatus() {
      return ;
    }

    getInboxUnreadCount(typ) {
      const url = typ + '/communications/unreadCount';
      return this.servicemeta.httpGet(url);
    }

    addConsumertoProviderNote(uuid, message) {
      const url = 'consumer/communications?account=' + uuid;
      return this.servicemeta.httpPost(url, message);
    }

    addProvidertoConsumerNote(uuid, message) {
      const url = 'provider/communications/' + uuid;
      return this.servicemeta.httpPost(url, message);
    }

    addProviderWaitlistNote(uuid, body) {
      const url = 'provider/waitlist/communicate/' + uuid;
      return this.servicemeta.httpPost(url, body);
    }

    addConsumerWaitlistNote(uuid, body) {
      const url = 'consumer/waitlist/communicate/' + uuid;
      return this.servicemeta.httpPost(url, body);
    }

    getPaymentModesofProvider(provid) {
      const url = 'consumer/payment/modes/' + provid;
      return this.servicemeta.httpGet(url);
    }

    consumerPayment(data) {
      const url = 'consumer/payment';
      return this.servicemeta.httpPost(url, data);
    }

    getExistingCheckinsByLocation(locid) {
      const stat = 'checkedIn,arrived';
      const url = 'consumer/waitlist?location-eq=' + locid + '&waitlistStatus-eq=' + stat;
      return this.servicemeta.httpGet(url);
    }

    addProvidertoFavourite(accountid) {
      const url = 'consumer/providers/' + accountid;
      return this.servicemeta.httpPost(url);
    }
    removeProviderfromFavourite(accountid) {
      const url = 'consumer/providers/' + accountid;
      return this.servicemeta.httpDelete(url);
    }
}
