import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
@Component({
    selector: 'app-displayboard-label',
    templateUrl: './displayboard-label.html'
})
export class DisplayboardLabelComponent implements OnInit {
    actionparam = 'show';
    label_id = null;
    api_loading = false;
    label_name_cap = 'Label';
    cancel_btn = Messages.CANCEL_BTN;
    save_btn = Messages.SAVE_BTN;
    labelSubscription: Subscription;
    breadcrumb_moreoptions: any = [];
    labelInfo = {
        'label': null,
        'description': null,
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
            title: 'Displayboard',
            url: '/provider/settings/displayboard'
        },
        {
            title: 'Labels',
            url: '/provider/settings/displayboard/labels'
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

    constructor(private router: Router,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        public fed_service: FormMessageDisplayService,
        private shared_functions: SharedFunctions,
        private provider_shared_functions: ProviderSharedFuctions,
        private fb: FormBuilder) {
        this.activated_route.params.subscribe(params => {
            this.label_id = params.id;
            console.log(this.label_id);
            if (this.label_id) {
                this.editLabelbyId(params.id);
            }
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.actionparam = qparams.action;
                console.log(this.actionparam);
            });
    }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'checkinmanager->settings-departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Add Custom Field', 'type': 'addcustomfield' }]
        };
        this.initLabelParams();
    }
    initLabelParams() {
        if (this.label_id === 'add') {
            this.label_id = null;
            this.api_loading = false;
        }
        if (this.label_id) {
            this.getLabelDetails();
        } else {
            this.action = 'add';
        }
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
    getLabelDetails() {
        this.api_loading = true;
        this.provider_services.getLabel(this.label_id)
            .subscribe(
                data => {
                    console.log(data);
                    this.label = data;
                    this.action = 'show';
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: this.label.label
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.api_loading = false;
                    if (this.actionparam === 'edit') {
                        this.action = 'edit';
                    }
                },
                () => {
                    this.api_loading = false;
                }
            );
    }
    createLabel() {
        const label_data = {};
        label_data['label'] = this.label;
        label_data['description'] = this.description;
        label_data['valueSet'] = this.valueSet;
        label_data['displayName'] = 'Color';
        console.log(label_data);
        // "notification": [
        //   {
        //     "values": "string",
        //     "messages": "string"
        //   }
        // ]
        this.provider_services.createLabel(label_data)
            .subscribe(
                (id) => {
                    this.label_id = id;
                    this.getLabelDetails();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        if (this.actionparam === 'edit') {
            console.log(this.label);
            const post_data = {
                'id': this.labelData.id,
                'label': this.label,
                'description': this.description,
                'valueSet': this.valueSet,
            };
            this.provider_services.updateLabel(post_data).subscribe(data => {
            });
        }
    }
    editLabelbyId(id) {
        this.provider_services.getLabel(id).subscribe(data => {
            console.log(data);
            this.labelData = data;
            if (this.actionparam === 'edit') {
                this.label = this.labelData.label;
                this.description = this.labelData.description;
                this.valueSet = this.labelData.valueSet.value;
                this.valueSet = this.labelData.valueSet;
            }
        });
    }
    editLabel() {
        this.action = 'edit';
        console.log(this.label_id)
        this.editLabelbyId(this.label_id);
    }
    deleteLabel(label_id) {
        this.provider_services.deleteLabel(label_id)
            .subscribe(
                data => {
                    this.getLabelDetails();
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
        this.valueSet.push(valset);
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
        this.router.navigate(['provider/settings/displayboard/labels']);
    }
}

