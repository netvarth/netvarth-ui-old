
import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';

// Import RxJs required methods
import { ServiceMeta } from '../../shared/services/service-meta';

@Injectable()

export class ConsumerServices {


  constructor(private servicemeta: ServiceMeta) {}

  getWaitlist(params) {
      return this.servicemeta.httpGet('consumer/waitlist', null, params);
      // set no_redirect_path in interceptor to avoid redirect on 401
  }
  getApptlist(params) {
    return this.servicemeta.httpGet('consumer/appointment', null, params);
    // set no_redirect_path in interceptor to avoid redirect on 401
}
  getWaitlistHistory(params?) {
    return this.servicemeta.httpGet('consumer/waitlist/history', null, params);
    // set no_redirect_path in interceptor to avoid redirect on 401
  }


  deleteFavProvider(id) {
    return this.servicemeta.httpDelete('consumer/providers/' + id);
  }



  getWaitlistCount(params) {
    return this.servicemeta.httpGet('consumer/waitlist/count', null, params);
  }

  getHistoryWaitlistCount() {
    return this.servicemeta.httpGet('consumer/waitlist/history/count');
  }

  deleteWaitlist(id, params) {
    return this.servicemeta.httpDelete('consumer/waitlist/' + id, null, params);
  }

  getWaitlistDetail(uuid, params) {
    const path = 'consumer/waitlist/' + uuid;
    return this.servicemeta.httpGet(path, null, params);
  }

  getMembers() {
    return this.servicemeta.httpGet('consumer/familyMember');
  }

  deleteMember(id) {
    const path = 'consumer/familyMember/' + id;
    return this.servicemeta.httpDelete(path);
  }

  getConsumerCommunications(provider_id) {
    const url = 'consumer/communications?account=' + provider_id;
    return this.servicemeta.httpGet(url);
  }

  addConsumertoProviderNote(uuid, message) {
    const url = 'consumer/communications?account=' + uuid;
    return this.servicemeta.httpPost(url, message);
  }

  addConsumerWaitlistNote(accountid, uuid, body) {
    const url = 'consumer/waitlist/communicate/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpPost(url, body);
  }

 /* addMembers(data) {
    return this.servicemeta.httpPost('consumer/familyMember', data);
  }

  editMember(data) {
    return this.servicemeta.httpPut('consumer/familyMember', data);
  } */

  getWaitlistBill(uuid) {
    const path = 'consumer/bill/' + uuid;
    return this.servicemeta.httpGet(path);
  }

  getPaymentDetail(params, uuid) {
    const url = 'consumer/payment/details/' + uuid ;
    return this.servicemeta.httpGet(url, null, params);
  }

  getEstimatedWaitingTime(prov_arr) {
    let str = '';
    for (let i = 0; i < prov_arr.length; i++) {
      if (str !== '') {
        str += '%2C'; // comma
      }
      str += prov_arr[i];
    }
    if (str === '') {
      return null;
    }
    const path = 'provider/waitlist/queues/waitingTime/' + str;
    return this.servicemeta.httpGet(path);
  }

  getApptTime(prov_arr) {
    let str = '';
    for (let i = 0; i < prov_arr.length; i++) {
      if (str !== '') {
        str += '%2C'; // comma
      }
      str += prov_arr[i];
    }
    if (str === '') {
      return null;
    }
    const path = 'provider/appointment/schedule/nextAvailableSchedule/' + str;
    return this.servicemeta.httpGet(path);
  }

  getConsumerRateService(params) {
    const path = 'consumer/waitlist/rating' ;
    return this.servicemeta.httpGet(path, null , params);
  }

  postConsumerRateService(params, data) {
    const path = 'consumer/waitlist/rating' ;
    return this.servicemeta.httpPost(path, data, null , params);
  }

  updateConsumerRateService(params, data) {
    const path = 'consumer/waitlist/rating' ;
    return this.servicemeta.httpPut(path, data, null , params);
  }

  managePrivacy(accountId, status) {
    const path = 'consumer/providers/revealPhoneNo/' + accountId + '/' + status;
    return this.servicemeta.httpPut(path);
  }

  getWaitlistToday() {
    const path = 'consumer/waitlist/today';
    return this.servicemeta.httpGet(path);
  }
  getWaitlistFuture(params?) {
    // const path = 'consumer/waitlist/future';
    // return this.servicemeta.httpGet(path);
    return this.servicemeta.httpGet('consumer/waitlist/future', null, params);
  }
  getAppointmentToday(params?) {
   // const path = 'consumer/appointment/today';
   // return this.servicemeta.httpGet(path);
    return this.servicemeta.httpGet('consumer/appointment/today', null, params);
  }
  getAppointmentFuture(params?) {
    // const path = 'consumer/appointment/future';
    // return this.servicemeta.httpGet(path);
    return this.servicemeta.httpGet('consumer/appointment/future', null, params);
  }
  getAppointmentHistory(params?) {
   // const path = 'consumer/appointment/history',null, params ;
    return this.servicemeta.httpGet('consumer/appointment/history', null, params);
    // return this.servicemeta.httpGet(path);
  }
  getAppointmentHistoryCount() {
    return this.servicemeta.httpGet('consumer/appointment/history/count');
  }
  getAppointmentDetail(uuid, params) {
    const path = 'consumer/appointment/' + uuid;
    return this.servicemeta.httpGet(path, null, params);
  }
  getApptHistory(uuid, accountid) {
    const path = 'consumer/appointment/state/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpGet(path);
  }
  getWtlistHistory(uuid, accountid) {
    const path = 'consumer/waitlist/states/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpGet(path);
  }
  getConsumerOrders(params) {
    // const url = 'consumer/orders';
    // return this.servicemeta.httpGet(url);
     return this.servicemeta.httpGet('consumer/orders', null, params);
  }
   getOrderHistory(params?) {
    const url = 'consumer/orders/history';
    // return this.servicemeta.httpGet(url);
    return this.servicemeta.httpGet(url, null, params);
  }
  CreateConsumerOrder(accountid, postData) {
    return this.servicemeta.httpPost('consumer/orders?account=' + accountid, postData);
  }
  GetConsumerCatalogs(accountid) {
    const url = 'consumer/orders/catalogs/'   + accountid;
    return this.servicemeta.httpGet(url);
  }
  getConsumeraddress() {
    const url = 'consumer/deliveryAddress';
    return this.servicemeta.httpGet(url);
  }
  updateConsumeraddress(data) {
    const url = 'consumer/deliveryAddress';
    return this.servicemeta.httpPut(url , data);
  }
  getConsumerFutOrders() {
    const url = 'consumer/orders/future';
    return this.servicemeta.httpGet(url);
  }
  getConsumerCashbalance() {
    const url = 'consumer/wallet/cash/available';
    return this.servicemeta.httpGet(url);
  }
  getConsumerCashbalanceDetails() {
    const url = 'consumer/wallet/cash/info';
     return this.servicemeta.httpGet(url);
    // const url = 'consumer/wallet/cash/1';
    // return this.servicemeta.httpGet(url);
    
  }
  getConsumerCashbalanceExpiredDetails(){
    const url = 'consumer/wallet/cash/expired';
     return this.servicemeta.httpGet(url);
  }
  getConsumerCashspentWithIdDetails(id){
    const url = 'consumer/wallet/cash/'+ id +'/txn/log';
     return this.servicemeta.httpGet(url);
  }
  getConsumerTotalCashspent(){
    const url = 'consumer/wallet/cash/spent';
     return this.servicemeta.httpGet(url);
  }
  getWaitlistQuestionnaireByUid(uid) {
    const url = 'consumer/waitlist/questionnaire/' + uid;
    return this.servicemeta.httpGet(url);
  }
  getApptQuestionnaireByUid(uid) {
    const url = 'consumer/appointment/questionnaire/' + uid;
    return this.servicemeta.httpGet(url);
  }
  getDonaitonQuestionnaireByUid(uid) {
    const url = 'consumer/donation/questionnaire/' + uid;
    return this.servicemeta.httpGet(url);
  }
}
