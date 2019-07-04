import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { AddProviderWaitlistServiceComponent } from '../add-provider-waitlist-service/add-provider-waitlist-service.component';

@Component({
  selector: 'app-provider-waitlist-services',
  templateUrl: './provider-waitlist-services.component.html'
})

export class ProviderWaitlistServicesComponent implements OnInit, OnDestroy {

  add_new_serv_cap = Messages.SER_ADD_NEW_SER_CAP;
  est_duration_cap = Messages.SER_EST_DURATION_CAP;
  min_cap = Messages.SER_MIN_CAP;
  price_cap = Messages.SER_PRICE_CAP;
  isServiceBillable = false;
  api_loading = true;
  service_list: any = [];
  api_error = null;
  api_success = null;
  breadcrumb_moreoptions: any = [];
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: Messages.WAITLIST_MANAGE_CAP,
      url: '/provider/settings/waitlist-manager'
    },
    {
      title: 'Services'
    }
  ];
  addservicedialogRef;
  isCheckin;

  constructor(private provider_services: ProviderServices,
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public provider_shared_functions: ProviderSharedFuctions,
    public router: Router) { }

  ngOnInit() {
    this.api_loading = true;
    this.getDomainSubdomainSettings();
    this.getServices();
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'checkinmanager', 'subKey': 'services', 'classname': 'b-service',
      'actions': [{ 'title': this.add_new_serv_cap, 'type': 'addservice' }]
    };
    this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
    
  }

  ngOnDestroy() {
    if (this.addservicedialogRef) {
      this.addservicedialogRef.close();
    }
  }
  performActions(action) {
    if (action === 'addservice') {
      this.addService();
    }
  }
  getServices() {
    this.api_loading = true;
    this.provider_services.getServicesList()
      .subscribe(
        data => {
          this.service_list = data;
          this.api_loading = false;
        },
        error => {
          this.api_loading = false;
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );
  }

  changeServiceStatus(service) {
    this.provider_shared_functions.changeServiceStatus(this, service);
  }

  disableService(service) {
    this.provider_services.disableService(service.id)
      .subscribe(
        () => {
          this.getServices();
        },
        (error) => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getServices();
        });
  }

  enableService(service) {
    this.provider_services.enableService(service.id)
      .subscribe(
        () => {
          this.getServices();
        },
        (error) => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getServices();
        });
  }

  addService() {
    this.addservicedialogRef = this.dialog.open(AddProviderWaitlistServiceComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'add-service'],
      disableClose: true,
      data: {
        type: 'add'
      }
    });

    this.addservicedialogRef.afterClosed().subscribe(() => {
      // if (result === 'reloadlist') {
      this.getServices();
      // }
    });
  }

  addEditProviderService(type, service = null) {
    this.provider_shared_functions.addEditServicePopup(this, type, 'service_list', service, this.provider_shared_functions.getActiveQueues());
  }

  goServiceDetail(service) {
    this.router.navigate(['provider', 'settings', 'waitlist-manager',
      'service-detail', service.id]);
  }

  getDomainSubdomainSettings() {
    this.api_loading = true;
    const user_data = this.shared_functions.getitemfromLocalStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    this.provider_services.domainSubdomainSettings(domain, sub_domain)
      .subscribe(
        (data: any) => {
          if (data.serviceBillable) {
            this.isServiceBillable = true;
          } else {
            this.isServiceBillable = false;
          }
          this.api_loading = false;
        },
        error => {
          this.api_loading = false;
        }
      );
  }
}
