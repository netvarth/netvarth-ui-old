import { Injectable } from '@angular/core';
import { ServiceMeta } from './service-meta';

@Injectable()
export class CustomerService {

  constructor(private servicemeta: ServiceMeta) { }

  /**
   * To get the customer details
   * @param id id of the customer
   * @param origin 'customer'
   * @returns 
   */
  getProfile(id, origin?) {
    let path = origin + '/' + id;
    return this.servicemeta.httpGet(path);
  }

  getConsumerFamilyMembers() {
    return this.servicemeta.httpGet('consumer/familyMember');
  }

  editMember(data) {
    return this.servicemeta.httpPut('consumer/familyMember', data);
  }

  updateProfile(data, origin) {
    return this.servicemeta.httpPatch(origin, data);
  }

  addMember(data) {
    return this.servicemeta.httpPost('consumer/familyMember', data);
  }

  /**
     * Return customer details as promise
     * @param id id of the customer
     * @returns customer details
     */
  getCustomerInfo(id) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.getProfile(id, 'consumer')
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
}
