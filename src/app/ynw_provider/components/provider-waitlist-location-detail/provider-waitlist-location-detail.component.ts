import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HeaderComponent } from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { AddProviderWaitlistLocationsComponent } from '../add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
@Component({
    selector: 'app-provider-waitlist-location-detail',
    templateUrl: './provider-waitlist-location-detail.component.html'
})
export class ProviderWaitlistLocationDetailComponent implements OnInit, OnDestroy {
    location_id = null;
    location_data;
    queues: any = [];
    mapurl;
    badgeIcons = {};
    loc_badges: any = [];
    badge_map_arr: any = [];
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Waitlist Manager',
            url: '/provider/settings/waitlist-manager'
        },
        {
            title: 'Locations',
            url: '/provider/settings/waitlist-manager/locations'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    api_success = null;
    api_error = null;
    editlocdialogRef;
    queuedialogRef;
    constructor(
        private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
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
        this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
        if (this.location_id) {
            this.getLocationBadges();
            this.getLocationDetail();
        } else {
            this.goBack();
        }
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
        this.provider_services.getLocationDetail(this.location_id)
            .subscribe(
                data => {
                    this.location_data = data;
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
                        this.mapurl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?zoom=11&center=' + this.location_data.lattitude + ',' + this.location_data.longitude + '&key=AIzaSyBy0c2wXOnE16A7Xr4NKrELGa_m_8KCy6U');
                    }
                },
                error => {
                    this.goBack();
                }
            );
    }
    changeProviderLocationStatus(obj) {
        this.provider_shared_functions.changeProviderLocationStatusMessage(obj)
            .then((msg_data) => {

                this.provider_services.changeProviderLocationStatus(obj.id, msg_data['chgstatus'])
                    .subscribe(data => {
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
            .subscribe(data => {
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
                        // console.log('queue', this.queues);
                    },
                    error => {
                    }
                );
        }
    }
    goBack() {
        this.router.navigate(['provider', 'settings', 'waitlist-manager',
            'locations']);
    }
    editLocation(badge?) {
        this.editlocdialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'locationoutermainclass'],
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
        this.router.navigate(['provider/settings/waitlist-manager/', 'queue-detail', queue.id]);
    }
}
