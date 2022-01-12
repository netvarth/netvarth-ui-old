import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { ServiceDetailComponent } from '../../shared/components/service-detail/service-detail.component';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../shared/services/auth-service';
import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';
import { ConsumerJoinComponent } from '../../ynw_consumer/components/consumer-join/join.component';
import { CheckavailabilityComponent } from '../../shared/components/checkavailability/checkavailability.component';

@Component({
  selector: 'app-checkin-services',
  templateUrl: './checkin-services.component.html',
  styleUrls: ['./checkin-services.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CheckinServicesComponent implements OnInit, OnChanges {

  @Input() selectedLocation;
  @Input() terminologiesjson;
  @Input() templateJson;
  @Input() apptSettings;
  @Input() businessProfile;
  @Input() filteredServices;

  availabilityDialogref: any;
  serviceDialogRef: any;
  serverDate: any;

  services;

  constructor(private dialog: MatDialog,
    private dateTimeProcessor: DateTimeProcessor,
    private authService: AuthService,
    private router: Router,
    private lStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.serverDate = this.lStorageService.getitemfromLocalStorage('sysdate');
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
        apptSettingsJson: this.apptSettings
      }
    });
    this.availabilityDialogref.afterClosed().subscribe(result => {
      if (result != 'undefined') {
        if(actionObj['service']['bType']=='Waitlist' || !actionObj['service']['bType']) {
          console.log("***Waitlist***");
          this.checkinClicked(actionObj['location'], actionObj['service']);
        }
      }
    });
  }
  cardClicked(actionObj) {
    console.log(actionObj);
    if (actionObj['type'] == 'checkavailability') {
      this.checkAvailableSlots(actionObj);
    } else if (actionObj['type'] === 'waitlist') {
      if (actionObj['action'] === 'view') {
        this.showServiceDetail(actionObj['service'], this.businessProfile.businessName);
      } else {
        this.checkinClicked(actionObj['location'], actionObj['service']);
      }
    } else {
      this.providerDetClicked(actionObj['userId']);
    }
  }
  providerDetClicked(userId) {
    this.router.navigate([this.businessProfile.accencUid, userId]);
  }
  showServiceDetail(serv, busname) {
    let servData = {
      bname: busname,
      sector: this.businessProfile.serviceSector.domain,
      serdet: serv
    };
    this.serviceDialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', this.templateJson['theme']],
      disableClose: true,
      data: servData
    });
    this.serviceDialogRef.afterClosed().subscribe(() => {
    });
  }
  checkinClicked(location, service) {
    const current_provider = {
      'id': location.id,
      'place': location.place,
      'location': location,
      'cdate': service.serviceAvailability.availableDate,
      'service': service
    };
    const _this = this;
    _this.authService.goThroughLogin().then(
      (status) => {
        if (status) {
          _this.showCheckin(location, service);
        } else {
          const passParam = { callback: '', current_provider: current_provider };
          _this.doLogin('consumer', passParam);
        }
      });
  }
  showCheckin(location, service) {
    console.log("Location:", location);
    let queryParam = {
      loc_id: location.id,
      locname: location.place,
      googleMapUrl: location.gMapUrl,
      sel_date: service.serviceAvailability.availableDate,
      unique_id: this.businessProfile.uniqueId,
      account_id: this.businessProfile.id,
      service_id: service.id
    };
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
    const dtoday = this.dateTimeProcessor.getStringFromDate_YYYYMMDD(this.dateTimeProcessor.getLocaleDateFromServer(this.serverDate));
    if (dtoday === service.serviceAvailability.nextAvailableDate) {
      queryParam['cur'] = false;
    } else {
      queryParam['cur'] = true;
    }
    queryParam['customId'] = this.businessProfile.accEncUid;
    console.log(queryParam);
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam,
    };
    this.router.navigate(['consumer', 'checkin'], navigationExtras);
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
        this.showCheckin(current_provider['location'], current_provider['service']);
      } else if (result === 'showsignup') {
        // this.doSignup(passParam);
      } else {
        //this.loading = false;
      }
    });
  }
}
