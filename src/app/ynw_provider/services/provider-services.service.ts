import { Injectable } from '@angular/core';
import { projectConstants } from '../../app.component';
// Import RxJs required methods
import { ServiceMeta } from '../../shared/services/service-meta';

@Injectable()
export class ProviderServices {
  catalogPrefilledInput: any = [];
  constructor(private servicemeta: ServiceMeta) { }
  getProviderConfig() {
    return this.servicemeta.httpGet('accounts/conf');
  }
  getBussinessProfile() {
    return this.servicemeta.httpGet('provider/bProfile');
  }
  getPublicSearch() {
    return this.servicemeta.httpGet('provider/search');
  }
  updatePublicSearch(value) {
    const path = 'provider/search/' + value;
    return this.servicemeta.httpPut(path);
  }
  getVirtualFields(domain, subdomain = null) {
    const path = (!subdomain) ? 'provider/ynwConf/dataModel/' + domain :
      'provider/ynwConf/dataModel/' + domain + '/' + subdomain;

    return this.servicemeta.httpGet(path);
  }
  getMembers(id) {
    return this.servicemeta.httpGet('provider/familyMember/' + id);
  }
  addMembers(data) {
    return this.servicemeta.httpPost('provider/familyMember', data);
  }
  getProviderItems(id?) {
    if (id) {
      return this.servicemeta.httpGet('provider/items/' + id);
    } else {
      return this.servicemeta.httpGet('provider/items');
    }
  }
  getProviderfilterItems(filter) {
    const url = 'provider/items';
    return this.servicemeta.httpGet(url, null, filter);
  }
  addItem(data) {
    return this.servicemeta.httpPost('provider/items', data);
  }
  editItem(data) {
    return this.servicemeta.httpPut('provider/items', data);
  }
  deleteItem(id) {
    const path = 'provider/items/' + id;
    return this.servicemeta.httpDelete(path);
  }
  enableItem(id) {
    const path = 'provider/items/enable/' + id;
    return this.servicemeta.httpPut(path);
  }
  disableItem(id) {
    const path = 'provider/items/disable/' + id;
    return this.servicemeta.httpPut(path);
  }
  uploadItemImage(id, data) {
    const path = 'provider/items/' + id + '/image';
    return this.servicemeta.httpPost(path, data);
  }
  removeItemImage(data) {
    const path = 'provider/items/' + data.itemId + '/image';
    return this.servicemeta.httpDelete(path);
  }
  getLicenseCorpSettings() {
    return this.servicemeta.httpGet('provider/corp/settings');
  }
  getLicenseDetails() {
    return this.servicemeta.httpGet('provider/license');
  }
  getLicenseMetadata() {
    return this.servicemeta.httpGet('provider/license/licensemetadata');
  }
  getLicenseMetrics() {
    return this.servicemeta.httpGet('provider/license/metric');
  }
  getTotalAllowedAdwordsCnt() {
    return this.servicemeta.httpGet('provider/license/adwords/count');
  }
  getUpgradableLicensePackages() {
    return this.servicemeta.httpGet('provider/license/upgradablePackages');
  }
  upgradeLicensePackage(value) {
    const path = 'provider/license/' + value;
    return this.servicemeta.httpPut(path);
  }
  getAuditList() {
    return this.servicemeta.httpGet('provider/license/auditlog');
  }
  getAddonAuditList() {
    return this.servicemeta.httpGet('provider/license/addon/auditlog');
  }
  getUpgradableAddonPackages() {
    return this.servicemeta.httpGet('provider/license/upgradableAddons');
  }
  addAddonPackage(value) {
    const path = 'provider/license/addon/' + value;
    return this.servicemeta.httpPost(path);
  }
  // Provider Discounts
  getProviderDiscounts(id?) {
    if (id) {
      return this.servicemeta.httpGet('provider/bill/discounts/' + id);
    } else {
      return this.servicemeta.httpGet('provider/bill/discounts');
    }
  }
  addDiscount(data) {
    return this.servicemeta.httpPost('provider/bill/discounts', data);
  }
  editDiscount(data) {
    return this.servicemeta.httpPut('provider/bill/discounts', data);
  }
  deleteDiscount(id) {
    const path = 'provider/bill/discounts/' + id;
    return this.servicemeta.httpDelete(path);
  }
  // Provider Coupons
  getProviderCoupons(id?) {
    if (id) {
      return this.servicemeta.httpGet('provider/bill/coupons/' + id);
    } else {
      return this.servicemeta.httpGet('provider/bill/coupons');
    }
  }
  addCoupon(data) {
    return this.servicemeta.httpPost('provider/bill/coupons', data);
  }
  createCoupon(data) {
    const url = 'provider/bill/coupons';
    return this.servicemeta.httpPost(url, data);
  }
  updateCoupon(data) {
    const url = 'provider/bill/coupons';
    return this.servicemeta.httpPut(url, data);
  }
  publishCoupon(data,id){
    const url = 'provider/bill/coupons/'+id+'/publish';
    return this.servicemeta.httpPut(url, data);
  }


  editCoupon(data) {
    return this.servicemeta.httpPut('provider/bill/coupons', data);
  }
  deleteCoupon(id) {
    const path = 'provider/bill/coupons/' + id;
    return this.servicemeta.httpDelete(path);
  }
  // Jaldee Coupons
  getJaldeeCoupons() {
    return this.servicemeta.httpGet('provider/jaldee/coupons');
  }
  getJaldeeCoupon(jc_code) {
    const url = 'provider/jaldee/coupons/' + jc_code;
    return this.servicemeta.httpGet(url);
  }
  applyJaldeeCoupon(jc_code, checkin_id) {
    const url = 'provider/jaldee/coupons/' + jc_code + '/' + checkin_id;
    return this.servicemeta.httpGet(url);
  }
  applyStatusJaldeeCoupon(jc_code, status) {
    const url = 'provider/jaldee/coupons/' + jc_code + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  getJaldeeCouponStat(jc_code) {
    const url = 'provider/jaldee/coupons/' + jc_code + '/stats';
    return this.servicemeta.httpGet(url);
  }
  getProviderCouponStat(jc_code) {
    const url = 'provider/bill/' + jc_code + '/stats';
    return this.servicemeta.httpGet(url);
  }
  getJaldeeCouponReports(filter) {
    const url = 'provider/jaldee/coupons/jcreports/reimburse';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getJaldeeCouponReportsCount(filter = {}) {
    return this.servicemeta.httpGet('provider/jaldee/coupons/jcreports/reimburse/count', null, filter);
  }
  getJaldeeCouponReportsbyId(invoice_id) {
    const url = 'provider/jaldee/coupons/jcreports/reimburse/' + invoice_id;
    return this.servicemeta.httpGet(url);
  }
  requestforPaymentJC(id?) {
    const url = 'provider/jaldee/coupons/jcreports/reimburse/' + id + '/requestPayment';
    return this.servicemeta.httpPut(url);
  }
  // Non working days
  // getProviderNonworkingdays(id?) {
  //   if (id) {
  //     return this.servicemeta.httpGet('provider/settings/nonBusinessDays/' + id);
  //   } else {
  //     return this.servicemeta.httpGet('provider/settings/nonBusinessDays');
  //   }
  // }
  // addHoliday(data) {
  //   return this.servicemeta.httpPost('provider/settings/nonBusinessDays', data);
  // }
  // deleteHoliday(id) {
  //   const path = 'provider/settings/nonBusinessDays/' + id;
  //   return this.servicemeta.httpDelete(path);
  // }
  // editHoliday(data) {
  //   return this.servicemeta.httpPut('provider/settings/nonBusinessDays', data);
  // }

  // Non working days new Url's
getProviderNonworkingdays(id?) {
  if (id) {
    return this.servicemeta.httpGet('provider/settings/nonBusinessDays/holiday/' + id);
  } else {
    return this.servicemeta.httpGet('provider/settings/nonBusinessDays/holiday');
  }
}
addHoliday(data) {
  return this.servicemeta.httpPost('provider/settings/nonBusinessDays/holiday', data);
}
Holidaywaitlist(id) {
  return this.servicemeta.httpPut('provider/settings/nonBusinessDays/holiday/mark/' + id);
}
deleteHoliday(id) {
  const path = 'provider/settings/nonBusinessDays/holiday/' + id;
  return this.servicemeta.httpDelete(path);
}
editHoliday(data) {
  return this.servicemeta.httpPut('provider/settings/nonBusinessDays/holiday', data);
}
  // business profile Primary fields
  getParkingtypes() {
    return this.servicemeta.httpGet('ynwConf/parkingTypes');
  }
  createPrimaryFields(data) {
    return this.servicemeta.httpPost('provider/bProfile', data);
  }
  patchbProfile(data) {
    return this.servicemeta.httpPatch('provider/bProfile', data);
  }
  updatePrimaryFields(data) {
    return this.servicemeta.httpPut('provider/bProfile', data);
  }
  updateDomainSubDomainFields(data, domain, subdomain = null) {
    const path = (!subdomain) ? 'provider/bProfile/domain' :
      'provider/bProfile/' + subdomain;
    return this.servicemeta.httpPut(path, data);
  }
  updateSocialMediaLinks(data) {
    return this.servicemeta.httpPut('provider/bProfile/socialMedia', data);
  }
  getGalleryImages() {
    return this.servicemeta.httpGet('provider/gallery');
  }
  uploadGalleryImages(postdata) {
    return this.servicemeta.httpPost('provider/gallery', postdata);
  }
  deleteProviderGalleryImage(filename) {
    return this.servicemeta.httpDelete('provider/gallery/' + filename);
  }
  getProviderLogo() {
    return this.servicemeta.httpGet('provider/logo');
  }
  uploadLogo(data) {
    return this.servicemeta.httpPost('provider/logo', data);
  }
  deleteLogo(name) {
    const url = 'provider/logo/' + name;
    return this.servicemeta.httpDelete(url);
  }
  deleteuserLogo(name, userid) {
    const url = 'provider/user/logo/' + userid + '/' + name;
    return this.servicemeta.httpDelete(url);
  }
  // Addwords
  getAdwords() {
    return this.servicemeta.httpGet('provider/license/adwords');
  }
  addAdwords(data) {
    const url = 'provider/license/adwords/create';
    return this.servicemeta.httpPost(url, data);
  }
  deleteAdwords(id) {
    const url = 'provider/license/adwords/' + id;
    return this.servicemeta.httpDelete(url);
  }
  // Q manager
  setAcceptOnlineCheckin(status) {
    const url = 'provider/settings/waitlistMgr/onlineCheckIns/' + status;
    return this.servicemeta.httpPut(url);
  }
  getWaitlistMgr() {
    const url = 'provider/settings/waitlistMgr/';
    return this.servicemeta.httpGet(url);
  }
  getPaymentSettings() {
    const url = 'provider/payment/settings/';
    return this.servicemeta.httpGet(url);
  }
  setPaymentSettings(data) {
    const url = 'provider/payment/settings/';
    return this.servicemeta.httpPut(url, data);
  }
  setPaymentAccountSettings(status) {
    const url = 'provider/payment/settings/jaldee/' + status;
    return this.servicemeta.httpPost(url);
  }
  getProviderLocations() {
    return this.servicemeta.httpGet('provider/locations');
  }
  setWaitlistMgr(data) {
    const url = 'provider/settings/waitlistMgr/';
    return this.servicemeta.httpPut(url, data);
  }
  setDeptWaitlistMgr(status) {
    const url = 'provider/settings/waitlistMgr/department/' + status;
    return this.servicemeta.httpPut(url);
  }
  getServicesList(filter?) {
    // let stat = '';
    // if (params !== undefined) {
    //    if (params['status'] !== undefined && params['status'] !== '') {
    //       stat = '?status-eq=' + params['status'];
    //    }
    // }
    const url = 'provider/services';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getProviderServices(filter?) {
    const url = 'provider/services';
    return this.servicemeta.httpGet(url, null, filter);
  }
  createService(data) {
    const url = 'provider/services/';
    return this.servicemeta.httpPost(url, data);
  }
  updateService(data) {
    const url = 'provider/services/';
    return this.servicemeta.httpPut(url, data);
  }
  getService(service_id) {
    const url = 'provider/services/' + service_id;
    return this.servicemeta.httpGet(url);
  }
  enableService(service_id) {
    const url = 'provider/services/' + service_id + '/Enable';
    return this.servicemeta.httpPut(url);
  }
  disableService(service_id) {
    const url = 'provider/services/' + service_id + '/Disable';
    return this.servicemeta.httpDelete(url);
  }
  getServiceGallery(service_id) {
    const url = 'provider/services/serviceGallery/' + service_id;
    return this.servicemeta.httpGet(url);
  }
  uploadServiceGallery(service_id, data) {
    const url = 'provider/services/serviceGallery/' + service_id;
    return this.servicemeta.httpPost(url, data);
  }
  deleteServiceGalleryImage(service_id, name) {
    const url = 'provider/services/serviceGallery/' + service_id + '/' + name;
    return this.servicemeta.httpDelete(url);
  }
  // Waiting listing location
  addProviderLocation(data) {
    return this.servicemeta.httpPost('provider/locations', data);
  }
  changeProviderLocationStatus(id, chstatus) {
    const url = 'provider/locations/' + id + '/' + chstatus;
    if (chstatus === 'enable') {
      return this.servicemeta.httpPut(url);
    } else if (chstatus === 'disable') {
      return this.servicemeta.httpDelete(url);
    }
  }
  changeProviderBaseLocationStatus(id) {
    const url = 'provider/bProfile/baseLocation/' + id;
    return this.servicemeta.httpPut(url);
  }
  editProviderLocation(data) {
    return this.servicemeta.httpPut('provider/locations', data);
  }
  getLicenseUsage() {
    const url = 'provider/license/usageInfo';
    return this.servicemeta.httpGet(url);
  }
  getProviderQueues(filter?) {
    return this.servicemeta.httpGet('provider/waitlist/queues', null, filter);
  }
  getProviderLocationQueues(location_id) {
    const url = 'provider/waitlist/queues/' + location_id + '/location';
    return this.servicemeta.httpGet(url);
  }
  getProviderLocationQueuesByDate(location_id, date) {
    const url = 'provider/waitlist/queues/' + location_id + '/location/' + date;
    return this.servicemeta.httpGet(url);
  }
  addProviderQueue(data) {
    return this.servicemeta.httpPost('provider/waitlist/queues', data);
  }
  addInstantQ(data) {
    return this.servicemeta.httpPost('provider/waitlist/queues/instant', data);
  }
  editInstantQ(data) {
    return this.servicemeta.httpPut('provider/waitlist/queues/instant', data);
  }
  getProviderQueuesbyfilter(filter?) {
    return this.servicemeta.httpGet('provider/waitlist/queues/filter', null, filter);
  }
  getProviderQueuesCountbyfilter(filter) {
    return this.servicemeta.httpGet('provider/waitlist/queues/filter/count', null, filter);
  }
  editProviderQueue(data) {
    return this.servicemeta.httpPut('provider/waitlist/queues', data);
  }
  changeSamedayCheckinStatus(queId, status) {
    const url = 'provider/waitlist/queues/onlineCheckIn/' + status + '/' + queId;
    return this.servicemeta.httpPatch(url);
  }
  changeFutureCheckinStatus(queId, status) {
    const url = 'provider/waitlist/queues/futureCheckIn/' + status + '/' + queId;
    return this.servicemeta.httpPatch(url);
  }
  changeProviderQueueStatus(id, chstatus) {
    const url = 'provider/waitlist/queues/' + id + '/' + chstatus;
    return this.servicemeta.httpPut(url);
  }
  getProviderInbox(filter = {}) {
    return this.servicemeta.httpGet('provider/communications', null, filter);
  }
  getWaitlistFutureCount(filter = {}) {
    const url = 'provider/waitlist/future/count/';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getwaitlistTodayCount(filter = {}) {
    const url = 'provider/waitlist/today/count/';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getwaitlistHistoryCount(filter = {}) {
    const url = 'provider/waitlist/history/count/';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getTodayWaitlist(filter) {
    const url = 'provider/waitlist/today/';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getTodayWaitlistFromStringQuery(filter) {
    const url = 'provider/waitlist/today?' + filter;
    return this.servicemeta.httpGet(url, null, null);
  }
  getHistoryWaitlist(filter = {}) {
    const url = 'provider/waitlist/history';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getFutureWaitlist(filter = {}) {
    const url = 'provider/waitlist/future';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getQueueDelay(queueId) {
    const url = 'provider/waitlist/queues/' + queueId + '/delay';
    return this.servicemeta.httpGet(url);
  }
  addQueueDelay(queueId, data) {
    const url = 'provider/waitlist/queues/' + queueId + '/delay';
    return this.servicemeta.httpPost(url, data);
  }
  setWaitlistMgrStatus(status) {
    const url = 'provider/settings/waitlistMgr/' + status;
    return this.servicemeta.httpPut(url);
  }
  getProviderMessages() {
    const url = 'provider/ynwConf/messages';
    return this.servicemeta.httpGet(url);
  }
  getApptProviderMessages() {
    const url = 'provider/ynwConf/appointment/messages';
    return this.servicemeta.httpGet(url);
  }
  getCustomer(data) {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null, data);
  }
  getQueueWaitingTime(queueId, date) {
    const url = 'provider/waitlist/queues/' + queueId + '/' + date + '/waitingTime';
    return this.servicemeta.httpGet(url);
  }
  addCustomerWaitlist(data) {
    const url = 'provider/waitlist';
    return this.servicemeta.httpPost(url, data);
  }
  getLocationBadges() {
    const url = 'provider/ynwConf/badges';
    return this.servicemeta.httpGet(url);
  }
  getGoogleMapLocationAddress(lat, lon) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=' + projectConstants.GOOGLEAPIKEY + '&sensor=false';
    return this.servicemeta.httpGet(url);
  }
  getGoogleMapLocationGeometry(address) {
    const url = 'https://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=false';
    return this.servicemeta.httpGet(url);
  }
  getLocationDetail(location_id) {
    const url = 'provider/locations/' + location_id;
    return this.servicemeta.httpGet(url);
  }

  getServiceDetail(service_id) {
    const url = 'provider/services/' + service_id;
    return this.servicemeta.httpGet(url);
  }
  getQueueDetail(queue_id) {
    const url = 'provider/waitlist/queues/' + queue_id;
    return this.servicemeta.httpGet(url);
  }
  getLocationCount() {
    const url = 'provider/locations/count';
    return this.servicemeta.httpGet(url);
  }
  getServiceCount(filter?) {
    const url = 'provider/services/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getQueuesCount(filter?) {
    const url = 'provider/waitlist/queues/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getSpokenLanguages() {
    const url = 'ynwConf/spokenLangs';
    return this.servicemeta.httpGet(url);
  }
  getSpecializations(domain, subdomain) {
    const url = 'ynwConf/specializations/' + domain + '/' + subdomain;
    return this.servicemeta.httpGet(url);
  }
  changeProviderWaitlistStatus(waitlist_id, action, message = {}) {
    const url = 'provider/waitlist/' + waitlist_id + '/' + action;
    return this.servicemeta.httpPut(url, message);
  }
  getInvoicesHistoryWithStatus(filter = {}) {
    const url = 'provider/license/invoice/payment/history';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getInvoicesWithStatus(status = 'NotPaid', filter = {}) {
    const url = 'provider/license/invoices/' + status + '/status';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getInvoicesHistoryWithStatusCount() {
    const url = 'provider/license/invoice/payment/history/count';
    return this.servicemeta.httpGet(url);
  }
  getInvoicesWithStatusCount(status = 'NotPaid', filter = {}) {
    const url = 'provider/license/invoices/' + status + '/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getInvoiceStatus(filter) {
    const url = 'provider/license/invoice';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getLicenseSubscription() {
    // const url = 'provider/license/getSubscription';
    const url = 'provider/license/billing';
    return this.servicemeta.httpGet(url);
  }
  changeLicenseSubscription(type) {
    // const url = 'provider/license/changeSubscription/' + type;
    const url = 'provider/license/billing/' + type;
    return this.servicemeta.httpPut(url);
  }
  getInvoice(uuid) {
    const url = 'provider/license/invoices/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  getPaymentModes() {
    const url = 'provider/payment/modes/subscription';
    return this.servicemeta.httpGet(url);
  }
  getPaymentDetail(uuid) {
    const url = 'provider/payment/details/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  getProviderWaitlistDetailById(uuid) {
    const url = 'provider/waitlist/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  addProviderWaitlistNote(uuid, message) {
    const url = 'provider/waitlist/notes/' + uuid;
    return this.servicemeta.httpPost(url, message);
  }
  getProviderWaitlistNotes(consumer_id) {
    const url = 'provider/waitlist/' + consumer_id + '/notes';
    return this.servicemeta.httpGet(url);
  }
  getWaitlistBill(uuid) {
    const url = 'provider/bill/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  setWaitlistBill(action, uuid, data, header) {
    const url = 'provider/bill/' + action + '/' + uuid;
    return this.servicemeta.httpPut(url, data, header);
  }
  createWaitlistBill(data) {
    const url = 'provider/bill/';
    return this.servicemeta.httpPost(url, data);
  }
  updateWaitlistBill(data) {
    const url = 'provider/bill/';
    return this.servicemeta.httpPut(url, data);
  }
  getTaxpercentage() {
    const url = 'provider/payment/tax/';
    return this.servicemeta.httpGet(url);
  }
  setTaxpercentage(data) {
    const url = 'provider/payment/tax';
    return this.servicemeta.httpPut(url, data);
  }
  settleWaitlistBill(uuid) {
    const url = 'provider/bill/settlebill/' + uuid;
    return this.servicemeta.httpPut(url);
  }
  emailWaitlistBill(uuid) {
    const url = 'provider/bill/email/' + uuid;
    return this.servicemeta.httpPost(url);
  }
  getProviderTax() {
    const url = 'provider/payment/tax';
    return this.servicemeta.httpGet(url);
  }
  getProviderWaitlistHistroy(uuid) {
    const url = 'provider/waitlist/states/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  acceptPayment(data) {
    const url = 'provider/bill/acceptPayment';
    return this.servicemeta.httpPost(url, data);
  }
  providerPayment(data) {
    const url = 'provider/payment';
    return this.servicemeta.httpPost(url, data);
  }
  providerPaymentStatus(data) {
    const url = 'provider/payment/status';
    return this.servicemeta.httpPost(url, data);
  }
  acknowledgeAlert(id) {
    return this.servicemeta.httpPut('provider/alerts/' + id);
  }
  // getProviderCustomers(filter = {}) {
  // const url = 'provider/waitlist/consumers';
  // return this.servicemeta.httpGet(url, null, filter);
  // }
  // getProviderCustomersCount(filter = {}) {
  // const url = 'provider/waitlist/consumers/count';
  // return this.servicemeta.httpGet(url, null, filter);
  // }
  getProviderCustomers(filter = {}) {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderCustomersCount(filter = {}) {
    const url = 'provider/customers/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  createProviderCustomer(data) {
    const url = 'provider/customers';
    return this.servicemeta.httpPost(url, data);
  }
  updateProviderCustomer(data) {
    const url = 'provider/customers';
    return this.servicemeta.httpPut(url, data);
  }
  getIdTerminologies(domain, subDomain) {
    const url = 'ynwConf/terminologies/' + domain + '/' + subDomain;
    return this.servicemeta.httpGet(url);
  }
  domainSubdomainSettings(domain, subDomain) {
    const url = 'ynwConf/settings/' + domain + '/' + subDomain;
    return this.servicemeta.httpGet(url);
  }
  getgeneralBusinessSchedules() {
    return this.servicemeta.httpGet('provider/ynwConf/bSchedule');
  }
  refundBill(data) {
    const url = 'provider/payment/refund';
    return this.servicemeta.httpPost(url, data);
  }
  addCustomId(id) {
    const url = 'provider/business/' + id;
    return this.servicemeta.httpPost(url);
  }
  editCustomId(id) {
    const url = 'provider/business/' + id;
    return this.servicemeta.httpPut(url);
  }
  removeCustomId(customid) {
    const url = 'provider/business/' + customid;
    return this.servicemeta.httpDelete(url);
  }
  editWaitTime(uuid, waittime) {
    const url = 'provider/waitlist/' + uuid + '/' + waittime + '/waitingTime';
    return this.servicemeta.httpPut(url);
  }
  isAvailableNow() {
    const url = 'provider/waitlist/queues/isAvailableNow/today';
    return this.servicemeta.httpGet(url);
  }
  getDepartments() {
    const url = 'provider/departments';
    return this.servicemeta.httpGet(url);
  }
  getDepartmentById(id) {
    const url = 'provider/departments/' + id;
    return this.servicemeta.httpGet(url);
  }
  createDepartment(dept) {
    const url = 'provider/departments';
    return this.servicemeta.httpPost(url, dept);
  }
  updateDepartment(dept) {
    const url = 'provider/departments/' + dept.id;
    return this.servicemeta.httpPut(url, dept);
  }
  deleteDepartment(id) {
    const url = 'provider/departments/' + id;
    return this.servicemeta.httpDelete(url);
  }
  getServicesByDeptId(id) {
    const url = 'provider/departments/' + id + '/service';
    return this.servicemeta.httpGet(url);
  }
  addDepartmentServices(data, id) {
    const url = 'provider/departments/' + id + '/service';
    return this.servicemeta.httpPost(url, data);
  }
  removeDeparmentService(deptId, serviceId) {
    const url = 'provider/departments/' + deptId + '/service/' + serviceId;
    return this.servicemeta.httpDelete(url);
  }
  getServiceByDept_Service_Id(deptId, serviceId) {
    const url = 'provider/departments/' + deptId + '/service/' + serviceId;
    return this.servicemeta.httpGet(url);
  }
  enableDepartment(dept_id) {
    const url = 'provider/departments/' + dept_id + '/enable';
    return this.servicemeta.httpPut(url);
  }
  disableDepartment(dept_id) {
    const url = 'provider/departments/' + dept_id + '/disable';
    return this.servicemeta.httpPut(url);
  }
  setFutureCheckinStatus(status) {
    const url = 'provider/settings/waitlistMgr/futureCheckIns/' + status;
    return this.servicemeta.httpPut(url);
  }
  getDepartmentCount() {
    const url = 'provider/departments/count';
    return this.servicemeta.httpGet(url);
  }
  addNotificationList(data) {
    const url = 'provider/settings/notification';
    return this.servicemeta.httpPost(url, data);
  }
  getNotificationList() {
    const url = 'provider/settings/notification';
    return this.servicemeta.httpGet(url);
  }
  updateNotificationList(data) {
    const url = 'provider/settings/notification';
    return this.servicemeta.httpPut(url, data);
  }
  updateProviderNotificationStatus(status, data) {
    const url = 'provider/settings/notification/' + status;
    return this.servicemeta.httpPut(url, data);
  }
  updateTax(data) {
    const url = 'provider/payment/tax/' + data;
    return this.servicemeta.httpPost(url);
  }
  getgst() {
    const url = 'provider/ynwConf/jaldeeGst';
    return this.servicemeta.httpGet(url);
  }
  setProviderPOSStatus(status) {
    const url = 'provider/bill/settings/' + status;
    return this.servicemeta.httpPut(url);
  }
  getProviderPOSStatus() {
    const url = 'provider/bill/settings/pos';
    return this.servicemeta.httpGet(url);
  }
  getLabelList() {
    const url = 'provider/waitlist/label';
    return this.servicemeta.httpGet(url);
  }
  getLabel(labelId) {
    const url = 'provider/waitlist/label/' + labelId;
    return this.servicemeta.httpGet(url);
  }
  updateLabel(data) {
    const url = 'provider/waitlist/label';
    return this.servicemeta.httpPut(url, data);
  }
  updateLabelStatus(id, status) {
    const url = 'provider/waitlist/label/' + id + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  createLabel(label) {
    const url = 'provider/waitlist/label';
    return this.servicemeta.httpPost(url, label);
  }
  deleteLabel(labelId) {
    const url = 'provider/waitlist/label/' + labelId;
    return this.servicemeta.httpDelete(url);
  }
  getDisplayboardQSets() {
    const url = 'provider/statusBoard';
    return this.servicemeta.httpGet(url);
  }
  getDisplayboardQSetbyId(id) {
    const url = 'provider/waitlist/statusBoard/queueSet/' + id;
    return this.servicemeta.httpGet(url);
  }
  getApptDisplayboardQSetbyId(id) {
    const url = 'provider/appointment/statusBoard/queueSet/' + id;
    return this.servicemeta.httpGet(url);
  }
  updateDisplayboardQSet(data) {
    const url = 'provider/statusBoard';
    return this.servicemeta.httpPut(url, data);
  }
  createDisplayboardQSet(input) {
    const url = 'provider/statusBoard';
    return this.servicemeta.httpPost(url, input);
  }
  deleteDisplayboardQSet(id) {
    const url = 'provider/statusBoard/' + id;
    return this.servicemeta.httpDelete(url);
  }
  getDisplayboards() {
    const url = 'provider/statusBoard/dimension';
    return this.servicemeta.httpGet(url);
  }
  getDisplayboard(id) {
    const url = 'provider/statusBoard/dimension/' + id;
    return this.servicemeta.httpGet(url);
  }
  updateDisplayboard(data) {
    const url = 'provider/statusBoard/dimension';
    return this.servicemeta.httpPut(url, data);
  }
  createDisplayboard(input) {
    const url = 'provider/statusBoard/dimension';
    return this.servicemeta.httpPost(url, input);
  }
  deleteDisplayboard(id) {
    const url = 'provider/statusBoard/dimension/' + id;
    return this.servicemeta.httpDelete(url);
  }
  createDisplayboardContainer(input) {
    const url = 'provider/statusBoard/container';
    return this.servicemeta.httpPost(url, input);
  }
  getDisplayboardContainers() {
    const url = 'provider/statusBoard/container';
    return this.servicemeta.httpGet(url);
  }
  updateDisplayboardContainer(id, data) {
    const url = 'provider/statusBoard/container/' + id;
    return this.servicemeta.httpPut(url, data);
  }
  getDisplayboardContainer(id) {
    const url = 'provider/statusBoard/container/' + id;
    return this.servicemeta.httpGet(url);
  }
  addLabeltoCheckin(uuid, data) {
    const url = 'provider/waitlist/label/' + uuid;
    return this.servicemeta.httpPost(url, data);
  }
  deleteLabelfromCheckin(uuid, label) {
    const url = 'provider/waitlist/label/' + uuid + '/' + label;
    return this.servicemeta.httpDelete(url);
  }
  addSalesCode(id) {
    const url = 'provider/salesChannel/' + id;
    return this.servicemeta.httpPost(url);
  }
  getSalesChannel() {
    const url = 'provider/salesChannel';
    return this.servicemeta.httpGet(url);
  }
  getbillCycle() {
    const url = 'provider/license/billing/nextBillCycle';
    return this.servicemeta.httpGet(url);
  }
  getAnnualDiscountPercentage() {
    const url = 'provider/license/annualDiscPct';
    return this.servicemeta.httpGet(url);
  }
  manageProvider(accountId) {
    const url = 'provider/branch/manage/' + accountId;
    return this.servicemeta.httpPost(url);
  }
  getBranchSPs(branchId) {
    const url = 'provider/branch/' + branchId + '/accounts';
    return this.servicemeta.httpGet(url);
  }
  createBranchSP(post_data) {
    const url = 'provider/branch/createSp';
    return this.servicemeta.httpPost(url, post_data);
  }
  createAssistant(post_data) {
    const url = 'provider/assistant';
    return this.servicemeta.httpPost(url, post_data);
  }
  updateAssistant(post_data) {
    const url = 'provider/assistant';
    return this.servicemeta.httpPut(url, post_data);
  }
  getAssistants() {
    const url = 'provider/assistant/filter';
    return this.servicemeta.httpGet(url);
  }
  getCorporateDetails() {
    const url = 'provider/corp';
    return this.servicemeta.httpGet(url);
  }
  joinCorp(corpUid) {
    const url = 'provider/corp/joinCorp/' + corpUid;
    return this.servicemeta.httpPost(url);
  }
  createCorp(post_data) {
    const url = 'provider/corp/switchToCorp';
    return this.servicemeta.httpPost(url, post_data);
  }
  getQStartToken() {
    const url = 'provider/waitlist/queues/nextTokenStart';
    return this.servicemeta.httpGet(url);
  }
  getSearchSCdetails(scId) {
    const url = 'provider/salesChannel/' + scId;
    return this.servicemeta.httpGet(url);
  }
  getsearchPhonedetails(phoneNumber) {
    const url = 'provider/salesChannel/phone/' + phoneNumber;
    return this.servicemeta.httpGet(url);
  }
  getCustomerTrackStatus(uuid) {
    const url = 'provider/waitlist/live/locate/distance/time/' + uuid;
    return this.servicemeta.httpPost(url);
  }
  getSMSglobalSettings() {
    const url = 'provider/account/settings';
    return this.servicemeta.httpGet(url);
  }
  getGlobalSettings() {
    const url = 'provider/account/settings';
    return this.servicemeta.httpGet(url);
  }
  setSMSglobalSettings(state) {
    const url = 'provider/account/settings/sms/' + state;
    return this.servicemeta.httpPut(url);
  }
  getSMSCredits() {
    const url = 'provider/account/settings/smsCount';
    return this.servicemeta.httpGet(url);
  }
  getUserConsumerNotificationSettings(id) {
    // const url = 'provider/consumerNotification/settings/' + id;
    // return this.servicemeta.httpGet(url);
    const url = 'provider/consumerNotification/settings/provider/' + id;
    return this.servicemeta.httpGet(url);
  }
  saveUserConsumerNotificationSettings(data) {
    const url = 'provider/consumerNotification/settings';
    return this.servicemeta.httpPost(url, data);
  }
  updateUserConsumerNotificationSettings(data) {
    const url = 'provider/consumerNotification/settings/provider';
    return this.servicemeta.httpPut(url, data);
  }
  getConsumerNotificationSettings() {
    const url = 'provider/consumerNotification/settings';
    return this.servicemeta.httpGet(url);
  }
  saveConsumerNotificationSettings(data) {
    const url = 'provider/consumerNotification/settings';
    return this.servicemeta.httpPost(url, data);
  }
  updateConsumerNotificationSettings(data) {
    const url = 'provider/consumerNotification/settings';
    return this.servicemeta.httpPut(url, data);
  }
  changeJaldeePayStatus(status) {
    const url = 'provider/payment/' + status;
    return this.servicemeta.httpPut(url);
  }
  getLicenseAddonmetaData() {
    const url = 'provider/license/addonmetadata';
    return this.servicemeta.httpGet(url);
  }
  updateApptTime(uuid, time) {
    const url = 'provider/waitlist/' + uuid + '/' + time + '/appointmentTime';
    return this.servicemeta.httpPut(url);
  }
  setCallStatus(uuid, status) {
    const url = 'provider/waitlist/callingStatus/' + uuid + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  getProviderOnlinePresence() {
    const url = 'provider/onlinePresence';
    return this.servicemeta.httpGet(url);
  }
  setOnlinePresence(status) {
    const url = 'provider/onlinePresence/' + status;
    return this.servicemeta.httpPut(url);
  }
  changeApptStatus(status, queueId) {
    const url = 'provider/waitlist/queues/appointment/' + status + '/' + queueId;
    return this.servicemeta.httpPut(url);
  }
  deleteAssistant(id) {
    const url = 'provider/assistant/' + id;
    return this.servicemeta.httpDelete(url);
  }
  // assistantFilter() {
  // const url = 'provider/assistant/filter';
  // return this.servicemeta.httpGet(url);
  // }
  assistantFilterCount() {
    const url = 'provider/assistant/filter/count';
    return this.servicemeta.httpGet(url);
  }
  // getAssistant(assistantId) {
  // const url = 'provider/assistant/' + assistantId;
  // return this.servicemeta.httpGet(url);
  // }
  // changeAssistantStatus(status, assistantId) {
  // const url = 'provider/assistant/ + ' + status + ' + /' + assistantId;
  // return this.servicemeta.httpPut (url);
  // }
  getUsers(filter = {}) {
    const url = 'provider/user';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getUsersCount(filter = {}) {
    const url = 'provider/user/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  createUser(post_data) {
    const url = 'provider/user';
    return this.servicemeta.httpPost(url, post_data);
  }
  updateUser(post_data, id) {
    const url = 'provider/user/' + id;
    return this.servicemeta.httpPut(url, post_data);
  }
  getUser(providerid) {
    const url = 'provider/user/' + providerid;
    return this.servicemeta.httpGet(url);
  }
  disableEnableuser(userid, stat) {
    const url = 'provider/user/' + stat + '/' + userid;
    return this.servicemeta.httpPut(url);
  }
  getUserBussinessProfile(id) {
    const url = 'provider/user/providerBprofile/' + id;
    return this.servicemeta.httpGet(url);
  }
  getUserPublicSearch(userId) {
    return this.servicemeta.httpGet('provider/user/search/' + userId);
  }
  updateUserPublicSearch(userId, status) {
    return this.servicemeta.httpPut('provider/user/search/' + status + '/' + userId);
  }
  patchUserbProfile(data, id) {
    return this.servicemeta.httpPatch('provider/user/providerBprofile/' + id, data);
  }
  createUserbProfile(data, id) {
    return this.servicemeta.httpPut('provider/user/providerBprofile/' + id, data);
  }
  updateuserSpecializationPrimaryFields(data, id) {
    return this.servicemeta.httpPut('provider/user/providerBprofile/' + id, data);

  }
  updateUserbProfile(data, id) {
    return this.servicemeta.httpPut('provider/user/providerBprofile/' + id, data);
  }
  updateUserSocialMediaLinks(data, id) {
    return this.servicemeta.httpPut('provider/user/providerBprofile/socialMedia/' + id, data);
  }
  updateDomainFields(providerId, postdata) {
    const url = 'provider/user/providerBprofile/domain' + '/' + providerId;
    return this.servicemeta.httpPut(url, postdata);
  }
  updatesubDomainFields(providerId, postdata, subdomainId) {
    return this.servicemeta.httpPut('provider/user/providerBprofile/' + subdomainId + '/' + providerId, postdata);
  }
  getUserProviderQueues(id) {
    return this.servicemeta.httpGet('provider/waitlist/queues?provider-eq=' + id);
  }
  getUserServicesList(filter?) {
    return this.servicemeta.httpGet('provider/services', null, filter);
  }
  getUserServiceDetail(service_id) {
    const url = 'provider/services/' + service_id;
    return this.servicemeta.httpGet(url);
  }

  getUserProviderNonworkingdays(id?) {
    return this.servicemeta.httpGet('provider/vacation/?provider-eq=' + id);
  }

  addUserHoliday(data) {
    return this.servicemeta.httpPost('provider/vacation', data);
  }

  deleteUserHoliday(id) {
    const path = 'provider/vacation/' + id;
    return this.servicemeta.httpDelete(path);
  }

  getUserdetailNonworkingday(id) {
    return this.servicemeta.httpGet('provider/vacation/' + id);
  }

  editUserHoliday(data) {
    return this.servicemeta.httpPut('provider/vacation', data);
  }

  uploaduserLogo(passdata, id) {
    return this.servicemeta.httpPost('provider/user/logo/' + id, passdata);
  }
  updateuserlinkProfile(id, profid) {
    return this.servicemeta.httpPut('provider/user/providerBprofile/linkProfile/' + id + '/' + profid);
  }
  getUserNotificationList(id?) {
    const url = 'provider/settings/notification/' + id;
    return this.servicemeta.httpGet(url);
  }
  getProviderWaitlistNotesnew(uuid) {
    const url = 'provider/waitlist/' + uuid + '/notes';
    return this.servicemeta.httpGet(url);
  }
  addProviderSchedule(data) {
    return this.servicemeta.httpPost('provider/appointment/schedule', data);
  }
  editProviderSchedule(data) {
    return this.servicemeta.httpPut('provider/appointment/schedule', data);
  }
  getProviderSchedules(filter?) {
    return this.servicemeta.httpGet('provider/appointment/schedule', null, filter);
  }
  getProviderSchedulesbyDate(date) {
    return this.servicemeta.httpGet('provider/appointment/schedule/date/' + date);
  }
  readConsumerMessages(consumerId, messageIds, providerId) {
    const url = 'provider/communications/readMessages/' + consumerId + '/' + messageIds + '/' + providerId;
    return this.servicemeta.httpPut(url);
  }
  // CustomViewUrls
  createCustomView(post_data) {
    const url = 'provider/customView';
    return this.servicemeta.httpPost(url, post_data);
  }
  getCustomViewDetail(id) {
    return this.servicemeta.httpGet('provider/customView/' + id);
  }
  getCustomViewList() {
    return this.servicemeta.httpGet('provider/customView');
  }
  deleteCustomView(id) {
    const path = 'provider/customView/' + id;
    return this.servicemeta.httpDelete(path);
  }
  updateCustomView(id, post_data) {
    const url = 'provider/customView/' + id;
    return this.servicemeta.httpPut(url, post_data);
  }
  changeProviderScheduleStatus(id, chstatus) {
    const url = 'provider/appointment/schedule/' + id + '/' + chstatus;
    return this.servicemeta.httpPut(url);
  }
  getScheduleDetail(queue_id) {
    const url = 'provider/appointment/schedule/' + queue_id;
    return this.servicemeta.httpGet(url);
  }
  changeBatchStatus(queueId, status) {
    const url = 'provider/waitlist/queues/batch/' + queueId + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  updateBatch(queueId, data) {
    const url = 'provider/waitlist/queues/batch/pattern/' + queueId;
    return this.servicemeta.httpPut(url, data);
  }
  getMergestatement(refId) {
    const url = 'provider/license/invoice/' + refId + '/merge/stmt';
    return this.servicemeta.httpGet(url);
  }
  uploadDisplayboardLogo(id, data) {
    const url = 'provider/statusBoard/dimension/logo/' + id;
    return this.servicemeta.httpPut(url, data);
  }
  // Appointments
  getTodayAppointments(filter = {}) {
    const url = 'provider/appointment/today';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getTodayAppointmentsFromStringQuery(filter) {
    const url = 'provider/appointment/today?' + filter;
    return this.servicemeta.httpGet(url, null, null);
  }
  getTodayAppointmentsCount(filter = {}) {
    const url = 'provider/appointment/today/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getFutureAppointments(filter = {}) {
    const url = 'provider/appointment/future';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getFutureAppointmentsCount(filter = {}) {
    const url = 'provider/appointment/future/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getHistoryAppointments(filter = {}) {
    const url = 'provider/appointment/history';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getHistoryAppointmentsCount(filter = {}) {
    const url = 'provider/appointment/history/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getAppointmentSlotsByScheduleid(scheduleid) {
    const url = 'provider/appointment/schedule/nextAvailableTime/' + scheduleid;
    return this.servicemeta.httpGet(url);
  }
  getSlotsByLocationServiceandDate(locid, servid, pdate) {
    const url = 'consumer/appointment/schedule/date/' + pdate + '/location/' + locid + '/service/' + servid;
    return this.servicemeta.httpGet(url);
  }
  getAppointmentSlotsByDate(scheduleid, date) {
    const url = 'provider/appointment/schedule/' + scheduleid + '/' + date;
    return this.servicemeta.httpGet(url);
  }
  addLabeltoAppointment(uuid, data) {
    const url = 'provider/appointment/addLabel/' + uuid;
    return this.servicemeta.httpPost(url, data);
  }
  deleteLabelfromAppointment(uuid, label) {
    const url = 'provider/appointment/removeLabel/' + uuid + '/' + label;
    return this.servicemeta.httpDelete(url);
  }
  getProviderAppointmentHistory(uuid) {
    const url = 'provider/appointment/state/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  getProviderAppointmentNotes(uuid) {
    const url = 'provider/appointment/note/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  addProviderAppointmentNotes(uuid, messgae) {
    const url = 'provider/appointment/note/' + uuid;
    return this.servicemeta.httpPost(url, messgae);
  }
  //
  setLivetrack(status) {
    const url = 'provider/account/settings/livetrack/' + status;
    return this.servicemeta.httpPut(url);
  }
  setServiceLivetrack(status, serviceId) {
    const url = 'provider/services/livetrack/' + status + '/' + serviceId;
    return this.servicemeta.httpPut(url);
  }
  // getTodaysAvailableTimeSlots(date, sheduleid) {
  //    const url = 'provider/appointment/schedule/' + date + '/' + '{' + sheduleid + '}' + '/' + '{' + date + '}';
  //    return this.servicemeta.httpGet(url);
  // }
  changeProviderApptStatus(appmntId, status, message = {}) {
    const url = 'provider/appointment/statuschange/' + status + '/' + appmntId;
    return this.servicemeta.httpPut(url, message);
  }
  getAppointmentById(appmntId) {
    const url = 'provider/appointment/' + appmntId;
    return this.servicemeta.httpGet(url);
  }
  setAppointmentPresence(status) {
    const url = 'provider/account/settings/appointment/' + status;
    return this.servicemeta.httpPut(url);
  }
  getJaldeeIntegrationSettings() {
    const url = 'provider/account/settings/jaldeeIntegrationSettings';
    return this.servicemeta.httpGet(url);
  }
  setJaldeeIntegration(data) {
    const url = 'provider/account/settings/jaldeeIntegration';
    return this.servicemeta.httpPut(url, data);
  }
  setDonations(status) {
    const url = 'provider/account/settings/donationFundRaising/' + status;
    return this.servicemeta.httpPut(url);
  }
  updateCustIdFormat(pattern, data) {
    const url = 'provider/account/settings/jaldeeIdFormat/' + pattern;
    return this.servicemeta.httpPut(url, data);
  }
  // Comm urls
  getVirtualCallingModes() {
    const url = 'provider/account/settings/virtualCallingModes';
    return this.servicemeta.httpGet(url);
  }
  setVirtualCallingMode(status) {
    const url = 'provider/account/settings/virtualServices/' + status;
    return this.servicemeta.httpPut(url);
  }
  addVirtualCallingModes(post_data) {
    const url = 'provider/account/settings/virtualCallingModes';
    return this.servicemeta.httpPut(url, post_data);
  }
  getDonationsCount(filter) {
    const url = 'provider/donation/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getDonations(filter) {
    const url = 'provider/donation';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getDonationByUid(uid) {
    const url = 'provider/donation/' + uid;
    return this.servicemeta.httpGet(url);
  }
  getCauseCount(filter) {
    const url = 'provider/services/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getCauses(filter) {
    const url = 'provider/services';
    return this.servicemeta.httpGet(url, null, filter);
  }
  emailCheckin(uuid) {
    const url = 'provider/waitlist/' + uuid + '/email';
    return this.servicemeta.httpGet(url);
  }
  smsCheckin(uuid) {
    const url = 'provider/waitlist/' + uuid + '/sms';
    return this.servicemeta.httpGet(url);
  }
  getAppointmentWaitlistFutureCount(filter = {}) {
    const url = 'provider/appointment/future/count/';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getAppointmentwaitlistTodayCount(filter = {}) {
    const url = 'provider/appointment/today/count/';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getSchedulesCount(filter?) {
    const url = 'provider/appointment/schedule/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getApptlistMgr() {
    const url = 'provider/settings/apptMgr';
    return this.servicemeta.httpGet(url);
  }
  setAcceptOnlineAppointment(status) {
    const url = 'provider/settings/apptMgr/todayAppt/' + status;
    return this.servicemeta.httpPut(url);
  }
  setFutureAppointmentStatus(status) {
    const url = 'provider/settings/apptMgr/futureAppt/' + status;
    return this.servicemeta.httpPut(url);
  }
  emailAppt(uuid) {
    const url = 'provider/appointment/' + uuid + '/email';
    return this.servicemeta.httpGet(url);
  }
  smsAppt(uuid) {
    const url = 'provider/appointment/' + uuid + '/sms';
    return this.servicemeta.httpGet(url);
  }
  setCheckinPresence(status) {
    const url = 'provider/account/settings/waitlist/' + status;
    return this.servicemeta.httpPut(url);
  }
  changeSamedayAppointmentStatus(queId, status) {
    const url = 'provider/appointment/schedule/todayAppt/' + status + '/' + queId;
    return this.servicemeta.httpPatch(url);
  }
  changeFutureAppointmentStatus(queId, status) {
    const url = 'provider/appointment/schedule/futureAppt/' + status + '/' + queId;
    return this.servicemeta.httpPatch(url);
  }
  getDisplayboardQSetsAppointment() {
    const url = 'provider/appointment/statusBoard/queueSet';
    return this.servicemeta.httpGet(url);
  }
  getDisplayboardQSetsWaitlist() {
    const url = 'provider/waitlist/statusBoard/queueSet';
    return this.servicemeta.httpGet(url);
  }
  getDisplayboardsAppointment() {
    const url = 'provider/appointment/statusBoard';
    return this.servicemeta.httpGet(url);
  }
  getDisplayboardsWaitlist() {
    const url = 'provider/waitlist/statusBoard';
    return this.servicemeta.httpGet(url);
  }
  createDisplayboardQSetAppointment(input) {
    const url = 'provider/appointment/statusBoard/queueSet';
    return this.servicemeta.httpPost(url, input);
  }
  createDisplayboardQSetWaitlist(input) {
    const url = 'provider/waitlist/statusBoard/queueSet';
    return this.servicemeta.httpPost(url, input);
  }
  updateDisplayboardQSetAppointment(data) {
    const url = 'provider/appointment/statusBoard/queueSet';
    return this.servicemeta.httpPut(url, data);
  }
  updateDisplayboardQSetWaitlist(data) {
    const url = 'provider/waitlist/statusBoard/queueSet';
    return this.servicemeta.httpPut(url, data);
  }
  createDisplayboardAppointment(input) {
    const url = 'provider/appointment/statusBoard';
    return this.servicemeta.httpPost(url, input);
  }
  createDisplayboardWaitlist(input) {
    const url = 'provider/waitlist/statusBoard';
    return this.servicemeta.httpPost(url, input);
  }
  updateDisplayboardAppointment(data) {
    const url = 'provider/appointment/statusBoard';
    return this.servicemeta.httpPut(url, data);
  }
  updateDisplayboardWaitlist(data) {
    const url = 'provider/waitlist/statusBoard';
    return this.servicemeta.httpPut(url, data);
  }
  uploadDisplayboardLogoAppointment(id, data) {
    const url = 'provider/appointment/statusBoard/logo/' + id;
    return this.servicemeta.httpPost(url, data);
  }
  uploadDisplayboardLogoWaitlist(id, data) {
    const url = 'provider/waitlist/statusBoard/logo/' + id;
    return this.servicemeta.httpPost(url, data);
  }
  uploadDisplayboardWlLogoProps(id, data) {
    const url = 'provider/waitlist/statusBoard/logo/' + id;
    return this.servicemeta.httpPut(url, data);
  }
  uploadDisplayboardApptLogoProps(id, data) {
    const url = 'provider/appointment/statusBoard/logo/' + id;
    return this.servicemeta.httpPut(url, data);
  }
  getDisplayboardAppointment(id) {
    const url = 'provider/appointment/statusBoard/' + id;
    return this.servicemeta.httpGet(url);
  }
  getDisplayboardById_Type(id, type) {
    const url = 'provider/' + type + '/statusBoard/' + id;
    return this.servicemeta.httpGet(url);
  }
  getDisplayboardWaitlist(id) {
    const url = 'provider/waitlist/statusBoard/' + id;
    return this.servicemeta.httpGet(url);
  }
  deleteDisplayboardAppointment(id) {
    const url = 'provider/appointment/statusBoard/' + id;
    return this.servicemeta.httpDelete(url);
  }
  deleteDisplayboardWaitlist(id) {
    const url = 'provider/waitlist/statusBoard/' + id;
    return this.servicemeta.httpDelete(url);
  }
  deleteDisplayboardQSetAppointment(id) {
    const url = 'provider/appointment/statusBoard/queueSet/' + id;
    return this.servicemeta.httpDelete(url);
  }
  deleteDisplayboardQSetWaitlist(id) {
    const url = 'provider/waitlist/statusBoard/queueSet/' + id;
    return this.servicemeta.httpDelete(url);
  }
  getProviderUserSchedules(id) {
    return this.servicemeta.httpGet('provider/appointment/schedule?provider-eq=' + id);
  }
  changeScheduleBatchStatus(queueId, status) {
    const url = 'provider/appointment/schedules/batch/' + queueId + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  updateScheduleBatch(queueId, data) {
    const url = 'provider/appointment/schedules/batch/pattern/' + queueId;
    return this.servicemeta.httpPut(url, data);
  }
  changeAppointmentStatusByBatch(batchId, status, data) {
    const url = 'provider/appointment/statusChangeByBatch/' + batchId + '/' + status;
    return this.servicemeta.httpPut(url, data);
  }
  setApptCallStatus(uuid, status) {
    const url = 'provider/appointment/callingStatus/' + uuid + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  getvirtualServiceInstructions() {
    const url = 'provider/ynwConf/virtualServiceInstructions';
    return this.servicemeta.httpGet(url);
  }
  getCustomerTrackStatusforAppointment(uuid) {
    const url = 'provider/appointment/live/locate/distance/time/' + uuid;
    return this.servicemeta.httpPost(url);
  }
  getScheduleDelay(queueId) {
    const url = 'provider/appointment/schedule/' + queueId + '/delay';
    return this.servicemeta.httpGet(url);
  }
  addScheduleDelay(queueId, data) {
    const url = 'provider/appointment/schedule/' + queueId + '/delay';
    return this.servicemeta.httpPost(url, data);
  }
  getTodayApptlist(filter) {
    const url = 'provider/appointment/today/';
    return this.servicemeta.httpGet(url, null, filter);
  }
  setNotificationSettings(state) {
    const url = 'provider/account/settings/notification/' + state;
    return this.servicemeta.httpPut(url);
  }
  getScheduleAvailablity() {
    const url = 'provider/appointment/schedule/availableNow';
    return this.servicemeta.httpGet(url);
  }
  getAccountSchedules(filter?) {
    return this.servicemeta.httpGet('provider/appointment/schedule', null, filter);
  }
  Paymentlink(data) {
    const url = 'provider/payment/paylink/generate';
    return this.servicemeta.httpPost(url, data);
  }
  Paymentlinkcheck(uuid) {
    const url = 'consumer/bill/pay/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  linkPayment(data) {
    const url = 'provider/payment/paylink/order/create';
    return this.servicemeta.httpPost(url, data);
  }
  makeDefalutAdmin(id) {
    const url = 'provider/user/makeDefalutAdminUser/' + id;
    return this.servicemeta.httpPut(url);
  }
  getProviderAttachments(uuid) {
    const url = 'provider/communications/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  getProviderAppointmentAttachmentsByUuid(uuid) {
    const url = 'provider/appointment/attachment/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  getProviderWaitlistAttachmentsByUuid(uuid) {
    const url = 'provider/waitlist/attachment/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  getAccountContactInfo() {
    const url = 'provider/contact';
    return this.servicemeta.httpGet(url);
  }
  updateAccountContactInfo(data) {
    const url = 'provider/contact';
    return this.servicemeta.httpPut(url, data);
  }
  updateAccountEmail(data) {
    const url = 'provider/email/notification';
    return this.servicemeta.httpPut(url, data);
  }
  generateReport(data) {
    const url = 'provider/report';
    return this.servicemeta.httpPut(url, data);
  }
  getJaldeeCustomer(data) {
    const url = 'consumer';
    return this.servicemeta.httpGet(url, null, data);
  }
  createVoiceCall(data) {
    const url = 'provider/appointment/createJaldeeMeetingrequest';
    return this.servicemeta.httpPost(url, data);
  }
  createWaitlistVoiceCall(data) {
    const url = 'provider/waitlist/createJaldeeMeetingrequest';
    return this.servicemeta.httpPost(url, data);
  }
  rescheduleProviderAppointment(data) {
    const url = 'provider/appointment/reschedule';
    return this.servicemeta.httpPut(url, data);
  }
  rescheduleConsumerWaitlist(data) {
    const url = 'provider/waitlist/reschedule';
    return this.servicemeta.httpPut(url, data);
  }
  // medical record
  createMedicalRecordForFollowUp(data, patientId) {
    const url = 'provider/mr/patient/' + patientId;
    return this.servicemeta.httpPost(url, data);
  }

  createMedicalRecord(data, bookingId) {
    const url = 'provider/mr/' + bookingId;
    return this.servicemeta.httpPost(url, data);
  }
  updateMRprescription(data, mrId) {
    const url = 'provider/mr/prescription/' + mrId;
    return this.servicemeta.httpPut(url, data);
  }
  getMRprescription(id) {
    const url = 'provider/mr/prescription/' + id;
    return this.servicemeta.httpGet(url);
  }
  GetMedicalRecordList(filter = {}) {
    const url = 'provider/mr';
    return this.servicemeta.httpGet(url, null, filter);
  }
  uploadMRprescription(mrId, data) {
    const url = 'provider/mr/uploadPrescription/' + mrId;
    return this.servicemeta.httpPost(url, data);
  }
  getClinicalRecordOfMRById(mrId) {
    const url = 'provider/mr/clinicalNotes/' + mrId;
    return this.servicemeta.httpGet(url, null);
  }
  getDigitalSign(providerId) {
    const url = 'provider/user/digitalSign/' + providerId;
    return this.servicemeta.httpGet(url);
  }
  GetMedicalRecord(mrId) {
    const url = 'provider/mr/' + mrId;
    return this.servicemeta.httpGet(url);
  }
  uploadMrDigitalsign(id, data) {
    const url = 'provider/user/digitalSign/' + id;
    return this.servicemeta.httpPost(url, data);
  }
  updateMrClinicalNOtes(data, mrId) {
    const url = 'provider/mr/clinicalNotes/' + mrId;
    return this.servicemeta.httpPut(url, data);
  }
  getPatientVisitList(patientId) {
    const url = 'provider/mr/patientPreviousVisit/' + patientId;
    return this.servicemeta.httpGet(url);
  }
  getproviderprofile(id) {
    const url = 'provider/profile/' + id;
    return this.servicemeta.httpGet(url);
  }
  deleteUplodedprescription(name, id) {
    return this.servicemeta.httpDelete('provider/mr/prescription/' + id + '/' + name);
  }
  getPatientVisitListCount(patientId) {
    const url = 'provider/mr/patientPreviousVisit/count/' + patientId;
    return this.servicemeta.httpGet(url);
  }
  getPatientMedicalRecords(patientId) {
    const filter = { 'patientId-eq': patientId };
    const url = 'provider/mr';
    return this.servicemeta.httpGet(url, null, filter);
  }
  shareRx(id, data) {
    const url = 'provider/mr/sharePrescription/' + id;
    return this.servicemeta.httpPost(url, data);
  }
  shareRxforThirdparty(id, data) {
    const url = 'provider/mr/sharePrescription/thirdParty/' + id;
    return this.servicemeta.httpPost(url, data);
  }
  updateMR(data, mrId) {
    const url = 'provider/mr/' + mrId;
    return this.servicemeta.httpPut(url, data);
  }
  deleteUplodedsign(name, id) {
    return this.servicemeta.httpDelete('provider/user/digitalSign/' + id + '/' + name);
  }

  addAppointmentBlock(data) {
    const url = 'provider/appointment/block';
    return this.servicemeta.httpPost(url, data);
  }
  deleteAppointmentBlock(uid) {
    const url = 'provider/appointment/unblock/' + uid;
    return this.servicemeta.httpPut(url);
  }
  confirmAppointmentBlock(data) {
    const url = 'provider/appointment/confirm';
    return this.servicemeta.httpPut(url, data);
  }
  getCustomerTodayVisit(id) {
    const url = 'provider/customers/bookings/today/' + id;
    return this.servicemeta.httpGet(url);
  }
  getCustomerFutureVisit(id) {
    const url = 'provider/customers/bookings/future/' + id;
    return this.servicemeta.httpGet(url);
  }
  getCustomerHistoryVisit(id) {
    const url = 'provider/customers/bookings/history/' + id;
    return this.servicemeta.httpGet(url);
  }
  getCustomerOrderVisit(id){
      const url = 'provider/orders/customer/' + id;
      return this.servicemeta.httpGet(url);
   }
  getMRAudits(id) {
    const url = 'provider/mr/auditLog/' + id;
    return this.servicemeta.httpGet(url);
  }
  // waitlist block
  addWaitlistBlock(data) {
    const url = 'provider/waitlist/block';
    return this.servicemeta.httpPost(url, data);
  }
  deleteWaitlistBlock(uid) {
    const url = 'provider/waitlist/unblock/' + uid;
    return this.servicemeta.httpPut(url);
  }
  confirmWaitlistBlock(data) {
    const url = 'provider/waitlist/confirm';
    return this.servicemeta.httpPut(url, data);
  }
  getSlotsByScheduleandDate(ids, date) {
    const url = 'provider/appointment/schedule/' + ids + '/date/' + date;
    return this.servicemeta.httpGet(url);
  }
  addLabeltoCustomer(data) {
    const url = 'provider/customers/label';
    return this.servicemeta.httpPost(url, data);
  }
  deleteLabelFromCustomer(data) {
      const url = 'provider/customers/masslabel';
      return this.servicemeta.httpDelete(url, data);
   }
  uploadCoverFoto(data) {
    return this.servicemeta.httpPost('provider/coverPicture', data);
  }
  getCoverFoto() {
    const url = 'provider/cover';
    return this.servicemeta.httpGet(url);
  }
  deleteCoverFoto(name) {
    const path = 'provider/coverPicture/' + name;
    return this.servicemeta.httpDelete(path);
  }
  paymentRefund(data) {
    return this.servicemeta.httpPost('provider/payment/refund', data);
  }
  saveReportCriteria(reportName, data) {
    const url = 'provider/report/' + reportName;
    return this.servicemeta.httpPost(url, data);
  }
  getCriteriaList() {
    const url = 'provider/report/criteria';
    return this.servicemeta.httpGet(url);
  }
  deleteCriteria(reportName, reportType) {
    const path = 'provider/report/' + reportName + '/' + reportType;
    return this.servicemeta.httpDelete(path);
  }

  uploadItemImages(id, data) {
    const url = 'provider/items/' + id + '/image';
    return this.servicemeta.httpPost(url, data);
  }
  updateProviderOrders(data) {
    const url = 'provider/orders';
    return this.servicemeta.httpPut(url, data);
  }
  updateProviderOrderItems(uuid) {
    const url = 'provider/orders/item' + uuid;
    return this.servicemeta.httpPut(url);
  }
  getProviderTodayOrders(filter = {}) {
    const url = 'provider/orders';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderTodayOrdersCount(filter = {}) {
    const url = 'provider/orders/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderFutureOrders(filter = {}) {
    const url = 'provider/orders/future';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderFutureOrdersCount(filter = {}) {
    const url = 'provider/orders/future/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderOrderById(id) {
    const url = 'provider/orders/' + id;
    return this.servicemeta.httpGet(url);
  }
  getProviderHistoryOrders(filter = {}) {
    const url = 'provider/orders/history';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderHistoryOrdersCount(filter = {}) {
    const url = 'provider/orders/history/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderOrderStates(uuid) {
    const url = 'provider/orders/states/' + uuid;
    return this.servicemeta.httpGet(url);
  }
  changeOrderStatus(uuid, action) {
    const url = 'provider/orders/' + uuid + '/' + action;
    return this.servicemeta.httpPut(url);
  }
  addCatalog(data) {
    return this.servicemeta.httpPost('provider/catalog', data);
  }
  editCatalog(data) {
    return this.servicemeta.httpPut('provider/catalog', data);
  }
  getProviderCatalogs(id?) {
    if (id) {
      return this.servicemeta.httpGet('provider/catalog/' + id);
    } else {
      return this.servicemeta.httpGet('provider/catalog');
    }
  }
  stateChangeCatalog(id, status) {
    const url = 'provider/catalog/' + id + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  deleteUplodeditemImage(name, id) {
    return this.servicemeta.httpDelete('provider/items/' + id + '/image/' + name);
  }
  uploadCatalogImages(id, data) {
    const url = 'provider/catalog/' + id + '/image';
    return this.servicemeta.httpPost(url, data);
  }
  deleteUplodedCatalogImage(name, id) {
    return this.servicemeta.httpDelete('provider/catalog/' + id + '/image/' + name);
  }
  getProviderOrderSettings() {
    const url = 'provider/order/settings';
    return this.servicemeta.httpGet(url);
  }
  setProviderOrderSStatus(status) {
    const url = 'provider/order/settings/' + status;
    return this.servicemeta.httpPut(url);
  }
  addCatalogItems(id, data) {
    const url = 'provider/catalog/' + id + '/items';
    return this.servicemeta.httpPost(url, data);
  }
  deleteCatalogItems(id, data) {
    const url = 'provider/catalog/' + id + '/items';
    return this.servicemeta.httpDelete(url, data);
  }
  deleteCatalogItem(id, itemid) {
    const url = 'provider/catalog/' + id + '/item/' + itemid;
    return this.servicemeta.httpDelete(url);
  }
  updateCatalogItems(id, data) {
    const url = 'provider/catalog/items';
    return this.servicemeta.httpPut(url, data);
  }
  updateCatalogItem(data) {
    const url = 'provider/catalog/item';
    return this.servicemeta.httpPut(url, data);
  }
  setCatalogPrefilledDetails(data) {
    this.catalogPrefilledInput = data;
    console.log(this.catalogPrefilledInput);
  }
  getCatalogPrefiledDetails() {
    return this.catalogPrefilledInput;
  }
  getDefaultCatalogStatuses() {
    const url = 'provider/catalog/statuses';
    return this.servicemeta.httpGet(url);
  }
  getContactInfo() {
    return this.servicemeta.httpGet('provider/order/settings/contact/info');
  }
  editContactInfo(data) {
    return this.servicemeta.httpPut('provider/order/settings/contact/info', data);
  }
  addLabeltoMultipleCheckin(data) {
    const url = 'provider/waitlist/labelBatch';
    return this.servicemeta.httpPost(url, data);
  }
  addLabeltoMultipleAppt(data) {
    const url = 'provider/appointment/labelBatch';
    return this.servicemeta.httpPost(url, data);
  }
  addLabeltoMultipleOrder(data) {
    const url = 'provider/orders/labelsBatch';
    return this.servicemeta.httpPost(url, data);
  }
  // deleteLabelfromOrder(uuid, label) {
  //   const url = 'provider/orders/label/' + uuid + '/' + label;
  //   return this.servicemeta.httpDelete(url);
  // }
  // Customer
  deleteLabelfromOrder(data) {
    const url = 'provider/orders/masslabel';
    return this.servicemeta.httpDelete(url,data);
  } 
  createCustomerGroup(data) {
    const url = 'provider/customers/group';
    return this.servicemeta.httpPost(url, data);
  }
  updateCustomerGroup(data) {
    const url = 'provider/customers/group';
    return this.servicemeta.httpPut(url, data);
  }
  getCustomerGroup() {
    const url = 'provider/customers/group';
    return this.servicemeta.httpGet(url);
  }
  getCustomerGroupById(id) {
    const url = 'provider/customers/group/' + id;
    return this.servicemeta.httpGet(url);
  }
  updateCustomerGroupStatus(id, status) {
    const url = 'provider/customers/group/' + id + '/' + status;
    return this.servicemeta.httpPut(url);
  }
  addCustomerToGroup(name, data) {
    const url = 'provider/customers/group/' + name;
    return this.servicemeta.httpPost(url, data);
  }
  removeCustomerFromGroup(name, data) {
    const url = 'provider/customers/group/' + name;
    return this.servicemeta.httpDelete(url, data);
  }
  getDeliveryAddress(customerId) {
    const url = 'provider/orders/consumer/' + customerId + '/deliveryAddress';
    return this.servicemeta.httpGet(url);
  }
  updateDeliveryaddress(customerId, data) {
    const url = 'provider/orders/consumer/' + customerId + '/deliveryAddress' ;
    return this.servicemeta.httpPut(url, data);
  }
  updateOrder(data) {
    const url = 'provider/orders';
    return this.servicemeta.httpPut(url, data);
  }

  updateOrderItems(uid, data) {
    const url ='provider/orders/item/' + uid;
    return this.servicemeta.httpPut(url, data);

  }
   deleteLabelFromMultipleCheckin(data) {
      const url = 'provider/waitlist/masslabel';
      return this.servicemeta.httpDelete(url, data);
   }
   deleteLabelFromMultipleAppt(data) {
      const url = 'provider/appointment/masslabel';
      return this.servicemeta.httpDelete(url, data);
   }
   getProviderorderlistHistroy(uuid) {
      const url = 'provider/orders/states/' + uuid;
      return this.servicemeta.httpGet(url);
   }
   uploadMRfiles(mrId, data) {
      const url = 'provider/mr/uploadMR/' + mrId;
      return this.servicemeta.httpPost(url, data);
   }
   getProviderUnreadCount(msgType, providerId) {
     const url = 'provider/message/count/' + msgType + '/' + providerId;
     return this.servicemeta.httpGet(url);
   }
}
