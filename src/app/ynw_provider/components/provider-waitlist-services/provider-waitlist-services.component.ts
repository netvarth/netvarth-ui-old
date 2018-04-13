import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { AddProviderWaitlistServiceComponent } from '../add-provider-waitlist-service/add-provider-waitlist-service.component';

@Component({
    selector: 'app-provider-waitlist-services',
    templateUrl: './provider-waitlist-services.component.html'
})

export class ProviderWaitlistServicesComponent implements OnInit {

  service_list: any = [];
  api_error = null;
  api_success = null;

  breadcrumbs = [
    {
      title: 'Settings'
    },
    {
    title: 'Waitlist Manager',
    url: '/provider/settings/waitlist-manager'
    },
    {
      title: 'Services'
    }
  ];

  constructor(private provider_services: ProviderServices,
  private provider_datastorage: ProviderDataStorageService,
  private dialog: MatDialog,
  public shared_functions: SharedFunctions,
  public provider_shared_functions: ProviderSharedFuctions,
  public router: Router) {}

  ngOnInit() {
    this.getServices();
  }

  getServices() {
    this.provider_services.getServicesList()
    .subscribe(
      data => {
        this.service_list = data;
      },
      error => {
        this.shared_functions.apiErrorAutoHide(this, error);
      }
    );
  }

  changeServiceStatus(service) {

    let chstatusmsg = '';
    if (service.status === 'ACTIVE') {
       chstatusmsg = 'disabled';
    } else {
       chstatusmsg = 'enabled';
    }

    let msg = Messages.WAITLIST_SERVICE_CHG_STAT.replace('[sername]', service.name);
    msg = msg.replace('[status]', chstatusmsg);

    if (service.status === 'ACTIVE') {
      this.disableService(service, msg);
    } else {
      this.enableService(service, msg);
    }

  }

  disableService(service, msg) {
    this.provider_services.disableService(service.id)
    .subscribe(
      data => {
        this.getServices();
        // this.shared_functions.apiSuccessAutoHide(this, msg);
        const snackBarRef =  this.provider_shared_functions.openSnackBar (msg);
      },
      error => {
        // this.shared_functions.apiErrorAutoHide(this, error);
        const snackBarRef =  this.provider_shared_functions.openSnackBar (error, {'panelClass': 'snackbarerror'});
        this.getServices();
      });

  }

  enableService(service, msg) {
    this.provider_services.enableService(service.id)
    .subscribe(
      data => {
        this.getServices();
        // this.shared_functions.apiSuccessAutoHide(this, msg);
        const snackBarRef =  this.provider_shared_functions.openSnackBar (msg);
      },
      error => {
        // this.shared_functions.apiErrorAutoHide(this, error);
        const snackBarRef =  this.provider_shared_functions.openSnackBar (error, {'panelClass': 'snackbarerror'});
        this.getServices();
      });
  }

  addService() {
    const dialogRef = this.dialog.open(AddProviderWaitlistServiceComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      data: {
        type : 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getServices();
      }
    });
  }



  goServiceDetail(service) {
    this.router.navigate(['provider', 'settings' , 'waitlist-manager',
    'service-detail', service.id]);
  }

}


