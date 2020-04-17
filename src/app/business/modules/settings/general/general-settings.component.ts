import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

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
    locations_cap = Messages.WAITLIST_LOCATIONS_CAP;
    breadcrumb_moreoptions: any = [];
    frm_set_loc_cap = Messages.FRM_LEVEL_SETT_LOC_MSG;
    livetrack_status: any;
    livetrack_statusstr: string;
    account_type;
    accountType: any;
    filterbydepartment = false;
    isCorp = false;
    isMultilevel = false;
    domain;
    constructor(private router: Router,
        private provider_services: ProviderServices,
        private shared_services: SharedServices,
        private shared_functions: SharedFunctions) {

    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.account_type = user.accountType;
        // this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.getWaitlistMgr();
        this.getLiveTrackStatus();
        this.getLocationCount();
        this.getDepartmentsCount();
        this.getDomainSubdomainSettings();
        this.getBusinessConfiguration();
    }
    goLocation() {
        this.router.navigate(['provider', 'settings', 'general', 'locations']);
    }
    goDepartments() {
        this.router.navigate(['provider', 'settings', 'general', 'departments']);
    }
    gotoNonworkingDays() {
        this.router.navigate(['provider', 'settings', 'general', 'holidays']);
    }
    gotothemes() {
        this.router.navigate(['provider', 'settings', 'general', 'skins']);
    }
    gotocustomview() {
        this.router.navigate(['provider', 'settings', 'general', 'customview']);
    }
    gotoLabels() {
        this.router.navigate(['provider', 'settings', 'general', 'labels']);
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
    handle_liveTracking(event) {
        const is_livetrack = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setLivetrack(is_livetrack)
            .subscribe(
                () => {
                    this.shared_functions.openSnackBar('Live tracking ' + is_livetrack + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getLiveTrackStatus();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getLiveTrackStatus();
                }
            );
    }
    getLiveTrackStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.livetrack_status = data.livetrack;
                this.livetrack_statusstr = (this.livetrack_status) ? 'On' : 'Off';
            });
    }
}
