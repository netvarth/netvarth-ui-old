import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
@Component({
    selector: 'app-label',
    templateUrl: './label.component.html'
})
export class LabelComponent implements OnInit {
    tooltipcls = '';
    add_button = '';
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
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            title: 'Labels',
            url: '/provider/settings/general/labels'
        }
    ];
    label;
    action: string;
    status: any;
    breadcrumbs = this.breadcrumbs_init;
    api_error: any = [];
    api_success: any;
    valueSet = [];
    value;
    shortValue;
    labelData: any = [];
    description;
    displayName;
    showAddsec = false;
    defaultShortValue = true;
    customer_label = '';
    waitlist_label = '';
    exceedLimit = false;
    labelcaption = 'Create Label';
    labelStatus = false;
    source;
    users: any;
    constructor(private router: Router,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        public fed_service: FormMessageDisplayService,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService,
        public _location: Location) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.waitlist_label = this.wordProcessor.getTerminologyTerm('waitlist');
        this.activated_route.params.subscribe(params => {
            this.actionparam = params.id;
            if (this.actionparam === 'view') {
                this.labelcaption = 'Label Details';
            } else if (this.actionparam === 'edit') {
                this.labelcaption = ' Edit Label';
            }
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                console.log(qparams);
                if (qparams.source) {
                    this.source = qparams.source;
                }
                this.label_id = qparams.id;
                if (this.label_id) {
                    this.editLabelbyId(qparams.id);
                } else {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Create Label'
                    });
                    this.breadcrumbs = breadcrumbs;
                }
            });
            const user = this.groupService.getitemFromGroupStorage('ynw-user');
    
              if (user.accountType === 'BRANCH') {
                  this.getProviders().then((data) => {
                   this.users = data;
                
                  });                  
                }
    }

    ngOnInit() {

    }
    getProviders() {
        const _this = this;
          return new Promise(function (resolve, reject) {
            const apiFilter = {};
            // apiFilter['userType-eq'] = 'PROVIDER';
            _this.provider_services.getUsers(apiFilter).subscribe(data => {
                  resolve(data);
                },
                () => {
                  reject();
                }
              );
          });
      }
    getOwnership(ownerShipData){
        let userNamelist='';
       if(ownerShipData.users &&ownerShipData.users.length>0){
     
            ownerShipData.users.forEach(element => {
                const userObject =  this.users.filter(user => user.id === parseInt(element)); 
                console.log(userObject);
                userNamelist=userNamelist+userObject[0].firstName+' '+userObject[0].lastName+','
               }); 
        
                return userNamelist.replace(/,\s*$/, '')
           }
       

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
            this.labelStatus = (this.labelData.status === 'ENABLED') ? true : false;
        });
    }
    onSubmit() {
        let label = '';
        if (this.displayName && this.displayName.trim() !== '') {
            label = this.displayName.trim().replace(/ /g, '_');
            this.valueSet = [];
            this.valueSet.push(
                { 'value': true, 'shortValue': true },
                { 'value': false, 'shortValue': false });
            if (this.actionparam === 'add') {
                const post_data = {
                    'label': label,
                    'displayName': this.displayName,
                    'description': this.description,
                    'valueSet': this.valueSet,
                };
                this.provider_services.createLabel(post_data).subscribe(data => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('LABEL_ADDED'));
                    this.editLabelbyId(data);
                    this.actionparam = 'view';
                    this.labelcaption = 'Label Details';
                },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    }
                );
            }
            if (this.actionparam === 'edit') {
                const post_data = {
                    'id': this.labelData.id,
                    'label': label,
                    'displayName': this.displayName,
                    'description': this.description,
                    'valueSet': this.valueSet
                };
                this.provider_services.updateLabel(post_data).subscribe(data => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('LABEL_UPDATED'));
                    this.editLabelbyId(data);
                    this.labelcaption = 'Label Details';
                    this.actionparam = 'view';

                },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
            }
        } else {
            this.snackbarService.openSnackBar(this.label_name_cap + ' required', { 'panelClass': 'snackbarerror' });
        }
    }
    changeLabelStatus(label) {
        const status = (label.status === 'ENABLED') ? 'DISABLED' : 'ENABLED';
        const statusmsg = (label.status === 'ENABLED') ? 'disabled' : 'enabled';
        this.provider_services.updateLabelStatus(label.id, status).subscribe(data => {
            this.snackbarService.openSnackBar(label.displayName  + ' ' +  statusmsg + ' successfully');
            this.editLabelbyId(label.id);
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
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
        this.labelcaption = ' Edit Label';
        if (this.label_id) {
            this.editLabelbyId(this.label_id);
        }
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
        this.api_error = [];
        if (!value) {
            this.api_error['value'] = 'Please enter the value';
        } else if (!this.defaultShortValue && !shortcut) {
            this.api_error['short'] = 'Please enter the short value';
        } else {
            const valset = {};
            valset['value'] = value;
            if (shortcut) {
                valset['shortValue'] = shortcut;
            } else {
                valset['shortValue'] = value;
            }
            this.value = '';
            this.shortValue = '';
            if (valset['value'].length !== 0 && valset['shortValue'].length !== 0) {
                this.valueSet.push(valset);
                this.showAddsec = false;
            }
            value = '';
            shortcut = '';
        }
    }
    deleteValueforSet(i) {
        this.value = '';
        this.shortValue = '';
        this.valueSet.splice(i, 1);
    }
    resetApiErrors() {
        this.api_error = [];
        this.api_success = [];
    }
    onCancel() {
        if (this.label_id) {
            this.editLabelbyId(this.label_id);
        }
        setTimeout(() => {
            if (this.actionparam === 'edit') {
                this.labelcaption = 'Label Details';
                this.actionparam = 'view';
            } else {
                this.router.navigate(['provider/settings/general/labels']);
            }
        }, 500);
    }
    showAddsection() {
        (!this.showAddsec) ? this.showAddsec = true : this.showAddsec = false;
    }
    settingDeafultValue(event) {
        (event.checked) ? this.defaultShortValue = true : this.defaultShortValue = false;
        this.shortValue = this.value;
    }
    valueKeyup(e) {
        if (e.target.value.length > 15) {
            this.defaultShortValue = false;
            this.exceedLimit = true;
        } else {
            this.exceedLimit = false;
        }
    }
    redirecToGeneral() {
        if (this.source === 'appt' || this.source === 'checkin' || this.source === 'customer' || this.source === 'order') {
            this._location.back();
        } else {
            this.router.navigate(['provider', 'settings', 'general', 'labels']);
        }
    }
}
