import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
    selector: 'app-provider-waitlist-queue-detail',
    templateUrl: './provider-waitlist-queue-detail.component.html'
})

export class ProviderWaitlistQueueDetailComponent implements OnInit, OnDestroy {

    location_cap = Messages.Q_DET_LOCATION_CAP;
    service_cap = Messages.Q_DET_SERVICE_OFFERD_CAP;
    max_cap = Messages.Q_DET_MAX_CAP_CAP;
    no_of_cap = Messages.Q_DET_NO_OF_CAP;
    served_at_time_cap = Messages.Q_DET_SERVED_AT_A_TIME_CAP;
    ser_time_wind_status_cap = Messages.Q_DET_SER_TIME_WIND_STATUS_CAP;
    enabled_cap = Messages.Q_DET_ENABLED_CAP;
    disabled_cap = Messages.Q_DET_DISABLED_CAP;
    schedule_cap = Messages.Q_DET_SCHEDULE_CAP;
    work_hours = Messages.SERVICE_TIME_CAP;
    on_cap = Messages.WORK_ON_CAP;
    off_cap = Messages.WORK_OFF_CAP;
    enable_msg_cap = Messages.ENABLE_MSG_CAP;
    queue_id = null;
    queue_data;
    mapurl;
    badgeIcons = {};
    loc_badges: any = [];
    badge_map_arr: any = [];
    display_schedule: any = [];
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/waitlist-manager'
        },
        {
            title: this.work_hours,
            url: '/provider/settings/waitlist-manager/queues'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    customer_label = '';
    queuedialogRef;
    api_loading = true;
    isCheckin;

    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute,
        public provider_shared_functions: ProviderSharedFuctions) {
        this.activated_route.params.subscribe(params => {
            this.queue_id = params.id;
        });
        this.customer_label = this.shared_Functionsobj.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.api_loading = true;
        if (this.queue_id) {
            this.getQueueDetail();

        } else {
            this.goBack();
        }
    }
    ngOnDestroy() {
        if (this.queuedialogRef) {
            this.queuedialogRef.close();
        }
    }
    getQueueDetail() {
        this.api_loading = true;
        this.getProviderQueues();
        this.provider_services.getQueueDetail(this.queue_id)
            .subscribe(
                data => {
                    this.queue_data = data;
                    let schedule_arr = [];
                    if (this.queue_data.queueSchedule) {
                        schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queue_data.queueSchedule);
                    }
                    this.display_schedule = [];
                    this.display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);

                    // remove multiple end breadcrumb on edit function
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: this.queue_data.name
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.api_loading = false;
                },
                () => {
                    this.api_loading = false;
                    this.goBack();
                }
            );
    }
    goBack() {
        this.router.navigate(['provider', 'settings', 'waitlist-manager',
            'queues']);
        this.api_loading = false;
    }
    addEditProviderQueue(type) {
        this.provider_shared_functions.addEditQueuePopup(this, type, 'queue_detail', this.queue_data, this.provider_shared_functions.getActiveQueues());
    }
    changeProviderQueueStatus(obj) {
        this.provider_shared_functions.changeProviderQueueStatus(this, obj, 'queue_detail');
    }
    getProviderQueues() {
        const activeQueues: any = [];
        let queue_list: any = [];
        this.provider_services.getProviderQueues()
            .subscribe(data => {
                queue_list = data;
                for (let ii = 0; ii < queue_list.length; ii++) {
                    let schedule_arr = [];
                    // extracting the schedule intervals
                    if (queue_list[ii].queueSchedule) {
                        schedule_arr = this.shared_Functionsobj.queueSheduleLoop(queue_list[ii].queueSchedule);
                    }
                    let display_schedule = [];
                    display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                    if (queue_list[ii].queueState === 'ENABLED') {
                        activeQueues.push(display_schedule[0]);
                    }
                }
                this.provider_shared_functions.setActiveQueues(activeQueues);
            });
    }
}
