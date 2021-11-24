import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from '../../constants/project-messages';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../business/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { GroupStorageService } from '../../services/group-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../business/shared/confirm-box/confirm-box.component';
import { WordProcessor } from '../../services/word-processor.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../constants/project-constants';
import { userContactInfoComponent } from '../../../business/modules/settings/general/users/user-contact-info/user-contact-info.component';
import { ConfirmBoxLocationComponent } from './confirm-box-location/confirm-box-location.component';

@Component({
  selector: 'app-user-service-change',
  templateUrl: './user-service-change.component.html',
  styleUrls: ['./user-service-change.component.css', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})

export class UserServiceChnageComponent implements OnInit {
  accountType: any;
  serviceList: any;
  services_selected: any = [];
  select_All = Messages.SELECT_ALL;
  public service_dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  service_displayedColumns = ['select', 'username', 'userType', 'availability', 'phonenumber', 'specialization', 'languages'];
  selection = new SelectionModel(true, []);
  uuid: any;
  source;
  selected = false;
  userId = '';
  selectedUser;
  selectrow = false;
  showDetails: any = [];
  loading = true;
  customer_label = '';
  provider_label = '';
  filter_sidebar = false;
  filterapplied = false;

  filter = {
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    pincode: '',
    primaryMobileNo: '',
    employeeId: '',
    email: '',
    available: ''
  };

  filters: any = {
    'firstName': false,
    'lastName': '',
    'city': false,
    'state': false,
    'pincode': false,
    'primaryMobileNo': false,
    'employeeId': false,
    'email': false,
    'available': false
  };
  languages_arr: any = [];
  specialization_arr: any = [];
  user;
  selectedLanguages: any = [];
  selectedSpecialization: any = [];
  filterApplied_count: any;
  allSelected: boolean;
  availabileSelected: boolean;
  notAvailabileSelected: boolean;
  accountSettings;
  contactDetailsdialogRef: any;
  checkin: any;
  userDetails:any;
  domain;
  locationsjson: any = [];
  subdomain: any;
  users_list: any = [];
  loc_list: any = [];
  selectedLocations: any = [];
  

  constructor(
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private wordProcessor: WordProcessor,
    public location: Location,
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.activated_route.params.subscribe(params => {
      this.uuid = params.id;
    });
    this.activated_route.queryParams.subscribe(qparams => {
      this.source = qparams.source;
    });
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = this.user.accountType;
    this.domain = this.user.sector;
    if (this.source === 'appt'){
      this.getApptDetails();
    } else  if (this.source == 'checkin'){
      this.getCheckinDetails();
    }
  
  }
  applyFilter(filterValue: string) {
    this.selection.clear();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.service_dataSource.filter = filterValue;
  }
  ngOnInit() {
    this.getProviderLocations().then(
      () => {
        this.getProviders(true);
      }
    )
    this.accountSettings = this.groupService.getitemFromGroupStorage('settings');
    this.getSpokenLanguages();
    // this.getSpecializations();
   
  }
  setSpecializationFilter(users_list: any) {
    const _this = this;
    const specialiationList = [];
    users_list.map(function (user) {
        if (user.specialization) {
            specialiationList.push(...user.specialization);
        }        
    })
    _this.specialization_arr = getUniqueListBy(specialiationList, 'name');
      function getUniqueListBy(arr, key) {
          return [...new Map(arr.map(item => [item[key], item])).values()]
      }
}
getLanguages(languages) {
  if (!languages) {
      return;
  }
  languages = JSON.parse(languages);
  for (let i = 0; i < languages.length; i++) {
      languages[i] = languages[i].charAt(0).toUpperCase() + languages[i].slice(1).toLowerCase();
  }
  languages = languages.toString();
  if (languages.length > 1) {
      languages = languages.replace(/,/g, ", ");
  }
  return languages;
}
   getProviders(from_init?) {
     const _this = this;
    let apiFilter = {};
    apiFilter = _this.setFilterForApi();
    apiFilter['userType-eq'] = 'PROVIDER';
    apiFilter['status-eq'] = 'ACTIVE';
    _this.provider_services.getUsers(apiFilter).subscribe(data => {
      _this.users_list = data;
      if (from_init) {
        _this.setSpecializationFilter(_this.users_list);
      }
      _this.users_list.map(function (user) {
        user.preferredLanguages = user.preferredLanguages ? _this.getLanguages(user.preferredLanguages) : '';
        return user
      })
      _this.users_list.map(function (user) {
          user.specialization = user.specialization ? user.specialization.map(spec => spec.displayName) : '';
          return user
      })
      _this.users_list.map(function(user) {
        const businessLocations = _this.locationsjson.filter(loc => user.userType==='PROVIDER' && !(user.bussLocations.indexOf(loc.id)<0));
        user.businessLocations = businessLocations.map(loc => loc.place);
        return user
      })
      // for(let user of this.users_list){
      //     if(user.userType == 'PROVIDER'){
      //         this.subdomain=user.subdomainName;
      //     }
      // }
      this.service_dataSource.data = this.users_list;
      this.filterApplied_count = this.service_dataSource.data.length;
    });
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.service_dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.service_dataSource.data.forEach(row => this.selection.select(row));
  }
  // setServiceDataSource(result) {
  //   const usersList: any = [];
  //   result.forEach(userObj => {
  //     let businessName = '';
  //     // let languages;
  //     // let specialization;
  //     businessName = (userObj.businessName) ? userObj.businessName : userObj.firstName + ' ' + userObj.lastName;
  //     // if (userObj.preferredLanguages) {
  //     //   languages = JSON.parse(userObj.preferredLanguages);
  //     //   for (var i = 0; i < languages.length; i++) {
  //     //     languages[i] = languages[i].charAt(0).toUpperCase() + languages[i].slice(1).toLowerCase();
  //     //   }
  //     // }
  //     // if (userObj.specialization) {
  //     //   for (let i = 0; i < userObj.specialization.length; i++) {
  //     //     const special = this.specialization_arr.filter(speciall => speciall.name === userObj.specialization[i]);
  //     //     if (special[0]) {
  //     //       userObj.specialization[i] = special[0].displayName;
  //     //     }
  //     //   }
  //     //   specialization = userObj.specialization.toString();
  //       // if (userObj.specialization.length > 1) {
  //       //   specialization = specialization.replace(/,/g, ", ");
  //       // }
  //     // }
  //     usersList.push(
  //       {
  //         'id': userObj.id,
  //         'businessName': businessName,
  //         'gender': userObj.gender,
  //         'userType': userObj.userType,
  //         'status': userObj.status,
  //         'mobileNo': userObj.mobileNo,
  //         'isAvailable': userObj.isAvailable,
  //         'specialization':userObj.specialization,
  //         'languages': userObj.preferredLanguages,
  //         'locationName': userObj.locationName,
  //         'profilePicture': userObj.profilePicture,
  //         'city': userObj.city,
  //         'employeeId': userObj.employeeId,
  //         'state': userObj.state,
  //         'currentWlCount': userObj.currentWlCount+userObj.currentApptCount,
  //         'whatsAppNum': (userObj.whatsAppNum) ? userObj.whatsAppNum  : '', 
  //         'telegramNum': (userObj.telegramNum) ? userObj.telegramNum  : '', 
  //         'countryCode':  userObj.countryCode || '',
  //         'firstName': userObj.firstName,
  //         'lastName': userObj.lastName,
  //         'email': userObj.email || '',
  //         'bussloc': userObj.bussLocations || ''
  //       });
  //   });
  //   return usersList;
  // }
  updateUser() {
    const businessName = this.selectedUser.businessName?this.selectedUser.businessName:(this.selectedUser.firstName + ' ' + this.selectedUser.lastName);
    let msg = '';
    if (!this.selectedUser.isAvailable && (this.selectedUser.id === 136239 || this.selectedUser.id === 9341)) {
      msg = this.selectedUser.businessName + ' seems to be unavailable now. Assign anyway ? ';
    } else {
      msg = 'Do you want to assign this ' + this.customer_label + ' to ' + businessName + '?';
    }
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        if (this.source == 'checkin') {
          const post_data = {
            'ynwUuid': this.uuid,
            'provider': {
              'id': this.userId
              // 'id': this.services_selected[0].id
            },
          };
          this.provider_services.updateUserWaitlist(post_data)
            .subscribe(
              data => {
                //this.router.navigate(['provider', 'check-ins']);
                this.location.back();
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
        else {
          const post_data = {
            'uid': this.uuid,
            'provider': {
              'id': this.userId
              // 'id': this.services_selected[0].id
            },
          };
          this.provider_services.updateUserAppointment(post_data)
            .subscribe(
              data => {
                // this.router.navigate(['provider', 'check-ins']);
                this.location.back();
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
      }
    });
  }
  redirecToReports() {
    // this.router.navigate(['provider', 'check-ins']);
    this.location.back();
  }
  selectedRow(index, user) {
    this.selectrow = true;
    this.selectedUser = user;
    if (this.selectrow === true && user.id) {
      if(user.bussLocations.length > 1){
        this.updateUserWithLocation(user)
      }
      else{
        this.updateUser()
      }
    }
    this.removeSelection();
    if (this.service_dataSource.data[index].selected === undefined || this.service_dataSource.data[index].selected === false) {
      this.userId = user.id;
      this.service_dataSource.data[index].selected = true;
    } else {
      this.userId = '';
      this.service_dataSource.data[index].selected = false;
    }
  }
  updateUserWithLocation(user) {
    let msg = '';
    if (!this.selectedUser.isAvailable && (this.user.id === 136239 || this.user.id === 9341)) {
      msg = this.selectedUser.businessName + ' seems to be unavailable now. Assign anyway ? ';
    } else {
     msg = 'Select the location of ' + this.selectedUser.businessName + ' to whom the '+ this.customer_label + ' ,' + this.userDetails + ' will be assigned';
      // msg = 'Do you want to assign this ' + this.customer_label + ' to ' + this.selectedUser.businessName + '?';
    }
    const dialogrefd = this.dialog.open(ConfirmBoxLocationComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message':msg,
        'user':user,
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        if (this.source == 'checkin') {
          const post_data = {
            'ynwUuid': this.uuid,
            'provider': {
              'id': this.userId
            },
            'location':{
              'id':result
            }
          };
        this.provider_services.updateUserWaitlist(post_data)
            .subscribe(
              data => {
                this.location.back();
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
        else {
          const post_data = {
            'uid': this.uuid,
            'provider': {
              'id': this.userId
            },
            'location':{
              'id': result
            }
          };
          this.provider_services.updateUserAppointment(post_data)
            .subscribe(
              data => {
                this.location.back();
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
      }
    });
  }
  removeSelection() {
    this.service_dataSource.data.map((question) => {
      return question.selected = false;
    });
  }
  getUserImg(user) {
    if (user.profilePicture) {
      const proImage = user.profilePicture;
      return proImage.url;
    } else if(user.gender ==='male'){
      return '../../.././assets/images/Asset1@300x.png';
  }
  else if(user.gender ==='female'){
      return '../../.././assets/images/Asset2@300x.png';
  }
  else{
      return '../../.././assets/images/Asset1@300x(1).png'; 
  }
  }
  showMoreorLess(event, index, type) {
    event.stopPropagation();
    this.showDetails = [];
    if (type === 'more') {
      this.showDetails[index] = true;
    }
  }
  stopprop(event) {
    event.stopPropagation();
}
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
    /* this.clearFilter(); */
  }
  clearFilter() {
    this.allSelected = false;
    this.availabileSelected = false;
    this.notAvailabileSelected = false;
    this.resetFilter();
    this.filterapplied = false;
    this.getProviders();
  }
  resetFilter() {
    this.filters = {
      'firstName': false,
      'lastName': false,
      'city': false,
      'state': false,
      'pincode': false,
      'primaryMobileNo': false,
      'employeeId': false,
      'email': false,
      'available': false
    };
    this.filter = {
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      pincode: '',
      primaryMobileNo: '',
      employeeId: '',
      email: '',
      available: ''
      
    };
    this.selectedSpecialization = [];
    this.selectedLanguages = [];
    this.selectedLocations = [];
  }
  doSearch() {
    // this.getProviders();
    if (this.filter.firstName || this.filter.lastName || this.filter.city || this.filter.state || this.filter.pincode || this.filter.email || this.filter.primaryMobileNo || this.filter.employeeId || this.filter.available || this.selectedLanguages.length > 0 || this.selectedLocations.length > 0 || this.selectedSpecialization.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.filter.firstName !== '') {
      api_filter['firstName-like'] = this.filter.firstName;
    }
    if (this.filter.lastName !== '') {
      api_filter['lastName-like'] = this.filter.lastName;
    }
    if (this.filter.city !== '') {
      api_filter['city-like'] = this.filter.city;
    }
    if (this.filter.state !== '') {
      api_filter['state-like'] = this.filter.state;
    }
    if (this.filter.pincode !== '') {
      api_filter['pinCode-eq'] = this.filter.pincode;
    }
    if (this.filter.available !== '') {
      api_filter['available-eq'] = this.filter.available;
    }
    if (this.filter.email !== '') {
      api_filter['email-eq'] = this.filter.email;
    }
    if (this.filter.employeeId !== '') {
      api_filter['employeeId-eq'] = this.filter.employeeId;
    }
    if (this.filter.primaryMobileNo !== '') {
      const pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
      const mval = pattern.test(this.filter.primaryMobileNo);
      if (mval) {
        api_filter['primaryMobileNo-eq'] = this.filter.primaryMobileNo;
      } else {
        this.filter.primaryMobileNo = '';
      }
    }
    if (this.selectedLocations.length > 0) {
      api_filter['businessLocs-eq'] = this.selectedLocations.toString();
    }
    if (this.selectedLanguages.length > 0) {
      api_filter['preferredLanguages-eq'] = this.selectedLanguages.toString();
    }
    if (this.selectedSpecialization.length > 0) {
      api_filter['specialization-eq'] = 'name::' + this.selectedSpecialization.toString();
    }
    return api_filter;
  }
  focusInput(ev) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      this.doSearch();
    }
  }
  getSpokenLanguages() {
    this.provider_services.getSpokenLanguages()
      .subscribe(data => {
        this.languages_arr = data;
      });
  }
  getSpecializations() {
    // let subDomain;
    // if (this.user.sector === 'healthCare') {
    //   if (this.user.subSector === 'hospital') {
    //     subDomain = 'physiciansSurgeons';
    //   } else if (this.user.subSector === 'dentalHosp') {
    //     subDomain = 'dentists';
    //   } else if (this.user.subSector === 'alternateMedicineHosp') {
    //     subDomain = 'alternateMedicinePractitioners';
    //   }
    // } else if (this.user.sector === 'personalCare') {
    //     if(this.user.subSector === 'beautyCare'){
    //       subDomain = 'beautyCare';
    //     } else if(this.user.subSector === 'personalFitness'){
    //       subDomain = 'personalFitness';
    //     }else if(this.user.subSector === 'massageCenters'){
    //       subDomain = 'massageCenters';
    //     }
      
    // } else if (this.user.sector === 'finance') {
    //   if(this.user.subSector === 'bank'){
    //     subDomain = 'bank';
    //   } else if(this.user.subSector === 'nbfc'){
    //     subDomain = 'nbfc';
    //   }else if(this.user.subSector === 'insurance'){
    //     subDomain = 'insurance';
    //   }
    // } else if (this.user.sector === 'veterinaryPetcare') {
    //   if (this.user.subSector === 'veterinaryhospital') {
    //     subDomain = 'veterinarydoctor';
    //   }
    // } else if (this.user.sector === 'retailStores') {
    //   if(this.user.subSector === 'groceryShops'){
    //     subDomain = 'groceryShops';
    //   } else if(this.user.subSector === 'supermarket'){
    //     subDomain = 'supermarket';
    //   }else if(this.user.subSector === 'hypermarket'){
    //     subDomain = 'hypermarket';
    //   }
    // } 
    // else if (this.user.sector === 'educationalInstitution') {
    //   if (this.user.subSector === 'educationalTrainingInstitute') {
    //     subDomain = 'educationalTrainingInstitute';
    //   } else if (this.user.subSector === 'schools') {
    //      subDomain = 'schools';
    //   } 
    //   else if (this.user.subSector === 'colleges') {
    //     subDomain = 'colleges';
    //  }
    // }
    // else if (this.user.sector === 'sportsAndEntertainement') {
    //   if (this.user.subSector === 'sports') {
    //     subDomain = 'sports';
    //   } else if (this.user.subSector === 'entertainment') {
    //       subDomain = 'entertainment';
    //    }  
    // }
    // this.provider_services.getSpecializations(this.user.sector, this.subdomain)
    //   .subscribe(data => {
    //     this.specialization_arr = data;
    //     this.getProviders();
    //   });
  }
  setFilterDataCheckbox(type, value) {
    if (type === 'languages') {
      const indx = this.selectedLanguages.indexOf(value);
      if (indx === -1) {
        this.selectedLanguages.push(value);
      } else {
        this.selectedLanguages.splice(indx, 1);
      }
    }
    if (type === 'location') {
      const indx = this.selectedLocations.indexOf(value);
      if (indx === -1) {
          this.selectedLocations.push(value);
      } else {
          this.selectedLocations.splice(indx, 1);
      }
    }
    if (type === 'specializations') {
      const indx = this.selectedSpecialization.indexOf(value);
      if (indx === -1) {
        this.selectedSpecialization.push(value);
      } else {
        this.selectedSpecialization.splice(indx, 1);
      }
    }
    if (type === 'available') {
      if(value === 'ALL'){
        this.allSelected = true;
        this.availabileSelected = false;
        this.notAvailabileSelected = false;
        this.filter.available = 'ALL';
      }
      else if(value === 'true'){
        this.allSelected = false;
        this.availabileSelected = true;
        this.notAvailabileSelected = false;
        this.filter.available = 'true';
      }
     else{
      this.allSelected = false;
      this.availabileSelected = false;
      this.notAvailabileSelected = true;
      this.filter.available = 'false';
     }
    }
    this.doSearch();
  }
  viewContactDetails(user) {
    this.contactDetailsdialogRef = this.dialog.open(userContactInfoComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
          userData: user
      }
    });
}
getApptDetails() {
  this.provider_services.getAppointmentById(this.uuid)
    .subscribe(
      data => {
        this.checkin = data;
        if(this.checkin.appmtFor){
        if (this.checkin.appmtFor[0].firstName && this.checkin.appmtFor[0].firstName !== null && this.checkin.appmtFor[0].firstName !== undefined && this.checkin.appmtFor[0].firstName !== '') {
          this.userDetails = this.checkin.appmtFor[0].firstName + ' ' + this.checkin.appmtFor[0].lastName;
        } else {
          if (this.checkin.appmtFor[0].memberJaldeeId) {
            this.userDetails = this.customer_label + ' : ' + this.checkin.appmtFor[0].memberJaldeeId;
          }
          if (this.checkin.appmtFor[0].jaldeeId) {
            this.userDetails = this.customer_label + ' : ' + this.checkin.appmtFor[0].jaldeeId;
          }
        }
      }
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
 }
 getCheckinDetails() {
  this.provider_services.getProviderWaitlistDetailById(this.uuid)
    .subscribe(
      data => {
        this.checkin = data;
        if(this.checkin.waitlistingFor){
          if (this.checkin.waitlistingFor[0].firstName && this.checkin.waitlistingFor[0].firstName !== null && this.checkin.waitlistingFor[0].firstName !== undefined && this.checkin.waitlistingFor[0].firstName !== '') {
            this.userDetails = this.checkin.waitlistingFor[0].firstName + ' ' + this.checkin.waitlistingFor[0].lastName;
          } else {
            if (this.checkin.waitlistingFor[0].memberJaldeeId) {
              this.userDetails = this.customer_label + 'id:' + this.checkin.waitlistingFor[0].memberJaldeeId;
            }
            if (this.checkin.waitlistingFor[0].jaldeeId) {
              this.userDetails = this.customer_label + 'id:' + this.checkin.waitlistingFor[0].jaldeeId;
            }
          }
        }
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  getProviderLocations() {
    const _this = this;
    return new Promise(function(resolve, reject) {
      _this.provider_services.getProviderLocations()
        .subscribe(data => {
          _this.locationsjson = data;
          for (const loc of _this.locationsjson) {
            if (loc.status === 'ACTIVE') {
                _this.loc_list.push(loc);
            }
        }
         resolve(true);
        }, ()=> {
          resolve(false);
        });
      })
  }
//   getBussLoc(bussloc){
//     for (let i = 0; i < bussloc.length; i++) {
//         const locations = this.locationsjson.filter(loc =>loc.id === bussloc[i]);
//         if (locations[0]) {
//             bussloc[i] = locations[0].place;
//         }
//     }
//     if (bussloc.length > 1) {
//         bussloc = bussloc.toString();
//         return bussloc.replace(/,/g, ", ");
//     }
//     return bussloc;
// }

}

