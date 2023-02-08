import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { SubSink } from 'subsink';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';


@Component({
  selector: 'app-cdlrbac-manager',
  templateUrl: './cdlrbac-manager.component.html',
  styleUrls: ['./cdlrbac-manager.component.css']
})
export class CdlrbacManagerComponent implements OnInit {
  cdlRbacStatus: any;
  cdlRbacstatusDisplayName: any;
  private subs = new SubSink();

  constructor(
    private router: Router,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private commonDataStorage: CommonDataStorageService,
    private sharedFunctions: SharedFunctions
  ) { }

  ngOnInit(): void {
    this.getCdlRbacStatus()
  }


  redirecToSettings() {
    this.router.navigate(['provider', 'settings']);
  }


  getCdlRbacStatus() {
    this.providerServices.getAccountSettings().then((data: any) => {
      this.cdlRbacStatus = data.enableRbac;
      this.cdlRbacstatusDisplayName = (this.cdlRbacStatus) ? 'On' : 'Off';
      this.sharedFunctions.sendMessage({ 'ttype': 'cdlRbacStatus', cdlRbacstatus: this.cdlRbacStatus });
    });
  }


  handleCdlRbacStatus(event) {
    if (event.checked) {
      this.cdlRbacStatus = 'Enable';
    }
    else {
      this.cdlRbacStatus = 'Disable';
    }
    const status = (event.checked) ? 'enabled' : 'disabled';
    this.subs.sink = this.providerServices.setProviderCdlRbacStatus(this.cdlRbacStatus).subscribe(data => {
      this.snackbarService.openSnackBar('CDL RBAC ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.commonDataStorage.setSettings('account', null);
      this.getCdlRbacStatus();
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getCdlRbacStatus();
    });
  }
}


