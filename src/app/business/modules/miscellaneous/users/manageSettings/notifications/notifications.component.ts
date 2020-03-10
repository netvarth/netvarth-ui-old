import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html'
})
export class NotificationsUserComponent implements OnInit {
    smsGlobalStatus;
    smsGlobalStatusStr;
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            url: '/provider/settings/miscellaneous/users',
            title: 'Users'

        },
    ];
    domain;
    breadcrumbs = this.breadcrumbs_init;
    smsCredits;
    genrl_notification_cap = '';
    frm_cust_notification_cap = '';
    cust_domain_name = '';
    provdr_domain_name = '';
    frm_providr_notification_cap = '';
    breadcrumb_moreoptions: any = [];
    customer_label = '';
    provider_label = '';
    custmr_domain_terminology = '';
    provdr_domain_terminology = '';
    userId: any;

    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private activatedRoot: ActivatedRoute,
        private sharedfunctionObj: SharedFunctions
    ) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
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
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
            breadcrumbs.push(e);
        });
        breadcrumbs.push({
            title: this.userId,
            url: '/provider/settings/miscellaneous/users/add?type=edit&val=' + this.userId
        });
        breadcrumbs.push({
            title: 'Settings',
            url: '/provider/settings/miscellaneous/users/' + this.userId + '/settings'
        });
        breadcrumbs.push({
            title: 'Notifications'
        });
        this.breadcrumbs = breadcrumbs;

    }
    // gotoConsumer() {
    //     this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'notifications', 'consumer']);
    // }
    gotoProvider() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'notifications', 'provider'], this.userId);
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
            this.shared_functions.openSnackBar('SMS settings ' + status + ' successfully');
            this.getSMSglobalSettings();
        }, (error) => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.getSMSglobalSettings();
        });
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->notifications']);
        }
    }
}
