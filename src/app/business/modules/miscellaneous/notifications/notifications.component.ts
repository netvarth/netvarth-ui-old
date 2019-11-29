import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
    smsGlobalStatus;
    smsGlobalStatusStr;
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Miscellaneous',
            url: '/provider/settings/miscellaneous',
        },
        {
            title: 'Notifications'
        }
    ];
    domain;
    breadcrumbs = this.breadcrumbs_init;
    smsCredits;

    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices
    ) {

    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getSMSglobalSettings();
        this.getSMSCredits();

    }
    gotoConsumer() {
        this.router.navigate(['provider', 'settings', 'miscellaneous',  'notifications', 'consumer']);
    }
    gotoProvider() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'notifications', 'provider']);
    }
    getSMSCredits() {
        this.provider_services.getSMSCredits().subscribe(data => {
            this.smsCredits = data;
        });
    }
    getSMSglobalSettings () {
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
}
