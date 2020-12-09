import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { projectConstants } from '../../../../../app.component';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../../../src/app/ynw_provider/services/provider-services.service';
@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.css']
})
export class StoreDetailsComponent implements OnInit {
  privacypermissiontxt = projectConstants.PRIVACY_PERMISSIONS;
  amForm: FormGroup;
  small_device_display = false;
  screenWidth;
  disableButton = false;
  api_loading = true;
  api_success = null;
  api_error = null;
  firstName: any;
  lastName: any;
  phone: any;
  email: any;
  address: any;
  alternatePhone: any;
  alternateEmail: any;
  whatsappNo: any;
  info_list: any;
  constructor(
    private routerobj: Router,
    private router: Router,
    public sharedfunctionObj: SharedFunctions,
    private provider_services: ProviderServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_functions: SharedFunctions) { }
  ngOnInit(): void {
    this.getInfo();
  }
  redirecToJaldeeIordermanager() {
    this.routerobj.navigate(['provider', 'settings', 'ordermanager']);
  }
  ngOnDestroy() {
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.small_device_display = false;
    }
    if (this.screenWidth <= 1040) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getInfo() {
    this.provider_services.getContactInfo()
      .subscribe(data => {
        this.info_list = data;

      });
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  editInfo() {
    this.router.navigate(['provider/settings/ordermanager/storedetails/edit', { contact_info: JSON.stringify(this.info_list) }]);
  }
  learnmore_clicked(mod, e) {
  }
}
