import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../shared/services/auth-service';
import { SearchDetailServices } from '../../../shared/components/search-detail/search-detail-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { BookingService } from '../../../shared/services/booking-service';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { S3UrlProcessor } from '../../../shared/services/s3-url-processor.service';
import { CustomappService } from '../../customapp.service';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { MatDialog } from '@angular/material/dialog';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';


@Component({
  selector: 'app-cust-template4',
  templateUrl: './cust-template4.component.html',
  styleUrls: ['./cust-template4.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustTemplate4Component implements OnInit {
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
  onlineUsers: any;
  settings: any;
  waitlisttime_arr: any = [];
  appttime_arr: any = [];
  deptUsers: any;
  // @Input() templateJson;
  // userId;
  // pSource;
  // loading = true;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  server_date: any;
  constructor(
    private customappService: CustomappService,
    private s3Processor: S3UrlProcessor,
    private bookingService: BookingService,
    private dateTimeProcessor: DateTimeProcessor,
    private searchdetailserviceobj: SearchDetailServices,
    private authService: AuthService,
    private dialog: MatDialog
  ) {

  }
  setSystemDate() {
    this.customappService.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
        });
  }
  ngOnInit(): void {
    this.setSystemDate();
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
      this.settings = this.s3Processor.getJson(this.customappService.getAccountSettings());
      this.showDepartments = this.settings.filterByDept;
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
    if (this.customappService.getUsers()) {
      this.deptUsers = this.s3Processor.getJson(this.customappService.getUsers());
      this.setUserWaitTime();
      this.setUsers(this.deptUsers);
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
  setUserWaitTime() {
    let apptTimearr = [];
    let waitTimearr = [];
    if (this.deptUsers && this.deptUsers.length > 0) {
      for (let dept of this.deptUsers) {
        if (!this.showDepartments) {
          apptTimearr.push({ 'locid': this.businessProfile.id + '-' + this.locationjson[0].id + '-' + dept.id });
          waitTimearr.push({ 'locid': dept.id + '-' + this.locationjson[0].id });
        } else {
          if (dept.users && dept.users.length > 0) {
            for (let user of dept.users) {
              apptTimearr.push({ 'locid': this.businessProfile.id + '-' + this.locationjson[0].id + '-' + user.id });
              waitTimearr.push({ 'locid': user.id + '-' + this.locationjson[0].id });
            }
          }
        }
      }
    }
    this.getUserApptTime(apptTimearr, waitTimearr);
  }
  getAvailableSlot(slots) {
    let slotAvailable = '';
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].active) {
        slotAvailable = this.getSingleTime(slots[i].time);
        break;
      }
    }
    return slotAvailable;
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  getUserApptTime(provids_locid, waitTimearr) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getUserApptTime(post_provids_locid)
        .subscribe(data => {
          this.appttime_arr = data;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const dd = today.getDate();
          const mm = today.getMonth() + 1; // January is 0!
          const yyyy = today.getFullYear();
          let cday = '';
          if (dd < 10) {
            cday = '0' + dd;
          } else {
            cday = '' + dd;
          }
          let cmon;
          if (mm < 10) {
            cmon = '0' + mm;
          } else {
            cmon = '' + mm;
          }
          const dtoday = yyyy + '-' + cmon + '-' + cday;
          for (let i = 0; i < this.appttime_arr.length; i++) {
            if (this.appttime_arr[i]['availableSlots']) {
              this.appttime_arr[i]['caption'] = 'Next Available Time';
              if (dtoday === this.appttime_arr[i]['availableSlots']['date']) {
                this.appttime_arr[i]['date'] = 'Today' + ', ' + this.getAvailableSlot(this.appttime_arr[i]['availableSlots'].availableSlots);
              } else {
                this.appttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.appttime_arr[i]['availableSlots']['date'], { 'rettype': 'monthname' }) + ', '
                  + this.getAvailableSlot(this.appttime_arr[i]['availableSlots'].availableSlots);
              }
            }
          }
          this.getUserWaitingTime(waitTimearr);
        });
    }
  }
  getUserWaitingTime(provids) {
    if (provids.length > 0) {
      const post_provids: any = [];
      for (let i = 0; i < provids.length; i++) {
        post_provids.push(provids[i].locid);
      }
      if (post_provids.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getUserEstimatedWaitingTime(post_provids)
        .subscribe(data => {
          this.waitlisttime_arr = data;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const dd = today.getDate();
          const mm = today.getMonth() + 1; // January is 0!
          const yyyy = today.getFullYear();
          let cday = '';
          if (dd < 10) {
            cday = '0' + dd;
          } else {
            cday = '' + dd;
          }
          let cmon;
          if (mm < 10) {
            cmon = '0' + mm;
          } else {
            cmon = '' + mm;
          }
          const dtoday = yyyy + '-' + cmon + '-' + cday;
          for (let i = 0; i < this.waitlisttime_arr.length; i++) {
            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              if (!this.waitlisttime_arr[i]['nextAvailableQueue']['openNow']) {
                this.waitlisttime_arr[i]['caption'] = 'Next Available Time ';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.waitlisttime_arr[i]['date'] = 'Today' + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  } else {
                    this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                      + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  }
                } else {
                  this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.dateTimeProcessor.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
              } else {
                this.waitlisttime_arr[i]['caption'] = 'Est Wait Time'; // 'Estimated Waiting Time';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.waitlisttime_arr[i]['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.waitlisttime_arr[i]['date'] = 'Today' + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  } else {
                    this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                      + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  }
                }
              }
            }
          }
          this.setUsers(this.deptUsers);
        });
    }
  }
  setUsers(deptUsers) {
    this.onlineUsers = [];
    if (this.showDepartments) {
      for (let dIndex = 0; dIndex < deptUsers.length; dIndex++) {
        // const deptItem = {};
        // deptItem['departmentName'] = deptUsers[dIndex]['departmentName'];
        // deptItem['departmentCode'] = deptUsers[dIndex]['departmentCode'];
        // deptItem['departmentId'] = deptUsers[dIndex]['departmentId'];
        // deptItem['departmentItems'] = [];
        if (this.settings.enabledWaitlist || this.apptSettings.enableAppt) {
          for (let pIndex = 0; pIndex < deptUsers[dIndex]['users'].length; pIndex++) {
            const userWaitTime = this.waitlisttime_arr.filter(time => time.provider.id === deptUsers[dIndex]['users'][pIndex].id);
            const userApptTime = this.appttime_arr.filter(time => time.provider.id === deptUsers[dIndex]['users'][pIndex].id);
            deptUsers[dIndex]['users'][pIndex]['waitingTime'] = userWaitTime[0];
            deptUsers[dIndex]['users'][pIndex]['apptTime'] = userApptTime[0];
            this.onlineUsers.push({ 'type': 'provider', 'item': deptUsers[dIndex]['users'][pIndex] });
            // this.userCount++;
          }
        }
        // this.onlineUsers.push(deptItem);
      }
    } else {
      if (this.settings.enabledWaitlist || this.apptSettings.enableAppt) {
          for (let dIndex = 0; dIndex < deptUsers.length; dIndex++) {
            deptUsers[dIndex]['waitingTime'] = this.waitlisttime_arr[dIndex];
            deptUsers[dIndex]['apptTime'] = this.appttime_arr[dIndex];
            this.onlineUsers.push({ 'type': 'provider', 'item': deptUsers[dIndex] });
            // this.userCount++;
          }
      }
    }
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
    console.log("Loc Id:", locationId);
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
        mode: 'dialog',
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        // this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        // if (passParam['callback'] === 'communicate') {
        //   
        // } else if (passParam['callback'] === 'history') {
        //   this.redirectToHistory();
        // } else 
        if (passParam['callback'] === 'communicate') {
          this.showCommunicate(passParam['providerId']);
        } 
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
        // this.loading = false;
      }
    });
  }
  showCommunicate(provid) {
    const dialogRef  = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'loginmainclass', 'smallform'],
      disableClose: true,
      data: {
        caption: 'Enquiry',
        user_id: provid,
        userId: provid,
        source: 'consumer-common',
        type: 'send',
        terminologies: this.terminologiesjson,
        name: this.businessProfile.businessName,
        typeOfMsg: 'single',
        theme: this.templateJson['theme']
      }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }
  communicateHandler() {
    const _this = this;
    // _this.loading = true;
    _this.authService.goThroughLogin().then(
      (status) => {
        if (status) {
          _this.showCommunicate(this.businessProfile.id);
        } else {
          const passParam = { callback: 'communicate' };
          this.doLogin('consumer', passParam);
        }
      });
    // const _this = this;
    // const providforCommunicate = this.provider_bussiness_id;
    // _this.goThroughLogin().then(
    //   (status) => {
    //     if (status) {
    //       _this.showCommunicate(providforCommunicate);

    //     } else {
    //       const passParam = { callback: 'communicate', providerId: providforCommunicate, provider_name: name };
    //       this.doLogin('consumer', passParam);
    //     }
    //   }
    // );
  }
}
