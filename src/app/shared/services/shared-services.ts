import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
// Import RxJs required methods
import { ServiceMeta } from './service-meta';
import { AlertPromise } from 'selenium-webdriver';
@Injectable()
export class SharedServices {

  licenseMetrics: any = [];
  constructor(private servicemeta: ServiceMeta, private http: HttpClient) {
  }
  getSystemDate() {
    return this.servicemeta.httpGet('provider/server/date');
  }
  getUIConfig(s3Url: any, UTCstring) {
    const url = s3Url + '/UIConfig/config.json?modifiedDate=' + UTCstring;
    return this.servicemeta.httpGet(url);
  }
  adminLogin(body) {
    return this.servicemeta.httpPost('superadmin/login', body);
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
  addJdn(data) {
    return this.servicemeta.httpPost('provider/settings/jdn/enable', data);
  }
  updateJdn(data) {
    return this.servicemeta.httpPut('provider/settings/jdn', data);
  }
  disable() {
    return this.servicemeta.httpPut('provider/settings/jdn/disable');
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
    const path = 'provider/license/packages';
    return this.servicemeta.httpGet(path);
  }
  signUpProvider(body) {

    return this.servicemeta.httpPost('provider', body);
  }
  signUpConsumer(body) {
    return this.servicemeta.httpPost('consumer', body);
  }
  saveReferralInfo(otp, body) {
    const path = 'provider/' + otp + '/howDoYouHear';
    return this.servicemeta.httpPost(path, body);
  }
  OtpSignUpProviderValidate(otp) {
    const path = 'provider/' + otp + '/verify';
    return this.servicemeta.httpPost(path);
  }
  OtpSignUpConsumerValidate(otp) {
    const path = 'consumer/' + otp + '/verify';
    return this.servicemeta.httpPost(path);
  }
  ConsumerSetPassword(otp, body) {
    const path = 'consumer/' + otp + '/activate';
    return this.servicemeta.httpPut(path, body);
  }
  ProviderSetPassword(otp, body) {
    const path = 'provider/' + otp + '/activate';
    return this.servicemeta.httpPut(path, body);
  }
  /* By Sony - Starts here*/
  GetsearchLocation(params) {
    return this.servicemeta.httpGet('provider/search/suggester/location', '', params);
  }
  getBusinessUniqueId(customId) {
    return this.servicemeta.httpGet('provider/business/' + customId);
  }
  getFeatures(subdomain) {
    return this.servicemeta.httpGet('provider/ynwConf/features/' + subdomain);
  }
  getJdn() {
    return this.servicemeta.httpGet('provider/settings/jdn');
  }
  GetProviders(url, params) {
    url = url + '/suggest';
    return this.servicemeta.httpGet(url, '', params);
  }
  DocloudSearch(url, params) {
    let sort_prefix;
    if (params.sort.trim() !== '') {
      sort_prefix = params.sort;
    } else {
      sort_prefix = 'claimable asc, ynw_verified_level desc, distance asc';
    }
    url = url + '/search';
    // rebuilding the parameters to accomodate q.parser and q.options
    const pass_params = {
      'start': params.start,
      // 'return': params.return,
      'fq': params.fq,
      'q': params.q,
      'size': params.size,
      'q.parser': params.parser, // 'q.parser'
      'q.options': params.options, // 'q.options'
      'sort': sort_prefix,
      // 'q.sort': params.sort,
      'expr.distance': params.distance,
      'return': '_all_fields,distance'
    };
    return this.servicemeta.httpGet(url, '', pass_params);
  }
  DocloudSearchWithoutDistance(url, params) {
    let sort_prefix;
    if (params.sort.trim() !== '') {
      sort_prefix = params.sort;
    } else {
      sort_prefix = 'claimable asc, ynw_verified_level desc';
    }
    url = url + '/search';
    // rebuilding the parameters to accomodate q.parser and q.options
    const pass_params = {
      'start': params.start,
      // 'return': params.return,
      'fq': params.fq,
      'q': params.q,
      'size': params.size,
      'q.parser': params.parser, // 'q.parser'
      'q.options': params.options, // 'q.options'
      'sort': sort_prefix,
      // 'q.sort': params.sort,
      'return': '_all_fields'
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
    return this.servicemeta.httpPatch(origin, data);
  }
  changePasswordProfile(data, origin?) {
    // return this.servicemeta.httpPut('consumers/login/chpwd' , data);
    const url = origin + '/login/chpwd';
    return this.servicemeta.httpPut(url, data);
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
    return this.servicemeta.httpGet(gurl);
  }
  getUserbusinessprofiledetails_json(accUId, providerId, s3url, section, UTCstring) {
    let gurl = '';
    section = section + '.json';
    if (UTCstring !== null) {
      gurl = s3url + '/' + accUId + '/' + providerId + '/' + section + '?modifiedDate=' + UTCstring;
    } else {
      gurl = s3url + '/' + accUId + '/' + providerId + '/' + section;
    }
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
    const dd = (pdate !== undefined) ? '/' + pdate + '?account=' + accountid : '';
    const url = 'consumer/waitlist/queues/' + locid + '/' + servid + dd;
    return this.servicemeta.httpGet(url);
  }
  addCheckin(accountid, postData) {
    return this.servicemeta.httpPost('consumer/waitlist?account=' + accountid, postData);
  }
  getCheckinByConsumerUUID(uuid, accountid) {
    const url = 'consumer/waitlist/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpGet(url);
  }
  addProviderCheckin(postData) {
    return this.servicemeta.httpPost('provider/waitlist', postData);
  }
  getConsumerFamilyMembers() {
    return this.servicemeta.httpGet('consumer/familyMember');
  }
  getProviderCustomerFamilyMembers(consumer_id) {
    const url = 'provider/customers/familyMember/' + consumer_id;
    return this.servicemeta.httpGet(url);
  }
  addProviderCustomerFamilyMember(data) {
    return this.servicemeta.httpPost('provider/customers/familyMember', data);
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
  buildAuditlogParams(cat, subcat, action, sdate) {
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
    if (ackStatus === 'true') {
      param += 'ackStatus-eq=true';
    } else if (ackStatus === 'false') {
      if (ackStatus === 'false') {
        param += 'ackStatus-eq=false';
      }
    } else if (ackStatus === 'true,false') {
      param += 'ackStatus-eq=false,true';
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
  setFutureCheckinStatus(status) {
    const url = 'provider/settings/waitlistMgr/futureCheckIns/' + status;
    return this.servicemeta.httpPut(url);
  }
  getWaitlistMgr() {
    const url = 'provider/settings/waitlistMgr/';
    return this.servicemeta.httpGet(url);
  }
  getPaymentStatus(type, uuid) {
    const url = type + '/payment/status/' + uuid;
    return this.servicemeta.httpGet(url);
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
  addConsumerWaitlistNote(accountid, uuid, body) {
    const url = 'consumer/waitlist/communicate/' + uuid + '?account=' + accountid;
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
  consumerPaymentStatus(data) {
    const url = 'consumer/payment/status';
    return this.servicemeta.httpPost(url, data);
 }
  getConsumerPayments() {
    const url = 'consumer/payment';
    return this.servicemeta.httpGet(url);
  }
  getConsumerPaymentById(id) {
    const url = 'consumer/payment/' + id;
    return this.servicemeta.httpGet(url);
  }
  providerPayment(data) {
    const url = 'provider/payment';
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
  getWaitlistHistory(accountid, filter) {
    const starturl = 'consumer/waitlist/history?account-eq=' + accountid;
    let returl = this.generateFilter(starturl, filter);
    if (filter['from']) {
      returl = returl + '&from=' + filter['from'];
    }
    if (filter['perpage']) {
      returl = returl + '&count=' + filter['perpage'];
    }
    return this.servicemeta.httpGet(returl);
  }
  getWaitlistHistoryCnt(accountid, filter) {
    const starturl = 'consumer/waitlist/history/count?account-eq=' + accountid;
    const returl = this.generateFilter(starturl, filter);
    return this.servicemeta.httpGet(returl);
  }
  generateFilter(url, filter) {
    if (filter['location']) {
      url = url + '&location-eq=' + filter['location'];
    }
    if (filter['queue']) {
      url = url + '&queue-eq=' + filter['queue'];
    }
    if (filter['service']) {
      url = url + '&service-eq=' + filter['service'];
    }
    if (filter['waitliststatus']) {
      url = url + '&waitlistStatus-eq=' + filter['waitliststatus'];
    }
    if (filter['date']) {
      url = url + '&date-eq=' + filter['date'];
    }
    return url;
  }
  deleteWaitlist(id, params, type) {
    if (type === 'checkin') {
      return this.servicemeta.httpDelete('consumer/waitlist/' + id, null, params);
    } else if (type === 'appointment') {
      return this.servicemeta.httpPut('consumer/appointment/cancel/' + id + '?account=' + params['account']);
    }
  }
  getConsumerRateService(params, type) {
    let path;
    if (type === 'checkin') {
      path = 'consumer/waitlist/rating';
    } else if (type === 'appointment') {
      path = 'consumer/appointment/rating';
    }
    return this.servicemeta.httpGet(path, null, params);
  }
  postConsumerRateService(params, data, type) {
    let path;
    if (type === 'checkin') {
      path = 'consumer/waitlist/rating';
    } else if (type === 'appointment') {
      path = 'consumer/appointment/rating';
    }
    return this.servicemeta.httpPost(path, data, null, params);
  }
  updateConsumerRateService(params, data, type) {
    let path;
    if (type === 'checkin') {
      path = 'consumer/waitlist/rating';
    } else if (type === 'appointment') {
      path = 'consumer/appointment/rating';
    }
    return this.servicemeta.httpPut(path, data, null, params);
  }
  getUpgradableLicensePackages() {
    return this.servicemeta.httpGet('provider/license/upgradablePackages');
  }
  getPaymentDetail(uuid, mod) {
    const url = mod + '/payment/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  getTaxpercentage() {
    const url = 'provider/payment/tax/';
    return this.servicemeta.httpGet(url);
  }
  getPartysizeDetails(domain, subdomain) {
    const url = 'ynwConf/settings/' + domain + '/' + subdomain;
    return this.servicemeta.httpGet(url);
  }
  applyCoupon(jCouponCode, checkinId, accountid) {
    const url = 'consumer/jaldee/coupons/' + jCouponCode + '/' + checkinId + '?account=' + accountid;
    return this.servicemeta.httpPost(url);
  }
  set(value, key) {
    return CryptoJS.AES.encrypt(value, key);
  }
  get(value, key) {
    return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
  }
  isAvailableNow() {
    const url = 'provider/waitlist/queues/isAvailableNow/today';
    return this.servicemeta.httpGet(url);
  }
  getLicenseDetails() {
    // return this.servicemeta.httpGet('accounts/license');
    return this.servicemeta.httpGet('provider/license');
  }
  getProviderDept(id) {
    const path = 'consumer/waitlist/department/services?account=' + id;
    return this.servicemeta.httpGet(path);
  }
  getUsersByDept(id, departmentId) {
    const path = 'consumer/waitlist/providerByDepartmentId/' + departmentId + '?account=' + id;
    return this.servicemeta.httpGet(path);
  }
  getBussinessProfile() {
    return this.servicemeta.httpGet('provider/bProfile');
  }
  getAddressfromLatLong(data) {
    return this.servicemeta.httpPost('provider/signup/location', data);
  }
  addLiveTrackDetails(uid, id, data) {
    const url = 'consumer/waitlist/saveMyLoc/' + uid + '?account=' + id;
    return this.servicemeta.httpPost(url, data);
  }
  updateLiveTrackDetails(uid, id, data) {
    const url = 'consumer/waitlist/updateMyLoc/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url, data);
  }
  unSaveMyLocation(uid, id) {
    const url = 'consumer/waitlist/unshareMyLoc/' + uid + '?account=' + id;
    return this.servicemeta.httpDelete(url);
  }
  startLiveTrack(uid, id) {
    const url = 'consumer/waitlist/start/mytracking/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url);
  }
  stopLiveTrack(uid, id) {
    const url = 'consumer/waitlist/stop/mytracking/' + uid + '?account=' + id;
    return this.servicemeta.httpDelete(url);
  }
  statusOfLiveTrack(uid, id) {
    const path = 'consumer/waitlist/status/mytracking/' + uid + '?account=' + id;
    return this.servicemeta.httpGet(path);
  }
  liveLocateChange(uid, id) {
    const url = 'consumer/waitlist/live/locate/change/waitlist/status/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url);
  }
  updateLatLong(uid, id, data) {
    const url = 'consumer/waitlist/update/latlong/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url, data);
  }
  updateTravelMode(uid, id, data) {
    const url = 'consumer/waitlist/update/travelmode/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url, data);
  }
  getTimeinMin(time) {
    const time_min = (time.hour * 60) + time.minute;
    return (typeof (time_min) === 'number') ? time_min : 0;
  }
  getFormattedAddress(data) {
    let address;
    if (data) {
      if (data.area) {
        address = data.area;
      }
      if (data.district && data.district !== data.area) {
        address = address + ', ' + data.district;
      }
      if (data.state.state) {
        address = address + ', ' + data.state.state;
      }
      if (data.state.country.country) {
        address = address + ', ' + data.state.country.country;
      }
      if (data.pinCode) {
        address = address + ', ' + data.pinCode;
      }
    }
    return address;
  }
  consumerMassCommunication(data) {
    const url = 'provider/waitlist/consumerMassCommunication';
    return this.servicemeta.httpPost(url, data);
  }
  consumerMassCommunicationWithId(data) {
    const url = 'provider/waitlist/consumerMassCommunicationWithId';
    return this.servicemeta.httpPost(url, data);
  }
  addProviderAppointment(postData) {
    return this.servicemeta.httpPost('provider/appointment', postData);
  }
  addCustomerAppointment(accountid, postData) {
    return this.servicemeta.httpPost('consumer/appointment?account=' + accountid, postData);
  }
  getSchedulesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
    const dd = (pdate !== undefined) ? '/' + pdate + '?account=' + accountid : '';
    const url = 'consumer/appointment/schedule/location/' + locid + '/service/' + servid + '/date' + dd;
    // const url = 'consumer/appointment/schedule/location/' + locid + '/service/' + servid + '/date/' + pdate;
    return this.servicemeta.httpGet(url);
  }
  getTodaysAvailableTimeSlots(date, sheduleid, accountid?) {
    const url = 'consumer/appointment/schedule/' + sheduleid + '/' + date + '?account=' + accountid;
    return this.servicemeta.httpGet(url);
  }
  addProviderAppointmentNote(uuid, body) {
    const url = 'provider/appointment/communicate/' + uuid;
    return this.servicemeta.httpPost(url, body);
  }
  addConsumerAppointmentNote(accountid, uuid, body) {
    const url = 'consumer/appointment/communicate/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpPost(url, body);
  }
  consumerMassCommunicationAppt(data) {
    const url = 'provider/appointment/consumerMassCommunication';
    return this.servicemeta.httpPost(url, data);
  }
  addCustomerDonation(postData, accountid) {
    return this.servicemeta.httpPost('consumer/donation?account=' + accountid, postData);
  }
  getDonationByConsumerUUID(uuid, accountid) {
    const url = 'consumer/donation/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpGet(url);
  }
  getConsumerDonations(params = null) {
    const url = 'consumer/donation';
    return this.servicemeta.httpGet(url, null, params);
  }
  getConsumerDonationServices(accountid) {
    const url = 'consumer/donation/services?account=' + accountid;
    return this.servicemeta.httpGet(url);
  }
  getCheckinbyEncId(encId) {
    const url = 'consumer/waitlist/enc/' + encId;
    return this.servicemeta.httpGet(url);
  }
  getApptbyEncId(encId) {
    const url = 'consumer/appointment/enc/' + encId;
    return this.servicemeta.httpGet(url);
  }
  getServicesforAppontmntByLocationId(locid) {
    if (locid) {
      const url = 'consumer/appointment/service/' + locid;
      return this.servicemeta.httpGet(url);
    }
  }
  getAppointmentByConsumerUUID(uuid, accountid) {
    const url = 'consumer/appointment/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpGet(url);
  }
  consumerMobilenumCheck(mobile) {
    const url = 'consumer/' + mobile + '/check';
    return this.servicemeta.httpGet(url);
  }
  isProviderAccountExists(mobile) {
    const url = 'provider/' + mobile + '/check';
    return this.servicemeta.httpGet(url);
  }
  updateAppointmentTravelMode(uid, id, data) {
    const url = 'consumer/appointment/update/travelmode/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url, data);
  }
  addAppointmentLiveTrackDetails(uid, id, data) {
    const url = 'consumer/appointment/saveMyLoc/' + uid + '?account=' + id;
    return this.servicemeta.httpPost(url, data);
  }
  updateAppointmentLiveTrackDetails(uid, id, data) {
    const url = 'consumer/appointment/updateMyLoc/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url, data);
  }
  startApptLiveTrack(uid, id) {
    const url = 'consumer/appointment/start/mytracking/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url);
  }
  stopApptLiveTrack(uid, id) {
    const url = 'consumer/appointment/stop/mytracking/' + uid + '?account=' + id;
    return this.servicemeta.httpDelete(url);
  }
  statusOfApptLiveTrack(uid, id) {
    const path = 'consumer/appointment/status/mytracking/' + uid + '?account=' + id;
    return this.servicemeta.httpGet(path);
  }
  updateApptLatLong(uid, id, data) {
    const url = 'consumer/appointment/update/latlong/' + uid + '?account=' + id;
    return this.servicemeta.httpPut(url, data);
  }
  getSchdulesbyLocatinIdandServiceIdwithoutDate(locid, servid, accountid?) {
    const url = 'consumer/appointment/schedule/location/' + locid + '/service/' + servid + '/?account=' + accountid;
    return this.servicemeta.httpGet(url);
  }
  consumerWtlstTeleserviceWithId(postdata, uuid) {
    return this.servicemeta.httpPost('provider/waitlist/' + uuid + '/createmeetingrequest', postdata);
  }
  consumerApptTeleserviceWithId(postdata, uuid) {
    return this.servicemeta.httpPost('provider/appointment/' + uuid + '/createmeetingrequest', postdata);
  }
  getWaitlstMeetingDetails(mode, uuid) {
    const path = 'provider/waitlist/' + uuid + '/meetingDetails/' + mode;
    return this.servicemeta.httpGet(path);
  }
  getApptMeetingDetails(mode, uuid) {
    const path = 'provider/appointment/' + uuid + '/meetingDetails/' + mode;
    return this.servicemeta.httpGet(path);
  }
  getS3Url(src?) {
    const promise = new Promise((resolve, reject) => {
      if (localStorage.getItem('s3Url')) {
        resolve(localStorage.getItem('s3Url'));
      } else {
        this.gets3url(src)
          .subscribe(
            data => {
              localStorage.setItem('s3Url', data.toString());
              resolve(data);
            },
            error => {
              reject(error);
            });
      }
    });
    return promise;
  }
}
