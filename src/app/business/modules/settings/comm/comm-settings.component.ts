import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { UpdateNotificationComponent } from './update-notification/update-notification.component';
import { MatDialog } from '@angular/material/dialog';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
    'selector': 'app-comm-settings',
    'templateUrl': './comm-settings.component.html',
    styleUrls: ['./comm-settings.component.css']
})
export class CommSettingsComponent implements OnInit, AfterViewInit {
    domain: any;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Communications And Notifications'
        }
    ];
    virtualCallingMode_status: any;
    virtualCallingMode_statusstr: string;
    customer_label = '';
    provider_label = '';
    cust_domain_name = '';
    provider_domain_name = '';
    breadcrumb_moreoptions: any = [];
    smsGlobalStatus: any;
    notificationStatus: any;
    smsCredits: ArrayBuffer;
    genrl_notification_cap = '';
    virtualCallModesList: any;
    sub_domain;
    accountType;
    isMultilevel;
    type;
    @ViewChild('teleservice') scrollFrame: ElementRef;
    scrollContainer;
    constructor(private router: Router, public dialog: MatDialog,
        private provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
        public route: ActivatedRoute) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.route.queryParams.subscribe(
            params => {
                this.type = params.type;
            });
    }
    ngAfterViewInit() {
        var height = this.scrollFrame.nativeElement.offsetHeight;
        if (this.type) {
            window.scroll({
                top: height,
                left: 0,
                behavior: 'smooth'
            });
        }
    }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.sub_domain = user.subSector || null;
        this.accountType = user.accountType;
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
        this.genrl_notification_cap = Messages.GENRL_NOTIFICATION_MSG.replace('[provider]', this.provider_label);
        this.getGlobalSettingsStatus();
        this.getSMSCredits();
        this.getSMSglobalSettings();
        this.getVirtualCallingModesList();
        this.getDomainSubdomainSettings();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
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
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/comm']);
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/comm->' + mod]);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/comm']);
    }
    handle_virtualCallingModeStatus(event) {
        const is_VirtualCallingMode = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setVirtualCallingMode(is_VirtualCallingMode)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Teleservice ' + is_VirtualCallingMode + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getGlobalSettingsStatus();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getGlobalSettingsStatus();
                }
            );
    }
    redirecToSettings() {
        this.router.navigate(['provider', 'settings']);
    }
    handlenotificationSettings(event) {
        const value = (event.checked) ? true : false;
        const status = (value) ? 'enabled' : 'disabled';
        const state = (value) ? 'Enable' : 'Disable';
        this.provider_services.setNotificationSettings(state).subscribe(data => {
            this.snackbarService.openSnackBar('Send notification  ' + status + ' successfully');
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
            this.getSMSglobalSettings();
        }, (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.getSMSglobalSettings();
        });
    }
    getSMSglobalSettings() {
        this.provider_services.getSMSglobalSettings().subscribe(data => {
            this.smsGlobalStatus = data['enableSms'];
            this.notificationStatus = data['sendNotification'];
        });
    }
    getSMSCredits() {
        this.provider_services.getSMSCredits().subscribe(data => {
            this.smsCredits = data;
        });
    }
    getVirtualCallingModesList() {
        this.provider_services.getVirtualCallingModes().subscribe(
            (data: any) => {
                this.virtualCallModesList = data.virtualCallingModes;               
            });
    }
    showPopup(mode) {

        console.log(mode);
        const dialogref = this.dialog.open(UpdateNotificationComponent, {
            width: '40%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'updatenotificationclass'],
            disableClose: true,
            data: {
                mode: mode,
                callingmodeList: this.virtualCallModesList
            }
        });
        dialogref.afterClosed().subscribe(
            result => {
                this.getVirtualCallingModesList();
            }
        );
    }
    gotoProviderNotification() {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                type: this.provider_label
            }
        };
        this.router.navigate(['provider', 'settings', 'comm', 'notifications', 'provider'], navigationExtras);
    }
    gotoCustomerNotification() {
        this.router.navigate(['provider', 'settings', 'comm', 'notifications', 'consumer']);
    }
    getName(type) {
        if (this.virtualCallModesList) {
            const filtererList = this.virtualCallModesList.filter(mode => mode.callingMode === type);
            if (filtererList && filtererList[0] && filtererList[0].value) {
                return 'Connected';
            } else {
                return 'Not Connected';
            }
        }
    }
    getDomainSubdomainSettings() {
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(this.domain, this.sub_domain)
                .subscribe(
                    (data: any) => {
                        this.isMultilevel = data.isMultilevel;
                        if (this.sub_domain === ('hospital' || 'dentalHosp' || 'alternateMedicineHosp' || 'veterinaryhospital') && this.accountType === 'BRANCH' && this.isMultilevel) {
                            this.provider_label = 'Hospital';
                        }
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
}
