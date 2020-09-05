import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material';

@Component({
    'selector': 'app-general-settings',
    'templateUrl': './general-settings.component.html'
})
export class GeneralSettingsComponent implements OnInit {
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'General'
        }
    ];
    bProfile = null;
    loading = true;
    businessConfig: any = [];
    location_count: any = 0;
    locations: any = [];
    selected_location = null;
    multipeLocationAllowed = false;
    departmentCount: any = 0;
    locName;
    customer_label = '';
    cust_domain_name = '';
    locations_cap = Messages.WAITLIST_LOCATIONS_CAP;
    breadcrumb_moreoptions: any = [];
    frm_set_loc_cap = Messages.FRM_LEVEL_SETT_LOC_MSG;
    // livetrack_status: any;
    // livetrack_statusstr: string;
    account_type;
    accountType: any;
    filterbydepartment = false;
    isCorp = false;
    isMultilevel = false;
    domain;
    filterByDept = false;
    removeitemdialogRef;
    message;
    deptstatusstr = 'Off';
    constructor(private router: Router,
        private provider_services: ProviderServices,
        private shared_services: SharedServices,
        private dialog: MatDialog,
        private shared_functions: SharedFunctions) {
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.account_type = user.accountType;
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        // this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.getWaitlistMgr();
        // this.getLiveTrackStatus();
        this.getLocationCount();
        this.getDepartmentsCount();
        this.getDomainSubdomainSettings();
        this.getBusinessConfiguration();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    goLocation() {
        this.router.navigate(['provider', 'settings', 'general', 'locations']);
    }
    goDepartments() {
        this.router.navigate(['provider', 'settings', 'general', 'departments']);
    }
    gotoUsers() {
        this.router.navigate(['provider', 'settings', 'general', 'users']);
    }
    gotoNonworkingDays() {
        this.router.navigate(['provider', 'settings', 'general', 'holidays']);
    }
    gotothemes() {
        this.router.navigate(['provider', 'settings', 'general', 'skins']);
    }
    gotoLiveTrack() {
        this.router.navigate(['provider', 'settings', 'general', 'livetrack']);
    }
    gotocustomview() {
        this.router.navigate(['provider', 'settings', 'general', 'customview']);
    }
    gotoLabels() {
        this.router.navigate(['provider', 'settings', 'general', 'labels']);
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/general']);
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/general->' + mod]);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/general']);
    }
    getLocationCount() {
        this.loading = true;
        this.provider_services.getLocationCount()
            .subscribe(
                data => {
                    this.location_count = data;
                });
        this.loading = false;
    }
    getWaitlistMgr() {
        this.loading = true;
        this.provider_services.getWaitlistMgr()
            .subscribe(
                data => {
                    this.filterbydepartment = data['filterByDept'];
                    this.deptstatusstr = data['filterByDept'] ? 'On' : 'Off';
                });
        this.loading = false;
    }
    getBusinessConfiguration() {
        this.loading = true;
        this.shared_services.bussinessDomains()
            .subscribe(data => {
                this.businessConfig = data;
                this.getBussinessProfile();
            });
        this.loading = false;
    }
    getBussinessProfile() {
        this.provider_services.getBussinessProfile()
            .subscribe(data => {
                this.bProfile = data;
                for (let i = 0; i < this.businessConfig.length; i++) {
                    if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
                        if (this.businessConfig[i].multipleLocation) {
                            this.multipeLocationAllowed = true;
                        }
                        if (this.multipeLocationAllowed === true) {
                            this.locName = this.shared_functions.getProjectMesssages('WAITLIST_LOCATIONS_CAP');
                        }
                        if (this.multipeLocationAllowed === false) {
                            this.locName = this.shared_functions.getProjectMesssages('WIZ_LOCATION_CAP');
                        }
                    }
                }
            });
    }
    getDomainSubdomainSettings() {
        const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user_data.accountType;
        this.domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(this.domain, sub_domain)
                .subscribe(
                    (data: any) => {
                        this.isCorp = data.isCorp;
                        this.isMultilevel = data.isMultilevel;
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
    getDepartmentsCount() {
        this.loading = true;
        this.provider_services.getDepartmentCount()
            .subscribe(
                data => {
                    this.departmentCount = data;
                });
        this.loading = false;
    }
    // handle_liveTracking(event) {
    //     const is_livetrack = (event.checked) ? 'Enable' : 'Disable';
    //     this.provider_services.setLivetrack(is_livetrack)
    //         .subscribe(
    //             () => {
    //                 this.shared_functions.openSnackBar('Live tracking ' + is_livetrack + 'd successfully', { ' panelclass': 'snackbarerror' });
    //                 this.getLiveTrackStatus();
    //             },
    //             error => {
    //                 this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //                 this.getLiveTrackStatus();
    //             }
    //         );
    // }
    // getLiveTrackStatus() {
    //     this.provider_services.getGlobalSettings().subscribe(
    //         (data: any) => {
    //             this.livetrack_status = data.livetrack;
    //             this.livetrack_statusstr = (this.livetrack_status) ? 'On' : 'Off';
    //         });
    // }
    doRemoveservice() {
        if (this.filterByDept) {
            this.message = 'All services created will be moved to the department named \'Default\'. You can either rename the \'Default\' department for customer visibility or add new departments and assign respective services';
        } else {
            this.message = 'Assigned services are removed from the departments';
        }
        this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': this.message
            }
        });
        this.removeitemdialogRef.afterClosed().subscribe(result => {
            if (result) {
                const status = (this.filterByDept === true) ? 'Enable' : 'Disable';
                this.provider_services.setDeptWaitlistMgr(status)
                    .subscribe(
                        () => {
                            this.getWaitlistMgr();
                        },
                        error => {
                            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
            } else {
                this.filterByDept = (this.filterByDept === true) ? false : true;
            }
        });
    }
    redirecToSettings() {
        this.router.navigate(['provider', 'settings']);
    }
}
