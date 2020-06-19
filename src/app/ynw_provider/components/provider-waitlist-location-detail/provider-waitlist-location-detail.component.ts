import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { AddProviderWaitlistLocationsComponent } from '../add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
@Component({
    selector: 'app-provider-waitlist-location-detail',
    templateUrl: './provider-waitlist-location-detail.component.html'
})
export class ProviderWaitlistLocationDetailComponent implements OnInit, OnDestroy {
    longitude_cap = Messages.BPROFILE_LONGITUDE_CAP;
    latitude_cap = Messages.BPROFILE_LATIITUDE_CAP;
    enable_cap = Messages.ENABLE_CAP;
    disable_cap = Messages.DISABLE_CAP;
    loc_amenities_cap = Messages.BPROFILE_LOCATION_AMENITIES;
    you_havent_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_it_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    service_winds_cap = Messages.SERVICE_TIME_CAP;
    serv_window_cap = Messages.SERV_TIME_WINDOW_CAP;
    status_cap = Messages.COUPONS_STATUS_CAP;
    base_loca_cap = Messages.WAITLIST_BASE_LOC_CAP;
    loc_status_cap = Messages.WAITLIST_LOC_STATUS_CAP;
    set_base_loc_cap = Messages.WAITLIST_SET_BASE_CAP;
    schedule_cap = Messages.WAITLIST_SCHEDULE_CAP;
    waitlist_cap = Messages.WAITLIST_CAP;
    queues_cap = Messages.SERVICE_TIME_CAP;
    loca_hours = Messages.LOCATION_HOURS_CAP;
    location_id = null;
    location_data;
    queues: any = [];
    mapurl;
    badgeIcons = {};
    api_loading = true;
    loc_badges: any = [];
    badge_map_arr: any = [];
    display_schedule: any = [];
    schedule_ar: any = [];
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
        {
            title: 'Locations',
            url: '/provider/settings/general/locations'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    api_success = null;
    api_error = null;
    editlocdialogRef;
    queuedialogRef;
    isCheckin;
    active_Schedules: any = [];
    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private dialog: MatDialog,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private provider_shared_functions: ProviderSharedFuctions) {
        this.activated_route.params.subscribe(params => {
            this.location_id = params.id;
        });
    }
    ngOnInit() {
        this.api_loading = true;
        this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
        if (this.location_id) {
            this.getLocationBadges();
            this.getLocationDetail();
        } else {
            this.goBack();
        }
        this.isCheckin = this.shared_Functionsobj.getitemFromGroupStorage('isCheckin');
    }
    ngOnDestroy() {
        if (this.editlocdialogRef) {
            this.editlocdialogRef.close();
        }
        if (this.queuedialogRef) {
            this.queuedialogRef.close();
        }
    }
    getLocationDetail() {
        this.api_loading = true;
        this.provider_services.getLocationDetail(this.location_id)
            .subscribe(
                data => {
                    this.location_data = data;
                    let schedule_arr = [];
                    this.active_Schedules = [];
                    this.schedule_ar = [];
                    if (this.location_data.bSchedule) {
                        for (let i = 0; i < this.location_data.bSchedule.timespec.length; i++) {
                            schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.location_data.bSchedule.timespec[i]);
                            if (schedule_arr.length !== 0) {
                                this.active_Schedules.push(schedule_arr);
                            }
                        }
                    }
                    for (let i = 0; i < this.active_Schedules.length; i++) {
                        this.schedule_ar.push(this.shared_Functionsobj.arrageScheduleforDisplay(this.active_Schedules[i]));
                    }
                    this.display_schedule = [];
                    for (let i = 0; i < this.schedule_ar.length; i++) {
                        this.display_schedule[i] = this.schedule_ar[i][0];
                    }
                    this.getQueueList(this.location_id);
                    // remove multiple end breadcrumb on edit function
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: this.location_data.place
                    });
                    this.breadcrumbs = breadcrumbs;
                    if (this.location_data.lattitude !== '' && this.location_data.longitude !== '') {
                        this.mapurl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?zoom=11&center=' + this.location_data.lattitude + ',' + this.location_data.longitude + '&key=' + projectConstants.GOOGLEAPIKEY);
                    }
                    this.api_loading = false;
                },
                () => {
                    this.api_loading = false;
                    this.goBack();
                }
            );
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
                        /*this.api_success = msg_data['msg'];
                        setTimeout(() => {
                            this.resetApiErrors();
                        }, projectConstants.TIMEOUT_DELAY_LARGE);*/
                        this.getLocationDetail();
                    },
                        error => {
                            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            /*this.api_error = error.error;
                            setTimeout(() => {
                                this.resetApiErrors();
                            }, projectConstants.TIMEOUT_DELAY_LARGE);*/
                            this.getLocationDetail();
                        });

            });

    }
    changeProviderBaseLocationStatus(obj) {
        this.resetApiErrors();
        this.provider_services.changeProviderBaseLocationStatus(obj.id)
            .subscribe(() => {
                this.shared_Functionsobj.openSnackBar(Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place));
                /*this.api_success = Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place);
                setTimeout(() => {
                this.resetApiErrors();
                }, projectConstants.TIMEOUT_DELAY_LARGE);*/
                this.getLocationDetail();
            },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    /*this.api_error = error.error;
                    setTimeout(() => {
                    this.resetApiErrors();
                    }, projectConstants.TIMEOUT_DELAY_LARGE);*/
                    this.getLocationDetail();
                });
    }
    getQueueList(location_id) {
        if (location_id) {
            this.provider_services.getProviderLocationQueues(location_id)
                .subscribe(
                    data => {
                        this.queues = data;

                        for (let ii = 0; ii < this.queues.length; ii++) {
                            let schedule_arr = [];
                            // extracting the schedule intervals
                            if (this.queues[ii].queueSchedule) {
                                schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queues[ii].queueSchedule);
                            }
                            let display_schedule = [];
                            display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                            this.queues[ii]['displayschedule'] = display_schedule;
                        }
                    },
                    () => {
                    }
                );
        }
    }
    goBack() {
        this.router.navigate(['provider', 'settings', 'q-manager',
            'locations']);
        this.api_loading = false;
    }
    editLocation(badge?) {
        this.editlocdialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'locationoutermainclass'],
            disableClose: true,
            autoFocus: true,
            data: {
                location: this.location_data,
                badges: this.loc_badges,
                type: 'edit',
                source: 'waitlist',
                forbadge: (badge) ? true : false
            }
        });
        this.editlocdialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result === 'reloadlist') {
                    this.getLocationDetail();
                }
            }
        });
    }
    getLocationBadges() {
        this.api_loading = true;
        this.provider_services.getLocationBadges()
            .subscribe(data => {
                this.loc_badges = data;
                for (const badge of this.loc_badges) {
                    this.badge_map_arr[badge.name] = badge.displayName;
                }
            });
        this.api_loading = false;
    }
    objectKeys(obj) {
        return Object.keys(obj);
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    changeProviderQueueStatus(obj) {
        this.provider_shared_functions.changeProviderQueueStatus(this, obj, 'location_detail');
    }
    getProviderQueues() {
        this.getQueueList(this.location_id);
    }
    addEditProviderQueue(type, queue = null) {
        if (this.location_id && type === 'add') {
            queue = { 'location': { id: null } };
            queue.location.id = this.location_id;
        }
        this.provider_shared_functions.addEditQueuePopup(this, type, 'location_detail', queue, this.provider_shared_functions.getActiveQueues());
    }
    goQueueDetail(queue) {
        this.router.navigate(['provider/settings/q-manager/', 'queues', queue.id]);
    }
}
