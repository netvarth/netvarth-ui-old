import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Subscription } from 'rxjs';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../ynw_provider/services/provider-datastorage.service';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ShowMessageComponent } from '../../show-messages/show-messages.component';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-waitlistmgr',
    templateUrl: './waitlistmgr.component.html'
})
export class WaitlistMgrComponent implements OnInit, OnDestroy {
    accept_online_cap = Messages.WAITLIST_ACCEPT_ONLINE_CAP;
    // locations_cap = Messages.WAITLIST_LOCATIONS_CAP;
    services_cap = Messages.WAITLIST_SERVICES_CAP;
    ser_time_windows_cap = Messages.SERVICE_TIME_CAP;
    statusboard_cap = Messages.DISPLAYBOARD_HEADING;
    bProfile = null;
    online_checkin = false;
    waitlist_manager: any = null;
    // location_count: any = 0;
    service_count: any = 0;
    queues_count: any = 0;
    instant_count: any = 0;
    // departmentCount: any = 0;
    board_count: any = 0;
    // locations: any = [];
    // selected_location = null;
    // multipeLocationAllowed = false;
    // locName;
    // businessConfig: any = [];
    checkin_label = '';
    prevcheckstatus;
    loc_list: any = [];
    active_user;
    customer_label = '';
    loading = true;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP
        }
    ];

    subscription: Subscription;
    isCheckin;
    domain;
    futureDateWaitlist = false;
    // filterbydepartment = false;
    locationExists = false;
    statusboardStatus = false;
    licenseMetadata: any = [];
    account_type;
    waitlist_status: boolean;
    waitlist_statusstr: string;
    todaycheckin_statusstr = 'Off';
    futurecheckin_statusstr = 'Off';
    qSystem = 'token';
    trnArndTime;
    isManualMode = false;
    is_data_chnge: any;
    confirmdialogRef;
    today_waitlist_count: any = 0;
    future_waitlist_count: any = 0;
    constructor(private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        private router: Router,
        private routerobj: Router,
        private shared_functions: SharedFunctions,
        private dialog: MatDialog,
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService
        // private shared_services: SharedServices
    ) {
        this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.shared_functions.getMessage().subscribe(data => {
            switch (data.ttype) {
                case 'upgradelicence':
                    // this.getStatusboardLicenseStatus();
                    break;
            }
        });
    }
    frm_set_ser_cap = '';
    breadcrumb_moreoptions: any = [];
    frm_set_loc_cap = Messages.FRM_LEVEL_SETT_LOC_MSG;
    frm_set_working_hr_cap = Messages.FRM_LEVEL_SETT_WORKING_HR_MSG;
    calcMode = 'conventional';
    est_time;
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        if (this.domain === 'healthCare' || this.domain === 'veterinaryPetcare') {
            this.services_cap = projectConstantsLocal.HealthcareService.service_cap;
        }
        this.account_type = user.accountType;
        this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.loading = true;
        this.getBusinessProfile();
        this.getWaitlistMgr();
        this.getGlobalSettingsStatus();
        // this.getLocationCount();
        this.getQueuesCount();
        this.getServiceCount();
        // this.getDepartmentsCount();
        // this.getBusinessConfiguration();
        this.getDisplayboardCount();
        // this.getStatusboardLicenseStatus();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.frm_set_ser_cap = Messages.FRM_LEVEL_SETT_SERV_MSG.replace('[customer]', this.customer_label);
        // this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'q-manager->settings' };
        // Update from footer
        this.subscription = this.shared_functions.getMessage()
            .subscribe(
                data => {
                    if (data.ttype === 'online_checkin_status' || data.ttype === 'filterbyDepartment' || data.ttype === 'future_checkin_status') {
                        this.getWaitlistMgr();
                    }
                });
        this.getTodayWLCount();
        this.getFutureWLCount();
    }
    getDisplayboardCount() {
        let layout_list: any = [];
        this.provider_services.getDisplayboardsWaitlist()
            .subscribe(
                data => {
                    layout_list = data;
                    this.board_count = layout_list.length;
                });
    }
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    getWaitlistMgr() {
        this.loading = true;
        this.waitlist_manager = null;
        this.est_time = false;
        this.isManualMode = false;
        this.trnArndTime = 0;
        this.provider_services.getWaitlistMgr()
            .subscribe(
                data => {
                    this.waitlist_manager = data;
                    this.shared_functions.sendMessage({ ttype: 'waitlistSettings', value: this.waitlist_manager.showTokenId });
                    if (this.waitlist_manager.showTokenId) {
                        this.qSystem = 'token';
                        if (this.waitlist_manager.showTokenId && this.waitlist_manager.calculationMode === 'Conventional') {
                            this.est_time = true;
                        }
                    } else {
                        // if (this.domain === 'healthCare') {
                        //     this.qSystem = 'token';
                        // } else {
                        this.qSystem = 'fifo';
                        // }
                        if (this.waitlist_manager.calculationMode === 'Fixed') {
                            this.calcMode = 'manual';
                            this.isManualMode = true;
                            this.trnArndTime = this.waitlist_manager.trnArndTime;
                        }
                        if (this.waitlist_manager.calculationMode === 'Conventional') {
                            this.calcMode = 'conventional';
                        }
                    }
                    this.online_checkin = data['onlineCheckIns'];
                    this.futureDateWaitlist = data['futureDateWaitlist'];
                    this.todaycheckin_statusstr = this.online_checkin ? 'On' : 'Off';
                    this.futurecheckin_statusstr = this.futureDateWaitlist ? 'On' : 'Off';
                    this.provider_datastorage.set('waitlistManage', data);
                    // this.filterbydepartment = data['filterByDept'];
                });
        this.loading = false;
    }
    getBusinessProfile() {
        this.loading = true;
        this.provider_services.getBussinessProfile()
            .subscribe(
                data => {
                    this.bProfile = data;
                    if (this.bProfile.baseLocation) {
                        this.locationExists = true;
                    } else {
                        this.locationExists = false;
                    }
                    this.provider_datastorage.set('bProfile', data);

                });
        this.loading = false;
    }
    changAcceptOnlineCheckin(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        this.prevcheckstatus = (this.online_checkin) ? false : true;
        this.online_checkin = event.checked;
        this.setAcceptOnlineCheckin(is_check);
    }
    getGlobalSettingsStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.waitlist_status = data['waitlist'];
                this.waitlist_statusstr = this.waitlist_status ? 'On' : 'Off';
                this.groupService.setitemToGroupStorage('settings', data);
                this.shared_functions.sendMessage({ 'ttype': 'checkinStatus', checkinStatus: this.waitlist_status });
            });
    }
    setAcceptOnlineCheckin(is_check) {
        this.provider_services.setAcceptOnlineCheckin(is_check)
            .subscribe(
                () => {
                    this.getWaitlistMgr();
                },
                error => {
                    this.online_checkin = this.prevcheckstatus;
                }
            );
    }
    gotoDisplayboards() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
        // if (this.statusboardStatus) {
        //     this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
        // } else {
        //     this.snackbarService.openSnackBar(Messages.COUPON_UPGRADE_LICENSE, { 'panelClass': 'snackbarerror' });
        // }
    }
    // goLocation() {
    //     this.router.navigate(['provider', 'settings', 'q-manager', 'locations']);
    // }
    goService() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'services']);
    }
    goQueue() {
        if (this.locationExists) {
            this.router.navigate(['provider', 'settings', 'q-manager', 'queues']);
        } else {
            this.snackbarService.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
    }
    // goDepartments() {
    //     this.router.navigate(['provider', 'settings', 'q-manager', 'departments']);
    // }
    // getLocationCount() {
    //     this.loading = true;
    //     this.provider_services.getLocationCount()
    //         .subscribe(
    //             data => {
    //                 this.location_count = data;
    //             });
    //     this.loading = false;
    // }
    getServiceCount() {
        this.loading = true;
        const filter = { 'serviceType-neq': 'donationService', 'status-eq': 'ACTIVE' };
        this.provider_services.getServiceCount(filter)
            .subscribe(
                data => {
                this.service_count = data;
                });
        this.loading = false;
    }
    getQueuesCount() {
        this.loading = true;
        // const filter = { 'scope-eq': 'account' };
        const filter = { 'state-eq': 'ENABLED' };
        this.provider_services.getQueuesCount(filter)
            .subscribe(
                data => {
                this.queues_count = data;
                });
        this.loading = false;
    }

    // getBusinessConfiguration() {
    //     this.loading = true;
    //     this.shared_services.bussinessDomains()
    //         .subscribe(data => {
    //             this.businessConfig = data;
    //             this.getBussinessProfile();
    //         });
    //     this.loading = false;
    // }
    // getBussinessProfile() {
    //     this.provider_services.getBussinessProfile()
    //         .subscribe(data => {
    //             this.bProfile = data;
    //             for (let i = 0; i < this.businessConfig.length; i++) {
    //                 if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
    //                     if (this.businessConfig[i].multipleLocation) {
    //                         this.multipeLocationAllowed = true;
    //                     }
    //                     if (this.multipeLocationAllowed === true) {
    //                         this.locName = this.wordProcessor.getProjectMesssages('WAITLIST_LOCATIONS_CAP');
    //                     }
    //                     if (this.multipeLocationAllowed === false) {
    //                         this.locName = this.wordProcessor.getProjectMesssages('WIZ_LOCATION_CAP');
    //                     }
    //                 }
    //             }
    //         });
    // }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/q-manager']);
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->' + mod]);
    }
    // getMode(mod) {
    //   let moreOptions = {};
    //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'waitlistmanager', 'subKey': mod };
    //   return moreOptions;
    // }
    handle_waitliststatus(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setAcceptOnlineCheckin(is_check)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Same day online check-in ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getWaitlistMgr();
                    this.shared_functions.sendMessage({ ttype: 'checkin-settings-changed' });
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getWaitlistMgr();
                }
            );
    }

    handleFuturewaitlist(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setFutureCheckinStatus(is_check)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Future check-in ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getWaitlistMgr();
                    this.shared_functions.sendMessage({ ttype: 'checkin-settings-changed' });
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    handleCheckinPresence(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        if (event.checked && this.queues_count === 0) {
            const confirmdialogRef = this.dialog.open(ShowMessageComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass'],
                disableClose: true,
                data: {
                  'type': 'waitlist'
                }
              });
            confirmdialogRef.afterClosed().subscribe(result => {
                this.waitlist_status = false;
            });
        } else {
            this.provider_services.setCheckinPresence(is_check)
                .subscribe(
                    () => {
                        this.snackbarService.openSnackBar('QManager ' + is_check.charAt(0).toLowerCase() + is_check.slice(1) + 'd successfully', { ' panelclass': 'snackbarerror' });
                        this.getGlobalSettingsStatus();
                    },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.getGlobalSettingsStatus();
                    }
                );
        }
    }
    // getDepartmentsCount() {
    //     this.loading = true;
    //     this.provider_services.getDepartmentCount()
    //         .subscribe(
    //             data => {
    //                 this.departmentCount = data;
    //             });
    //     this.loading = false;
    // }
    getStatusboardLicenseStatus() {
        // let pkgId;
        // const user = this.groupService.getitemFromGroupStorage('ynw-user');
        // if (user && user.accountLicenseDetails && user.accountLicenseDetails.accountLicense && user.accountLicenseDetails.accountLicense.licPkgOrAddonId) {
        //     pkgId = user.accountLicenseDetails.accountLicense.licPkgOrAddonId;
        // }
        // this.provider_services.getLicenseMetadata().subscribe(data => {
        //     this.licenseMetadata = data;
        //     for (let i = 0; i < this.licenseMetadata.length; i++) {
        //         if (this.licenseMetadata[i].pkgId === pkgId) {
        //             for (let k = 0; k < this.licenseMetadata[i].metrics.length; k++) {
        //                 if (this.licenseMetadata[i].metrics[k].id === 18) {
        //                     if (this.licenseMetadata[i].metrics[k].anyTimeValue === 'true') {
        //                         this.statusboardStatus = true;
        //                         return;
        //                     } else {
        //                         this.statusboardStatus = false;
        //                         return;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // });
    }

    handleModeSelection(qSystem) {
        let postData;
        if (qSystem === 'token') {
            postData = {
                calculationMode: 'NoCalc',
                showTokenId: true
            };
        } else {
            postData = {
                calculationMode: 'Conventional',
                showTokenId: false
            };
        }
        if (this.today_waitlist_count === 0 && this.future_waitlist_count === 0) {
            this.provider_services.setWaitlistMgr(postData)
                .subscribe(
                    () => {
                        this.getWaitlistMgr();
                        this.is_data_chnge = 0;
                        this.snackbarService.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
                    },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        } else {
            this.confirmdialogRef = this.dialog.open(ConfirmBoxComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
                disableClose: true,
                data: {
                    'message': 'Are you sure you want to change your queue system? This will effect your tokens/check-ins'
                }
            });
            this.confirmdialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.provider_services.setWaitlistMgr(postData)
                        .subscribe(
                            () => {
                                this.getWaitlistMgr();
                                this.is_data_chnge = 0;
                                this.snackbarService.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
                            },
                            error => {
                                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            });
                } else {
                    if (qSystem === 'token') {
                        this.qSystem = 'fifo';
                    } else {
                        this.qSystem = 'token';
                    }
                }
            });
        }
    }
    setWaitingTime(ev) {
        if (ev.checked) {
            const postData = {
                calculationMode: 'Conventional',
                showTokenId: true
            };
            this.provider_services.setWaitlistMgr(postData)
                .subscribe(
                    () => {
                        this.getWaitlistMgr();
                        this.is_data_chnge = 0;
                        this.snackbarService.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
                    },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        } else {
            const postData = {
                calculationMode: 'NoCalc',
                showTokenId: true
            };
            this.provider_services.setWaitlistMgr(postData)
                .subscribe(
                    () => {
                        this.getWaitlistMgr();
                        this.is_data_chnge = 0;
                        this.snackbarService.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
                    },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        }
    }
    inputChange() {
        this.is_data_chnge = 1;
    }
    updateManualMode() {
        if (this.trnArndTime <= 0) {
            this.snackbarService.openSnackBar(Messages.WAITLIST_TURNTIME_INVALID, { 'panelClass': 'snackbarerror' });
            return;
        }
        const postData = {
            calculationMode: 'Fixed',
            trnArndTime: this.trnArndTime,
            showTokenId: false
        };
        this.provider_services.setWaitlistMgr(postData)
            .subscribe(
                () => {
                    this.getWaitlistMgr();
                    this.is_data_chnge = 0;
                    this.snackbarService.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
                },
                error => {
                    this.is_data_chnge = 0;
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    cancelChange() {
        this.is_data_chnge = 0;
        this.getWaitlistMgr();
    }
    fixedModeChanged(calcMode) {
        if (calcMode === 'conventional') {
            this.is_data_chnge = 0;
            const postData = {
                calculationMode: 'Conventional',
                showTokenId: false
            };
            this.provider_services.setWaitlistMgr(postData)
                .subscribe(
                    () => {
                        this.getWaitlistMgr();
                    });
            this.isManualMode = false;
        } else {
            this.isManualMode = true;
            this.trnArndTime = 0;
        }
    }
    getTodayWLCount() {
        const Mfilter = {};
        Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
        this.provider_services.getwaitlistTodayCount(Mfilter)
            .subscribe(
                data => {
                    this.today_waitlist_count = data;
                },
                () => {
                });
    }
    getFutureWLCount() {
        const Mfilter = {};
        Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
        this.provider_services.getWaitlistFutureCount(Mfilter)
            .subscribe(
                data => {
                    this.future_waitlist_count = data;
                },
                () => {
                });
    }
    redirecToSettings() {
        this.routerobj.navigate(['provider', 'settings']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/q-manager']);
    }
}

