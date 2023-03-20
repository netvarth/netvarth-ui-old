import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderServices } from '../../../../services/provider-services.service';
import { projectConstants } from '../../../../../app.component';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { ShowMessageComponent } from '../../../show-messages/show-messages.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { userContactInfoComponent } from './user-contact-info/user-contact-info.component';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';

@Component({

  'selector': 'app-branchusers',
  'templateUrl': './users.component.html',
  styleUrls: ['./users.component.css', '../../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']

})

export class BranchUsersComponent implements OnInit {
  tooltipcls = '';
  filtericonTooltip = '';
  add_button = '';
  users_list: any = [];
  domain;
  filter_sidebar = false;
  filterapplied = false;
  open_filter = false;
  filter = {
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    pinCode: '',
    primaryMobileNo: '',
    employeeId: '',
    email: '',
    userType: '',
    available: '',
    userRole: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1

  };

  filters: any = {
    'firstName': false,
    'lastName': '',
    'city': false,
    'state': false,
    'pinCode': false,
    'primaryMobileNo': false,
    'employeeId': false,
    'email': false,
    'userType': false,
    'available': false
  };
  // userTypesFormfill: any = ['ASSISTANT', 'PROVIDER', 'ADMIN'];
  userTypesFormfill: any = [
    {
      name: 'ASSISTANT',
      displayName: 'Assistant'
    },
    {
      name: 'PROVIDER',
      displayName: 'Provider'
    },
    {
      name: 'ADMIN',
      displayName: 'Admin'
    }];
  api_loading: boolean;
  departments: any;
  loadComplete = false;
  userRolesFormfill: any;
  user_count: any = 0;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  linkprofiledialogRef;
  provId;
  businessConfig: any;
  provider_label = '';
  assistant_label = '';
  changeUserStatusdialogRef;
  order = 'status';
  use_metric;
  usage_metric: any;
  adon_info: any;
  adon_total: any;
  adon_used: any;
  disply_name: any;
  warningdialogRef: any;
  loading = true;
  languages_arr: any = [];
  specialization_arr: any = [];
  user;
  selectedLanguages: any = [];
  selectedLocations: any = [];
  selectedSpecialization: any = [];
  selectedUser;
  selectrow = false;
  user_count_filterApplied: any;
  allSelected: boolean;
  availabileSelected: boolean;
  notAvailabileSelected: boolean;
  accountSettings;
  contactDetailsdialogRef: any;
  // user_list_dup: any = []
  user_list_add: any
  teamDescription = '';
  teamName = '';
  size = '';
  apiError = '';
  showAddCustomerHint = false;
  @ViewChild('closebutton') closebutton;
  @ViewChild('locclosebutton') locclosebutton;
  groups: any;
  teamLoaded = false;
  teamEdit = false;
  groupIdEdit = '';
  selectedTeam;
  // teamusers: any = [];
  showUsers = false;
  userIds: any = [];
  showcheckbox = false;
  addlocationcheck = false;
  loc_list: any = [];
  locationsjson: any = [];
  locIds: any = [];
  branchIds: any = [];
  newlyCreatedGroupId;
  showteams = false;
  showusers = false;
  selecteTeamdUsers: any = [];
  addUser = false;
  users_activecount;
  locationText: any;
  branchesEnabled: any = false;
  branchjson: any;
  branch_list: any = [];
  // subdomain: any;
  constructor(
    private router: Router,
    private routerobj: Router,
    private provider_services: ProviderServices,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private lStorageService: LocalStorageService) {
  }
  ngOnInit() {
    this.selectedTeam = 'all';
    this.accountSettings = this.groupService.getitemFromGroupStorage('settings');
    console.log("Account Settings : ", this.accountSettings)
    if (this.accountSettings && this.accountSettings.enableBranchMaster) {
      this.branchesEnabled = true;
      this.locationText = "Branches";
    }
    else {
      this.branchesEnabled = false;
      this.locationText = "Locations";
    }
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = this.user.sector;
    this.api_loading = true;
    this.getProviderLocations().then(
      () => {
        this.getUsers(true);
      }
    );

    this.getProviderBranches().then(
      () => {
        this.getUsers(true);
      }
    );

    this.getRolesInAccount('cdl');

    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.assistant_label = this.wordProcessor.getTerminologyTerm('assistant');
    this.getLicenseUsage();
    this.getSpokenLanguages();
    this.getTeams();
    // this.addCustomerToGroup();
    this.userTypesFormfill = [{ value: 'ASSISTANT', displayName: 'Assistant' }, { value: 'PROVIDER', displayName: this.provider_label }, { value: 'ADMIN', displayName: 'Admin' }];
  }
  getTeams(groupId?) {
    this.teamLoaded = true;
    this.provider_services.getTeamGroup().subscribe((data: any) => {
      this.groups = data;
      this.teamLoaded = false;
      if (this.groups.length > 0) {
        this.showteams = true;
        this.showusers = false;
      }
      if (this.groups.length == 0) {
        this.showteams = false;
        this.showusers = true;
      }
      if (groupId) {
        if (groupId === 'update') {
          if (this.selectedTeam !== 'all') {
            const grp = this.groups.filter(group => group.id === this.selectedTeam.id);
            this.selectedTeam = grp[0];
            this.teamSelected(this.selectedTeam);
          }
        }
        else {
          const grp = this.groups.filter(group => group.id === JSON.stringify(groupId));
          this.teamSelected(grp[0], 'show');
        }
      }
    });
  }
  addBranchSP() {
    if (this.adon_total === this.adon_used) {
      this.warningdialogRef = this.dialog.open(ShowMessageComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'popup-class'],
        disableClose: true,
        data: {
          warn: this.disply_name
        }
      });
      this.warningdialogRef.afterClosed().subscribe(result => {

      });
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { type: 'Add' }
      };
      this.router.navigate(['provider', 'settings', 'general', 'users', 'add'], navigationExtras);
    }
  }
  personalProfile(user) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'edit',
        val: user
      }
    };
    this.router.navigate(['provider', 'settings', 'general', 'users', 'add'], navigationExtras);
  }


  getRolesInAccount(features) {
    this.api_loading = true;
    let api_filter = {}
    api_filter["featureName-eq"] = features;
    this.provider_services.getRolesInAccount().subscribe(data => {
      this.userRolesFormfill = data;
      this.api_loading = false;
      console.log("userRolesFormfill : ", this.userRolesFormfill);

    });
  }


  manageSettings(userId) {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', userId, 'settings']);
  }
  changeUserStatus(user) {
    let passingStatus;
    if (user.status === 'ACTIVE') {
      passingStatus = 'Disable';
    } else {
      passingStatus = 'Enable';
    }
    if (user.userType === 'PROVIDER') {
      let msg;
      if (passingStatus === 'Disable') {
        msg = 'Disabling the ' + this.provider_label + ', will also disable the ' + this.provider_label + '’s services as well as queues/schedules, if any. Continue?';
      } else {
        msg = 'After enabling, make sure to setup services as well as queues/schedules for the ' + this.provider_label + '.';
      }

      this.changeUserStatusdialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': msg,
          'buttons': 'okCancel'
        }
      });
      this.changeUserStatusdialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.provider_services.disableEnableuser(user.id, passingStatus)
            .subscribe(
              () => {
                this.getUsers();
              },
              (error) => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.getUsers();
              });
        }
      });
    } else {
      this.provider_services.disableEnableuser(user.id, passingStatus)
        .subscribe(
          () => {
            this.getUsers();
          },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.getUsers();
          });
    }
  }
  getUsers(from_oninit = false) {
    const _this = this;
    _this.loading = true;
    let filter = _this.setFilterForApi();
    if (_this.selectedTeam !== 'all' && !_this.addUser) {
      filter['teams-eq'] = this.selectedTeam.id;
    }
    _this.lStorageService.setitemonLocalStorage('userfilter', filter);
    _this.getUsersListCount(filter)
      .then(
        result => {
          if (from_oninit) { _this.user_count = result; }
          // filter = this.setPaginationFilter(filter);
          _this.provider_services.getUsers(filter).subscribe(
            (data: any) => {
              _this.users_list = data;
              if (from_oninit) {
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
              _this.users_list.map(function (user) {
                if (user && user.bussLocations) {
                  const businessLocations = _this.locationsjson.filter(loc => user.userType === 'PROVIDER' && user.bussLocations ? !(user.bussLocations.indexOf(loc.id) < 0) : "");
                  user.businessLocations = businessLocations.map(loc => loc.place);
                  return user
                }
              })

              // this.users_list = this.users_list.map(function(user) {
              //     if (user.specialiation) {
              //         user.specialiations = user.specialiation.map(special => special.displayName);
              //     }
              // })
              //    user.specialization.map(specialization => specialization.displayName);
              // // })displayName
              // const usersList = data;
              // const ids = usersList.map(function (a) { return a.bProfileId; });
              // if (ids) {
              // this.provider_services.getUserProfiles(ids).subscribe(
              //     (profiles: any)=> {
              //         _this.users_list = profiles.map((item, i) => Object.assign({}, item, usersList[i]));
              //         _this.users_list.map(
              //             function(user) { user.preferredLanguages = _this.getLanguages(user.preferredLanguages);
              //             return user })
              //         _this.users_list.map(
              //             function(user) { user.specialization = _this.getSpecialization(user.specialization);
              //             return user })
              //     }
              // )
              // }
              this.provider_services.getDepartments().subscribe(
                (data1: any) => {
                  this.departments = data1.departments;
                  // this.users_list = data;
                  // this.user_list_dup = this.users_list;
                  this.user_count_filterApplied = this.users_list.length;
                  this.api_loading = false;
                  this.loadComplete = true;
                },
                (error: any) => {
                  // this.users_list = data;
                  // this.user_list_dup = this.users_list;
                  this.api_loading = false;
                  this.loadComplete = true;
                  this.user_count_filterApplied = this.users_list.length;
                });
              // this.getSpecializations();
            },
            (error: any) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
        },
        (error: any) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  setSpecializationFilter(users_list: any) {
    const _this = this;
    const specialiationList = [];
    users_list.map(function (user) {
      if (user.specialization) {
        specialiationList.push(...user.specialization);
      }
      _this.specialization_arr = getUniqueListBy(specialiationList, 'name');
      function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
      }
    })
  }
  getDepartmentNamebyId(id) {
    let departmentName;
    for (let i = 0; i < this.departments.length; i++) {
      if (this.departments[i].departmentId === id) {
        departmentName = this.departments[i].departmentName;
        break;
      }
    }
    return departmentName;
  }
  getUserImg(user) {
    if (user.profilePicture) {
      const proImage = user.profilePicture;
      return proImage.url;
    } else if (user.gender === 'male') {
      return '../../.././assets/images/Asset1@300x.png';
    }
    else if (user.gender === 'female') {
      return '../../.././assets/images/Asset2@300x.png';
    }
    else {
      return '../../.././assets/images/Asset1@300x(1).png';
    }
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/general->branchsps']);
    }
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
    /* this.clearFilter(); */
  }
  clearFilter() {
    this.lStorageService.removeitemfromLocalStorage('userfilter');
    this.allSelected = false;
    this.availabileSelected = false;
    this.notAvailabileSelected = false;
    this.resetFilter();
    this.filterapplied = false;
    this.getUsers();
  }
  resetFilter() {
    this.filters = {
      'firstName': false,
      'lastName': false,
      'city': false,
      'state': false,
      'pinCode': false,
      'primaryMobileNo': false,
      'employeeId': false,
      'email': false,
      'userType': false,
      'available': false,
      'userRole': false
    };
    this.filter = {
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      pinCode: '',
      primaryMobileNo: '',
      employeeId: '',
      email: '',
      userType: '',
      available: '',
      userRole: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
    this.selectedSpecialization = [];
    this.selectedLanguages = [];
    this.selectedLocations = [];
  }
  doSearch() {
    // this.getUsers();
    this.lStorageService.removeitemfromLocalStorage('userfilter');
    if (this.filter.firstName || this.filter.lastName || this.filter.city || this.filter.state || this.filter.pinCode || this.filter.available || this.filter.employeeId || this.filter.email || this.filter.primaryMobileNo || this.filter.userType || this.filter.userRole || this.selectedLanguages.length > 0 || this.selectedLocations.length > 0 || this.selectedSpecialization.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      input.focus();
      this.doSearch();
    }
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  setFilterForApi() {
    let api_filter = {};
    const filter = this.lStorageService.getitemfromLocalStorage('userfilter');
    if (filter) {
      api_filter = filter;
      this.initFilters(filter);
    }
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
    if (this.filter.pinCode !== '') {
      api_filter['pinCode-eq'] = this.filter.pinCode;
    }
    if (this.filter.userRole !== '') {
      api_filter['userRoles-eq'] = 'roleId::' + this.filter.userRole;
    }
    if (this.filter.userType !== '') {
      if (this.filter.userType == 'ADMIN') {
        // api_filter['or=userType-eq'] =this.filter.userType+',isAdmin-eq='+true;
        api_filter['userType-eq'] = this.filter.userType;
      } else {
        api_filter['userType-eq'] = this.filter.userType;
      }
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
    if (this.selectedLanguages.length > 0) {
      api_filter['preferredLanguages-eq'] = this.selectedLanguages.toString();
    }
    if (this.selectedLocations.length > 0) {
      api_filter['businessLocs-eq'] = this.selectedLocations.toString();
    }
    if (this.selectedSpecialization.length > 0) {
      api_filter['specialization-eq'] = 'name::' + this.selectedSpecialization.toString();
    }
    if (this.selectedTeam === 'all' || this.addUser) {
      delete api_filter['teams-eq'];
    }
    return api_filter;
  }
  initFilters(filter) {
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach(key => {
        const splitedKey = key.split('-');
        if (splitedKey[0] === 'spokenlangs') {
          const values = filter[key].split(',');
          this.selectedLanguages = values;
        } else if (splitedKey[0] === 'businessLocs') {
          let values = filter[key].split(',');
          values = values.map(value => JSON.parse(value));
          this.selectedLocations = values;
        } else if (splitedKey[0] === 'specialization') {
          const values = filter[key].split(',');
          this.selectedSpecialization = values;
        } else {
          this.filter[splitedKey[0]] = filter[key];
        }
      });
      this.filterapplied = true;
    }
  }
  getUsersListCount(filter) {
    return new Promise((resolve, reject) => {
      this.provider_services.getUsersCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.users_activecount = data;
            this.user_count = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getUsers();
  }
  makeDefalutAdmin(id) {
    this.provider_services.makeDefalutAdmin(id)
      .subscribe(
        () => {
          this.getUsers();
        },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getUsers();
        });
  }
  redirecToGeneral() {
    this.routerobj.navigate(['provider', 'settings', 'general']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/general->branchsps']);
  }
  getLicenseUsage() {
    this.provider_services.getLicenseUsage()
      .subscribe(
        data => {
          this.use_metric = data;
          this.usage_metric = this.use_metric.metricUsageInfo;
          this.adon_info = this.usage_metric.filter(sch => sch.metricName === 'Multi User');
          this.adon_total = this.adon_info[0].total;
          this.adon_used = this.adon_info[0].used;
          this.disply_name = this.adon_info[0].metricName;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getSpokenLanguages() {
    this.provider_services.getSpokenLanguages()
      .subscribe(data => {
        this.languages_arr = data;
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
      if (value === 'ALL') {
        this.allSelected = true;
        this.availabileSelected = false;
        this.notAvailabileSelected = false;
        this.filter.available = 'ALL';
      }
      else if (value === 'true') {
        this.allSelected = false;
        this.availabileSelected = true;
        this.notAvailabileSelected = false;
        this.filter.available = 'true';
      }
      else {
        this.allSelected = false;
        this.availabileSelected = false;
        this.notAvailabileSelected = true;
        this.filter.available = 'false';
      }
    }
    this.doSearch();
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
  getSpecialization(specialization) {
    if (!specialization) {
      return;
    }
    const specializationArray = [];
    for (let i = 0; i < specialization.length; i++) {
      if (specialization[i] && specialization[i] !== null && specialization[i] !== 'null') {
        specializationArray.push(specialization[i]);
      }
    }
    return specializationArray.join(', ').toString();
  }
  selectedRow(index, user) {
    if (!this.showcheckbox) {
      this.selectrow = true;
      this.selectedUser = user;
      if (this.selectrow === true && user.id && user.userType === 'PROVIDER') {
        this.manageSettings(user.id)
      } else {
        this.personalProfile(user.id)
      }

    }
    // else {
    // }
  }
  stopprop(event) {
    event.stopPropagation();
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
  customerGroupAction() {
    if (this.teamName === '' || (this.teamName && this.teamName.trim() === '')) {
      this.apiError = 'Please enter the team name';
    } else {
      const postData = {
        'name': this.teamName,
        'description': this.teamDescription
      };
      if (!this.teamEdit) {
        this.createGroup(postData);
      } else {
        this.updateGroup(postData);
      }
    }
  }
  createGroup(data) {
    this.newlyCreatedGroupId = null;
    this.provider_services.createTeamGroup(data).subscribe(data => {
      this.showAddCustomerHint = true;
      this.newlyCreatedGroupId = data;
    },
      error => {
        this.apiError = error.error;
        setTimeout(() => {
          this.apiError = '';
        }, 1000);

      });
  }
  updateGroup(data) {
    this.provider_services.updateTeamGroup(data, this.groupIdEdit).subscribe(data => {
      this.getTeams('update');
      this.resetGroupFields();
      this.closeGroupDialog();
      this.snackbarService.openSnackBar('Team updated successfully', { ' panelclass': 'snackbarerror' });
    },

      error => {
        this.apiError = error.error;
        setTimeout(() => {
          this.apiError = '';
        }, 1000);

      });
  }
  resetGroupFields() {
    this.teamName = '';
    this.teamDescription = '';
    this.teamEdit = false;
    // this.getUsers();
  }
  showCustomerHint() {
    this.showAddCustomerHint = false;
    this.getTeams(this.newlyCreatedGroupId);
    this.resetGroupFields();
    this.resetError();
  }
  showCustomerstoAdd(type?) {
    this.addUser = true;
    this.selecteTeamdUsers = [];
    this.showcheckbox = true
    this.userIds = [];
    this.getUsers();
    this.showUsers = true;
    this.resetFilter();
    this.selecteTeamdUsers = this.selectedTeam.users;
    if (type) {
      this.closeGroupDialog();
      this.showCustomerHint();
    }
    if (!type) {
      if (this.selectedTeam.users.length > 0) {
        for (let i = 0; i < this.selectedTeam.users.length; i++) {
          this.userIds.push(this.selectedTeam.users[i].id);
        }
      }
    }
  }
  closeGroupDialog() {
    this.closebutton.nativeElement.click();
    this.resetError();
  }
  closelocDialog() {
    this.locclosebutton.nativeElement.click();
  }
  editGroup(group?) {
    this.teamEdit = true;
    this.groupIdEdit = '';
    if (group) {
      this.teamName = group.name;
      this.teamDescription = group.description;
      this.groupIdEdit = group.id;
    }
  }
  teamSelected(team, type?) {
    this.showusers = true;
    this.showteams = false;
    if (!type) {
      this.showUsers = false;
      this.showcheckbox = false;
    }
    this.selectedTeam = team;
    this.clearFilter();
    if (type) {
      this.closeGroupDialog();
    }
  }
  changeGroupStatus(group) {
    let status;
    if (group.status === 'ACTIVE') {
      status = 'INACTIVE';
    } else {
      status = 'ACTIVE';
    }
    this.provider_services.updateTeamStatus(group.id, status).subscribe(
      (data: any) => {
        this.getTeams();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  addCustomerToGroup() {
    const postData = {
      'userIds': this.userIds,
      'teams': [this.selectedTeam.id]
    };
    this.provider_services.updateTeamMembers(postData).subscribe(
      (data: any) => {
        this.getTeams('update');
        this.showcheckbox = false;
        this.showUsers = false;
        this.addUser = false;
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  checkSelection(user) {
    if (this.selecteTeamdUsers && this.selecteTeamdUsers.length > 0) {
      const isuser = this.selecteTeamdUsers.filter(listofusers => listofusers.id === user.id);
      if (isuser.length > 0) {
        return true;
      }
    }
  }

  cancelAdd() {
    this.userIds = [];
    this.showcheckbox = false;
    this.showUsers = false;
    this.addUser = false;
    this.teamSelected(this.selectedTeam);
  }
  getUserIds(service, id, values) {
    if (values.currentTarget.checked) {
      this.userIds.push(id);
    } else {
      const index = this.userIds.filter(x => x !== id);
      this.userIds = index;
    }
  }
  getLocIdsUserIds(loc, id, values) {
    console.log("Loc:", loc);
    console.log("Id:", id);
    console.log("Values:", values);

    if (values.checked) {
      console.log("Checked");
      const index = this.locIds.indexOf(id);
      if (index === -1) {
        this.locIds.push(id);
      }
    } else {
      console.log("UnChecked");
      const index = this.locIds.indexOf(id);
      this.locIds.splice(index, 1);
    }
    console.log(this.locIds);
    // if (loc.baseLocation || values.currentTarget.checked) {
    //     this.locIds.push(id);
    // } else {
    //     const index = this.locIds.filter(x => x === id);
    //     this.locIds.pop(index);
    // }
  }

  getBranchIdsUserIds(branch, id, values) {
    console.log("Branch:", branch);
    console.log("Id:", id);
    console.log("Values:", values);

    if (values.checked) {
      console.log("Checked");
      const index = this.branchIds.indexOf(id);
      if (index === -1) {
        this.branchIds.push({ 'id': id, "isDefault": false });
      }
    } else {
      console.log("UnChecked");
      const index = this.branchIds.indexOf(id);
      this.branchIds.splice(index, 1);
    }
    console.log(this.branchIds);
    // if (loc.baseLocation || values.currentTarget.checked) {
    //     this.locIds.push(id);
    // } else {
    //     const index = this.locIds.filter(x => x === id);
    //     this.locIds.pop(index);
    // }
  }


  addlocation() {
    this.userIds = [];
    this.showcheckbox = true;
    this.addlocationcheck = true;
    this.showusers = true;
    //this.getProviderLocations();
  }
  getProviderLocations() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.api_loading = true;
      _this.provider_services.getProviderLocations()
        .subscribe(data => {
          _this.locationsjson = data;
          console.log("Locationsss :", data);
          for (const loc of _this.locationsjson) {
            if (loc.status === 'ACTIVE') {
              _this.loc_list.push(loc);
            }
          }
          resolve(true);
          _this.api_loading = false;
        }, () => {
          resolve(false);
          _this.api_loading = true;
        });
    });
  }


  getProviderBranches() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.api_loading = true;
      _this.provider_services.getBranches()
        .subscribe(data => {
          _this.branchjson = data;
          console.log("branchs :", data);
          for (const branch of _this.branchjson) {
            if (branch.status === 'ACTIVE') {
              _this.branch_list.push(branch);
            }
          }
          resolve(true);
          _this.api_loading = false;
        }, () => {
          resolve(false);
          _this.api_loading = true;
        });
    });
  }


  locationclose() {
    this.showcheckbox = false;
    this.addlocationcheck = false
  }
  clearLocations() {
    this.locIds = [];
  }
  assignLocationToUsers() {
    if (this.locIds.length === 0) {
      this.apiError = 'Please select at least one location';
    }
    else {
      const postData = {
        'userIds': this.userIds,
        'bussLocations': this.locIds
      };
      this.provider_services.assignLocationToUsers(postData).subscribe(
        (data: any) => {
          this.showcheckbox = false;
          this.userIds = [];
          this.addlocationcheck = false;
          // this.locIds = [];

          this.closelocDialog();
          this.getUsers();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    }
  }


  assignBranchesToUsers() {
    if (this.branchIds.length === 0) {
      this.apiError = 'Please select at least one branch';
    }
    else {
      const postData = {
        'userIds': this.userIds,
        'branchIds': this.branchIds
      };

      this.provider_services.assignBranchToUsers(postData).subscribe(
        (data: any) => {
          this.showcheckbox = false;
          this.userIds = [];
          this.addlocationcheck = false;
          // this.branchIds = [];
          this.closelocDialog();
          this.getUsers();
          this.snackbarService.openSnackBar("Branches Assigned to Users Successfully");
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    }
  }

  redirecToUsers() {
    // this.routerobj.navigate(['provider', 'settings', 'general', 'users']);
    this.showteams = true;
    this.showusers = false;
    this.selectedTeam = 'all';

  }
  showteamsres() {
    this.showteams = true;
    this.showusers = false;;
  }
  showallusers() {
    this.showteams = false;
    this.showusers = true;
    this.selectedTeam = 'all';
    this.teamSelected(this.selectedTeam);
  }
  resetError() {
    this.apiError = '';
  }
  cancelLocationToUsers() {
    // this.apiError = '';
    this.closelocDialog();
  }
  openGoogleMap() { }
  getBussLoc(bussloc) {
    for (let i = 0; i < bussloc.length; i++) {
      const locations = this.locationsjson.filter(loc => loc.id === bussloc[i]);
      if (locations[0]) {
        bussloc[i] = locations[0].place;
      }
    }
    if (bussloc.length > 1) {
      bussloc = bussloc.toString();
      return bussloc.replace(/,/g, ", ");
    }
    return bussloc;
  }
}
