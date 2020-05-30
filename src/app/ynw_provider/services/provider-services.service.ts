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
      console.log(data);
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
   getInvoicesWithStatus(status = 'NotPaid', filter = {}) {
      const url = 'provider/license/invoices/' + status + '/status';
      return this.servicemeta.httpGet(url, null, filter);
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
      console.log(postdata);
      const url = 'provider/user/providerBprofile/domain' + '/' + providerId;
      return this.servicemeta.httpPut(url, postdata);
   }
   updatesubDomainFields(providerId, postdata, subdomainId) {
      return this.servicemeta.httpPut('provider/user/providerBprofile/' + subdomainId + '/' + providerId, postdata);
   }
   getUserProviderQueues(id) {
      return this.servicemeta.httpGet('provider/waitlist/queues?provider-eq=' + id);
   }
   getUserServicesList(id) {
      const url = 'provider/services/?provider-eq=' + id;
      return this.servicemeta.httpGet(url);
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
      console.log(id);
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
   getUserNotificationList(id) {
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
   readConsumerMessages(consumerId, messageIds) {
      const url = 'provider/communications/readMessages/' + consumerId + '/' + messageIds;
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
}
