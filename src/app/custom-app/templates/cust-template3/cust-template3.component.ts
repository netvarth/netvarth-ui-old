import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BookingService } from '../../../shared/services/booking-service';
import { S3UrlProcessor } from '../../../shared/services/s3-url-processor.service';
import { CustomappService } from '../../customapp.service';


@Component({
  selector: 'app-cust-template3',
  templateUrl: './cust-template3.component.html',
  styleUrls: ['./cust-template3.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustTemplate3Component implements OnInit {

  templateJson: any;
  locationjson: any;
  showDepartments: any;
  terminologiesjson: any;
  apptSettings: any;
  businessProfile: any;
  donationServices: any;
  selectedLocation: any;

  loaded_donations = false;
  loaded_orders = false;
  loaded_appointments = false;
  loaded_checkins = false;

  donationServicesJson: any;
  apptServices: any = [];
  checkinServices: any = [];

  filteredApptServices: any;
  filteredCheckinServices: any;
  departments: any;
  galleryJson: any;
  // @Input() templateJson;
  // userId;
  // pSource;
  // loading = true;

  constructor(
    private customappService: CustomappService,
    private s3Processor: S3UrlProcessor,
    private bookingService: BookingService
  ) {

  }

  ngOnInit(): void {
    this.templateJson = this.customappService.getTemplateJson();
    console.log(this.templateJson);
    if (this.customappService.getDonationServices()) {
      this.donationServicesJson = this.s3Processor.getJson(this.customappService.getDonationServices());
    }
    console.log("Here");
    console.log("Locations:", this.customappService.getLocations());
    if (this.customappService.getLocations()) {
      this.locationjson = this.s3Processor.getJson(this.customappService.getLocations());
      this.selectedLocation = this.locationjson[0];
    }
    if (this.customappService.getAccountSettings()) {
      this.showDepartments = this.s3Processor.getJson(this.customappService.getAccountSettings()).filterByDept;
    }
    console.log("Template Json:", this.showDepartments);
    if (this.customappService.getTerminologies()) {
      this.terminologiesjson = this.s3Processor.getJson(this.customappService.getTerminologies());
    }
    if (this.customappService.getApptSettings()) {
      this.apptSettings = this.s3Processor.getJson(this.customappService.getApptSettings());
    }
    if (this.customappService.getBusinessProfile()) {
      this.businessProfile = this.s3Processor.getJson(this.customappService.getBusinessProfile());
    }
    if (this.customappService.getGallery()) {
      this.galleryJson = this.s3Processor.getJson(this.customappService.getGallery());
    }
    // if(this.templateJson.section1.gallery || this.templateJson.section2.gallery || this.templateJson.section3.gallery) {

    // }

    if (this.templateJson.section1.donations || this.templateJson.section2.donations || this.templateJson.section3.donations) {
      this.getDonationServices();
    }

    if (this.showDepartments) {
      let departmentsS3 = [];
      const depts = this.s3Processor.getJson(this.customappService.getDepartments());
      for (let dIndex = 0; dIndex < depts.length; dIndex++) {
        departmentsS3.push({ 'type': 'department', 'item': depts[dIndex] })
      }
      this.departments = departmentsS3;
    }

    this.changeLocation(this.selectedLocation);
  }

  getDonationServices() {
    this.donationServices = [];
    if (this.donationServicesJson && this.businessProfile.donationFundRaising && this.businessProfile.onlinePresence) {
      for (let dIndex = 0; dIndex < this.donationServicesJson.length; dIndex++) {
        this.donationServices.push({ 'type': 'donation', 'item': this.donationServicesJson[dIndex] });
      }
      this.loaded_donations = true;
      console.log("Loaded:", this.donationServices);
    }
  }

  getAppointmentServices(locationId) {
    const _this = this;
    const apptServiceList = [];
    _this.bookingService.getAppointmentServices(locationId).then(
      (appointmentServices: any) => {
        for (let aptIndex = 0; aptIndex < appointmentServices.length; aptIndex++) {
          apptServiceList.push({ 'type': 'appt', 'item': appointmentServices[aptIndex] });
        }
        _this.apptServices = apptServiceList;
        _this.filteredApptServices = apptServiceList;
        _this.loaded_appointments = true;
      }, (error) => {
        _this.apptServices = apptServiceList;
        _this.loaded_appointments = true;
      }
    );
  }

  getCheckinServices(locationId) {
    const self = this;
    const checkinServiceList = [];
    self.bookingService.getCheckinServices(locationId).then(
      (checkinServices: any) => {
        console.log("CheckinServices:", checkinServices);
        for (let wlIndex = 0; wlIndex < checkinServices.length; wlIndex++) {
          checkinServiceList.push({ 'type': 'waitlist', 'item': checkinServices[wlIndex] });
        }
        self.filteredCheckinServices = checkinServiceList;
        self.checkinServices = checkinServiceList;
        self.loaded_checkins = true;
      }, (error) => {
        self.filteredCheckinServices = checkinServiceList;
        self.checkinServices = checkinServiceList;
        self.loaded_checkins = true;
      }
    );
  }

  /**
   * 
   * @param loc
   */
  changeLocation(loc) {
    this.selectedLocation = loc;

    if (this.templateJson.section1.appointments || this.templateJson.section2.appointments || this.templateJson.section3.appointments) {
      this.getAppointmentServices(this.selectedLocation.id);
    }

    if (this.templateJson.section1.checkins || this.templateJson.section2.checkins || this.templateJson.section3.checkins) {
      this.getCheckinServices(this.selectedLocation.id);
    }
    // // this.filteredUsers = [];
    // this.loading = true;
    // console.log("ChangeLocation:", loc);
    // this.selectedLocation = loc;
    // this.getAppointmentServices(this.selectedLocation.id).then(
    //   (status) => {
    //     if (status) {
    //       this.getCheckinServices(this.selectedLocation.id);
    //     } else {
    //       this.filteredApptServices = [];
    //       this.checkinServices = [];
    //       this.loading = false;
    //     }
    //   }
    // );
  }

}
