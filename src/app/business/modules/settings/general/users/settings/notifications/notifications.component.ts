import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../services/provider-services.service';
import { Messages } from '../../../../../../../shared/constants/project-messages';
import { GroupStorageService } from '../../../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsUserComponent implements OnInit {
    smsGlobalStatus;
    smsGlobalStatusStr;
    domain;
    smsCredits;
    genrl_notification_cap = '';
    frm_cust_notification_cap = '';
    cust_domain_name = '';
    provdr_domain_name = '';
    frm_providr_notification_cap = '';
    customer_label = '';
    provider_label = '';
    custmr_domain_terminology = '';
    provdr_domain_terminology = '';
    userId: any;
    isadminPrivilege: any;
    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private activatedRoot: ActivatedRoute,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService
    ) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.isadminPrivilege = user.adminPrivilege
        this.activatedRoot.params.subscribe(params => {
            this.userId = params.id;
        });
        this.getSMSglobalSettings();
        this.getSMSCredits();
        this.genrl_notification_cap = Messages.GENRL_NOTIFICATION_MSG.replace('[provider]', this.provider_label);
        this.frm_cust_notification_cap = Messages.FRM_LEVEL_CUST_NOTIFICATION_MSG.replace('[customer]', this.customer_label);
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.frm_providr_notification_cap = Messages.FRM_LEVEL_PROVIDER_NOTIFICATION_MSG.replace('[customer]', this.customer_label);
        this.provdr_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
    }
    gotoConsumer() {
        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'notifications', 'consumer'], this.userId);
    }
    gotoProvider() {
        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'notifications', 'provider'], this.userId);
    }
    getSMSCredits() {
        this.provider_services.getSMSCredits().subscribe(data => {
            this.smsCredits = data;
        });
    }
    getSMSglobalSettings() {
        this.provider_services.getSMSglobalSettings().subscribe(data => {
            this.smsGlobalStatus = data['enableSms'];
            this.smsGlobalStatusStr = (this.smsGlobalStatus) ? 'On' : 'Off';
        });
    }
    handleGlobalSMSSettings(event) {
        const value = (event.checked) ? true : false;
        const status = (value) ? 'enabled' : 'disabled';
        const state = (value) ? 'Enable' : 'Disable';
        this.provider_services.setSMSglobalSettings(state).subscribe(data => {
            this.snackbarService.openSnackBar('SMS settings ' + status + ' successfully');
            this.getSMSglobalSettings();
        }, (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.getSMSglobalSettings();
        });
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/comm->' + mod]);
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/comm->notifications']);
        }
    }
    redirecToUserSettings() {
        this.router.navigate(['provider', 'settings', 'general' , 'users' , this.userId , 'settings']);
    }
}
