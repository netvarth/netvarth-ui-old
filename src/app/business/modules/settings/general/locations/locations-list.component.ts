import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../app.component';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { Router, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-locations',
    templateUrl: './locations-list.component.html'
})

export class LocationsListComponent implements OnInit {
    base_loc_cap = Messages.WAITLIST_BASE_LOC_CAP;
    set_base_loc_cap = Messages.WAITLIST_SET_BASE_CAP;
    new_loc_cap = Messages.ADD_NEW_LOC_CAP;
    no_loc_add = Messages.NO_LOC_ADDED;
    base_loc_det_cap = Messages.BPROFILE_BASE_LOCATION;
    please_use_cap = Messages.BPROFILE_PLEASE_CAP;
    edit_cap = Messages.EDIT_BTN;
    location_cap = Messages.LOCATION_CAP;
    btn_to_compl_cap = Messages.BPROFILE_BUTTON_COMPLETE_CAP;
    need_loc_cap = Messages.BPROFILE_NEED_LOCATION_CAP;
    work_to_turn_search = Messages.BPROFILE_WORK_HOURS_SEARCH_CAP;
    loc_list: any = [];
    bProfile: any = [];
    loc_badges: any = [];
    badge_map_arr: any = [];
    query_executed = false;
    emptyMsg = '';
    subdomain_fields: any = [];
    loc_icon = projectConstants.LOCATION_BADGE_ICON;
    show_addlocationButton = false;
    multipeLocationAllowed = false;
    businessConfig: any = [];
    breadcrumb_moreoptions: any = [];
    init_location = true;
    api_loading = false;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    isCheckin;
    domain: any;
    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private router: Router,
        private shared_services: SharedServices,
        private provider_shared_functions: ProviderSharedFuctions
    ) {
        this.emptyMsg = this.shared_Functionsobj.getProjectMesssages('ADWORD_LISTEMPTY');
    }
    ngOnInit() {
        const user = this.shared_Functionsobj.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getBusinessConfiguration();
        // calling the method to get the list of badges related to location
        // this.bProfile = this.provider_datastorage.get('bProfile');
        this.isCheckin = this.shared_Functionsobj.getitemFromGroupStorage('isCheckin');
    }

    getBusinessConfiguration() {
        this.shared_services.bussinessDomains()
            .subscribe(data => {
                this.businessConfig = data;
                this.getBussinessProfile();
            },
                () => {
                });
    }
    performActions(action) {
        if (action === 'addlocation') {
            this.addLocation();
        } else if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/general->locations']);
        }
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
                            const breadcrumbs = [];
                            this.breadcrumbs_init.map((e) => {
                                breadcrumbs.push(e);
                            });
                            breadcrumbs.push({
                                title: 'Locations'
                            });
                            this.breadcrumbs = breadcrumbs;
                        }
                        if (this.multipeLocationAllowed === false) {
                            const breadcrumbs = [];
                            this.breadcrumbs_init.map((e) => {
                                breadcrumbs.push(e);
                            });
                            breadcrumbs.push({
                                title: 'Location'
                            });
                            this.breadcrumbs = breadcrumbs;
                        }
                    }
                }
                // calling the method to get the list of locations
                this.getProviderLocations();
            },
                () => {
                });
    }
    // get the list of locations added for the current provider
    getProviderLocations() {
        const user = this.shared_Functionsobj.getitemFromGroupStorage('ynw-user');
        this.api_loading = true;
        this.show_addlocationButton = false;
        this.provider_services.getProviderLocations()
            .subscribe(data => {
                this.loc_list = data;
                this.api_loading = false;
                if (this.multipeLocationAllowed && user.accountType === 'INDEPENDENT_SP') {
                    this.show_addlocationButton = true;
                } else {
                    if (this.loc_list.length === 0) {
                        this.show_addlocationButton = true;
                    }
                }
                if (this.init_location) {
                    const actions = [];
                    if (this.show_addlocationButton) {
                        actions.push({ 'title': this.new_loc_cap, 'type': 'addlocation' });
                        actions.push({ 'title': 'Help', 'type': 'learnmore' });
                    } else {
                        actions.push({ 'title': 'Help', 'type': 'learnmore' });
                    }
                    this.breadcrumb_moreoptions = {
                        'show_learnmore': true, 'scrollKey': 'general->locations', 'subKey': '', 'classname': 'b-loc',
                        'actions': actions
                    };
                    this.init_location = false;
                }
                this.query_executed = true;
            });
    }

    changeProviderLocationStatus(obj) {
        this.provider_shared_functions.changeProviderLocationStatusMessage(obj)
            .then((msg_data) => {
                this.provider_services.changeProviderLocationStatus(obj.id, msg_data['chgstatus'])
                    .subscribe(() => {
                        if (msg_data['chgstatus'] === 'enable') {
                            msg_data['msg'] = msg_data['msg'] + '. ' + Messages.ENBALE_QUEUES;
                        }
                        this.shared_Functionsobj.openSnackBar(msg_data['msg']);
                        this.getProviderLocations();
                    },
                        error => {
                            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            this.getProviderLocations();
                        });
            });
    }
    changeProviderBaseLocationStatus(obj) {
        this.provider_services.changeProviderBaseLocationStatus(obj.id)
            .subscribe(() => {
                this.getProviderLocations();
            },
                (error) => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getProviderLocations();
                });
    }
    getLocationBadgeIcon(key) {
        if (!projectConstants.LOCATION_BADGE_ICON[key]) {
            key = 'none';
        }
        const imgurl = 'assets/locationbadges/' + projectConstants.LOCATION_BADGE_ICON[key];
        return imgurl;
    }
    goLocationDetail(location_detail, action) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: action }
        };
        this.router.navigate(['provider', 'settings', 'general',
            'locations', location_detail.id], navigationExtras);
    }
    addLocation() {
        this.router.navigate(['provider', 'settings', 'general',
            'locations', 'add']);
    }
}
