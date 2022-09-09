import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { CommonDataStorageService } from '../../../../../shared/services/common-datastorage.service';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls:['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
    virtualCallingMode_status: any;
    virtualCallingMode_statusstr: string;
    smsGlobalStatus;
    notificationStatus;
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
    accountType: any;
    isCorp = false;
    isMultilevel = false;
    sub_domain;

    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private commonDataStorage: CommonDataStorageService
    ) {
    }
    ngOnInit() {
        const user_data = this.groupService.getitemFromGroupStorage('ynw-user');
        this.accountType = user_data.accountType;
        this.domain = user_data.sector || null;
        this.sub_domain = user_data.subSector || null;
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.getSMSglobalSettings();
        this.getSMSCredits();
        this.getDomainSubdomainSettings();
        this.genrl_notification_cap = Messages.GENRL_NOTIFICATION_MSG.replace('[provider]', this.provider_label);
        this.frm_cust_notification_cap = Messages.FRM_LEVEL_CUST_NOTIFICATION_MSG.replace('[customer]', this.customer_label);
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.frm_providr_notification_cap = Messages.FRM_LEVEL_PROVIDER_NOTIFICATION_MSG.replace('[customer]', this.customer_label);
        this.provdr_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
    }
    gotoConsumer() {
        this.router.navigate(['provider', 'settings', 'comm', 'notifications', 'consumer']);
    }
    gotoProvider() {
        let title;
        if (this.sub_domain === ('hospital' || 'dentalHosp' || 'alternateMedicineHosp' || 'veterinaryhospital' || 'hoslisticHealth') && this.accountType === 'BRANCH' && this.isMultilevel) {
            title = 'Hospital';
        } else {
            title = 'Provider';
        }
        const navigationExtras: NavigationExtras = {
            queryParams: {
                type: title
            }
        };
        this.router.navigate(['provider', 'settings', 'comm', 'notifications', 'provider'], navigationExtras);
    }
    getSMSCredits() {
        this.provider_services.getSMSCredits().subscribe(data => {
            this.smsCredits = data;
        });
    }
    getSMSglobalSettings() {
        this.provider_services.getAccountSettings().then(data => {
            this.smsGlobalStatus = data['enableSms'];
            this.smsGlobalStatusStr = (this.smsGlobalStatus) ? 'On' : 'Off';
            this.notificationStatus = data['sendNotification'];
        });
    }
    handlenotificationSettings(event) {
        const value = (event.checked) ? true : false;
        const status = (value) ? 'enabled' : 'disabled';
        const state = (value) ? 'Enable' : 'Disable';
        this.provider_services.setNotificationSettings(state).subscribe(data => {
            this.snackbarService.openSnackBar('Send notification  ' + status + ' successfully');
            this.commonDataStorage.setSettings('account', null);
            this.getSMSglobalSettings();
        }, (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.getSMSglobalSettings();
        });
    }
    handleGlobalSMSSettings(event) {
        const value = (event.checked) ? true : false;
        const status = (value) ? 'enabled' : 'disabled';
        const state = (value) ? 'Enable' : 'Disable';
        this.provider_services.setSMSglobalSettings(state).subscribe(data => {
            this.snackbarService.openSnackBar('SMS settings ' + status + ' successfully');
            this.commonDataStorage.setSettings('account', null);
            this.getSMSglobalSettings();
        }, (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.getSMSglobalSettings();
        });
    }
    getDomainSubdomainSettings() {
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(this.domain, this.sub_domain)
                .subscribe(
                    (data: any) => {
                        this.isCorp = data.isCorp;
                        this.isMultilevel = data.isMultilevel;
                    },
                    error => {
                        reject(error);
                    }
                );
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
    goBack() {
        this.router.navigate(['provider', 'settings']);
    }
    getGlobalSettingsStatus() {
        this.provider_services.getAccountSettings().then(
            (data: any) => {
                this.virtualCallingMode_status = data.virtualService;
                this.virtualCallingMode_statusstr = (this.virtualCallingMode_status) ? 'On' : 'Off';
            });
    }
    handle_virtualCallingModeStatus(event) {
        const is_VirtualCallingMode = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setVirtualCallingMode(is_VirtualCallingMode)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Teleservice ' + is_VirtualCallingMode + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.commonDataStorage.setSettings('account', null);
                    this.getGlobalSettingsStatus();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getGlobalSettingsStatus();
                }
            );
    }
}
