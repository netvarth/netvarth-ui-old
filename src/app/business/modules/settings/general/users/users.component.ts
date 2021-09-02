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
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';

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
        pinCode: '',
        primaryMobileNo: '',
        employeeId: '',
        email: '',
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
        'pinCode': false,
        'primaryMobileNo': false,
        'employeeId': false,
        'email': false,
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
    selectedTeam;
    // teamusers: any = [];
    showUsers = false;
    userIds: any = [];
    showcheckbox = false;
    addlocationcheck = false;
    loc_list: any = [];
    locationsjson: any = [];
    locIds: any = [];
    newlyCreatedGroupId;
    showteams = false;
    showusers = false;
    selecteTeamdUsers: any = [];
    addUser = false;
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
        this.user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log(this.user);
        this.domain = this.user.sector;
        this.api_loading = true;
        this.getUsers();
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.assistant_label = this.wordProcessor.getTerminologyTerm('assistant');
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.getLicenseUsage();
        this.getSpokenLanguages();
        this.getSpecializations();
        this.getTeams();
        this.getProviderLocations();
        // this.addCustomerToGroup();
        this.userTypesFormfill = [{ value: 'ASSISTANT', displayName: 'Assistant' }, { value: 'PROVIDER', displayName: this.provider_label }, { value: 'ADMIN', displayName: 'Admin' }];
        // if (this.domain === 'healthCare') {
        //     this.userTypesFormfill = [{ name: 'ASSISTANT', displayName: 'Assistant' }, { name: 'PROVIDER', displayName: 'Doctor' }, { name: 'ADMIN', displayName: 'Admin' }];
        // }
        // if (this.domain === 'finance') {
        //     this.userTypesFormfill = [{ name: 'ASSISTANT', displayName: 'Assistant' }, { name: 'PROVIDER', displayName: 'Staff Member' }, { name: 'ADMIN', displayName: 'Admin' }];
        // }
        // if (this.domain === 'educationalInstitution') {
        //     this.userTypesFormfill = [{ name: 'ASSISTANT', displayName: 'Assistant' }, { name: 'PROVIDER', displayName: 'Mentor' }, { name: 'ADMIN', displayName: 'Admin' }];
        // }
    }
    getTeams(groupId?) {
        this.teamLoaded = true;
        this.provider_services.getTeamGroup().subscribe((data: any) => {
            this.groups = data;
            console.log(this.groups);
            this.teamLoaded = false;
            if(this.groups.length > 0){
                this.showteams = true;
                this.showusers = false;
            }
            if(this.groups.length == 0){
                this.showteams = false;
                this.showusers = true;
            }
            if (groupId) {
                console.log("hi");

                if (groupId === 'update') {
                    if (this.selectedTeam !== 'all') {
                        const grp = this.groups.filter(group => group.id === this.selectedTeam.id);
                        this.selectedTeam = grp[0];
                        console.log(this.selectedUser)
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
        this.loading = true;
        let filter= this.setFilterForApi();
        if(this.selectedTeam!=='all' && !this.addUser) {
            filter['teams-eq'] = this.selectedTeam.id;
        }
        this.lStorageService.setitemonLocalStorage('userfilter', filter);
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
                                    this.user_count_filterApplied = this.users_list.length;
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
            return './assets/images/Asset1@300x.png';
        }
        else if (user.gender === 'female') {
            return './assets/images/Asset2@300x.png';
        }
        else {
            return './assets/images/Asset1@300x(1).png';
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
        if (this.filter.firstName || this.filter.lastName || this.filter.city || this.filter.state || this.filter.pinCode || this.filter.available || this.filter.employeeId || this.filter.email || this.filter.primaryMobileNo || this.filter.userType || this.selectedLanguages.length > 0 || this.selectedLocations.length > 0 || this.selectedSpecialization.length > 0) {
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
        if (this.filter.userType !== '') {
            if (this.filter.userType == 'ADMIN') {
                api_filter['or=userType-eq'] =this.filter.userType+',isAdmin-eq='+true;  
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
            api_filter['spokenlangs-eq'] = this.selectedLanguages.toString();
        }
        if (this.selectedLocations.length > 0) {
            api_filter['businessLocs-eq'] = this.selectedLocations.toString();
        }
        if (this.selectedSpecialization.length > 0) {
            api_filter['specialization-eq'] = this.selectedSpecialization.toString();
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
            if (this.user.subSector === 'beautyCare') {
                subDomain = 'beautyCare';
            } else if (this.user.subSector === 'personalFitness') {
                subDomain = 'personalFitness';
            } else if (this.user.subSector === 'massageCenters') {
                subDomain = 'massageCenters';
            }

        } else if (this.user.sector === 'finance') {
            if (this.user.subSector === 'bank') {
                subDomain = 'bank';
            } else if (this.user.subSector === 'nbfc') {
                subDomain = 'nbfc';
            } else if (this.user.subSector === 'insurance') {
                subDomain = 'insurance';
            }
        } else if (this.user.sector === 'veterinaryPetcare') {
            if (this.user.subSector === 'veterinaryhospital') {
                subDomain = 'veterinarydoctor';
            }
        } else if (this.user.sector === 'retailStores') {
            if (this.user.subSector === 'groceryShops') {
                subDomain = 'groceryShops';
            } else if (this.user.subSector === 'supermarket') {
                subDomain = 'supermarket';
            } else if (this.user.subSector === 'hypermarket') {
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
        console.log(this.user.sector, subDomain);
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
        this.doSearch();
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
            console.log(postData);
            if (!this.teamEdit) {
                this.createGroup(postData);
            } else {
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
            this.getTeams('update');
            this.resetGroupFields();
            this.closeGroupDialog();
            this.snackbarService.openSnackBar('Team updated successfully', { ' panelclass': 'snackbarerror' });
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
                    console.log(this.selectedTeam.users[i]);
                    this.userIds.push(this.selectedTeam.users[i].id);
                    console.log(this.userIds);
                }
            }
        }
        console.log(this.userIds);
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
        }
    }
    teamSelected(team, type?) {
        console.log("Selected Team:");
        console.log(team);
        this.showusers = true;
        this.showteams = false;
        if(!type){
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
        console.log(postData);
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
        if ( this.selecteTeamdUsers && this.selecteTeamdUsers.length > 0) {
            const isuser = this.selecteTeamdUsers.filter(listofusers => listofusers.id === user.id);
            if (isuser.length > 0) {
                return true;
            }
        }
    }

    cancelAdd() {
        console.log("close");
        this.userIds = [];
        this.showcheckbox = false;
        this.showUsers = false;
        this.teamSelected(this.selectedTeam);
    }
    getUserIds(service, id, values) {
        console.log(values.currentTarget.checked);
        console.log(service);
        console.log(values);
        if (values.currentTarget.checked) {
            this.userIds.push(id);
        } else {
            console.log(this.userIds);
            const index = this.userIds.filter(x => x !== id);
            console.log(index)
            this.userIds = index;
            console.log(this.userIds)
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
            console.log(this.locIds);
            const index = this.locIds.filter(x => x === id);
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
        // this.getProviderLocations();
    }
    getProviderLocations() {
        this.api_loading = true;
        this.provider_services.getProviderLocations()
            .subscribe(data => {
             this.locationsjson = data;
            for (const loc of this.locationsjson) {
              if (loc.status === 'ACTIVE') {
                this.loc_list.push(loc);
              }
            }
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
    cancelLocationToUsers(){
        this.apiError = '';
    }
    getBussLoc(bussloc){
        for (let i = 0; i < bussloc.length; i++) {
            const locations = this.locationsjson.filter(loc =>loc.id === bussloc[i]);
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
