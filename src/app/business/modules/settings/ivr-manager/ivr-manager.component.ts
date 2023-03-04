import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { SubSink } from 'subsink';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';


@Component({
  selector: 'app-ivr-manager',
  templateUrl: './ivr-manager.component.html',
  styleUrls: ['./ivr-manager.component.css']
})
export class IvrManagerComponent implements OnInit {
  ivrStatus: any;
  ivrstatusDisplayName: any;
  private subs = new SubSink();

  constructor(
    private router: Router,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private sharedFunctions: SharedFunctions,
    private commonDataStorage: CommonDataStorageService,

  ) { }

  ngOnInit(): void {
    this.getivrStatus()
  }


  redirecToSettings() {
    this.router.navigate(['provider', 'settings']);
  }


  getivrStatus() {
    this.providerServices.getAccountSettings().then((data: any) => {
      this.ivrStatus = data.enableIvr;
      this.ivrstatusDisplayName = (this.ivrStatus) ? 'On' : 'Off';
      this.sharedFunctions.sendMessage({ 'ttype': 'ivrstatus', ivrstatus: this.ivrStatus });
    });
  }


  handleivrStatus(event) {
    if (event.checked) {
      this.ivrStatus = 'Enable';
    }
    else {
      this.ivrStatus = 'Disable';
    }
    const status = (event.checked) ? 'enabled' : 'disabled';
    this.subs.sink = this.providerServices.setProviderIvrStatus(this.ivrStatus).subscribe((data) => {
      this.snackbarService.openSnackBar('Ivr ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.commonDataStorage.setSettings('account', null);
      this.getivrStatus();
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getivrStatus();
    });
  }
}



