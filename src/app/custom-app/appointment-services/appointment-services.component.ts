import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';
import { CheckavailabilityComponent } from '../../shared/components/checkavailability/checkavailability.component';
import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ServiceDetailComponent } from '../../shared/components/service-detail/service-detail.component';
import { ConsumerJoinComponent } from '../../ynw_consumer/components/consumer-join/join.component';

@Component({
  selector: 'app-appointment-services',
  templateUrl: './appointment-services.component.html',
  styleUrls: ['./appointment-services.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppointmentServicesComponent implements OnInit, OnChanges {

  @Input() selectedLocation;
  @Input() terminologiesjson;
  @Input() templateJson;
  @Input() apptSettings;
  @Input() businessProfile;
  @Input() filteredServices;

  services;

  availabilityDialogref: any;
  serverDate: any;
  serviceDialogRef: any;

  constructor(private dialog: MatDialog,
    private dateTimeProcessor: DateTimeProcessor,
    private authService: AuthService,
    private router: Router,
    private lStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.serverDate = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.services = this.filteredServices;
  }

  ngOnChanges(): void {
    this.services = this.filteredServices;
  }

  checkAvailableSlots(actionObj) {
    this.availabilityDialogref = this.dialog.open(CheckavailabilityComponent, {
      width: '100%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'availability-container', this.templateJson['theme']],
      height: 'auto',
      data: {
        alldetails: actionObj,
        apptSettingsJson: this.apptSettings,
      }
    });
    this.availabilityDialogref.afterClosed().subscribe(result => {
      if (result != 'undefined') {
        actionObj['location']['time'] = result[0];
        actionObj['location']['date'] = result[1];
        this.appointmentClicked(actionObj['location'], actionObj['service']);
      }
    });
  }
  showServiceDetail(serv, busname) {
    let servData;
    if (serv.serviceType && serv.serviceType === 'donationService') {
      servData = {
        bname: busname,
        sector: this.businessProfile.serviceSector.domain,
        serdet: serv,
        serv_type: 'donation'
      };
    } else {
      servData = {
        bname: busname,
        sector: this.businessProfile.serviceSector.domain,
        serdet: serv
      };
    }

    this.serviceDialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', this.templateJson['theme']],
      disableClose: true,
      data: servData
    });
    this.serviceDialogRef.afterClosed().subscribe(() => {
    });
  }

  cardClicked(actionObj) {
    if (actionObj['type'] == 'checkavailability') {
      this.checkAvailableSlots(actionObj);
    } else if (actionObj['type'] === 'appt') {
      if (actionObj['action'] === 'view') {
        this.showServiceDetail(actionObj['service'], this.businessProfile.businessName);
      } else {
        this.appointmentClicked(actionObj['location'], actionObj['service']);
      }
    } else {
      this.providerDetClicked(actionObj['userId']);
    }
  }
  providerDetClicked(userId) {
    this.router.navigate([this.businessProfile.accencUid, userId]);
  }
  appointmentClicked(location, service: any) {
    const _this = this;
    const current_provider = {
      'id': location.id,
      'place': location.place,
      'location': location,
      'cdate': service.serviceAvailability.nextAvailableDate,
      'service': service
    };
    _this.authService.goThroughLogin().then(
      (status) => {
        if (status) {
          _this.showAppointment(location, service);
        } else {
          const passParam = { callback: 'appointment', current_provider: current_provider };
          _this.doLogin('consumer', passParam);
        }
      });
  }
  showAppointment(location, service) {
    let queryParam = {
      loc_id: location.id,
      locname: location.place,
      googleMapUrl: location.googleMapUrl,
      unique_id: this.businessProfile.uniqueId,
      account_id: this.businessProfile.id,
      futureAppt: true,
      service_id: service.id,
      sel_date: service.serviceAvailability.nextAvailableDate
    };
    if (!location.futureAppt) {
      queryParam['futureAppt'] = false;
    }
    if (service.provider) {
      queryParam['user'] = service.provider.id;
    }
    if (service['serviceType'] === 'virtualService') {
      queryParam['tel_serv_stat'] = true;
    } else {
      queryParam['tel_serv_stat'] = false;
    }
    if (service['department']) {
      queryParam['dept'] = service['department'];
    }
    if (this.templateJson['theme']) {
      queryParam['theme'] = this.templateJson.theme;
    }
    queryParam['customId'] = this.businessProfile.accEncUid;

    const dtoday = this.dateTimeProcessor.getStringFromDate_YYYYMMDD(this.dateTimeProcessor.getLocaleDateFromServer(this.serverDate));
    if (dtoday === service.serviceAvailability.nextAvailableDate) {
      queryParam['cur'] = false;
    } else {
      queryParam['cur'] = true;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.router.navigate(['consumer', 'appointment'], navigationExtras);
  }
  doLogin(origin?, passParam?) {
    const current_provider = passParam['current_provider'];
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
        this.showAppointment(current_provider['location'], current_provider['service']);

        // this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        // if (passParam['callback'] === 'communicate') {
        //   this.showCommunicate(passParam['providerId']);
        // } else if (passParam['callback'] === 'history') {
        //   this.redirectToHistory();
        // } else 
        // else if (passParam['callback'] === 'donation') {
        //   this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        // } else if (passParam['callback'] === 'appointment') {
        //   this.showAppointment(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
        // } else if (passParam['callback'] === 'order') {
        //   if (this.orderType === 'SHOPPINGLIST') {
        //     this.shoppinglistupload();
        //   } else {
        //     this.checkout();
        //   }
        // } else {
        //   this.showCheckin(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
        // }
      } else if (result === 'showsignup') {
        // this.doSignup(passParam);
      } else {
        //this.loading = false;
      }
    });
  }
}
