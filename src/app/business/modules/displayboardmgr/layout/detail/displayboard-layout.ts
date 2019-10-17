import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-displayboard-layout',
    templateUrl: './displayboard-layout.html'
})
export class DisplayboardLayoutComponent implements OnInit {

    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    layout_id;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    statussel = false;
    statussel1 = false;
    statusse2 = false;
    statussel3 = false;
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
            title: 'Layouts',
            url: '/provider/settings/displayboard/layout'
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
            this.layout_id = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.actionparam = qparams.action;
            });
     }
    ngOnInit() {
        this.createForm();
    }
    onSubmit(form_data) {
        const data = {};
        data['customfield'] = form_data;
        data['action'] = this.action;
    }
    createForm() {
        this.amForm = this.fb.group({
            Name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            layout: ['', Validators.compose([Validators.maxLength(500)])],
        });
    }
    initLabelParams() {
        if (this.layout_id === 'add') {
            this.layout_id = null;
            this.api_loading = false;
        }
        if (this.layout_id) {
            this.getDBoardLayoutDetails();
        } else {
            this.action = 'add';
            this.createForm();
        }
    }
    getDBoardLayoutDetails() {

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
    handlestatus() {
        this.statussel = true;
        this.statussel1 = false;
        this.statusse2 = false;
        this.statussel3 = false;
    }
    handlestatus1() {
        this.statussel1 = true;
        this.statussel = false;
        this.statusse2 = false;
        this.statussel3 = false;
    }
    handlestatus2() {
        this.statussel1 = false;
        this.statussel = false;
        this.statusse2 = true;
        this.statussel3 = false;
    }
    handlestatus3() {
        this.statussel1 = false;
        this.statussel = false;
        this.statusse2 = false;
        this.statussel3 = true;
    }
}
