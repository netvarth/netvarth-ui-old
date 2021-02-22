import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
// import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { NavigationExtras, Router } from '@angular/router';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format/date-format.pipe';
import { projectConstants } from '../../../../../app.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';


@Component({
    selector: 'app-checkin-confirm-popup',
    templateUrl: './checkin-confirm-popup.component.html',
    styleUrls: ['./checkin-confirm-popup.component.css']
})
export class CheckinConfirmPopupComponent implements OnInit {

    service_det;
    waitlist_for;
    userPhone;
    post_Data;
    account_id;
    trackUuid;
    isFuturedate;
    eMail;
    sel_queue_personaahead;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
    settingsjson: any = [];
    consumerNote = '';
    api_error = null;
    selectedQsTime;
    selectedQeTime;
    prepaymentAmount;
    sel_queue_servicetime;
    calc_mode;
    sel_queue_waitingmins;
    changePhno;
    currentPhone;
    callingModes;
    action;
    payEmail;
    payEmail1;
    emailerror = null;
    email1error = null;
    userData: any = [];
    userEmail;
    emailExist = false;
    confrmshow = false;
    noEmailError = false;
    countryCode;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public provider_services: ProviderServices,
        public router: Router,
        public dateformat: DateFormatPipe,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        public dialogRef: MatDialogRef<CheckinConfirmPopupComponent>) {
        console.log(data);
        this.service_det = data.service_details;
        this.waitlist_for = data.waitlist_for;
        this.countryCode = data.countryCode,
            this.userPhone = data.userPhone;
        this.post_Data = data.post_Data;
        this.account_id = data.account_id;
        this.sel_queue_personaahead = data.sel_queue_personaahead;
        this.isFuturedate = data.isFuturedate;
        this.eMail = data.eMail;
        console.log(this.eMail)
        this.settingsjson = data.settingsjson;
        this.selectedQsTime = data.selectedQsTime;
        this.selectedQeTime = data.selectedQeTime;
        this.prepaymentAmount = data.prepaymentAmount;
        this.sel_queue_servicetime = data.sel_queue_servicetime;
        this.calc_mode = data.calc_mode;
        this.sel_queue_waitingmins = data.sel_queue_waitingmins;
        this.changePhno = data.changePhno;
        this.currentPhone = data.currentPhone;
        this.callingModes = data.callingModes;
        this.selectedMessage = data.selectedMessage;
    }
    ngOnInit() {
        this.getProfile();
    }


    close() {
        this.dialogRef.close();
    }
    getWaitlistMgr() {
        const _this = this;
        return new Promise<void>(function (resolve, reject) {
            _this.provider_services.getWaitlistMgr()
                .subscribe(
                    data => {
                        _this.settingsjson = data;
                        console.log(this.settingsjson.showTokenId)
                        resolve();
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    showCheckinButtonCaption() {
        let caption = '';
        // caption = 'Confirm';
        if (this.settingsjson.showTokenId) {
            caption = 'Token';
        } else {
            caption = 'Check-in';
        }

        return caption;
    }
    addConsumeremail() {
        this.action = 'addEmail'
    }
    addCheckInConsumer() {
        // this.api_loading = true;
        this.shared_services.addCheckin(this.account_id, this.post_Data)
            .subscribe(data => {
                const retData = data;
                let retUUID;
                let prepayAmount;
                let uuidList = [];
                Object.keys(retData).forEach(key => {
                    if (key === '_prepaymentAmount') {
                        prepayAmount = retData['_prepaymentAmount'];
                    } else {
                        retUUID = retData[key];
                        this.trackUuid = retData[key];
                        uuidList.push(retData[key]);
                    }
                });
                if (this.selectedMessage.files.length > 0) {
                    console.log(retUUID);
                    this.consumerNoteAndFileSave(uuidList);
                }
                // this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'bprofile', 'media']);
                const member = [];
                for (const memb of this.waitlist_for) {
                    member.push(memb.firstName + ' ' + memb.lastName);
                }
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        account_id: this.account_id,
                        type_check: 'checkin_prepayment',
                        members: member,
                        prepayment: prepayAmount,
                        uuids: uuidList
                    }
                };
                if (this.service_det.isPrePayment) {
                    this.router.navigate(['consumer', 'checkin', 'payment', this.trackUuid], navigationExtras);
                    this.dialogRef.close();
                } else {
                    let multiple;
                    if (uuidList.length > 1) {
                        multiple = true;
                    } else {
                        multiple = false;
                    }
                    this.router.navigate(['consumer', 'checkin', 'confirm'], { queryParams: { account_id: this.account_id, uuid: uuidList, multiple: multiple } });
                    this.dialogRef.close();

                }
            },
                error => {
                    this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    // this.api_loading = false;
                });
    }
    consumerNoteAndFileSave(uuids) {
        const dataToSend: FormData = new FormData();
        // this.consumerNote = this.post_Data.consumerNote;
        // if (this.consumerNote === '') {
        //     this.consumerNote = 'Please find the attachment(s) from Consumer with this message';
        // }
        // dataToSend.append('message', this.consumerNote);
        const captions = {};
        let i = 0;
        if (this.selectedMessage) {
            for (const pic of this.selectedMessage.files) {
                dataToSend.append('attachments', pic, pic['name']);
                captions[i] = 'caption';
                i++;
            }
        }
        const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
        dataToSend.append('captions', blobPropdata);
        console.log(dataToSend);
        // this.shared_services.addConsumerWaitlistNote(this.account_id, uuid,
        //     dataToSend)
        for( const uuid of uuids){
        this.shared_services.addConsumerWaitlistAttachment(this.account_id,uuid,dataToSend)    
            .subscribe(
                () => {
                },
                error => {
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
        }
    }
    addEmail() {
        if (this.payEmail && this.payEmail.trim() !== '') {
            const stat = this.validateEmail(this.payEmail.trim());
            if (!stat) {
                this.emailerror = 'Please enter a valid email.';
                this.noEmailError = false;
            } else {
                const post_data = {
                    'id': this.userData.userProfile.id || null,
                    'firstName': this.userData.userProfile.firstName || null,
                    'lastName': this.userData.userProfile.lastName || null,
                    'dob': this.userData.userProfile.dob || null,
                    'gender': this.userData.userProfile.gender || null,
                    'email': this.payEmail.trim() || ''
                };
                const passtyp = 'consumer';
                this.shared_services.updateProfile(post_data, passtyp)
                    .subscribe(
                        () => {
                            this.action = '';
                            this.getProfile();
                            this.noEmailError = true;
                        },
                        error => {
                            this.api_error = error.error;
                            this.noEmailError = false;
                            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
            }
        }
    }
    validateEmail(mail) {
        const emailField = mail;
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(emailField) === false) {
            return false;
        }
        return true;
    }
    getProfile() {
        this.sharedFunctionobj.getProfile()
            .then(
                data => {
                    this.userData = data;
                    if (this.userData.userProfile !== undefined) {
                        this.userEmail = this.eMail = this.userData.userProfile.email || '';
                        this.userPhone = this.userData.userProfile.primaryMobileNo || '';
                        // this.currentPhone = this.userPhone;
                    }
                    if (this.userEmail) {
                        this.emailExist = true;
                    } else {
                        this.emailExist = false;
                    }
                });
    }
    showConfrmEmail(event) {
        if (event.key !== 'Enter') {
            this.confrmshow = true;
        }
    }
}
