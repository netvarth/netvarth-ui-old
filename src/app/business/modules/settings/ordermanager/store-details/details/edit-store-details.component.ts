import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedFunctions } from '../../../../../../../../src/app/shared/functions/shared-functions';
import { Messages } from '../../../../../../../../src/app/shared/constants/project-messages';
import { ProviderServices } from '../../../../../../../../src/app/ynw_provider/services/provider-services.service';
@Component({
    selector: 'app-edit-store-details',
    templateUrl: './edit-store-details.component.html'
})
export class EditStoreDetailsComponent implements OnInit {
    api_loading: boolean;
    data: any;
    firstName;
    lastName;
    phone;
    email;
    api_error = null;
    api_success = null;
    address;
    disableButton = false;
    updateInfo: any;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Update';
    alternatePhone: any;
    alternateEmail: any;
    whatsappNo: any;
    constructor(
        public activateroute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router,
        private shared_Functionsobj: SharedFunctions,
        private provider_services: ProviderServices,
        ) {
            this.route.queryParams.subscribe(params => {
                if (this.router.getCurrentNavigation().extras.state) {
                  this.data = this.router.getCurrentNavigation().extras.state.contact_info;
                }
              });
         }
    ngOnInit() {
        this.firstName = this.data.firstName;
        this.lastName = this.data.lastName;
        this.phone = this.data.phone;
        this.email = this.data.email;
        this.address = this.data.address;
        this.alternatePhone = this.data.alternatePhone;
        this.alternateEmail = this.data.alternateEmail;
        this.whatsappNo = this.data.whatsappNo;
    }
    
     onSubmit() {
    const data = {
        'firstName' : this.firstName,
        'lastName': this.lastName,
        'phone': this.phone,
        'email': this.email,
        'address': this.address,
        'alternatePhone': this.alternatePhone,
        'alternateEmail': this.alternateEmail,
        'whatsappNo': this.whatsappNo,
      };
      this.editInfo(data);
  }
  editInfo(data) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    this.provider_services.editContactInfo(data)
        .subscribe(
            () => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('CONTACT_INFO_UPDATED'));
                this.api_loading = false;
                this.router.navigate(['provider', 'settings', 'ordermanager', 'storedetails']);
            },
            error => {
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.disableButton = false;
            }
        );
}
resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
}
Back() {
    this.router.navigate(['provider', 'settings', 'ordermanager', 'storedetails']);
}
    onCancel() {
        this.router.navigate(['provider', 'settings', 'ordermanager', 'storedetails']);
    }
   
}
