import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from '../../shared/services/booking-service';

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
  @Input() donationServicesJson;

  selectedLocation;
  selectedUserBranch;
  selectedServicesBranch;

  apptServices: any = [];
  checkinServices: any = [];

  filteredApptServices: any;
  filteredCheckinServices: any;

  filteredUsers: any;
  users: any[];
  branches: any[];
  userLocation: any;

  apptSettingsJson: any;
  serviceDialogRef: any;
  donationServices: any = [];

  constructor(
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    console.log(this.businessProfile);
    this.getDonationServices();
    this.changeLocation(this.locationjson[0]);
  }

  /**
   * 
   * @param loc
   */
  changeLocation(loc) {
    this.selectedLocation = loc;
    this.getAppointmentServices(this.selectedLocation.id);
    this.getCheckinServices(this.selectedLocation.id);
  }

  getAppointmentServices(locationId) {
    this.bookingService.getAppointmentServices(locationId).then(
      (appointmentServices: any) => {
        for (let aptIndex = 0; aptIndex < appointmentServices.length; aptIndex++) {
          this.apptServices.push({ 'type': 'appt', 'item': appointmentServices[aptIndex] });
        }
        this.filteredApptServices = this.apptServices;
      }
    );
  }

  getCheckinServices(locationId) {
    this.bookingService.getCheckinServices(locationId).then(
      (checkinServices: any) => {
        for (let wlIndex = 0; wlIndex < checkinServices.length; wlIndex++) {
          this.checkinServices.push({ 'type': 'waitlist', 'item': checkinServices[wlIndex] });
        }
        this.filteredCheckinServices = this.checkinServices;
      }
    );
  }

  getDonationServices() {
    this.donationServices = [];
    if (this.donationServicesJson && this.businessProfile.donationFundRaising && this.businessProfile.onlinePresence) {
      for (let dIndex = 0; dIndex < this.donationServicesJson.length; dIndex++) {
        this.donationServices.push({ 'type': 'donation', 'item': this.donationServicesJson[dIndex] });
      }
    }
  }

  changeBranch(selectedBranch, type) {
    this.userLocation = '';
    if (selectedBranch === '') {
      if (type === 'services') {
        this.selectedServicesBranch = '';
        this.filteredApptServices = this.apptServices;
        this.filteredCheckinServices = this.checkinServices;
      } else if (type === 'user') {
        this.selectedUserBranch = '';
        this.filteredUsers = this.users;
      }
    } else {
      if (type === 'services') {
        this.selectedServicesBranch = selectedBranch;
        this.filteredApptServices =  this.apptServices.filter(service => service.item.department === selectedBranch.departmentId);
        this.filteredCheckinServices = this.checkinServices.filter(service => service.item.department === selectedBranch.departmentId);
      } else if (type === 'user') {
        this.selectedUserBranch = selectedBranch;
        this.filteredUsers = this.users.filter(user => user.item.deptId === selectedBranch.departmentId);
      }
    }
  }
  filterUserByLocName(locationName) {
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

//   cardClicked(actionObj) {
//     console.log(actionObj);
//     //   } else if (actionObj['type'] === 'appt') {
//     //     if (actionObj['action'] === 'view') {
//     //       this.showServiceDetail(actionObj['service'], this.businessjson.businessName);
//     //     } else {
//     //       this.appointmentClicked(actionObj['location'], actionObj['service']);
//     //     }
//     //   } else if (actionObj['type'] === 'donation') {
//     //     if (actionObj['action'] === 'view') {
//     //       this.showServiceDetail(actionObj['service'], this.businessjson.businessName);
//     //     } else {
//     //       this.payClicked(actionObj['location'].id, actionObj['location'].place, new Date(), actionObj['service']);
//     //     }
//     //   } else if (actionObj['type'] === 'item') {
//     //     if (actionObj['action'] === 'view') {
//     //       this.itemDetails(actionObj['service']);
//     //     } else if (actionObj['action'] === 'add') {
//     //       this.increment(actionObj['service']);
//     //     } else if (actionObj['action'] === 'remove') {
//     //       this.decrement(actionObj['service']);
//     //     }
//     //   } else {
//     //     this.providerDetClicked(actionObj['userId']);
//     //   }
//   }
// }
}
