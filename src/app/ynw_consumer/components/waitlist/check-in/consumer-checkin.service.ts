import { Injectable } from "@angular/core";
import { CustomerService } from "./customer.service";

@Injectable()
export class ConsumerCheckinService {
    
    constructor(private customerService: CustomerService) {}

    /**
     * Return customer details as promise
     * @param id id of the customer
     * @returns customer details
     */
    getCustomerInfo(id) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.customerService.getProfile(id, 'consumer')
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