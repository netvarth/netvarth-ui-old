import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-donationmanager',
  templateUrl: './donation-mgr.component.html'
})
export class DonationMgrComponent implements OnInit {

  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Donation Manager ',
    }
  ];
  domain: any;
  breadcrumbs = this.breadcrumbs_init;
  donations_statusstr: string;
  donations_status: any;
  cause_count: any = 0;
  breadcrumb_moreoptions: any = [];
  constructor(private router: Router,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private provider_services: ProviderServices,
    private groupService:GroupStorageService,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.getDonationStatus();
    this.getCauseCount();
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
  }
  getCauseCount() {
    const filter = { 'scope-eq': 'account', 'serviceType-eq': 'donationService' , 'status-eq': 'ACTIVE'};
    this.provider_services.getCauseCount(filter)
      .subscribe(
        data => {
          this.cause_count = data;
        });
  }
  gotoCauses() {
    this.router.navigate(['provider', 'settings', 'donationmanager', 'causes']);
  }

  handle_Donations(event) {
    if(this.domain === 'finance'){
    let error = 'Donations are disabled for this account.  Please contact Jaldee support @ +91 8880125000'
    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    this.getDonationStatus();
  }
    else {
    const is_Donation = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setDonations(is_Donation)
      .subscribe(
        () => {
          this.snackbarService.openSnackBar('Accept Donations ' + is_Donation + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getDonationStatus();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getDonationStatus();
        }
      );
    }
  }
  getDonationStatus() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        this.donations_status = data.donationFundRaising;
        this.donations_statusstr = (this.donations_status) ? 'On' : 'Off';
        this.shared_functions.sendMessage({ 'ttype': 'donationStatus', donationStatus: this.donations_status });
      });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/donationmanager']);
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/donationmanager->' + mod]);
  }
  redirecToSettings() {
    this.routerobj.navigate(['provider', 'settings']);
  }
  redirecToHelp() {
    this.router.navigate(['/provider/' + this.domain + '/donationmanager']);
}
}
