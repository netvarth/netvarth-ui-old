import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';

@Component({
  selector: 'app-instantQueue',
  templateUrl: './instantQueue.component.html',
  styleUrls: ['./instantQueue.component.css']
})

export class instantQueueComponent implements OnInit {

  note_cap = Messages.CONS_NOTE_NOTE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  checkin;
  consumer_label = '';
  type;
  noteTitle;
  qAvailability;
  start_hour;
  start_min;
  amOrPm;
  qstartamOrPm;
  qendamOrPm;
  fromDateCaption;
    toDateCaption;
    now: string;
    instantQForm: FormGroup;
    capacityEditable = false;
    parallelServeEditable = false;
    capacitylimit = projectConstants.QTY_MAX_VALUE;
    parallellimit = projectConstantsLocal.VALIDATOR_MAX150;
    isAllServicesSelected = false;
    services_selected: any = [];
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
    queue_list: any={};
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
    console.log(data);
    this.location = data.location;
    this.userId = data.userId;
    this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
    if(data.instaQid){
        this.instantQId = data.instaQid;
        this.action ='edit';
        this.getProviderQueuedetails();

    }
    
  }

  ngOnInit() {
            this.getServices().then(
                () => {
                    if(this.services_list.length === 0){
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
            console.log(this.queue_list);
        });
}
  initInstantQForm() {
    console.log('kio');
    this.shared_services.getSystemDate()
        .subscribe(
            res => {
                this.lStorageService.setitemonLocalStorage('sysdate', res);
                let server_date;
                server_date = res;
                 console.log('kio1');
                this.createForm(server_date);
               // this.showInstantQFlag = true;
                // this.selectAllService();
                if (this.queue_list) {
                   this.updateForm(this.queue_list);
                }
            });
}

createForm(server_date) {
    console.log('kio2');
    const todaydt = new Date(server_date);
    // tslint:disable-next-line:radix
    this.start_hour = parseInt(moment(new Date(todaydt), ['hh:mm A']).format('HH'));
    // tslint:disable-next-line:radix
    this.start_min = parseInt(moment(new Date(todaydt), ['hh:mm A']).format('mm'));
    this.now = moment(new Date(todaydt), ['hh:mm A']).add(2, 'hours').format('hh:mm A');
    // if (!this.qAvailability.availableNow) {
    //     this.fromDateCaption = 'Now';
    //     if (this.qAvailability.timeRange) {
    //         this.toDateCaption = this.qAvailability.timeRange.eTime;
    //     } else {
    //         this.toDateCaption = '11:59 PM';
    //     }
    // } else {
    //     this.fromDateCaption = this.qAvailability.timeRange.eTime;
    //     this.toDateCaption = '11:59 PM';
    // }
    this.fromDateCaption = 'Now';
    this.toDateCaption = '11:59 PM';
    if (this.fromDateCaption === 'Now') {
        this.instantQForm = this.fb.group({
            // tslint:disable-next-line:radix
            dstart_time: [{ hour: parseInt(moment(new Date(todaydt), ['hh:mm A']).format('HH')), minute: parseInt(moment(new Date(todaydt), ['hh:mm A']).format('mm')) }, Validators.compose([Validators.required])],
            // tslint:disable-next-line:radix
            dend_time: [{ hour: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('HH'), 10), minute: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('mm'), 10) }, Validators.compose([Validators.required])],
            qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
            qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])]
        });
    } else {
        this.instantQForm = this.fb.group({
            // tslint:disable-next-line:radix
            dstart_time: [{ hour: parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('HH'), 10), minute: parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('mm'), 10) }, Validators.compose([Validators.required])],
            // tslint:disable-next-line:radix
            dend_time: [{ hour: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('HH'), 10), minute: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('mm'), 10) }, Validators.compose([Validators.required])],
            qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
            qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])]
        });
    }
}

updateForm(q) {
    this.qId = q.id;
    this.fromDateCaption = q.queueSchedule.timeSlots[0].sTime;
    this.toDateCaption = q.queueSchedule.timeSlots[0].eTime;
    const sttime = {
        hour: parseInt(moment(q.queueSchedule.timeSlots[0].sTime,
            ['h:mm A']).format('HH'), 10),
        minute: parseInt(moment(q.queueSchedule.timeSlots[0].sTime,
            ['h:mm A']).format('mm'), 10)
    };
    const edtime = {
        hour: parseInt(moment(q.queueSchedule.timeSlots[0].eTime,
            ['h:mm A']).format('HH'), 10),
        minute: parseInt(moment(q.queueSchedule.timeSlots[0].eTime,
            ['h:mm A']).format('mm'), 10)
    };
    this.instantQForm.setValue({
        dstart_time: sttime || null,
        dend_time: edtime || null,
        qcapacity: q.capacity || null,
        qserveonce: q.parallelServing || null
    });
    for (let j = 0; j < q.services.length; j++) {
        for (let k = 0; k < this.services_list.length; k++) {
            if (q.services[j].id === this.services_list[k].id) {
                this.services_list[k].checked = true;
                this.services_selected.push(q.services[j].id);
            }
        }
    }
    if (this.services_selected.length === this.services_list.length) {
        this.isAllServicesSelected = true;
    }
   // this.loc_name = q.location.place;
    //this.location = q.location;
}
editStartTime() {
    this.sTimeEditable = true;
    let sttime;
    const curtime = {};
    
        if (this.fromDateCaption === 'Now') {
            const server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
            const today = server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            curtime['hour'] = parseInt(moment(new Date(today), ['hh:mm A']).format('HH'), 10);
            curtime['minutes'] = parseInt(moment(new Date(today), ['hh:mm A']).format('mm'), 10);
        } else {
            curtime['hour'] = parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('HH'), 10);
            curtime['minutes'] = parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('mm'), 10);
        }
        sttime = {
            hour: curtime['hour'],
            minute: curtime['minutes']
        };
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
    const params = { 'status-eq': 'ACTIVE', 'serviceType-neq': 'donationService' ,'provider-eq':this.userId};
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
    const params = { 'status-eq': 'ACTIVE', 'serviceType-neq': 'donationService' ,'scope-eq': 'account' };
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
isAvailableNow() {
    return new Promise<void>((resolve, reject) => {
        this.provider_services.isAvailableNow()
            .subscribe(data => {
                this.qAvailability = data;
                // const message = {};
                // message['ttype'] = 'instant_q';
                // message['qAvailability'] = this.qAvailability;
                // this.shared_Functionsobj.sendMessage(message);
                resolve();
            },
                (error) => {
                    reject(error);
                });
    });
}
selectAllService() {
    for (let i = 0; i < this.services_list.length; i++) {
        this.services_list[i].checked = true;
        this.servicelist.push(this.services_list[i]);
    }
    this.isAllServicesSelected = true;
}
/**
 * Method to deselect all services
 */
deselectAllService() {
    for (let i = 0; i < this.services_list.length; i++) {
        delete this.services_list[i].checked;
        this.servicelist = [];
    }
    this.isAllServicesSelected = false;
}
/**
 * Handling Service Checkbox list
 * @param index index of the service check box selected
 */
handleServicechecbox(index) {
    this.servicelist = [];
    this.isAllServicesSelected = true;
    if (this.services_list[index].checked) {
        delete this.services_list[index].checked;
    } else {
        this.services_list[index].checked = true;
    }
    for (let i = 0; i < this.services_list.length; i++) {
        if (this.services_list[i].checked === true) {
            this.servicelist.push(this.services_list[i]);
        } else {
            this.isAllServicesSelected = false;
        }
    }
}

onSubmit(instantQ) {
    console.log(instantQ);
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
        // const todaydt1 = new Date(server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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
    //else {
    //     if (this.selectedQlocation === null) {
    //         this.selectedQlocation = this.selected_location;
    //     }
    //     this.locid = { 'id': this.selectedQlocation.id };
    // }
    const serv=[];
    serv.push({'id':this.services_list[0].id});
    instantQInput['location'] =this.location.id;
   // instantQInput['services'] = services;
   if (this.action !== 'edit') {
    instantQInput['services'] = serv;
   }
  
    instantQInput['queueSchedule'] = instantScheduleJson;
    instantQInput['name'] = (moment(sTime).format('hh:mm A') || null) + '-' + (moment(instantQ.dend_time).format('hh:mm A') || null);
    instantQInput['onlineCheckin'] = true;
    instantQInput['futureWaitlist'] = false;
    instantQInput['parallelServing'] = instantQ.qserveonce;
    instantQInput['capacity'] = instantQ.qcapacity;
    instantQInput['queueState'] = 'ENABLED';
    instantQInput['availabilityQueue'] = true;
    instantQInput['instantQueue'] = true;
    instantQInput['provider'] = {'id': this.userId }
    if (!this.sharedfunctionObj.checkIsInteger(instantQ.qcapacity)) {
        this.api_error = 'Please enter an integer value for Maximum ' + this.consumer_label + 's served';
       // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    } else if (!this.sharedfunctionObj.checkIsInteger(instantQ.qserveonce)) {
        this.api_error = 'Please enter an integer value for ' + this.consumer_label + 's served at a time';
      //  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    } else if (JSON.parse(instantQ.qserveonce) === 0) {
        this.api_error = this.consumer_label + 's' + ' ' + 'served  at a time should greter than Zero';
       // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        return;
    } else if ((JSON.parse(instantQ.qserveonce) > JSON.parse(instantQ.qcapacity))) {
        this.api_error = this.consumer_label + 's' + ' ' + 'served at a time should be lesser than Maximum' + ' ' + this.consumer_label + 's served.';
       // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        return;
    }else {
         if (this.action === 'edit') {
             this.updateInstantQ(instantQInput);
         } else {
            this.createInstantQ(instantQInput);
       }
    }
}
createInstantQ(post_data) {
    this.provider_services.addInstantQ(post_data)
        .subscribe(
            () => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('MADE_YOURSELF_AVAIL_NOW'), { 'panelClass': 'snackbarnormal' });
                this.dialogRef.close('reloadlist');
                // this.showInstantQFlag = false;
                // this.initializeQs();
            },
            (error) => {
                this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                //this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
}
updateInstantQ(post_data) {
    
        this.provider_services.editProviderQueue(post_data)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('MADE_YOURSELF_AVAIL_NOW'), { 'panelClass': 'snackbarnormal' });
                    this.dialogRef.close('reloadlist');
                    //this.showInstantQFlag = false;
                    //this.initializeQs();
                },
                (error) => {
                    this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                }
            );
   
}
isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
}
/**
 * Check Numeric Validation
 * @param evt Field Object
 */
isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
}
/**
 * Make Capacity Editable
 */
capacityClick() {
    this.capacityEditable = true;
}
/**
 * Make Parallel Serving Editable
 */
servedClick() {
    this.parallelServeEditable = true;
}
resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  close(){
    this.dialogRef.close('reloadlist'); 
  }
}
