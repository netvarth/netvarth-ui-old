import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { projectConstants } from '../../shared/constants/project-constants';
// Import RxJs required methods
import { ServiceMeta } from '../../shared/services/service-meta';

@Injectable()
export class ProviderServices {
  constructor(private servicemeta: ServiceMeta, private http: HttpClient) { }
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
  getProviderNonworkingdays(id?) {
    if (id) {
      return this.servicemeta.httpGet('provider/settings/nonBusinessDays/' + id);
    } else {
      return this.servicemeta.httpGet('provider/settings/nonBusinessDays');
    }
  }
  addHoliday(data) {
    return this.servicemeta.httpPost('provider/settings/nonBusinessDays', data);
  }
  deleteHoliday(id) {
    const path = 'provider/settings/nonBusinessDays/' + id;
    return this.servicemeta.httpDelete(path);
  }
  editHoliday(data) {
    return this.servicemeta.httpPut('provider/settings/nonBusinessDays', data);
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
  // Addwords
  getAdwords() {
    return this.servicemeta.httpGet('provider/license/adwords');
  }
  addAdwords(data) {
    const url = 'provider/license/adwords/' + data;
    return this.servicemeta.httpPost(url);
  }
  deleteAdwords(id) {
    const url = 'provider/license/adwords/' + id;
    return this.servicemeta.httpDelete(url);
  }
  // Check-In Manager
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
  getServicesList(params?) {
    let stat = '';
    if (params !== undefined) {
      if (params['status'] !== undefined && params['status'] !== '') {
        stat = '?status-eq=' + params['status'];
      }
    }
    const url = 'provider/services/' + stat;
    return this.servicemeta.httpGet(url);
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
  getProviderQueues() {
    return this.servicemeta.httpGet('provider/waitlist/queues');
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
  getProviderQueuesbyfilter(filter) {
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
  getHistroryWaitlist(filter = {}) {
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
  getServiceCount() {
    const url = 'provider/services/count';
    return this.servicemeta.httpGet(url);
  }
  getQueuesCount() {
    const url = 'provider/waitlist/queues/count';
    return this.servicemeta.httpGet(url);
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
  getInvoicesWithStatus(status = 'NotPaid', filter = {}) {
    const url = 'provider/license/invoices/' + status + '/status';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getInvoicesWithStatusCount(status = 'NotPaid', filter = {}) {
    const url = 'provider/license/invoices/' + status + '/count';
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
    const url = 'provider/payment/' + uuid;
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
  acknowledgeAlert(id) {
    return this.servicemeta.httpPut('provider/alerts/' + id);
  }
  getProviderCustomers(filter = {}) {
    const url = 'provider/waitlist/consumers';
    return this.servicemeta.httpGet(url, null, filter);
  }
  getProviderCustomersCount(filter = {}) {
    const url = 'provider/waitlist/consumers/count';
    return this.servicemeta.httpGet(url, null, filter);
  }
  createProviderCustomer(data) {
    const url = 'provider/customers';
    return this.servicemeta.httpPost(url, data);
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
    const url = 'provider/statusBoard/' + id;
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
  joinCorp(corpUid) {
    const url = 'provider/corp/joinCorp/' + corpUid;
    return this.servicemeta.httpPost(url);
  }
  createCorp (post_data) {
    const url = 'provider/corp/switchToCorp';
    return this.servicemeta.httpPost(url, post_data);
  }
}

