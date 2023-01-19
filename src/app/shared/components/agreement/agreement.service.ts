import { Injectable } from '@angular/core';
import { ServiceMeta } from '../../services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(
    private servicemeta: ServiceMeta,

  ) { }

  getLoanFromOutside(loan, account) {
    const url = 'provider/loanapplication/agreement/' + loan + '?account=' + account;
    return this.servicemeta.httpGet(url, null);
  }

  getLoanById(id) {
    const url = 'partner/loanapplication/' + id;
    return this.servicemeta.httpGet(url, null);
  }


  sendAgreementOTP(data) {
    const url = 'provider/loanapplication/generate/acceptance';
    return this.servicemeta.httpPost(url, data);
  }


  rejectLoan(id, data) {
    const url = 'partner/loanapplication/' + id + '/reject';
    return this.servicemeta.httpPut(url, data);
  }

  verifyagreementOTP(id, otp) {
    const url = 'provider/loanapplication/verify/' + id + '/acceptance/' + otp + '/phone';
    return this.servicemeta.httpPost(url, null);
  }

  getLoanEmiDetails(id) {
    const url = 'provider/loanapplication/' + id + '/loanemi';
    return this.servicemeta.httpGet(url, null);
  }

}
