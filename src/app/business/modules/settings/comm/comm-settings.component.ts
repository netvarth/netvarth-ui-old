import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    'selector': 'app-comm-settings',
    'templateUrl': './comm-settings.component.html'
})
export class CommSettingsComponent implements OnInit {
    domain: any;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Comm.'
        }
    ];
    virtualCallingMode_status: any;
    virtualCallingMode_statusstr: string;
    constructor(private router: Router,
        private provider_services: ProviderServices,
        private shared_services: SharedServices,
        private shared_functions: SharedFunctions) {
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getGlobalSettingsStatus();
    }
    getGlobalSettingsStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.virtualCallingMode_status = data.virtualService;
                this.virtualCallingMode_statusstr = (this.virtualCallingMode_status) ? 'On' : 'Off';
            });
    }
    gotoNotifications() {
        this.router.navigate(['provider', 'settings', 'comm', 'notifications']);
    }
    gotoVideoSettings() {
        this.router.navigate(['provider', 'settings', 'comm', 'video']);
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/comm->' + mod]);
    }
    handle_virtualCallingModeStatus(event) {
        const is_VirtualCallingMode = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setVirtualCallingMode(is_VirtualCallingMode)
            .subscribe(
                () => {
                    this.shared_functions.openSnackBar('Virtual Calling Mode ' + is_VirtualCallingMode + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getGlobalSettingsStatus();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getGlobalSettingsStatus();
                }
            );
    }
}
