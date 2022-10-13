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

}
