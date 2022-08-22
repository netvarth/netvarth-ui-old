import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-donation-services',
  templateUrl: './donation-services.component.html',
  styleUrls: ['./donation-services.component.css']
})
export class DonationServicesComponent implements OnInit {
  @Input() selectedLocation;
  @Input() terminologiesjson;
  @Input() templateJson;
  @Input() businessProfile;
  @Input() donationServices;
  @Input() cardType;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log("Mani:", this.donationServices);
  }

  cardClicked(actionObj) {
    if (actionObj['type'] === 'donation') {
      if (actionObj['action'] === 'view') {
        let queryParam = {
          back: 1,
          customId: this.businessProfile.accEncUid,
          accountId: this.businessProfile.id,
        }
        if (this.templateJson['theme']) {
          queryParam['theme'] = this.templateJson.theme;
        }
        const navigationExtras: NavigationExtras = {
          queryParams: queryParam
        };
        this.router.navigate([this.businessProfile.accEncUid, 'service', actionObj['service'].id], navigationExtras);
      } else {
        this.payClicked(actionObj['location'].id, actionObj['location'].place, new Date(), actionObj['service']);
      }
    }
  }

  payClicked(locid, locname, cdate, service) {
    this.showDonation(locid, cdate, service);
  }
  showDonation(locid, curdate, service) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loc_id: locid,
        sel_date: curdate,
        cur: false,
        unique_id: this.businessProfile.uniqueId,
        account_id: this.businessProfile.id,
        accountId: this.businessProfile.id,
        service_id: service.id,
        theme: this.templateJson['theme'],
        customId: this.businessProfile.accEncUid
      }
    };
    this.router.navigate(['consumer', 'donations', 'new'], navigationExtras);
  }
}
