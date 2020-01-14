import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { MatDialog } from '@angular/material';
import { Messages } from '../../../../../shared/constants/project-messages';
import { ProviderBprofileSearchDynamicComponent } from '../../../../../ynw_provider/components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { QuestionService } from '../../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { Router } from '@angular/router';
import { projectConstants } from '../../../../../shared/constants/project-constants';
@Component({
    selector: 'app-additionalinfo',
    templateUrl: './additionalinfo.component.html',
    styleUrls: ['./additionalinfo.component.scss']
})
export class AdditionalInfoComponent implements OnInit, OnDestroy {
    frm_additional_cap = '';
    bProfile = null;
    dynamicdialogRef;
    customer_label = '';
    domain_fields = [];
    domain_questions = [];
    normal_domainfield_show = 1;
    subdomain = null;
    subdomain_fields = [];
    subdomain_questions = [];
    normal_subdomainfield_show = 1;
    searchquestiontooltip = '';
    vkeyNameMap = {};
    serviceSector = null;
    breadcrumb_moreoptions: any = [];
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    additional_cap = Messages.BPROFILE_ADDITIONAL_CAP;
    info_cap = Messages.BPROFILE_INFORMATION_CAP;
    additional_info_cap = Messages.BPROFILE_ADDOTIONAL_INFO_CAP;
    edit_cap = Messages.EDIT_BTN;
    delete_btn = Messages.DELETE_BTN;
    domain;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Users',
            url: '/provider/settings/users'
        }
    ];
    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private provider_datastorage: ProviderDataStorageService,
        private dialog: MatDialog,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private service: QuestionService
    ) {
        this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
        this.searchquestiontooltip = this.sharedfunctionobj.getProjectMesssages('BRPFOLE_SEARCH_TOOLTIP');
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->' + mod]);
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
        this.getBusinessProfile();
    }
    ngOnDestroy() {
        if (this.dynamicdialogRef) {
            this.dynamicdialogRef.close();
        }
    }
    getBusinessProfile() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    this.provider_datastorage.set('bProfile', data);
                    const loginuserdata = this.sharedfunctionobj.getitemFromGroupStorage('ynw-user');
                    // setting the status of the customer from the profile details obtained from the API call
                    loginuserdata.accStatus = this.bProfile.status;
                    // Updating the status (ACTIVE / INACTIVE) in the local storage
                    this.sharedfunctionobj.setitemToGroupStorage('ynw-user', loginuserdata);
                    this.serviceSector = data['serviceSector']['displayName'] || null;
                    this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
                    if (this.bProfile['serviceSector'] && this.bProfile['serviceSector']['domain']) {
                        if (this.bProfile['domainVirtualFields'] &&
                            Object.keys(this.bProfile['domainVirtualFields']).length === 0) {
                            this.normal_domainfield_show = 2;
                        }
                        this.getDomainVirtualFields();
                        if (this.bProfile['subDomainVirtualFields'] &&
                            Object.keys(this.bProfile['subDomainVirtualFields']).length === 0) {
                            this.normal_subdomainfield_show = 2;
                        }
                        if (this.bProfile['serviceSubSector']['subDomain']) {
                            this.getSubDomainVirtualFields();
                        }
                    }
                },
                () => {

                }
            );
    }
    // objectKeys(obj) {
    //     return Object.keys(obj);
    //   }
    getDomainVirtualFields() {
        this.getVirtualFields(this.bProfile['serviceSector']['domain'])
            .then(
                data => {
                    // this.domain_questions = data;
                    this.domain_fields = data['fields'];
                    this.domain_questions = data['questions'] || [];
                    this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
                    // normal_domainfield_show = 4 // no data
                }
            );
    }
    addDynamicField(field, type) {
        if (field.dataType === 'DataGrid') {
            this.editGridDynamicField(field.name, type, null);
        } else {
            this.editDynamicField(field.name, type);
        }
    }
    editGridDynamicField(field_name, type, index = 0) {
        const field = JSON.parse(JSON.stringify(this.getFieldQuestion(field_name, type)));
        // We need to pass only selected row to edit page
        // Create the data for passing to dynamicform
        if (index !== null) {
            const column = field[0]['columns'][index] || [];
            field[0]['columns'] = [];
            field[0]['columns'].push(column);
            const selected_row = field[0]['value'][index] || [];
            field[0]['value'] = [];
            field[0]['value'].push(selected_row);
        } else {
            const column = field[0]['columns'][0] || [];
            field[0]['columns'] = [];
            field[0]['columns'].push(column);
            column.map((e) => { delete e.value; });
        }
        this.showDynamicFieldPopup(field, type, index);
    }
    deleteGridDynamicField(field_name, type = 'domain_questions', index = 0) {
        const pre_value = (type === 'domain_questions') ? JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields'])) :
            JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
        // JSON.parse(JSON.stringify used to remove reference
        const grid_list = pre_value[field_name] || [];
        if (grid_list.length === 1 && index === 0) {
            delete pre_value[field_name];
        } else {
            grid_list.splice(index, 1);
            pre_value[field_name] = grid_list;
        }
        if (type === 'domain_questions') {
            this.onDomainFormSubmit(pre_value);
        } else if (type === 'subdomain_questions') {
            this.onSubDomainFormSubmit(pre_value);
        }
    }
    editDynamicField(field_name, type) {
        const field = this.getFieldQuestion(field_name, type);
        this.showDynamicFieldPopup(field, type);
    }
    showDynamicFieldPopup(field, type, grid_row_index = null) {
        this.dynamicdialogRef = this.dialog.open(ProviderBprofileSearchDynamicComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            autoFocus: true,
            data: {
                type: type,
                questions: field,
                bProfile: this.bProfile,
                grid_row_index: grid_row_index
            }
        });
        this.dynamicdialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result === 'reloadlist') {
                    this.getBussinessProfileApi()
                        .then(
                            data => {
                                this.bProfile = data;
                                if (type === 'domain_questions') {
                                    this.getDomainVirtualFields();
                                } else {
                                    this.getSubDomainVirtualFields();
                                }
                            },
                            () => {

                            }
                        );
                }
            }
        });
    }
    getBussinessProfileApi() {
        const _this = this;
        return new Promise(function (resolve, reject) {

            _this.provider_services.getBussinessProfile()
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    getSubDomainVirtualFields() {
        this.getVirtualFields(this.bProfile['serviceSector']['domain'],
            this.bProfile['serviceSubSector']['subDomain']).then(
                data => {
                    this.subdomain_fields = data['fields'];
                    this.subdomain_questions = data['questions'] || [];
                    this.normal_subdomainfield_show = (this.normal_subdomainfield_show === 2) ? 4 : 3;
                    for (let fdIndex = 0; fdIndex < this.subdomain_fields.length; fdIndex++) {
                        // tslint:disable-next-line:no-unused-expression
                        if (this.subdomain_fields[fdIndex]['dataType'] === 'DataGrid') {
                            for (let colIndex = 0; colIndex < this.subdomain_fields[fdIndex]['Columns'].length; colIndex++) {
                                if (this.subdomain_fields[fdIndex]['Columns'][colIndex]['type'] === 'Enum') {
                                    for (let enumIndex = 0; enumIndex < this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'].length; enumIndex++) {
                                        this.vkeyNameMap[this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['name']] = this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['displayName'];
                                    }
                                }
                            }
                        }
                    }
                }
            );
    }
    getdispVal(typ, field) {
        let retfield = '';
        let passArray = [];
        if (typ === 'domain') {
            passArray = this.domain_fields;
        } else if (typ === 'subdomain') {
            passArray = this.subdomain_fields;
        }
        let str = '';
        if (field.value !== undefined) {
            if (field.dataType === 'Enum') {
                retfield = this.getFieldDetails(passArray, field.value, field.name);
            } else if (field.dataType === 'EnumList') {
                for (let i = 0; i < field.value.length; i++) {
                    if (str !== '') {
                        str += ', ';
                    }
                    // str += this.sharedfunctionobj.firstToUpper(fld.value[i]);
                    str += this.getFieldDetails(passArray, field.value[i], field.name);
                }
                retfield = str;
            } else {
                retfield = field.value;
            }
        }
        return retfield;
    }
    performActions() {
        this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->additional-info']);
    }
    getFieldDetails(passedArray, fieldvalue, fieldname) {
        let retfield;
        if (fieldvalue !== undefined) {
            for (let i = 0; i < passedArray.length; i++) {
                if (fieldname === passedArray[i].name) {
                    for (let j = 0; j < passedArray[i].enumeratedConstants.length; j++) {
                        if (fieldvalue === passedArray[i].enumeratedConstants[j].name) {
                            retfield = passedArray[i].enumeratedConstants[j].displayName;
                        }
                    }
                }
            }
        }
        return retfield;
    }
    showValueswithComma(fld) {
        let str = '';
        if (fld.value !== undefined) {
            for (let i = 0; i < fld.value.length; i++) {
                if (str !== '') {
                    str += ', ';
                }
                str += this.sharedfunctionobj.firstToUpper(fld.value[i]);
            }
            return str;
        }
    }
    getVirtualFields(domain, subdomin = null) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getVirtualFields(domain, subdomin)
                .subscribe(
                    data => {
                        const set_data = [];
                        set_data['fields'] = _this.setFieldValue(data, subdomin);
                        set_data['questions'] = _this.service.getQuestions(set_data['fields']);
                        resolve(set_data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    setFieldValue(data, subdomin) {
        let fields = [];
        if (subdomin) {
            fields = (this.bProfile['subDomainVirtualFields'] &&
                this.bProfile['subDomainVirtualFields'][0]) ?
                this.bProfile['subDomainVirtualFields'][0][subdomin] : [];
        } else {
            fields = (this.bProfile['domainVirtualFields']) ?
                this.bProfile['domainVirtualFields'] : [];
        }
        if (fields) {
            for (const i in data) {
                if (data[i]) {
                    const row = data[i];
                    if (fields[row.name]) {
                        data[i]['value'] = fields[row.name];
                    } else {
                        delete data[i]['value'];
                    }
                }
            }
            return data;
        } else {
            return data;
        }
    }
    getFieldQuestion(field_key = null, type = 'domain_questions') {
        const questions = (type === 'subdomain_questions') ? this.subdomain_questions : this.domain_questions;
        if (field_key != null) {
            const field = [];
            for (const que of questions) {
                if (que.key === field_key) {
                    field.push(que);
                }
            }
            return field;
        }
    }
    onDomainFormSubmit(post_data) {
        this.provider_services.updateDomainSubDomainFields(post_data,
            this.bProfile['serviceSector']['domain'])
            .subscribe(
                () => {
                    this.getBusinessProfile();
                },
                (error) => {
                    this.getBusinessProfile(); // refresh data ;
                    this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    onSubDomainFormSubmit(post_data) {
        this.provider_services.updateDomainSubDomainFields(post_data, null,
            this.bProfile['serviceSubSector']['subDomain'])
            .subscribe(
                () => {
                    this.getBusinessProfile();
                },
                (error) => {
                    this.getBusinessProfile(); // refresh data ;
                    this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }

}
