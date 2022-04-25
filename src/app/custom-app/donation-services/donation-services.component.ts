import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
// import { AuthService } from '../../shared/services/auth-service';
import { ServiceDetailComponent } from '../../shared/components/service-detail/service-detail.component';
import { ConsumerJoinComponent } from '../../ynw_consumer/components/consumer-join/join.component';

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
  servicedialogRef: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    // private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log("Mani:", this.donationServices);
  }

  cardClicked(actionObj) {
    if (actionObj['type'] === 'donation') {
      if (actionObj['action'] === 'view') {
        // this.showServiceDetail(actionObj['service'], this.businessProfile.businessName);
        // this.router.navigate([this.businessProfile.accEncUid, 'service', actionObj['service'].id]);
        let queryParam = {
          back:1,
          customId: this.businessProfile.accEncUid
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
  showServiceDetail(serv, busname) {
    let servData = {
      bname: busname,
      sector: this.businessProfile.serviceSector.domain,
      serdet: serv,
      serv_type: 'donation'
    };
    this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', this.templateJson['theme']],
      disableClose: true,
      data: servData
    });
    this.servicedialogRef.afterClosed().subscribe(() => {
    });
  }


  payClicked(locid, locname, cdate, service) {
    // const _this = this;
    // _this.authService.goThroughLogin().then(
    //   (status) => {
    //     if (status) {
            this.showDonation(locid, cdate, service);
      //   } else {
      //     const passParam = { callback: 'donation', loc_id: locid, name: locname, date: cdate, service: service };
      //     this.doLogin('consumer', passParam);
      //   }
      // });
  }
  doLogin(origin?, passParam?) {
    // const current_provider = passParam['current_provider'];
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class', this.templateJson['theme']],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        theme: this.templateJson['theme'],
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
      } else if (result === 'showsignup') {
        // this.doSignup(passParam);
      } else {
        //this.loading = false;
      }
    });
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
