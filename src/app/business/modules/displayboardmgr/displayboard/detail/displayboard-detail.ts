import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-displayboard-detail',
    templateUrl: './displayboard-detail.html'
})
export class DisplayboardDetailComponent implements OnInit {
    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    dept_data;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    sboard_id;
    action = 'show';
    api_loading: boolean;
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
            title: 'Displayboards',
            url: '/provider/settings/displayboard/list'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private activated_route: ActivatedRoute
    ) {
        this.activated_route.params.subscribe(params => {
            this.sboard_id = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.actionparam = qparams.action;
            });
     }
    ngOnInit() {
        this.initLabelParams();
    }
    // ngOnChanges() {
    //     if (this.action === 'add') {
    //         this.customfield = null;
    //     } else {
    //         this.dept_data = this.customfield;
    //         if (this.dept_data) {
    //         }
    //     }
    // }
    // setDescFocus() {
    //     this.isfocused = true;
    //     if (this.labelInfo.description) {
    //         this.char_count = this.max_char_count - this.labelInfo.description.length;
    //     }
    // }
    // lostDescFocus() {
    //     this.isfocused = false;
    // }
    // setCharCount() {
    //     if (this.labelInfo.description) {
    //         this.char_count = this.max_char_count - this.labelInfo.description.length;
    //     }

    // }
    initLabelParams() {
        if (this.sboard_id === 'add') {
            this.sboard_id = null;
            this.api_loading = false;
        }
        if (this.sboard_id) {
            this.getDisplayboardDetails();
        } else {
            this.action = 'add';
            this.createForm();
        }
    }
    getDisplayboardDetails() {

    }
    onSubmit(form_data) {
        const data = {};
        data['customfield'] = form_data;
        data['action'] = this.action;
    }
    onCancel () {
        this.router.navigate(['provider/settings/displayboard/list']);
    }
    createForm() {
        this.amForm = this.fb.group({
            Name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            Displayname: ['', Validators.compose([Validators.maxLength(500)])],
            Defaultvalue: ['', Validators.compose([Validators.maxLength(500)])],
        });
    }
    // updateForm() {
    //     this.amForm.setValue({
    //         'Name': this.dept_data['Name'] || this.amForm.get('Name').value,
    //         'Description': this.dept_data['Description'] || this.amForm.get('Description').value,
    //         'Value': this.dept_data['Value'] || this.amForm.get('Value').value
    //     });
    // }
    // editDepartment() {
    //     const data = {};
    //     data['action'] = 'edit';
    //     this.actionPerformed.emit(data);
    // }
    resetApiErrors() {
    }
}
