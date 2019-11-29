import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
@Component({
    selector: 'app-label',
    templateUrl: './label.component.html'
})
export class LabelComponent implements OnInit {
    actionparam = 'show';
    label_id = null;
    api_loading = false;
    label_name_cap = 'Label';
    label_displayname_cap = 'Display Name';
    cancel_btn = Messages.CANCEL_BTN;
    save_btn = Messages.SAVE_BTN;
    labelSubscription: Subscription;
    breadcrumb_moreoptions: any = [];
    labelInfo = {
        'label': null,
        'description': null,
        'displayName': null,
        'valueSet': null
    };
    char_count = 0;
    max_char_count = 500;
    button_title = 'Save';
    isfocused = false;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Miscellaneous',
            url: '/provider/settings/miscellaneous'
        },
        {
            title: 'Labels',
            url: '/provider/settings/miscellaneous/labels'
        }
    ];
    label;
    action: string;
    status: any;
    breadcrumbs = this.breadcrumbs_init;
    api_error: any;
    api_success: any;
    valueSet = [];
    value;
    shortValue;
    labelData: any = [];
    description;
    displayName;
    showAddsec = false;

    constructor(private router: Router,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        public fed_service: FormMessageDisplayService,
        private shared_functions: SharedFunctions,
        private shared_Functionsobj: SharedFunctions,
        private provider_shared_functions: ProviderSharedFuctions,
        private fb: FormBuilder) {
        this.activated_route.params.subscribe(params => {
            this.actionparam = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.label_id = qparams.id;
                if (this.label_id) {
                    this.editLabelbyId(qparams.id);
                } else {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                }
            });
    }

    ngOnInit() {
    }
    editLabelbyId(id) {
        this.provider_services.getLabel(id).subscribe(data => {
            this.labelData = data;
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: this.labelData.displayName
            });
            this.breadcrumbs = breadcrumbs;
            this.label = this.labelData.label;
            this.description = this.labelData.description;
            this.displayName = this.labelData.displayName;
            this.valueSet = this.labelData.valueSet;
        });
    }
    onSubmit() {
        if (this.actionparam === 'add') {
            const post_data = {
                'label': this.displayName.replace(/ /g, ' '),
                'displayName': this.displayName,
                'description': this.description,
                'valueSet': this.valueSet,
            };
            this.provider_services.createLabel(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('LABEL_ADDED'));
                this.editLabelbyId(data);
            });
        }
        if (this.actionparam === 'edit') {
            const post_data = {
                'id': this.labelData.id,
                'label': this.displayName.replace(/ /g, "_"),
                'displayName': this.displayName,
                'description': this.description,
                'valueSet': this.valueSet
            };
            this.provider_services.updateLabel(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('LABEL_UPDATED'));
                this.editLabelbyId(data);
            },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
        this.actionparam = 'view';

    }

    setDescFocus() {
        this.isfocused = true;
        if (this.labelInfo.description) {
            this.char_count = this.max_char_count - this.labelInfo.description.length;
        }
    }
    lostDescFocus() {
        this.isfocused = false;
    }
    setCharCount() {
        if (this.labelInfo.description) {
            this.char_count = this.max_char_count - this.labelInfo.description.length;
        }
    }
    editLabel() {
        this.actionparam = 'edit';
        this.editLabelbyId(this.label_id);
    }
    deleteLabel(label_id) {
        this.provider_services.deleteLabel(label_id)
            .subscribe(
                data => {
                    this.editLabelbyId(data);
                },
                error => {
                }
            );
    }
    addtoValueSet(value, shortcut) {
        const valset = {};
        valset['value'] = value;
        valset['shortValue'] = shortcut;
        this.value = [];
        this.shortValue = [];
        if (valset['value'].length !== 0 && valset['shortValue'].length !== 0) {
            this.valueSet.push(valset);
            this.showAddsec = false;
        }
        value = '';
        shortcut = '';
    }
    deleteValueforSet(i) {
        this.value = [];
        this.shortValue = [];
        this.valueSet.splice(i, 1);

    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    onCancel() {
        if (this.actionparam === 'edit') {
            this.actionparam = 'view';
        } else {
            this.router.navigate(['provider/settings/miscellaneous/labels']);
        }
    }
    showAddsection() {
        this.showAddsec = true;
    }
    onbtnCancel() {
        this.showAddsec = false;
    }
}

