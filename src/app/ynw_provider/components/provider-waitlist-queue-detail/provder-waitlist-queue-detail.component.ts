import { Component, OnInit } from '@angular/core';
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
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
    selector: 'app-provider-waitlist-queue-detail',
    templateUrl: './provider-waitlist-queue-detail.component.html'
})

export class ProviderWaitlistQueueDetailComponent implements OnInit {

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
          title: 'Waitlist Manager',
          url: '/provider/settings/waitlist-manager'
        },
        {
          title: 'Queues',
          url: '/provider/settings/waitlist-manager/queues'
        }
      ];
    breadcrumbs = this.breadcrumbs_init;

    constructor(
        private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        private shared_Functionsobj: SharedFunctions,
        private dialog: MatDialog,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        public provider_shared_functions: ProviderSharedFuctions) {

            this.activated_route.params.subscribe(params => {
                this.queue_id = params.id;
            });
        }

    ngOnInit() {

        if (this.queue_id) {
            this.getQueueDetail();

        } else {
            this.goBack();
        }
    }

    getQueueDetail() {
        this.provider_services.getQueueDetail(this.queue_id)
        .subscribe(
            data => {
                this.queue_data = data;
                let schedule_arr = [];
                if (this.queue_data.queueSchedule) {
                 schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queue_data.queueSchedule);
                }
                this.display_schedule = [];
                this.display_schedule =  this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);

                // remove multiple end breadcrumb on edit function
                const breadcrumbs = [];
                this.breadcrumbs_init.map((e) => {
                   breadcrumbs.push(e);
                });
                breadcrumbs.push({
                    title: this.queue_data.name
                });
                this.breadcrumbs = breadcrumbs;

           },
            error => {
                this.goBack();
            }
        );
    }

    goBack() {
        this.router.navigate(['provider', 'settings' , 'waitlist-manager',
        'queues']);
    }


    addEditProviderQueue(type) {
      this.provider_shared_functions.addEditQueuePopup(this, type, 'queue_detail', this.queue_data);

    }

    changeProviderQueueStatus(obj) {
      this.provider_shared_functions.changeProviderQueueStatus(this, obj, 'queue_detail');
    }



}
