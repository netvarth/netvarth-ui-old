import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';

@Component({
    'selector': 'app-jaldee-department',
    'templateUrl': './department.component.html'
})
export class DepartmentComponent implements OnInit, OnChanges {
    deptForm: FormGroup;
    @Input() action;
    @Input() department;
    @Output() actionPerformed = new EventEmitter<any>();
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    dept_data;
    cancel_btn = Messages.CANCEL_BTN;
    maxcharDept_name = projectConstants.VALIDATOR_MAX100_DEPT_NME;
    maxcharDept_code = projectConstants.VALIDATOR_MAX15_DEPT_CDE;
    button_title = 'Save';
    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices
    ) { }
    ngOnInit() {

    }
    ngOnChanges() {
        if (this.action === 'add') {
            this.department = null;
            this.createForm();
        } else {
            this.dept_data = this.department;
            if (this.dept_data) {
                this.createForm();
                this.updateForm();
            }
        }
    }
    updateForm() {
        this.deptForm.setValue({
            'departmentName': this.dept_data['departmentName'] || this.deptForm.get('departmentName').value,
            'departmentDescription': this.dept_data['departmentDescription'] || this.deptForm.get('departmentDescription').value,
            'departmentCode': this.dept_data['departmentCode'] || this.deptForm.get('departmentCode').value
        });
    }
    setDescFocus() {
        this.isfocused = true;
        this.char_count = this.max_char_count - this.deptForm.get('departmentDescription').value.length;
    }
    lostDescFocus() {
        this.isfocused = false;
    }
    setCharCount() {
        this.char_count = this.max_char_count - this.deptForm.get('departmentDescription').value.length;
    }
    editDepartment() {
        const data = {};
        data['action'] = 'edit';
        this.actionPerformed.emit(data);
    }
    onSubmit(form_data) {
        const data = {};
        data['department'] = form_data;
        data['action'] = this.action;
        this.actionPerformed.emit(data);
    }
    onCancel() {
        const data = {};
        data['action'] = 'close';
        if (this.action === 'add') {
            data['source'] = 'add';
        } else {
            data['source'] = 'edit';
        }
        this.actionPerformed.emit(data);
    }

    createForm() {
        this.deptForm = this.fb.group({
            departmentName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxcharDept_name)])],
            departmentDescription: ['', Validators.compose([Validators.maxLength(500)])],
            departmentCode: ['', Validators.compose([Validators.maxLength(this.maxcharDept_code)])]
        });
    }
    resetApiErrors() {
    }
}
