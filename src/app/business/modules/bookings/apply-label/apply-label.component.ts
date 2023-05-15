import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { projectConstants } from '../../../../app.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
    selector: 'app-apply-label',
    templateUrl: './apply-label.component.html'
})

export class ApplyLabelComponent implements OnInit {
    providerLabels: any = [];
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
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
        public shared_functions: SharedFunctions,
        @Inject(MAT_DIALOG_DATA) public checkin: any,
        public dialogRef: MatDialogRef<ApplyLabelComponent>) {
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
            this.providerLabels = data.filter(label => label.status === 'ENABLED');
        });
    }
    createLabel() {
        this.api_error = [];
        if (this.source === 'newlabel' && !this.labelname) {
            this.api_error['label'] = 'Please enter the label';
        } else {
            if (this.source === 'newlabel') {
                const valueSet = [];
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
                        this.api_error['error'] = this.wordProcessor.getProjectErrorMesssages(error);
                    });
            } else {
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
                        setTimeout(() => {
                            this.dialogRef.close({ label: this.label.label, value: this.value, message: 'reloadlist' });
                        }, projectConstants.TIMEOUT_DELAY);
                    },
                    error => {
                        this.api_error['error'] = this.wordProcessor.getProjectErrorMesssages(error);
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
