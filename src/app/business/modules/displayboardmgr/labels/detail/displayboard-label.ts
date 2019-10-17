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
    label: any;
    action: string;
    status: any;
    breadcrumbs = this.breadcrumbs_init;
    api_error: any;
    api_success: any;
    valueSet = [];

    constructor(private router: Router,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        public fed_service: FormMessageDisplayService,
        private shared_functions: SharedFunctions,
        private provider_shared_functions: ProviderSharedFuctions,
        private fb: FormBuilder) {
        this.activated_route.params.subscribe(params => {
            this.label_id = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.actionparam = qparams.action;
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
            // this.createForm();
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
                    console.log(data)
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
    onSubmit(label_data) {
        console.log(label_data);
    }
    createLabel() {
        const label_data = {};
        label_data['label'] = this.labelInfo.label;
        label_data['description'] = this.labelInfo.description;
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
    }
    editLabel(post_data) {
        this.provider_services.updateLabel(post_data)
            .subscribe(
                () => {
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('SERVICE_UPDATED'));
        this.getLabelDetails();
        },
        error => {
        }
        );
    }
    // createForm() {
    //     this.labelForm = this.fb.group({
    //         name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    //         description: ['', Validators.compose([Validators.maxLength(500)])]
    //     });
    // }

    addtoValueSet(value, shortcut) {
        const valset = {};
        valset['value'] = value;
        valset['shortValue'] = shortcut;

        this.valueSet.push(valset);
        value = '';
        shortcut = '';
    }
    /**
 * For clearing api errors
 */
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    onCancel () {
        this.router.navigate(['provider/settings/displayboard/labels']);
    }
}
