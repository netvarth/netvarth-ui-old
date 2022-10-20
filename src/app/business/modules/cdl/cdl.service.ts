import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CdlService {

  constructor(
    // private http: HttpClient,
    private servicemeta: ServiceMeta,
  ) { }

  getLoanCategoryList() {
    const url = 'provider/loanapplication/category';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanTypeList() {
    const url = 'provider/loanapplication/type';
    return this.servicemeta.httpGet(url, null);
  }


  getLoans() {
    const url = 'provider/loanapplication';
    return this.servicemeta.httpGet(url, null);
  }


  getLoansByFilter(filter = {}) {
    const url = 'provider/loanapplication';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getDealersByFilter(filter = {}) {
    const url = 'provider/partner';
    return this.servicemeta.httpGet(url, null, filter);
  }


  createLoan(data) {
    const url = 'provider/loanapplication';
    return this.servicemeta.httpPost(url, data);
  }


  updateLoan(id, data) {
    const url = 'provider/loanapplication/' + id;
    return this.servicemeta.httpPut(url, data);
  }


  createPartner(data) {
    const url = 'provider/partner';
    return this.servicemeta.httpPost(url, data);
  }

  savePartner(data) {
    const url = 'provider/partner/draft';
    return this.servicemeta.httpPost(url, data);
  }


  updateDealer(id, data) {
    const url = 'provider/partner/' + id;
    return this.servicemeta.httpPut(url, data);
  }


  createCustomer(data) {
    const url = 'provider/customers';
    return this.servicemeta.httpPost(url, data);
  }

  getCustomerDetails(filter = {}) {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getBusinessProfile() {
    const url = 'provider/bProfile';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanProducts() {
    const url = 'provider/loan/products';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanById(id) {
    const url = 'provider/loanapplication/' + id;
    return this.servicemeta.httpGet(url, null);
  }


  getBankDetailsById(id) {
    const url = 'provider/loanapplication/' + id + '/bankdetails';
    return this.servicemeta.httpGet(url, null);
  }

  getDealerUsers(id) {
    const url = 'provider/partner/' + id + '/users';
    return this.servicemeta.httpGet(url, null);
  }


  getDealerById(id) {
    const url = 'provider/partner/' + id;
    return this.servicemeta.httpGet(url, null);
  }



  verifyIds(type, data) {
    const url = 'provider/loanapplication/update/' + type;
    return this.servicemeta.httpPut(url, data);
  }

  ApprovalRequest(id) {
    const url = 'provider/loanapplication/' + id + '/approvalrequest';
    return this.servicemeta.httpPut(url, null);
  }

  refreshAadharVerify(id) {
    const url = 'provider/loanapplication/aadhar/status/' + id;
    return this.servicemeta.httpPut(url, null);
  }

  addressUpdate(data) {
    const url = 'provider/loanapplication/kyc/update';
    return this.servicemeta.httpPut(url, data);
  }

  loanDetailsSave(data) {
    const url = 'provider/loanapplication/request';
    return this.servicemeta.httpPut(url, data);
  }


  getDealers() {
    const url = 'provider/partner';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanStatuses() {
    const url = 'provider/loanapplication/status';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanSchemes() {
    const url = 'provider/loan/schemes';
    return this.servicemeta.httpGet(url, null);
  }

  getPartnerCategories() {
    const url = 'provider/partner/category';
    return this.servicemeta.httpGet(url, null);
  }


  getPartnerTypes() {
    const url = 'provider/partner/type';
    return this.servicemeta.httpGet(url, null);
  }

  videoaudioS3Upload(file, url) {
    return this.servicemeta.httpPut(url, file);
  }

  approveDealer(id, data) {
    const url = 'provider/partner/' + id + '/approved';
    return this.servicemeta.httpPut(url, data);
  }

  suspendDealer(id, data) {
    const url = 'provider/partner/' + id + '/suspended';
    return this.servicemeta.httpPut(url, data);
  }

  rejectDealer(id, data) {
    const url = 'provider/partner/' + id + '/rejected';
    return this.servicemeta.httpPut(url, data);
  }


  sendPhoneOTP(data, from) {
    var url = 'provider/loanapplication/generate/phone';
    if (from == 'partner') {
      var url = 'provider/partner/generate/phone';
    }
    return this.servicemeta.httpPost(url, data);
  }

  saveBankDetails(data) {
    const url = 'provider/loanapplication/bank';
    return this.servicemeta.httpPost(url, data);
  }

  updateBankDetails(data) {
    const url = 'provider/loanapplication/bank';
    return this.servicemeta.httpPut(url, data);
  }

  verifyBankDetails(data) {
    const url = 'provider/loanapplication/verify/bank';
    return this.servicemeta.httpPut(url, data);
  }

  verifyPhoneOTP(otp, data) {
    const url = 'provider/loanapplication/verify/' + otp + '/phone';
    return this.servicemeta.httpPost(url, data);
  }

  partnerOtpVerify(otp, data) {
    const url = 'provider/partner/verify/' + otp + '/phone';
    return this.servicemeta.httpPost(url, data);
  }

  sendEmailOTP(data, from) {
    var url = 'provider/loanapplication/generate/email';
    if (from && from == 'partner') {
      var url = 'provider/partner/generate/email';
    }
    return this.servicemeta.httpPost(url, data);
  }

  verifyEmailOTP(otp, from, data?) {
    var url = 'provider/loanapplication/verify/' + otp + '/email';
    if (from && from == 'partner') {
      var url = 'provider/partner/verify/' + otp + '/email';
      return this.servicemeta.httpPost(url);
    }
    return this.servicemeta.httpPost(url, data);
  }
}
