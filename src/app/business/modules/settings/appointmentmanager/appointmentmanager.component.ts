import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderDataStorageService } from '../../../../ynw_provider/services/provider-datastorage.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from '../../show-messages/show-messages.component';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-appointmentmanager',
    templateUrl: './appointmentmanager.component.html'
})
export class AppointmentmanagerComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Jaldee Appointment Manager'
        }
    ];
    domain;
    breadcrumbs = this.breadcrumbs_init;
    isCorp = false;
    isMultilevel = false;
    accountType: any;
    cust_domain_name = '';
    provider_domain_name = '';
    customer_label = '';
    provider_label = '';
    createappointment_status: any;
    createappointment_statusstr: string;
    schedules_count: any = 0;
    service_count: any = 0;
    apptlist_details;
    apptlist_status = false;
    futureDateApptlist = false;
    apptlist_statusstr = 'Off';
    futureapptlist_statusstr = 'off';
    breadcrumb_moreoptions: any = [];
    frm_set_ser_cap = '';
    bProfile = null;
    locationExists = false;
    services_cap = Messages.WAITLIST_SERVICES_CAP;
    constructor(
        private router: Router,
        private routerobj: Router, private dialog: MatDialog,
        private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        private groupService: GroupStorageService,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private sharedFunctions: SharedFunctions
    ) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    }
    ngOnInit() {
        this.getBusinessProfile();
        this.getDomainSubdomainSettings();
        this.getOnlinePresence();
        this.getServiceCount();
        this.getSchedulesCount();
        this.getApptlistMgr();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
        this.frm_set_ser_cap = Messages.FRM_LEVEL_SETT_SERV_MSG.replace('[customer]', this.customer_label);
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        if (this.domain === 'healthCare' || this.domain === 'veterinaryPetcare') {
            this.services_cap = projectConstantsLocal.HealthcareService.service_cap;
        }
    }
    getBusinessProfile() {
        this.provider_services.getBussinessProfile()
            .subscribe(
                data => {
                    // console.log(data);
                    this.bProfile = data;
                    if (this.bProfile.baseLocation) {
                        this.locationExists = true;
                    } else {
                        this.locationExists = false;
                    }
                    this.provider_datastorage.set('bProfile', data);

                });
    }
    gotoschedules() {
        if (this.locationExists) {
            this.router.navigate(['provider', 'settings', 'appointmentmanager', 'schedules']);
        } else {
            this.snackbarService.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
    }
    gotoservices() {
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'services']);
    }
    gotodisplayboards() {
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
    }
    // gotoAppointments(){
    //     this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointment']);
    // }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/appointmentmanager']);
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/appointmentmanager->' + mod]);
    }
    getDomainSubdomainSettings() {
        const user_data = this.groupService.getitemFromGroupStorage('ynw-user');
        this.accountType = user_data.accountType;
        this.domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(this.domain, sub_domain)
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
    handle_appointmentPresence(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        if (event.checked && this.schedules_count === 0) {
            const confirmdialogRef = this.dialog.open(ShowMessageComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass'],
                disableClose: true,
                data: {
                    'type': 'appt'
                }
            });
            confirmdialogRef.afterClosed().subscribe(result => {
                this.createappointment_status = false;
            });
        } else {
            this.provider_services.setAppointmentPresence(is_check)
                .subscribe(
                    () => {
                        this.snackbarService.openSnackBar('Appointment manager ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
                        this.getOnlinePresence();
                    },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.getOnlinePresence();
                    }
                );
        }
    }

    getOnlinePresence() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.createappointment_status = data.appointment;
                this.createappointment_statusstr = (this.createappointment_status) ? 'On' : 'Off';
                this.groupService.setitemToGroupStorage('settings', data);
                this.sharedFunctions.sendMessage({ 'ttype': 'apptStatus', apptStatus: this.createappointment_status });
            });
    }
    handle_apptliststatus(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setAcceptOnlineAppointment(is_check)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Same day online appointment ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getApptlistMgr();
                    this.sharedFunctions.sendMessage({ ttype: 'checkin-settings-changed' });
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getApptlistMgr();
                }
            );
    }

    handle_futureapptliststatus(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setFutureAppointmentStatus(is_check)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Future appointment ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getApptlistMgr();
                    this.sharedFunctions.sendMessage({ ttype: 'checkin-settings-changed' });
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    getApptlistMgr() {
        this.provider_services.getApptlistMgr()
            .subscribe(
                data => {
                    this.apptlist_details = data;
                    this.apptlist_status = data['enableToday'] || false;
                    this.futureDateApptlist = data['futureAppt'] || false;
                    this.apptlist_statusstr = (this.apptlist_status) ? 'On' : 'Off';
                    this.futureapptlist_statusstr = (this.futureDateApptlist) ? 'On' : 'Off';
                    // this.filterbydepartment = data['filterByDept'];
                });

    }
    getServiceCount() {
        const filter = { 'serviceType-neq': 'donationService' };
        this.provider_services.getServiceCount(filter)
            .subscribe(
                data => {
                    this.service_count = data;
                });
    }
    getSchedulesCount() {
        // const filter = { 'scope-eq': 'account' };
        const filter = { 'state-eq': 'ENABLED' };
        this.provider_services.getSchedulesCount(filter)
            .subscribe(
                data => {
                    this.schedules_count = data;
                });
    }
    redirecToSettings() {
        this.routerobj.navigate(['provider', 'settings']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/appointmentmanager']);
    }
}

