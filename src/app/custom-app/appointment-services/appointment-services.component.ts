import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

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
  @Input() config;
  @Input() cardName;

  services;
  serverDate: any;

  constructor(
    private dateTimeProcessor: DateTimeProcessor,
    private router: Router,
    private lStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.serverDate = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.services = this.filteredServices;
  }

  ngOnChanges(): void {
    this.services = this.filteredServices;
  }

  cardClicked(actionObj) {
    if (actionObj['type'] === 'appt') {
      if (actionObj['action'] === 'view') {
        console.log(this.businessProfile);
        console.log(this.businessProfile.accEncUid);
        console.log(actionObj['service']);
        console.log(actionObj['service'].id);
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
        this.appointmentClicked(actionObj['location'], actionObj['service']);
      }
    } else {
      this.providerDetClicked(actionObj['userId']);
    }
  }
  providerDetClicked(userId) {
    this.router.navigate([this.businessProfile.accEncUid, userId]);
  }
  appointmentClicked(location, service: any) {
    const _this = this;
    _this.showAppointment(location, service);
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
    if (location.time) {
      queryParam['ctime'] = location.time
    }
    if (location.date) {
      queryParam['cdate'] = location.date
      service.serviceAvailability.nextAvailableDate = location.date
    }
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
}
