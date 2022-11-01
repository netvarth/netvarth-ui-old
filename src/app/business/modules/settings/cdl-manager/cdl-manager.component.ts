import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { SubSink } from 'subsink';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-cdl-manager',
  templateUrl: './cdl-manager.component.html',
  styleUrls: ['./cdl-manager.component.css']
})
export class CdlManagerComponent implements OnInit {
  cdlStatus: any;
  cdlstatusDisplayName: any;
  private subs = new SubSink();

  constructor(
    private router: Router,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private commonDataStorage: CommonDataStorageService,
    private sharedFunctions: SharedFunctions
  ) { }

  ngOnInit(): void {
    this.getCdlStatus()
  }


  redirecToSettings() {
    this.router.navigate(['provider', 'settings']);
  }


  getCdlStatus() {
    this.providerServices.getAccountSettings().then((data: any) => {
      this.cdlStatus = data.enableCdl;
      this.cdlstatusDisplayName = (this.cdlStatus) ? 'On' : 'Off';
      this.sharedFunctions.sendMessage({ 'ttype': 'cdlstatus', cdlstatus: this.cdlStatus });
    });
  }


  handleCdlStatus(event) {
    if (event.checked) {
      this.cdlStatus = 'Enable';
    }
    else {
      this.cdlStatus = 'Disable';
    }
    const status = (event.checked) ? 'enabled' : 'disabled';
    this.subs.sink = this.providerServices.setProviderCdlStatus(this.cdlStatus).subscribe(data => {
      this.snackbarService.openSnackBar('CDL settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.commonDataStorage.setSettings('account', null);
      this.getCdlStatus();
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getCdlStatus();
    });
  }
}


