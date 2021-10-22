

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
// import { userContactInfoComponent } from '../../../business/modules/settings/general/users/user-contact-info/user-contact-info.component';
import { TeamMembersComponent } from './team-members/team-members.component';

@Component({
  selector: 'app-assign-team',
  templateUrl: './assign-team.component.html',
  styleUrls: ['./assign-team.component.css', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})

export class AssignTeam implements OnInit {
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
    available: ''
  };

  filters: any = {
    'firstName': false,
    'lastName': '',
    'city': false,
    'state': false,
    'pincode': false,
    'primaryMobileNo': false,
    'available': false
  };
  languages_arr: any = [];
  specialization_arr: any = [];
  user;
  selectedLanguages: any = [];
  selectedGroups: any = [];
  selectedSpecialization: any = [];
  filterApplied_count: any;
  allSelected: boolean;
  availabileSelected: boolean;
  notAvailabileSelected: boolean;
  accountSettings;
  contactDetailsdialogRef: any;
  groups: any;

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
  }
  applyFilter(filterValue: string) {
    this.selection.clear();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.service_dataSource.filter = filterValue;
  }
  ngOnInit() {
    this.accountSettings = this.groupService.getitemFromGroupStorage('settings');
    this.getSpokenLanguages();
    this.getProviders();
    // this.getSpecializations();
  }
  // getProvidersByTeam() {
  //   let apiFilter = {};
  //   apiFilter = this.setFilterForApi();
  //   // apiFilter['userType-eq'] = 'PROVIDER';
  //   // apiFilter['status-eq'] = 'ACTIVE';
  //   this.provider_services.getUsers(apiFilter).subscribe(data => {
  //     this.service_dataSource.data = this.setServiceDataSource(data);
  //     this.filterApplied_count = this.service_dataSource.data.length;
  //   });
  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 500);
  // }

  getProviders() {

    this.provider_services.getTeamGroup().subscribe((data: any) => {
      this.groups = data;
     this.service_dataSource.data = this.setServiceDataSource(data);
      this.filterApplied_count = this.service_dataSource.data.length;
         setTimeout(() => {
      this.loading = false;
    }, 500);

 
  
    });
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
  setServiceDataSource(result) {
    const service_list: any = [];
    result.forEach(serviceObj => {
    //   let businessName = '';
    //   let languages;
    //   let specialization;
    //   businessName = (serviceObj.businessName) ? serviceObj.businessName : serviceObj.firstName + ' ' + serviceObj.lastName;
    //   if (serviceObj.preferredLanguages) {
    //     languages = JSON.parse(serviceObj.preferredLanguages);
    //     for (var i = 0; i < languages.length; i++) {
    //       languages[i] = languages[i].charAt(0).toUpperCase() + languages[i].slice(1).toLowerCase();
    //     }
    //   }
    //   if (serviceObj.specialization) {
    //     for (let i = 0; i < serviceObj.specialization.length; i++) {
    //       const special = this.specialization_arr.filter(speciall => speciall.name === serviceObj.specialization[i]);
    //       if (special[0]) {
    //         serviceObj.specialization[i] = special[0].displayName;
    //       }
    //     }
    //     specialization = serviceObj.specialization.toString();
    //     if (serviceObj.specialization.length > 1) {
    //       specialization = specialization.replace(/,/g, ", ");
    //     }
    //   }
      service_list.push(
        {
          'description': serviceObj.description,
          'id': serviceObj.id,
          'name': serviceObj.name ,
          'size': serviceObj.size ,      
          'status': serviceObj.status,
          'users': serviceObj.users
        });
    });
    return service_list;
  }
  updateUser() {
    let msg = '';
    if (this.selectedUser.status === 'ACTIVE') {
      msg = 'Do you want to assign this ' + this.customer_label + ' to ' + this.selectedUser.name + ' team ?';
    } else {
      msg = this.selectedUser.name + 'team  seems to be unavailable now. Assign anyway ? ';
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
            'teamId': this.userId
          };
          this.provider_services.updateTeamWaitlist(post_data)
            .subscribe(
              data => {
                //this.router.navigate(['provider', 'check-ins']);
                this.snackbarService.openSnackBar('Assigned team successfully', { 'panelclass': 'snackbarerror' });
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
            'teamId': this.userId
            
          };
          this.provider_services.updateTeamAppointment(post_data)
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
      this.updateUser()
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
  removeSelection() {
    this.service_dataSource.data.map((question) => {
      return question.selected = false;
    });
  }
  getUserImg(user) {
    console.log(user);
    if (user.profilePicture) {
      const proImage = user.profilePicture;
      return proImage.url;
    } else if(user.gender === 'female'){
      // return '../../.././assets/images/unnamed.png';
      return '../../.././assets/images/avatar5.png';
    }
    else if(user.gender === 'male'){
      return '../../.././assets/images/avatar5.png';
    }
    else{
      return '../../.././assets/images/avatar5.png';
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
      'available': false
    };
    this.filter = {
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      pincode: '',
      primaryMobileNo: '',
      available: ''
      
    };
    this.selectedSpecialization = [];
    this.selectedLanguages = [];
    this.selectedGroups = [];
  }
  doSearch() {
    // this.getProviders();
    // this.getProvidersByTeam();
    if (this.filter.firstName || this.filter.lastName || this.filter.city || this.filter.state || this.filter.pincode || this.filter.primaryMobileNo || this.filter.available || this.selectedLanguages.length > 0 || this.selectedGroups.length > 0 || this.selectedSpecialization.length > 0) {
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
    if (this.filter.primaryMobileNo !== '') {
      const pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
      const mval = pattern.test(this.filter.primaryMobileNo);
      if (mval) {
        api_filter['primaryMobileNo-eq'] = this.filter.primaryMobileNo;
      } else {
        this.filter.primaryMobileNo = '';
      }
    }
    if (this.selectedLanguages.length > 0) {
      api_filter['spokenlangs-eq'] = this.selectedLanguages.toString();
    }
    if (this.selectedGroups.length > 0) {
      api_filter['teams-eq'] = this.selectedGroups.toString();
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
    let subDomain;
    if (this.user.sector === 'healthCare') {
      if (this.user.subSector === 'hospital') {
        subDomain = 'physiciansSurgeons';
      } else if (this.user.subSector === 'dentalHosp') {
        subDomain = 'dentists';
      } else if (this.user.subSector === 'alternateMedicineHosp') {
        subDomain = 'alternateMedicinePractitioners';
      } else if (this.user.subSector === 'hoslisticHealth') {
        subDomain = 'physiciansSurgeons';
      }
    } else if (this.user.sector === 'personalCare') {
      subDomain = 'beautyCare';
    } else if (this.user.sector === 'finance') {
      subDomain = 'bank';
    } else if (this.user.sector === 'veterinaryPetcare') {
      if (this.user.subSector === 'veterinaryhospital') {
        subDomain = 'veterinarydoctor';
      }
    } else if (this.user.sector === 'retailStores') {
      subDomain = 'groceryShops';
    }
    this.provider_services.getSpecializations(this.user.sector, subDomain)
      .subscribe(data => {
        this.specialization_arr = data;
        this.getProviders();
      });
  }
  setFilterDataCheckbox(type, value) {
    if (type === 'languages') {
      const indx = this.selectedLanguages.indexOf(value);
      if (indx === -1) {
        this.selectedLanguages.push(value);
      } else {
        this.selectedLanguages.splice(indx, 1);
      }
    } if (type === 'group') {
      const indx = this.selectedGroups.indexOf(value);
      if (indx === -1) {
        this.selectedGroups.push(value);
      } else {
        this.selectedGroups.splice(indx, 1);
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
    this.contactDetailsdialogRef = this.dialog.open(TeamMembersComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
          userData: user
      }
    });
}
}
