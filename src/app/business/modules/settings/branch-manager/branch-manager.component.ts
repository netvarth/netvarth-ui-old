import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { SubSink } from 'subsink';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-branch-manager',
  templateUrl: './branch-manager.component.html',
  styleUrls: ['./branch-manager.component.css']
})
export class BranchManagerComponent implements OnInit {
 branchStatus: any;
  branchstatusDisplayName: any;
  private subs = new SubSink();

  constructor(
    private router: Router,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private commonDataStorage: CommonDataStorageService,
    private sharedFunctions: SharedFunctions
  ) { }

  ngOnInit(): void {
    this.getBranchStatus()
  }


  redirecToSettings() {
    this.router.navigate(['provider', 'settings']);
  }


  getBranchStatus() {
    this.providerServices.getAccountSettings().then((data: any) => {
      this.branchStatus = data.enableBranchMaster;
      this.branchstatusDisplayName = (this.branchStatus) ? 'On' : 'Off';
      this.sharedFunctions.sendMessage({ 'ttype': 'branchstatus', branchstatus: this.branchStatus });
    });
  }


  handleBranchStatus(event) {
    if (event.checked) {
      this.branchStatus = 'ACTIVE';
    }
    else {
      this.branchStatus = 'INACTIVE';
    }
    const status = (event.checked) ? 'enabled' : 'disabled';
    this.subs.sink = this.providerServices.setProviderBranchStatus(this.branchStatus).subscribe(data => {
      this.snackbarService.openSnackBar('Branch settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.commonDataStorage.setSettings('account', null);
      this.getBranchStatus();
      this.redirecToSettings();
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getBranchStatus();
    });
  }
}
