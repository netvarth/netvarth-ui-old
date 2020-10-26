import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../../app.component';

@Component({
    selector: 'app-apply-label',
    templateUrl: './apply-label.component.html'
})

export class ApplyLabelComponent implements OnInit {
    // checkinId;
    providerLabels: any = [];
    breadcrumbs_init: any = [
        {
            // title: Messages.DASHBOARD_TITLE,
            url: '/provider'
        },
        {
            title: 'Check-ins',
            url: '/provider/dashboard/check-ins'
        },
        {
            title: 'Manage Label'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    // labelMap;
    label;
    labelname;
    value;
    source;
    caption;
    api_error: any = [];
    api_success = null;
    defaultShortValue = true;
    short_value;
    exceedLimit = false;
    // dataParams;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        @Inject(MAT_DIALOG_DATA) public checkin: any,
        public dialogRef: MatDialogRef<ApplyLabelComponent>,) {
        // this.activateroute.params.subscribe(data => {
        //     this.checkinId = data.id;
        // });
        // this.activateroute.queryParams.subscribe(data => {
        //     this.dataParams = data;
        // });
        this.source = checkin.source;
        this.checkin = checkin.checkin;
        this.label = checkin.label;
        if (this.source === 'newvalue') {
            this.caption = 'Create label ' + this.label.displayName;
        } else {
            this.caption = 'New Label';
        }
    }
    ngOnInit() {
        this.getLabels();
    }
    settingDeafultValue(event) {
        (event.checked) ? this.defaultShortValue = true : this.defaultShortValue = false;
        this.short_value = this.value;
    }
    getLabels() {
        this.provider_services.getLabelList().subscribe((data: any) => {
            this.providerLabels = data.filter(label => label.status === 'ACTIVE');
            // const value = Object.values(this.label);
            // for (let i = 0; i < this.providerLabels.length; i++) {
            //     for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
            //         for (let k = 0; k < value.length; k++) {
            //             if (this.providerLabels[i].valueSet[j].value === value[k]) {
            //                 this.providerLabels[i].valueSet[j].selected = true;
            //             }
            //         }
            //     }
            // }
        });
    }
    // addLabel() {
    //     this.provider_services.addLabeltoCheckin(this.checkinId, this.labelMap).subscribe(data => {

    //     },
    //         error => {
    //             this.api_error = this.shared_functions.getProjectErrorMesssages(error);
    //         });
    // }
    // deleteLabel(label) {
    //     this.provider_services.deleteLabelfromCheckin(this.checkinId, label).subscribe(data => {

    //     },
    //         error => {
    //             this.api_error = this.shared_functions.getProjectErrorMesssages(error);
    //         });
    // }
    // changeLabelvalue(labelname, value) {
    //     this.labelMap = new Object();
    //     this.labelMap[labelname] = value;
    //     for (let i = 0; i < this.providerLabels.length; i++) {
    //         for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
    //             if (this.providerLabels[i].valueSet[j].value === value) {
    //                 if (!this.providerLabels[i].valueSet[j].selected) {
    //                     this.providerLabels[i].valueSet[j].selected = true;
    //                     this.addLabel();
    //                 } else {
    //                     this.providerLabels[i].valueSet[j].selected = false;
    //                     this.deleteLabel(labelname);
    //                 }
    //             } else {
    //                 if (this.providerLabels[i].label === labelname) {
    //                     this.providerLabels[i].valueSet[j].selected = false;
    //                 }
    //             }
    //         }
    //     }
    // }
    createLabel() {
        //  else if (!this.value) {
        //     this.api_error['value'] = 'Please enter the value';
        // } else if (!this.defaultShortValue && !this.short_value) {
        //     this.api_error['short'] = 'Please enter the short value';
        // } 
        this.api_error = [];
        if (this.source === 'newlabel' && !this.labelname) {
            this.api_error['label'] = 'Please enter the label';
        } else {
            if (this.source === 'newlabel') {
                const valueSet = [];
                // const valset = {};
                // valset['value'] = this.value;
                // // valset['shortValue'] = this.value.replace(' ', '_');
                // if (this.short_value) {
                //     valset['shortValue'] = this.short_value;
                // } else {
                //     valset['shortValue'] = this.value;
                // }
                // if (valset['value'].length !== 0 && valset['shortValue'].length !== 0) {
                //     valueSet.push(valset);
                // }
                valueSet.push(
                    { 'value': true, 'shortValue': true },
                    { 'value': false, 'shortValue': false }
                );
                let label = '';
                if (this.labelname) {
                    label = this.labelname.trim().replace(/ /g, '_');
                }
                const post_data = {
                    'label': label,
                    'displayName': this.labelname,
                    'valueSet': valueSet,
                };
                this.provider_services.createLabel(post_data).subscribe(
                    () => {
                        setTimeout(() => {
                            this.dialogRef.close({ label: label, value: true, message: 'newlabel' });
                        }, 1000);
                    },
                    error => {
                        this.api_error['error'] = this.shared_functions.getProjectErrorMesssages(error);
                    });
            } else {
                // this.dialogRef.close({ label: this.label, value: this.value, message: 'newvalue' });
                let valueSet = [];
                const valset = {};
                valset['value'] = this.value;
                if (this.short_value) {
                    valset['shortValue'] = this.short_value;
                } else {
                    valset['shortValue'] = this.value;
                }
                valueSet = this.label.valueSet;
                if (valset['value'].length !== 0 && valset['shortValue'].length !== 0) {
                    valueSet.push(valset);
                }
                const post_data = {
                    'id': this.label.id,
                    'label': this.label.label,
                    'displayName': this.label.displayName,
                    'valueSet': valueSet,
                };
                this.provider_services.updateLabel(post_data).subscribe(
                    () => {
                        // this.shared_functions.apiSuccessAutoHide(this, Messages.SERVICE_RATE_UPDATE);
                        setTimeout(() => {
                            this.dialogRef.close({ label: this.label.label, value: this.value, message: 'reloadlist' });
                        }, projectConstants.TIMEOUT_DELAY);
                    },
                    error => {
                        // this.shared_functions.apiErrorAutoHide(this, error);
                        this.api_error['error'] = this.shared_functions.getProjectErrorMesssages(error);
                    });
            }
        }
    }
    resetApiErrors() {
        this.api_error = [];
        this.api_success = [];
    }
    valueKeyup(e) {
        if (e.target.value.length > 15) {
            this.defaultShortValue = false;
            this.exceedLimit = true;
        } else {
            this.exceedLimit = false;
        }
    }
}
