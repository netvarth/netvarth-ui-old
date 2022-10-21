import { Injectable } from '@angular/core';
import { ServiceMeta } from '../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(
    private servicemeta: ServiceMeta,

  ) { }



  getLoanCategoryList() {
    const url = 'partner/loanapplication/category';
    return this.servicemeta.httpGet(url, null);
  }

  getSchemes() {
    const url = 'partner/loanapplication/schemes';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanTypeList() {
    const url = 'partner/loanapplication/type';
    return this.servicemeta.httpGet(url, null);
  }


  getLoans() {
    const url = 'partner/loanapplication';
    return this.servicemeta.httpGet(url, null);
  }


  getLoansByFilter(filter = {}) {
    const url = 'partner/loanapplication';
    return this.servicemeta.httpGet(url, null, filter);
  }

  createLoan(data) {
    const url = 'partner/loanapplication';
    return this.servicemeta.httpPost(url, data);
  }


  updateLoan(id, data) {
    const url = 'partner/loanapplication/' + id;
    return this.servicemeta.httpPut(url, data);
  }


  getLoanFromOutside(loan, account) {
    const url = 'provider/loanapplication/agreement/' + loan + '?account=' + account;
    return this.servicemeta.httpGet(url, null);
  }


  getCustomerDetails(filter = {}) {
    const url = 'partner/loanapplication/consumers/details';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getBusinessProfile() {
    const url = 'provider/bProfile';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanProducts() {
    const url = 'partner/loan/products';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanById(id) {
    const url = 'partner/loanapplication/' + id;
    return this.servicemeta.httpGet(url, null);
  }


  getBankDetailsById(id) {
    const url = 'partner/loanapplication/' + id + '/bankdetails';
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
    const url = 'partner/loanapplication/update/' + type;
    return this.servicemeta.httpPut(url, data);
  }

  ApprovalRequest(id) {
    const url = 'partner/loanapplication/' + id + '/approvalrequest';
    return this.servicemeta.httpPut(url, null);
  }

  refreshAadharVerify(id) {
    const url = 'partner/loanapplication/aadhar/status/' + id;
    return this.servicemeta.httpPut(url, null);
  }

  addressUpdate(data) {
    const url = 'partner/loanapplication/kyc/update';
    return this.servicemeta.httpPut(url, data);
  }

  loanDetailsSave(data) {
    const url = 'partner/loanapplication/request';
    return this.servicemeta.httpPut(url, data);
  }


  getDealers() {
    const url = 'provider/partner';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanStatuses() {
    const url = 'partner/loanapplication/status';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanSchemes() {
    const url = 'partner/loan/schemes';
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


  sendPhoneOTP(data, from) {
    var url = 'partner/loanapplication/generate/phone';
    if (from == 'partner') {
      var url = 'partner/partner/generate/phone';
    }
    return this.servicemeta.httpPost(url, data);
  }

  sendAgreementOTP(data) {
    const url = 'provider/loanapplication/generate/acceptance';
    return this.servicemeta.httpPost(url, data);
  }

  saveBankDetails(data) {
    const url = 'partner/loanapplication/bank';
    return this.servicemeta.httpPost(url, data);
  }

  updateBankDetails(data) {
    const url = 'partner/loanapplication/bank';
    return this.servicemeta.httpPut(url, data);
  }

  verifyBankDetails(data) {
    const url = 'partner/loanapplication/verify/bank';
    return this.servicemeta.httpPut(url, data);
  }

  verifyPhoneOTP(otp, data) {
    const url = 'partner/loanapplication/verify/' + otp + '/phone';
    return this.servicemeta.httpPost(url, data);
  }

  verifyagreementOTP(id, otp) {
    const url = 'provider/loanapplication/verify/' + id + '/acceptance/' + otp + '/phone';
    return this.servicemeta.httpPost(url, null);
  }

  partnerOtpVerify(otp, data) {
    const url = 'partner/partner/verify/' + otp + '/phone';
    return this.servicemeta.httpPost(url, data);
  }

  sendEmailOTP(data, from) {
    var url = 'partner/loanapplication/generate/email';
    if (from && from == 'partner') {
      var url = 'partner/partner/generate/email';
    }
    return this.servicemeta.httpPost(url, data);
  }

  verifyEmailOTP(otp, from, data?) {
    var url = 'partner/loanapplication/verify/' + otp + '/email';
    if (from && from == 'partner') {
      var url = 'partner/partner/verify/' + otp + '/email';
      return this.servicemeta.httpPost(url);
    }
    return this.servicemeta.httpPost(url, data);
  }
}
