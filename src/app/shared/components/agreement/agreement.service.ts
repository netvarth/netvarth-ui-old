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

  uploadDigitalSign(Uid, KycId, submit_data, accountId, type?) {
    // const url = 'provider/loanapplication/' + Uid + '/kyc/' + KycId + '/digitalsign/' + type + '?account=' + accountId;
    const url = 'provider/loanapplication/' + Uid + '/kyc/' + KycId + '/digitalsign/' + '?account=' + accountId;
    return this.servicemeta.httpPost(url, submit_data);
  }

  b64toBlobforSign(b64Data) {
    const byteString = atob(b64Data.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

}
