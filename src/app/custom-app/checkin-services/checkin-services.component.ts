import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';

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
  @Input() cardName;
  serverDate: any;
  services;

  constructor(private dateTimeProcessor: DateTimeProcessor,
    private router: Router,
    private lStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.serverDate = this.lStorageService.getitemfromLocalStorage('sysdate');
  }

  ngOnChanges(): void {
    this.services = this.filteredServices;
  }
  cardClicked(actionObj) {
    if (actionObj['type'] === 'waitlist') {
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
        this.checkinClicked(actionObj['location'], actionObj['service']);
      }
    } else {
      this.providerDetClicked(actionObj['userId']);
    }
  }
  providerDetClicked(userId) {
    this.router.navigate([this.businessProfile.accEncUid, userId]);
  }
  checkinClicked(location, service) {
    this.showCheckin(location, service);
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
}
