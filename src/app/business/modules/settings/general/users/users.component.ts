import { Component, OnInit } from '@angular/core';
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
        location: '',
        pincode: '',
        primaryMobileNo: '',
        userType: '',
        page_count: projectConstants.PERPAGING_LIMIT,
        page: 1

    };

    filters: any = {
        'firstName': false,
        'lastName': '',
        'location': false,
        'pincode': false,
        'primaryMobileNo': false,
        'userType': false

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
            displayName: 'Doctor'
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
    selectedSpecialization: any = [];
    selectedUser;
    selectrow = false;
    user_count_filterApplied: any;
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
                    'message': msg
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
                                    this.user_count_filterApplied = this.users_list.length;
                                    this.api_loading = false;
                                    this.loadComplete = true;
                                },
                                (error: any) => {
                                    this.users_list = data;
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
        } else {
            return '../../.././assets/images/avatar5.png';
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
        this.clearFilter();
    }
    clearFilter() {
        this.resetFilter();
        this.filterapplied = false;
        this.getUsers();
    }
    resetFilter() {
        this.filters = {
            'firstName': false,
            'lastName': false,
            'location': false,
            'pincode': false,
            'primaryMobileNo': false,
            'userType': false
        };
        this.filter = {
            firstName: '',
            lastName: '',
            location: '',
            pincode: '',
            primaryMobileNo: '',
            userType: '',
            page_count: projectConstants.PERPAGING_LIMIT,
            page: 1
        };
        this.selectedSpecialization = [];
        this.selectedLanguages = [];
    }
    doSearch() {
        this.getUsers();
        if (this.filter.firstName || this.filter.lastName || this.filter.location || this.filter.pincode || this.filter.primaryMobileNo || this.filter.userType || this.selectedLanguages.length > 0 || this.selectedSpecialization.length > 0) {
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
            api_filter['firstName-eq'] = this.filter.firstName;
        }
        if (this.filter.lastName !== '') {
            api_filter['lastName-eq'] = this.filter.lastName;
        }
        if (this.filter.location !== '') {
            api_filter['locationName-eq'] = this.filter.location;
        }
        if (this.filter.pincode !== '') {
            api_filter['pinCode-eq'] = this.filter.pincode;
        }
        if (this.filter.userType !== '') {
            api_filter['userType-eq'] = this.filter.userType;
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
        if (type === 'specializations') {
            const indx = this.selectedSpecialization.indexOf(value);
            if (indx === -1) {
                this.selectedSpecialization.push(value);
            } else {
                this.selectedSpecialization.splice(indx, 1);
            }
        }
        this.doSearch();
    }
    getLanguages(languages) {
        languages = JSON.parse(languages).toString();
        if (languages.length > 1) {
            languages = languages.replace(/,/g, ", ");
        }
        return languages;
    }
    getSpecialization(specialization) {
        if (specialization.length > 1) {
            specialization = specialization.toString();
            return specialization.replace(/,/g, ", ");
        }
        return specialization;
    }
    selectedRow(index, user) {
        this.selectrow = true;
        this.selectedUser = user;
        if (this.selectrow === true && user.id) {
            this.manageSettings(user.id)
        }
      }
      stopprop(event) {
        event.stopPropagation();
      }
}
