import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../../app.component';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { ShowMessageComponent } from '../../../show-messages/show-messages.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { userContactInfoComponent } from './user-contact-info/user-contact-info.component';

@Component({

    'selector': 'app-branchusers',
    'templateUrl': './users.component.html',
    styleUrls: ['./user.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']

})

export class BranchUsersComponent implements OnInit {
    tooltipcls = '';
    filtericonTooltip = '';
    add_button = '';
    users_list: any = [];
    breadcrumb_moreoptions: any = [];
    domain;
    filter_sidebar = false;
    filterapplied = false;
    open_filter = false;
    filter = {
        firstName: '',
        lastName: '',
        city: '',
        state: '',
        pincode: '',
        primaryMobileNo: '',
        userType: '',
        available: '',
        page_count: projectConstants.PERPAGING_LIMIT,
        page: 1

    };

    filters: any = {
        'firstName': false,
        'lastName': '',
        'city': false,
        'state': false,
        'pincode': false,
        'primaryMobileNo': false,
        'userType': false,
        'available': false,


    };

    breadcrumbs = [
        {
            url: '/provider/settings',
            title: 'Settings'

        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            title: 'Users'
        }
    ];

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
    user_list_dup: any = []
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
    selectedGroup;
    teamusers: any = [];
    showUsers = false;
    userIds: any = [];
    showcheckbox = false;
    addlocationcheck = false;
    loc_list: any = [];
    locIds: any = [];
    newlyCreatedGroupId;
    showteams =  false;
    showusers = true;
    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor) {
    }
    ngOnInit() {
        this.selectedGroup = 'all';
        this.accountSettings = this.groupService.getitemFromGroupStorage('settings');
        this.user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = this.user.sector;
        this.api_loading = true;
        this.getUsers();
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.assistant_label = this.wordProcessor.getTerminologyTerm('assistant');
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.getLicenseUsage();
        this.getSpokenLanguages();
        this.getSpecializations();
        this.getCustomerGroup();
        this.getProviderLocations();
        // this.addCustomerToGroup();
        if (this.domain === 'healthCare') {
            this.userTypesFormfill = [{ name: 'ASSISTANT', displayName: 'Assistant' }, { name: 'PROVIDER', displayName: 'Doctor' }, { name: 'ADMIN', displayName: 'Admin' }];
        }
        if (this.domain === 'finance') {
            this.userTypesFormfill = [{ name: 'ASSISTANT', displayName: 'Assistant' }, { name: 'PROVIDER', displayName: 'Staff Member' }, { name: 'ADMIN', displayName: 'Admin' }];
        }
         if (this.domain === 'educationalInstitution') {
            this.userTypesFormfill = [{name: 'ASSISTANT',displayName: 'Assistant'}, {name: 'PROVIDER',displayName: 'Mentor'},{name: 'ADMIN',displayName: 'Admin'}];
        } 
    }
    getCustomerGroup(groupId?) {
        this.teamLoaded = true;
        this.provider_services.getTeamGroup().subscribe((data: any) => {
            this.groups = data;
            console.log(this.groups);
            this.teamLoaded = false;
            if (groupId) {
                console.log("hi");

                if (groupId === 'update') {
                    if (this.selectedGroup !== 'all') {
                        const grp = this.groups.filter(group => group.id === this.selectedGroup.id);
                        this.selectedGroup = grp[0];
                        console.log(this.selectedUser)
                        this.customerGroupSelection(this.selectedGroup);
                    }
                }
                else {
                    const grp = this.groups.filter(group => group.id === JSON.stringify(groupId));
                    this.customerGroupSelection(grp[0] , 'show');
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
        let filter = this.setFilterForApi();
        this.getUsersListCount(filter)
            .then(
                result => {
                    if (from_oninit) { this.user_count = result; }
                    // filter = this.setPaginationFilter(filter);
                    this.provider_services.getUsers(filter).subscribe(
                        (data: any) => {
                            this.provider_services.getDepartments().subscribe(
                                (data1: any) => {
                                    this.departments = data1.departments;
                                    this.users_list = data;
                                    this.user_list_dup = this.users_list;
                                    this.user_count_filterApplied = this.users_list.length;
                                    this.api_loading = false;
                                    this.loadComplete = true;
                                },
                                (error: any) => {
                                    this.users_list = data;
                                    this.user_list_dup = this.users_list;
                                    this.api_loading = false;
                                    this.loadComplete = true;
                                });
                        },
                        (error: any) => {
                            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
                },
                (error: any) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
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
        else{
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
            'pincode': false,
            'primaryMobileNo': false,
            'userType': false,
            'available': false,
        };
        this.filter = {
            firstName: '',
            lastName: '',
            city: '',
            state: '',
            pincode: '',
            primaryMobileNo: '',
            userType: '',
            available: '',
            page_count: projectConstants.PERPAGING_LIMIT,
            page: 1
        };
        this.selectedSpecialization = [];
        this.selectedLanguages = [];
        this.selectedLocations = [];
    }
    doSearch() {
        // this.getUsers();
        if (this.filter.firstName || this.filter.lastName || this.filter.city || this.filter.state || this.filter.pincode || this.filter.available || this.filter.primaryMobileNo || this.filter.userType || this.selectedLanguages.length > 0 || this.selectedLocations.length > 0 || this.selectedSpecialization.length > 0) {
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
        if (this.filter.userType !== '') {
            api_filter['userType-eq'] = this.filter.userType;
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
        if (this.selectedLocations.length > 0) {
            api_filter['businessLocs-eq'] = this.selectedLocations.toString();
        }
        if (this.selectedSpecialization.length > 0) {
            api_filter['specialization-eq'] = this.selectedSpecialization.toString();
        }
        return api_filter;
    }
    getUsersListCount(filter) {
        return new Promise((resolve, reject) => {
            this.provider_services.getUsersCount(filter)
                .subscribe(
                    data => {
                        this.pagination.totalCnt = data;
                        this.user_count = this.pagination.totalCnt;
                        console.log(this.user_count)
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
    getSpecializations() {
        let subDomain;
        if (this.user.sector === 'healthCare') {
            if (this.user.subSector === 'hospital') {
                subDomain = 'physiciansSurgeons';
            } else if (this.user.subSector === 'dentalHosp') {
                subDomain = 'dentists';
            } else if (this.user.subSector === 'alternateMedicineHosp') {
                subDomain = 'alternateMedicinePractitioners';
            }
        } else if (this.user.sector === 'personalCare') {
            if(this.user.subSector === 'beautyCare'){
              subDomain = 'beautyCare';
            } else if(this.user.subSector === 'personalFitness'){
              subDomain = 'personalFitness';
            }else if(this.user.subSector === 'massageCenters'){
              subDomain = 'massageCenters';
            }
          
        } else if (this.user.sector === 'finance') {
          if(this.user.subSector === 'bank'){
            subDomain = 'bank';
          } else if(this.user.subSector === 'nbfc'){
            subDomain = 'nbfc';
          }else if(this.user.subSector === 'insurance'){
            subDomain = 'insurance';
          }
        }else if (this.user.sector === 'veterinaryPetcare') {
            if (this.user.subSector === 'veterinaryhospital') {
                subDomain = 'veterinarydoctor';
            }
        } else if (this.user.sector === 'retailStores') {
            if(this.user.subSector === 'groceryShops'){
                subDomain = 'groceryShops';
              } else if(this.user.subSector === 'supermarket'){
                subDomain = 'supermarket';
              }else if(this.user.subSector === 'hypermarket'){
                subDomain = 'hypermarket';
              }
        } else if (this.user.sector === 'educationalInstitution') {
            if (this.user.subSector === 'educationalTrainingInstitute') {
              subDomain = 'educationalTrainingInstitute';
            } else if (this.user.subSector === 'schools') {
                subDomain = 'schools';
             } else if (this.user.subSector === 'colleges') {
                subDomain = 'colleges';
             } 
          }
          else if (this.user.sector === 'sportsAndEntertainement') {
            if (this.user.subSector === 'sports') {
              subDomain = 'sports';
            } else if (this.user.subSector === 'entertainment') {
                subDomain = 'entertainment';
             }  
          }
          console.log(this.user.sector,subDomain);
        this.provider_services.getSpecializations(this.user.sector, subDomain)
            .subscribe(data => {
                this.specialization_arr = data;
                console.log(this.specialization_arr);
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
        // this.doSearch();
    }
    getLanguages(languages) {
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
        for (let i = 0; i < specialization.length; i++) {
            const special = this.specialization_arr.filter(speciall => speciall.name === specialization[i]);
            if (special[0]) {
                specialization[i] = special[0].displayName;
            }
        }
        if (specialization.length > 1) {
            specialization = specialization.toString();
            return specialization.replace(/,/g, ", ");
        }
        return specialization;
    }
    selectedRow(index, user) {
        if(!this.showcheckbox){
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
            this.apiError = 'Please enter the group name';
        } else {
            const postData = {
                'name': this.teamName,
                // 'size': this.size,
                'description': this.teamDescription
            };
            console.log(postData);
            if (!this.teamEdit) {
                this.createGroup(postData);
            } else {
                // postData['id'] = (this.groupIdEdit !== '') ? this.groupIdEdit : '';

                // postData['id'] = (this.groupIdEdit !== '') ? this.groupIdEdit : this.selectedGroup.id;
                this.updateGroup(postData);
            }
        }
    }
    createGroup(data) {
        this.newlyCreatedGroupId = null;
        console.log(data);
        this.provider_services.createTeamGroup(data).subscribe(data => {
            this.showAddCustomerHint = true;
            console.log(data);
              this.newlyCreatedGroupId = data;
            console.log(data);
        },
            error => {
                this.apiError = error.error;
            });
    }
    updateGroup(data) {
        this.provider_services.updateTeamGroup(data, this.groupIdEdit).subscribe(data => {
            this.getCustomerGroup('update');
            this.resetGroupFields();
            this.closeGroupDialog();
        },
            error => {
                this.apiError = error.error;
            });
    }
    resetGroupFields() {
        this.teamName = '';
        this.teamDescription = '';
        this.teamEdit = false;
    }
    showCustomerHint() {
        this.showAddCustomerHint = false;
        console.log(this.newlyCreatedGroupId);
        this.getCustomerGroup(this.newlyCreatedGroupId);
        this.resetGroupFields();
        this.resetError();
    }
    showCustomerstoAdd(type?) {
        this.showcheckbox = true
        this.userIds = [];
        this.getUsers();
        this.showUsers = true;
        // this.resetList();
        this.resetFilter();
        // this.getCustomersList();
        if (type) {
            this.closeGroupDialog();
            this.showCustomerHint();
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
        console.log(group);
        this.teamEdit = true;
        this.groupIdEdit = '';
        if (group) {
            this.teamName = group.name;
            this.teamDescription = group.description;
            this.groupIdEdit = group.id;
            // this.size = group.size
        }
        // else {
        //   this.teamName = this.selectedGroup.teamName;
        //   this.teamDescription = this.selectedGroup.description;
        //   this.groupIdEdit = this.selectedGroup.id;
        // }
    }
    customerGroupSelection(group, type?) {
        this.showusers = true;
        this.showteams =  false;
        if (group === 'all') {
            this.getUsers();
        }
        console.log(group);
        console.log(this.users_list);
        this.selectedGroup = group;
        this.teamusers = this.selectedGroup.users;
        console.log(this.teamusers);
        if (group !== 'all') {
            console.log('emptycheck');
            if (this.teamusers.length === 0) {
                console.log('empty');
                this.users_list = [];
            }
            else {
                // this.user_list_dup = this.users_list;
                this.users_list = [];
                console.log(this.user_list_dup);
                for (let i = 0; i < this.teamusers.length; i++) {
                    console.log(i);
                    this.user_list_add = this.user_list_dup.filter(users => users.id === this.teamusers[i].id);
                    console.log(this.teamusers[i].id)
                    console.log(this.user_list_add);
                    this.users_list.push(this.user_list_add[0]);
                    // this.user_list_add.push(this.users_list);
                    console.log(this.users_list);
                    this.user_list_add = [];
                }
            }
        }
        console.log(this.users_list);
        this.resetFilter();

        if(type){
            this.closeGroupDialog();
        }
        // this.resetList();
        // this.customers = this.groupCustomers = [];
        // if (!type) {
        //   this.showUsers = false;
        //   if (this.selectedGroup === 'all') {
        //     this.getCustomersList();
        //   } else {
        //     this.getCustomerListByGroup();
        //   }
        // }
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
                this.getCustomerGroup();
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    addCustomerToGroup() {
        console.log("hi")
        console.log(this.selectedGroup);
        const postData = {
            'userIds': this.userIds,
            'teams': [this.selectedGroup.id]
        };
        console.log(postData);
        this.provider_services.updateTeamMembers(postData).subscribe(
            (data: any) => {
                //   this.getCustomerGroup();
                this.getCustomerGroup('update');
                this.showcheckbox = false;
                this.showUsers = false;
                //   this.getUsers();
                //   this.customerGroupSelection(this.selectedGroup);
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    //    checkSelection(customer) {
    //        console.log(customer);
    //         const custom = this.selectedcustomersformsg.filter(cust => cust.id === customer.id);
    //         if (custom.length > 0) {
    //           return true;
    //         }
    //     }
    cancelAdd() {
        console.log("close");
        this.showcheckbox = false;
        this.showUsers = false;
        console.log(this.selectedGroup);
        this.customerGroupSelection(this.selectedGroup);
        // this.resetList();
        // this.getCustomerListByGroup();
    }
    getUserIds(service, id, values) {
        console.log(values.currentTarget.checked);
        console.log(service);
        console.log(values);

        // if (values.currentTarget.checked) {
        //     this.userIds.push(id);
        //     console.log(this.userIds)
        // } else if (!values.currentTarget.checked) {
        //     this.userIds.splice(id);
        //     console.log(this.userIds)
        // }
        // console.log(this.userIds)
        if (values.currentTarget.checked) {
            this.userIds.push(id);
            // website.push(new FormControl(e.target.value));
          } else {
            console.log(this.userIds);
             const index =  this.userIds.filter(x => x === id);
             console.log(index)
             this.userIds.pop(index);
          }
          console.log(this.userIds)
    }
    getLocIdsUserIds(loc, id, values) {
        console.log(values.currentTarget.checked);
        console.log(loc);
        // if (values.currentTarget.checked) {
        //     this.locIds.push(id);
        //     console.log(this.userIds)
        // } else if (!values.currentTarget.checked) {
        //     this.locIds.splice(id);
        //     console.log(this.locIds)
        // }
        // console.log(this.userIds)
        if (values.currentTarget.checked) {
            this.locIds.push(id);
            console.log(this.locIds)
          } else {
            console.log( this.locIds);
             const index =   this.locIds.filter(x => x === id);
             console.log(index)
             this.locIds.pop(index);
          }
          console.log(this.locIds)
    }
    addlocation() {
        this.userIds = [];
        this.showcheckbox = true;
        this.addlocationcheck = true;
        this.showusers = true;
        this.getProviderLocations();
    }
    getProviderLocations() {
        this.api_loading = true;
        this.provider_services.getProviderLocations()
            .subscribe(data => {
                console.log(data);
                this.loc_list = data;
                this.api_loading = false;
                console.log(this.loc_list);
            });
    }
    locationclose() {
        this.showcheckbox = false;
        this.addlocationcheck = false
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
        console.log(postData);
           this.provider_services.assignLocationToUsers(postData).subscribe(
            (data: any) => {
              this.showcheckbox = false;
              this.userIds = [];
              this.addlocationcheck = false;
              this.locIds = [];
              this.getUsers();
              this.closelocDialog();
            },
            error => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
        }
    }
    redirecToUsers() {
        // this.routerobj.navigate(['provider', 'settings', 'general', 'users']);
        this.showteams =  true;
        this.showusers = false;

      }
     showteamsres() {
        this.showteams =  true;
        this.showusers = false;;
      }
      showallusers(){
        this.showteams =  false;
        this.showusers = true;
        this.selectedGroup = 'all';
        this.customerGroupSelection(this.selectedGroup);
      }
      resetError() {
        this.apiError = '';
      }
}
