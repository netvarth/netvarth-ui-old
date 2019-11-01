import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../../shared/constants/project-constants';

@Component({
    selector: 'app-apply-label',
    templateUrl: './apply-label.component.html'
})

export class ApplyLabelComponent implements OnInit {
    checkinId;
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
    labelMap;
    label;
    labelname;
    value;
    source;
    uuid;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        @Inject(MAT_DIALOG_DATA) public checkin: any,
        public dialogRef: MatDialogRef<ApplyLabelComponent>, ) {
        this.activateroute.params.subscribe(data => {
            this.checkinId = data.id;
        });
        this.activateroute.queryParams.subscribe(data => {
            this.label = data;
        });
        this.source = checkin.source;
        this.uuid = checkin.uuid;
        if (this.source === 'label') {
            this.label = checkin.checkin;
        }
    }
    ngOnInit() {
        this.getLabels();
    }
    getLabels() {
        this.provider_services.getLabelList().subscribe(data => {
            this.providerLabels = data;
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
    addLabel() {
        this.provider_services.addLabeltoCheckin(this.checkinId, this.labelMap).subscribe(data => {

        },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackarerror' });
            });
    }
    deleteLabel(label) {
        this.provider_services.deleteLabelfromCheckin(this.checkinId, label).subscribe(data => {

        },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    changeLabelvalue(labelname, value) {
        this.labelMap = new Object();
        this.labelMap[labelname] = value;
        for (let i = 0; i < this.providerLabels.length; i++) {
            for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
                if (this.providerLabels[i].valueSet[j].value === value) {
                    if (!this.providerLabels[i].valueSet[j].selected) {
                        this.providerLabels[i].valueSet[j].selected = true;
                        this.addLabel();
                    } else {
                        this.providerLabels[i].valueSet[j].selected = false;
                        this.deleteLabel(labelname);
                    }
                } else {
                    if (this.providerLabels[i].label === labelname) {
                        this.providerLabels[i].valueSet[j].selected = false;
                    }
                }
            }
        }
    }
    createLabel() {
        if (this.source === 'new') {
            const valueSet = [];
            const valset = {};
            valset['value'] = this.value;
            valset['shortValue'] = this.value.replace(' ', '_');
            if (valset['value'].length !== 0 && valset['shortValue'].length !== 0) {
                valueSet.push(valset);
            }
            const post_data = {
                'label': this.labelname,
                'displayName': this.labelname,
                'valueSet': valueSet,
            };
            this.provider_services.createLabel(post_data).subscribe(
                () => {
                    this.shared_functions.apiSuccessAutoHide(this, Messages.SERVICE_RATE_UPDATE);
                    setTimeout(() => {
                        this.dialogRef.close({ label: this.labelname, value: this.value, message: 'reloadlist' });
                    }, projectConstants.TIMEOUT_DELAY);
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                });
        } else {
            let valueSet = [];
            const valset = {};
            valset['value'] = this.value;
            valset['shortValue'] = this.value.replace(' ', '_');
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
                    this.shared_functions.apiSuccessAutoHide(this, Messages.SERVICE_RATE_UPDATE);
                    setTimeout(() => {
                        this.dialogRef.close({ label: this.label.label, value: this.value, message: 'reloadlist' });
                    }, projectConstants.TIMEOUT_DELAY);
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                });
        }
    }
}
