import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { QuestionService } from '../../../../../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../../../../../../app.component';
import { ProviderUserBprofileSearchDynamicComponent } from './provider-userbprofile-search-dynamic.component/provider-userbprofile-search-dynamic.component';
import { LocalStorageService } from '../../../../../../../../shared/services/local-storage.service';
import { GroupStorageService } from '../../../../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../../../../shared/services/snackbar.service';
@Component({
    selector: 'app-useradditionalinfo',
    templateUrl: './additionalinfo.component.html',
    styleUrls: ['./additionalinfo.component.scss']
})
export class AdditionalInfoComponent implements OnInit, OnDestroy {
    domain_fields_nonmandatory = [];
    subdomain_fields_nonmandatory = [];
    frm_additional_cap = '';
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
    subDomain;
    bProfile: any = [];
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            url: '/provider/settings/general/users',
            title: 'Users'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    domainList: any = [];
    subDomainId;
    userId: any;
    constructor(
        private provider_services: ProviderServices,
        private dialog: MatDialog,
        private routerobj: Router,
        private activated_route: ActivatedRoute,
        public shared_functions: SharedFunctions,
        private service: QuestionService,
        private lStorageService: LocalStorageService,
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService
    ) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.searchquestiontooltip = this.wordProcessor.getProjectMesssages('BRPFOLE_SEARCH_TOOLTIP');
        this.activated_route.params.subscribe(params => {
            this.userId = params.id;
        }
        );
    }

    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
    }

    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domainList = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
        this.domain = user.sector;
        this.bProfile['domain'] = this.domain;
        this.getUser();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    }

    ngOnDestroy() {
        if (this.dynamicdialogRef) {
            this.dynamicdialogRef.close();
        }
    }

    getUser() {
        this.provider_services.getUser(this.userId)
            .subscribe((data: any) => {
                this.subDomainId = data.subdomain;
                const breadcrumbs = [];
                this.breadcrumbs_init.map((e) => {
                    breadcrumbs.push(e);
                });
                breadcrumbs.push({
                    title: data.firstName,
                    url: '/provider/settings/general/users/add?type=edit&val=' + this.userId,
                });
                breadcrumbs.push({
                    title: 'Settings',
                    url: '/provider/settings/general/users/' + this.userId + '/settings'
                });
                breadcrumbs.push({
                    title: 'Jaldee Profile',
                    url: '/provider/settings/general/users/' + this.userId + '/settings/bprofile',
                });
                breadcrumbs.push({
                    title: 'Additional Info'
                });
                this.breadcrumbs = breadcrumbs;
                for (let i = 0; i < this.domainList.bdata.length; i++) {
                    if (this.domainList.bdata[i].domain === this.domain) {
                        for (let j = 0; j < this.domainList.bdata[i].subDomains.length; j++) {
                            if (this.domainList.bdata[i].subDomains[j].id === data.subdomain) {
                                this.subDomain = this.domainList.bdata[i].subDomains[j].subDomain;
                                this.bProfile['subDomain'] = this.subDomain;
                                this.getBusinessProfile();
                            }
                        }
                    }
                }
            });
    }

    getBusinessProfile() {

        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    this.getDomainVirtualFields();
                    if (this.subDomain) {
                        this.getSubDomainVirtualFields();
                    }
                },
                () => {
                    this.getDomainVirtualFields();
                    if (this.subDomain) {
                        this.getSubDomainVirtualFields();
                    }
                }
            );
    }

    getDomainVirtualFields() {
        this.getVirtualFields(this.domain)
            .then(
                data => {

                    this.domain_fields = data['fields'];
                    this.domain_fields_nonmandatory = this.domain_fields.filter(dom => dom.mandatory === false);
                    this.domain_questions = data['questions'] || [];
                    this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
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
            JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subDomain]));
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
        this.dynamicdialogRef = this.dialog.open(ProviderUserBprofileSearchDynamicComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            autoFocus: true,
            data: {
                type: type,
                questions: field,
                bProfile: this.bProfile,
                grid_row_index: grid_row_index,
                userId: this.userId,
                subDomainId: this.subDomainId,
                subdomain: this.subDomain
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
            _this.provider_services.getUserBussinessProfile(_this.userId)
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
        this.getVirtualFields(this.domain,
            this.subDomain).then(
                data => {
                    this.subdomain_fields = data['fields'];
                    this.subdomain_fields_nonmandatory = this.subdomain_fields.filter(dom => dom.mandatory === false);
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
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->additional-info']);
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
                str += this.wordProcessor.firstToUpper(fld.value[i]);
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
        this.provider_services.updateDomainFields(this.userId, post_data)
            .subscribe(
                () => {
                    this.getBusinessProfile();
                },
                (error) => {
                    this.getBusinessProfile(); // refresh data ;
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }

    onSubDomainFormSubmit(post_data) {
        this.provider_services.updatesubDomainFields(this.userId, post_data, this.subDomainId)
            .subscribe(
                () => {
                    this.getBusinessProfile();
                },
                (error) => {
                    this.getBusinessProfile(); // refresh data ;
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
}
