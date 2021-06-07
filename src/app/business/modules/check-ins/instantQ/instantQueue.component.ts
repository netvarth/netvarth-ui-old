import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../app.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';

@Component({
    selector: 'app-instantQueue',
    templateUrl: './instantQueue.component.html',
    styleUrls: ['./instantQueue.component.css']
})

export class instantQueueComponent implements OnInit {
    start_hour;
    start_min;
    fromDateCaption;
    toDateCaption;
    now: string;
    instantQForm: FormGroup;
    services_list: any = [];
    servicelist = [];
    sTimeEditable = false;
    eTimeEditable = false;
    api_error = null;
    api_success = null;
    location: any;
    userId;
    action: string;
    qId: any;
    instantQId;
    queue_list: any = {};
    loading = true;
    constructor(
        public dialogRef: MatDialogRef<instantQueueComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public sharedfunctionObj: SharedFunctions,
        private wordProcessor: WordProcessor,
        private shared_services: SharedServices,
        private fb: FormBuilder,
        private lStorageService: LocalStorageService,
        private provider_services: ProviderServices,
        private snackbarService: SnackbarService,
        public fed_service: FormMessageDisplayService,
    ) {
        this.location = data.location;
        this.userId = data.userId;
        if (data.instaQid) {
            this.instantQId = data.instaQid;
            this.action = 'edit';
            this.getProviderQueuedetails();
        }
    }
    ngOnInit() {
        this.getServices().then(
            () => {
                if (this.services_list.length === 0) {
                    this.getglobalServices().then(
                        () => {
                        });
                }
                this.initInstantQForm();
            }
        );
    }
    getProviderQueuedetails() {
        this.provider_services.getQueueDetail(this.instantQId)
            .subscribe(data => {
                this.queue_list = data;
            });
    }
    initInstantQForm() {
        this.shared_services.getSystemDate()
            .subscribe(
                res => {
                    this.lStorageService.setitemonLocalStorage('sysdate', res);
                    let server_date;
                    server_date = res;
                    this.createForm(server_date);
                });
    }
    createForm(server_date) {
        this.qId = this.queue_list.id;
        const todaydt = new Date(server_date);
        console.log(server_date);
        console.log(moment(server_date).format());
        this.start_hour = parseInt(moment(new Date(todaydt), ['hh:mm A']).format('HH'));
        this.start_min = parseInt(moment(new Date(todaydt), ['hh:mm A']).format('mm'));
        this.now = moment(new Date(todaydt), ['hh:mm A']).add(2, 'hours').format('hh:mm A');
        this.fromDateCaption = 'Now';
        this.toDateCaption = '11:59 PM';
        this.instantQForm = this.fb.group({
            dstart_time: [{ hour: parseInt(moment(server_date).format('HH')), minute: parseInt(moment(server_date).format('mm')) }, Validators.compose([Validators.required])],
            dend_time: [{ hour: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('HH'), 10), minute: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('mm'), 10) }, Validators.compose([Validators.required])]
        });
        setTimeout(() => {
            this.loading = false;
        }, 500);
    }
    editStartTime() {
        this.sTimeEditable = true;
        let sttime;
        const curtime = {};
        if (this.fromDateCaption === 'Now') {
            const server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
            console.log(server_date);
            const today = server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            console.log(today);
            console.log("moment(server_date, ['hh:mm A']):"+moment(server_date, ['hh:mm:ss A']));
            console.log("moment(server_date, ['hh:mm A']).format('HH'):"+moment(server_date, ['hh:mm:ss A']).format('HH'));
            console.log("moment(server_date, ['hh:mm A']).format('hh'):"+moment(server_date, ['hh:mm:ss A']).format('hh'));
            console.log("parseInt(moment(server_date).format('HH'):"+parseInt(moment(server_date).format('HH')));
            console.log(moment("2010-10-20 4:30","YYYY-MM-DD HH:mm").format('HH'));
            console.log(moment(server_date,"YYYY-MM-DD HH:mm").format('HH'));
            console.log(moment(server_date,"YYYY-MM-DD HH:mm")); 
            // curtime['hour'] = parseInt(moment(server_date, ['hh:mm A']).format('HH'));
            // curtime['minutes'] = parseInt(moment(server_date, ['hh:mm A']).format('mm'));
            curtime['hour'] = parseInt(moment(server_date).format('HH'));
            curtime['minutes'] = parseInt(moment(server_date).format('mm'));
        } else {
            curtime['hour'] = parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('HH'), 10);
            curtime['minutes'] = parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('mm'), 10);
        }
        sttime = {
            hour: curtime['hour'],
            minute: curtime['minutes']
        };
        console.log(sttime);
        this.instantQForm.patchValue({
            dstart_time: sttime || null,
        });
    }
    editEndTime() {
        this.eTimeEditable = true;
        let sttime;
        const curtime = {};
        curtime['hour'] = parseInt(moment(this.toDateCaption, ['hh:mm A']).format('HH'), 10);
        curtime['minutes'] = parseInt(moment(this.toDateCaption, ['hh:mm A']).format('mm'), 10);
        sttime = {
            hour: curtime['hour'],
            minute: curtime['minutes']
        };
        this.instantQForm.patchValue({
            dend_time: sttime || null,
        });
    }
    getServices() {
        const params = { 'status-eq': 'ACTIVE', 'serviceType-neq': 'donationService', 'provider-eq': this.userId };
        return new Promise<void>((resolve, reject) => {
            this.provider_services.getServicesList(params)
                .subscribe(data => {
                    this.services_list = data;
                    resolve();
                },
                    (error) => {
                        reject(error);
                    });
        });
    }
    getglobalServices() {
        const params = { 'status-eq': 'ACTIVE', 'serviceType-neq': 'donationService', 'scope-eq': 'account' };
        return new Promise<void>((resolve, reject) => {
            this.provider_services.getServicesList(params)
                .subscribe(data => {
                    this.services_list = data;
                    resolve();
                },
                    (error) => {
                        reject(error);
                    });
        });
    }
    onSubmit(instantQ) {
        this.resetApiErrors();
        const server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
        const todaydt = new Date(server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        const dd = today.getDate();
        const mm = today.getMonth() + 1; // January is 0!
        const yyyy = today.getFullYear();
        let sTime = instantQ.dstart_time;
        if (isNaN(instantQ.dstart_time.hour)) {
            const curtime = {};
            const toda = new Date(todaydt);
            const today1 = moment(toda).format();
            curtime['hour'] = parseInt(moment(new Date(today1), ['hh:mm A']).format('HH'), 10);
            curtime['minutes'] = parseInt(moment(new Date(today1), ['hh:mm A']).format('mm'), 10);
            sTime = {
                hour: curtime['hour'],
                minute: curtime['minutes']
            };
        }
        const dtoday = yyyy + '-' + mm + '-' + dd;
        const instantScheduleJson = {
            'recurringType': 'Once',
            'startDate': dtoday,
            'terminator': {
                'endDate': null,
                'noOfOccurance': null
            },
            'timeSlots': [{
                'sTime': moment(sTime).format('hh:mm A') || null,
                'eTime': moment(instantQ.dend_time).format('hh:mm A') || null
            }]
        };
        const instantQInput = {};
        const services = [];
        for (let i = 0; i < this.servicelist.length; i++) {
            services.push({ 'id': this.servicelist[i].id });
        }
        if (this.action === 'edit') {
            instantQInput['id'] = this.qId;
        }
        const serv = [];
        serv.push({ 'id': this.services_list[0].id });
        instantQInput['location'] = this.location.id;
        if (this.action !== 'edit') {
            instantQInput['services'] = serv;
        }
        instantQInput['queueSchedule'] = instantScheduleJson;
        instantQInput['name'] = (moment(sTime).format('hh:mm A') || null) + '-' + (moment(instantQ.dend_time).format('hh:mm A') || null);
        instantQInput['onlineCheckin'] = true;
        instantQInput['futureWaitlist'] = false;
        instantQInput['parallelServing'] = 1;
        instantQInput['capacity'] = 50;
        instantQInput['queueState'] = 'ENABLED';
        instantQInput['availabilityQueue'] = true;
        instantQInput['instantQueue'] = true;
        instantQInput['provider'] = { 'id': this.userId }
        this.createInstantQ(instantQInput);
    }
    createInstantQ(post_data) {
        this.provider_services.addMyAvailbility(post_data)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('MADE_YOURSELF_AVAIL_NOW'), { 'panelClass': 'snackbarnormal' });
                    this.dialogRef.close('reloadlist');
                },
                (error) => {
                    this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                }
            );
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    close() {
        this.dialogRef.close('reloadlist');
    }
}
