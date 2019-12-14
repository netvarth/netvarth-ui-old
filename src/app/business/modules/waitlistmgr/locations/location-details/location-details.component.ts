import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GoogleMapComponent } from '../../../../../ynw_provider/components/googlemap/googlemap.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { AddProviderWaitlistLocationsComponent } from '../../../../../ynw_provider/components/add-provider-waitlist-locations/add-provider-waitlist-locations.component';

@Component({
    selector: 'app-location-details',
    templateUrl: './location-details.component.html'
})

export class LocationDetailsComponent implements OnInit, OnDestroy {
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
    location_map_cap = Messages.LOCATION_MAP_CAP;
    location_map_message = Messages.LOCATION_MAP_MESSAGE_CAP;
    loc_placeholder = Messages.LOC_PLACEHOLDER;
    address_cap = Messages.LOCATION_ADDRESS_CAP;
    open_cap = Messages.OPEN_CAP;
    cancel_btn = Messages.CANCEL_BTN;
    save_btn = Messages.SAVE_BTN;
    map_url_cap = Messages.MAP_URL_CAP;
    location_id = null;
    location_data;
    queues: any = [];
    mapurl;
    badgeIcons = {};
    api_loading = false;
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
            url: '/provider/settings/q-manager/locations'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    api_success = null;
    api_error = null;
    editlocdialogRef;
    queuedialogRef;
    isCheckin;
    active_Schedules: any = [];
    action;
    amForm: FormGroup;
    schedule_arr: any = [];
    sel_badges: any = [];
    schedule_json: any = [];
    forbadge = false;
    disableButton: boolean;
    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private provider_shared_functions: ProviderSharedFuctions,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        private _location: Location,
        private dialog: MatDialog) {
        this.activated_route.params.subscribe(params => {
            this.location_id = params.id;
        });
        this.activated_route.queryParams.subscribe(qparams => {
            this.action = qparams.action;
        });
    }
    ngOnInit() {
        this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
        if (this.action !== 'add') {
            this.getLocationBadges();
            this.getLocationDetail();
        } else {
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: 'Add'
            });
            this.breadcrumbs = breadcrumbs;
            this.action = this.location_id;
            this.createForm();
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

    createForm() {
        this.amForm = this.fb.group({
            locname: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_BLANK_FALSE)])],
            locaddress: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
            loclattitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])],
            loclongitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])],
            locmapurl: [{ value: '', disabled: true }]
        });
        this.api_loading = false;
        if (this.action === 'edit' || this.action === 'editbase') {
            this.updateForm();
        }
    }

    updateForm() {
        if (this.location_data) {
        this.amForm.setValue({
            locname: this.location_data.place || null,
            locaddress: this.location_data.address || null,
            loclattitude: this.location_data.lattitude || null,
            loclongitude: this.location_data.longitude || null,
            locmapurl: this.location_data.googleMapUrl || null
        });
    }
        this.schedule_arr = [];
        // extracting the schedule intervals
        console.log(this.location_data);
        if (this.location_data && this.location_data.bSchedule && this.location_data.bSchedule.timespec) {
            for (let i = 0; i < this.location_data.bSchedule.timespec.length; i++) {
                for (let j = 0; j < this.location_data.bSchedule.timespec[i].repeatIntervals.length; j++) {
                    // pushing the schedule details to the respective array to show it in the page
                    this.schedule_arr.push({
                        day: this.location_data.bSchedule.timespec[i].repeatIntervals[j],
                        sTime: this.location_data.bSchedule.timespec[i].timeSlots[0].sTime,
                        eTime: this.location_data.bSchedule.timespec[i].timeSlots[0].eTime
                    });
                }
            }
        }
    }

    getLocationDetail() {
        this.api_loading = true;
        this.provider_services.getLocationDetail(this.location_id)
            .subscribe(
                data => {
                    this.location_data = data;
                    console.log(this.location_data);
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
                    if (this.action === 'edit' || this.action === 'editbase') {
                        this.createForm();
                    }
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
                        this.getLocationDetail();
                    },
                        error => {
                            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            this.getLocationDetail();
                        });
            });
    }
    changeProviderBaseLocationStatus(obj) {
        this.resetApiErrors();
        this.provider_services.changeProviderBaseLocationStatus(obj.id)
            .subscribe(() => {
                this.shared_Functionsobj.openSnackBar(Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place));
                this.getLocationDetail();
            },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    }
    editLocation(badge?) {
        if (badge) {
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
        } else {
            this.action = 'edit';
            this.createForm();
        }
    }
    getLocationBadges() {
        this.provider_services.getLocationBadges()
            .subscribe(data => {
                this.loc_badges = data;
                for (const badge of this.loc_badges) {
                    this.badge_map_arr[badge.name] = badge.displayName;
                }
            });
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
    public GetControl(form: FormGroup, field: string) {
        return form.get(field);
    }
    showGooglemap() {
        this.resetApiErrors();
        const dialogRef = this.dialog.open(GoogleMapComponent, {
            width: '50%',
            panelClass: 'googlemainmappopup',
            disableClose: true,
            data: {
                type: 'add',
                passloc: { 'lat': this.GetControl(this.amForm, 'loclattitude').value, 'lon': this.GetControl(this.amForm, 'loclongitude').value }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result['status'] === 'selectedonmap') {
                    if (result['map_point'].latitude) {
                        const mapurl = projectConstants.MAP_BASE_URL + result['map_point'].latitude + ',' + result['map_point'].longitude + '/@' + result['map_point'].latitude + ',' + result['map_point'].longitude + ',15z';
                        this.amForm.patchValue({
                            loclattitude: result['map_point'].latitude || null,
                            loclongitude: result['map_point'].longitude || null,
                            locmapurl: mapurl || null,
                        });
                    }
                    this.amForm.patchValue({
                        locaddress: result['address'] || null
                    });
                    this.amForm.patchValue({
                        locname: result['location']
                    });
                }
            }
        });
    }
    handlesSaveschedule(obj) {
        this.schedule_arr = obj;
        this.api_success = this.api_error = '';
    }
    handle_badge_click(obj) {
        const indx = this.sel_badges.indexOf(obj.name);
        if (indx !== -1) {
            this.sel_badges.splice(indx, 1);
        } else {
            this.sel_badges.push(obj.name);
        }
    }
    checkbadgealreadyselected(obj) {
        if (this.sel_badges.indexOf(obj.name) !== -1) {
            return true;
        }
    }
    onSubmit(form_data) {
        this.disableButton = true;
        let post_itemdata2;
        // Check whether atleast one schedule is added
        if (this.schedule_arr.length === 0) {
            this.schedule_json = [];
        } else {
            this.schedule_json = [];
            let mon;
            const cdate = new Date();
            mon = (cdate.getMonth() + 1);
            if (mon < 10) {
                mon = '0' + mon;
            }
            const today = cdate.getFullYear() + '-' + mon + '-' + cdate.getDate();
            const save_schedule = this.shared_Functionsobj.prepareScheduleforSaving(this.schedule_arr);
            for (const schedule of save_schedule) {
                this.schedule_json.push({
                    'recurringType': 'Weekly',
                    'repeatIntervals': schedule.daystr,
                    'startDate': today,
                    'terminator': {
                        'endDate': '',
                        'noOfOccurance': ''
                    },
                    'timeSlots': [{
                        'sTime': schedule.stime,
                        'eTime': schedule.etime
                    }]
                });
            }
        }
        if (this.forbadge === true) {
            post_itemdata2 = {
                'open24hours': (form_data.loct24hour) ? true : false
            };
            if (form_data.locparkingtype) {
                post_itemdata2.parkingType = form_data.locparkingtype;
            }
            post_itemdata2.locationVirtualFields = {};
            if (this.sel_badges.length > 0) {
                for (let i = 0; i < this.sel_badges.length; i++) {
                    post_itemdata2.locationVirtualFields[this.sel_badges[i]] = true;
                }
            }
        } else {
            const curlabel = form_data.locname;
            const pattern2 = new RegExp(projectConstants.VALIDATOR_BLANK);
            const result2 = pattern2.test(curlabel);
            if (result2) {
                this.api_error = this.shared_Functionsobj.getProjectMesssages('BPROFILE_LOCNAME_BLANK'); // 'Phone label should not be blank';
                this.disableButton = false;
                return;
            }
            form_data.locmapurl = this.amForm.controls['locmapurl'].value;
            post_itemdata2 = {
                'place': form_data.locname || '',
                'longitude': form_data.loclongitude || '',
                'lattitude': form_data.loclattitude || '',
                'googleMapUrl': form_data.locmapurl || '',
                'address': form_data.locaddress || ''
            };
            if (this.schedule_json.length > 0) {
                post_itemdata2.bSchedule = {};
                post_itemdata2.bSchedule.timespec = this.schedule_json;
            }
        }
        if (this.location_data && this.location_data.id) {
            post_itemdata2.id = this.location_data.id;
            this.provider_services.editProviderLocation(post_itemdata2)
                .subscribe(
                    () => {
                        if (this.forbadge === true) {
                            this.api_success = this.shared_Functionsobj.getProjectMesssages('WAITLIST_LOCATION_AMINITIES_SAVED');
                        } else {
                            this.api_success = this.shared_Functionsobj.getProjectMesssages('WAITLIST_LOCATION_UPDATED');
                        }

                    },
                    error => {
                        this.api_error = this.shared_Functionsobj.getProjectErrorMesssages(error);
                        this.disableButton = false;
                    }
                );
        } else {
            this.provider_services.addProviderLocation(post_itemdata2)
                .subscribe(
                    () => {
                        this.api_error = '';
                        this.api_success = this.shared_Functionsobj.getProjectMesssages('WAITLIST_LOCATION_CREATED');

                    },
                    error => {
                        this.api_success = '';
                        this.api_error = this.shared_Functionsobj.getProjectErrorMesssages(error);
                        this.disableButton = false;
                    }
                );
        }
    }
    closeClick() {
        if (this.action === 'edit') {
            this.action = 'view';
        } else {
            this._location.back();
        }
    }
}
