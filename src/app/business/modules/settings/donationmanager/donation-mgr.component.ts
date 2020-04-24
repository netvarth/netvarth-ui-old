import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

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
  domain;
  breadcrumbs = this.breadcrumbs_init;
  Donations_statusstr: string;
  Donations_status: any;
  cause_count: any = 0;

  constructor(private router: Router,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private provider_services: ProviderServices) { }

  ngOnInit() {
    this.getDonationStatus();
    this.getcauseCount();

  }
  getcauseCount() {
    // const filter = { 'scope-eq': 'account' };
    this.provider_services.getcauseCount()
      .subscribe(
        data => {
          this.cause_count = data;
        });
  }
  gotocauses() {
    this.router.navigate(['provider', 'settings', 'donationmanager','causes']);
  }

  handle_Donations(event) {
    const is_Donation = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setDonations(is_Donation)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Accept Donations' + is_Donation + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getDonationStatus();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getDonationStatus();
        }
      );
  }
  getDonationStatus() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        this.Donations_status = data.donation;
        this.Donations_statusstr = (this.Donations_status) ? 'On' : 'Off';
      });
  }

  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
}
