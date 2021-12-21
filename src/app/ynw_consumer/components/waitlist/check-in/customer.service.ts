import { Injectable } from '@angular/core';
import { ServiceMeta } from '../../../../shared/services/service-meta';

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
    let path= origin + '/' + id;
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
  
}
