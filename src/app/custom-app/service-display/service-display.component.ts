import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckavailabilityComponent } from '../../shared/components/checkavailability/checkavailability.component';
import { ServiceDetailComponent } from '../../shared/components/service-detail/service-detail.component';
import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { BookingService } from '../../shared/services/booking-service';
import { AuthService } from '../../shared/services/auth-service';
import { NavigationExtras, Router } from '@angular/router';
import { ConsumerJoinComponent } from '../../ynw_consumer/components/consumer-join/join.component';

@Component({
  selector: 'app-service-display',
  templateUrl: './service-display.component.html',
  styleUrls: ['./service-display.component.css']
})
export class ServiceDisplayComponent implements OnInit {

  @Input() locationjson;
  @Input() showDepartments;
  @Input() terminologiesjson;
  @Input() templateJson;
  @Input() apptSettings;
  @Input() businessProfile;

  selectedLocation;
  selectedUserBranch;
  selectedServicesBranch;

  accountId: any;

  services: any = [];
  filteredServices: any;
  filteredUsers: any;
  users: any[];
  branches: any[];
  userLocation: any;
  availabilityDialogref: any;
  apptSettingsJson: any;
  serviceDialogRef: any;
  serverDate: any;
  // donationServices;

  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private dateTimeProcessor: DateTimeProcessor,
    private lStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.businessProfile);
    this.serverDate = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.changeLocation(this.locationjson[0]);
  }

  /**
   * 
   * @param loc
   */
  changeLocation(loc) {
    this.selectedLocation = loc;
    this.generateServicesAndDoctorsForLocation(this.selectedLocation.id);
  }


  /**
   * 
   * @param locationId 
   */
  generateServicesAndDoctorsForLocation(locationId: any) {
    this.bookingService.getCheckinServices(locationId).then(
      (checkinServices: any) => {
        this.bookingService.getAppointmentServices(locationId)
          .then((appointmentServices: any) => {
            this.setServiceUserDetails(checkinServices, appointmentServices);
          },
            error => {

              // this.wordProcessor.apiErrorAutoHide(this, error);
            });
      },
      error => {
        // this.wordProcessor.apiErrorAutoHide(this, error);
      });
  }

  setServiceUserDetails(checkinServices, appointmentServices) {
    this.services = [];
    if (appointmentServices) {
      for (let aptIndex = 0; aptIndex < appointmentServices.length; aptIndex++) {
        this.services.push({ 'type': 'appt', 'item': appointmentServices[aptIndex] });
      }
    }
    if (checkinServices) {
      for (let wlIndex = 0; wlIndex < checkinServices.length; wlIndex++) {
        this.services.push({ 'type': 'waitlist', 'item': checkinServices[wlIndex] });
      }
    }
    this.filteredServices = this.services;
    // this.users = [];
    // this.branches = [];
    // console.log(this.deptUsers);
    // for (let dIndex = 0; dIndex < this.deptUsers.length; dIndex++) {
    //   const deptItem = {};
    //   deptItem['departmentName'] = this.deptUsers[dIndex]['departmentName'];
    //   deptItem['departmentCode'] = this.deptUsers[dIndex]['departmentCode'];
    //   deptItem['departmentId'] = this.deptUsers[dIndex]['departmentId'];
    //   // deptItem['departmentItems'] = [];
    //   if (this.showDepartments) {
    //     this.branches.push(deptItem);
    //     for (let pIndex = 0; pIndex < this.deptUsers[dIndex]['users'].length; pIndex++) {
    //       const userWaitTime = this.waitlisttime_arr.filter(time => time.provider.id === this.deptUsers[dIndex]['users'][pIndex].id);
    //       const userApptTime = this.appttime_arr.filter(time => time.provider.id === this.deptUsers[dIndex]['users'][pIndex].id);
    //       this.deptUsers[dIndex]['users'][pIndex]['waitingTime'] = userWaitTime[0];
    //       this.deptUsers[dIndex]['users'][pIndex]['apptTime'] = userApptTime[0];
    //       // deptItem['departmentItems'].push({ 'type': 'provider', 'item': this.deptUsers[dIndex]['users'][pIndex] });
    //       this.users.push({ 'type': 'provider', 'item': this.deptUsers[dIndex]['users'][pIndex] });
    //       console.log(pIndex);
    //       console.log(this.users);
    //       this.userCount++;
    //     }
    //   } else {
    //     const userWaitTime = this.waitlisttime_arr.filter(time => time.provider.id === this.deptUsers[dIndex].id);
    //     const userApptTime = this.appttime_arr.filter(time => time.provider.id === this.deptUsers[dIndex].id);
    //     this.deptUsers[dIndex]['waitingTime'] = userWaitTime[0];
    //     this.deptUsers[dIndex]['apptTime'] = userApptTime[0];
    //     // deptItem['departmentItems'].push({ 'type': 'provider', 'item': this.deptUsers[dIndex] });
    //     this.users.push({ 'type': 'provider', 'item': this.deptUsers[dIndex] });
    //     this.userCount++;
    //   }
    //   this.filteredUsers = this.users;
    // }
    // if (this.users.length > 0) {
    //   this.showUserSection = true;
    // }
  }

  changeBranch(selectedBranch, type) {
    this.userLocation = '';
    if (selectedBranch === '') {
      if (type === 'services') {
        this.selectedServicesBranch = '';
        this.filteredServices = this.services;
      } else if (type === 'user') {
        this.selectedUserBranch = '';
        this.filteredUsers = this.users;
      }
    } else {
      if (type === 'services') {
        this.selectedServicesBranch = selectedBranch;
        this.filteredServices = this.services.filter(service => service.item.department === selectedBranch.departmentId);
      } else if (type === 'user') {
        this.selectedUserBranch = selectedBranch;
        this.filteredUsers = this.users.filter(user => user.item.deptId === selectedBranch.departmentId);
      }
    }
  }
  filterUserByLocName(locationName) {
    // const users = this.users;
    let filteredUsers = this.users;
    console.log(filteredUsers);
    if (this.selectedUserBranch) {
      filteredUsers = filteredUsers.filter(user => user.item.deptId === this.selectedUserBranch.departmentId)
    }
    if (locationName && locationName.trim() !== '') {
      filteredUsers = filteredUsers.filter(user => user.item.locationName.includes(locationName));
    }
    console.log(filteredUsers);
    this.filteredUsers = filteredUsers;

  }

  cardClicked(actionObj) {

    console.log(actionObj);

    if (actionObj['type'] == 'checkavailability') {
      this.checkAvailableSlots(actionObj);
    } else if (actionObj['type'] === 'appt') {
      if (actionObj['action'] === 'view') {
        this.showServiceDetail(actionObj['service'], this.businessProfile.businessName);
      } else {
        this.appointmentClicked(actionObj['location'], actionObj['service']);
      }
    } else if(actionObj['type'] === 'waitlist') {
        if (actionObj['action'] === 'view') {
          this.showServiceDetail(actionObj['service'], this.businessProfile.businessName);
        } else {
          this.checkinClicked(actionObj['location'], actionObj['service']);
        }
    }
    //   } else if (actionObj['type'] === 'appt') {
    //     if (actionObj['action'] === 'view') {
    //       this.showServiceDetail(actionObj['service'], this.businessjson.businessName);
    //     } else {
    //       this.appointmentClicked(actionObj['location'], actionObj['service']);
    //     }
    //   } else if (actionObj['type'] === 'donation') {
    //     if (actionObj['action'] === 'view') {
    //       this.showServiceDetail(actionObj['service'], this.businessjson.businessName);
    //     } else {
    //       this.payClicked(actionObj['location'].id, actionObj['location'].place, new Date(), actionObj['service']);
    //     }
    //   } else if (actionObj['type'] === 'item') {
    //     if (actionObj['action'] === 'view') {
    //       this.itemDetails(actionObj['service']);
    //     } else if (actionObj['action'] === 'add') {
    //       this.increment(actionObj['service']);
    //     } else if (actionObj['action'] === 'remove') {
    //       this.decrement(actionObj['service']);
    //     }
    //   } else {
    //     this.providerDetClicked(actionObj['userId']);
    //   }
  }
  checkAvailableSlots(actionObj) {
    this.availabilityDialogref = this.dialog.open(CheckavailabilityComponent, {
      width: '90%',
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
      queryParam['cur']  = false;
    } else {
      queryParam['cur']  = true;
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
        if (passParam['callback'] === 'appointment') {
          this.showAppointment(current_provider['location'], current_provider['service']);
        } else {
            this.showCheckin(current_provider['location'],current_provider['service']);
        }
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
      queryParam['cur']  = false;
    } else {
      queryParam['cur']  = true;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.router.navigate(['consumer', 'appointment'], navigationExtras);
  }
}
