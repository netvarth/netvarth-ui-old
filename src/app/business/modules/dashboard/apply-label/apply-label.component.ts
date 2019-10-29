import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
    selector: 'app-apply-label',
    templateUrl: './apply-label.component.html'
})

export class ApplyLabelComponent implements OnInit {
    checkinId;
    providerLabels: any = [];
    breadcrumbs_init: any = [
        {
            title: Messages.DASHBOARD_TITLE,
            url: '/provider'
        },
        {
            title: 'Queue Manager',
            url: '/provider/dashboard/check-ins'
        },
        {
            title: 'Manage Label'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    labelMap;
    label;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions) {
        this.activateroute.params.subscribe(data => {
            this.checkinId = data.id;
        });
        this.activateroute.queryParams.subscribe(data => {
            this.label = data;
        });
    }
    ngOnInit() {
        this.getLabels();
    }
    getLabels() {
        this.provider_services.getLabelList().subscribe(data => {
            this.providerLabels = data;
            const value = Object.values(this.label);
            for (let i = 0; i < this.providerLabels.length; i++) {
                for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
                    for (let k = 0; k < value.length; k++) {
                        if (this.providerLabels[i].valueSet[j].value === value[k]) {
                            this.providerLabels[i].valueSet[j].selected = true;
                        }
                    }
                }
            }
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
}
