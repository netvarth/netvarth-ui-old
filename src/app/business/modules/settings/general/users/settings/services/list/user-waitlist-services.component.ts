import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../../../functions/provider-shared-functions';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../../services/provider-services.service';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../../../app.component';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { ShowMessageComponent } from '../../../../../../show-messages/show-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../../../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../../../shared/services/word-processor.service';
import { DateTimeProcessor } from '../../../../../../../../shared/services/datetime-processor.service';
import { ProviderDataStorageService } from '../../../../../../../services/provider-datastorage.service';
import { ServiceQRCodeGeneratordetailComponent } from '../../../../../../../../shared/modules/service/serviceqrcodegenerator/serviceqrcodegeneratordetail.component';

@Component({
    selector: 'app-user-services',
    templateUrl: './user-waitlist-services.component.html'
})
export class UserWaitlistServicesComponent implements OnInit, OnDestroy {
    add_new_serv_cap = Messages.SER_ADD_NEW_SER_CAP;
    est_duration_cap = Messages.SER_EST_DURATION_CAP;
    services_cap = Messages.WAITLIST_SERVICES_CAP;
    min_cap = Messages.SER_MIN_CAP;
    price_cap = Messages.SER_PRICE_CAP;
    isServiceBillable = false;
    api_loading = true;
    service_list: any = [];
    api_error = null;
    api_success = null;
    domain: any;
    domainList: any = [];
    subDomain;
    userId: any;
    page_count = projectConstants.PERPAGING_LIMIT;
    page = 1;
    pagination: any = {
        startpageval: 1,
        totalCnt: 0,
        perPage: this.page_count
    };
    order = 'status';
    use_metric;
    usage_metric: any;
    adon_info: any;
    adon_total: any;
    adon_used: any;
    disply_name: any;
    warningdialogRef: any;
    bprofile: any = [];
    qrdialogRef: any;
    wndw_path = projectConstantsLocal.PATH;
    constructor(private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        private dialog: MatDialog,
        public router: Router,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService,
        private dateTimeProcessor: DateTimeProcessor,
        private provider_datastorage: ProviderDataStorageService,
        private groupService: GroupStorageService) {
        this.activated_route.params.subscribe(params => {
            this.userId = params.id;
        }
        );
    }
    ngOnInit() {
        this.getBusinessProfile();
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getServiceCount();
        if (this.domain === 'healthCare' || this.domain === 'veterinaryPetcare') {
            this.services_cap = projectConstantsLocal.HealthcareService.service_cap;
        }
        this.getLicenseUsage();
    }
    ngOnDestroy() {
    }
    performActions(action) {
        if (action === 'addservice') {
            this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->settings-services']);
        }
    }
    getBusinessProfile() {
        this.provider_services.getBussinessProfile()
            .subscribe(
                data => {
                    this.bprofile = data;
                    this.provider_datastorage.set('bProfile', data);
                });
    }
    getServices(pgefilter?) {
        this.api_loading = true;
        this.provider_services.getUserServicesList(pgefilter)
            .subscribe(
                data => {
                    this.service_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }
    changeServiceStatus(service) {
        this.provider_shared_functions.changeServiceStatus(this, service);
    }
    disableService(service) {
        this.provider_services.disableService(service.id)
            .subscribe(
                () => {
                    this.getServiceCount();
                },
                (error) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServiceCount();
                });
    }
    enableService(service) {
        this.provider_services.enableService(service.id)
            .subscribe(
                () => {
                    this.getServiceCount();
                },
                (error) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServiceCount();
                });
    }
    editService(service) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', service.id], navigationExtras);
    }
    goServiceDetail(service) {
        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', service.id]);
    }
    getDomainSubdomainSettings() {
        this.provider_services.domainSubdomainSettings(this.domain, this.subDomain)
            .subscribe(
                (data: any) => {
                    if (data.serviceBillable) {
                        this.isServiceBillable = true;
                    } else {
                        this.isServiceBillable = false;
                    }
                    this.api_loading = false;
                },
                () => {
                    this.api_loading = false;
                }
            );
    }
    getAppxTime(waitlist) {
        return this.dateTimeProcessor.providerConvertMinutesToHourMinute(waitlist);
    }

    getServiceCount() {
        const filter = { 'serviceType-neq': 'donationService', 'provider-eq': this.userId };
        this.provider_services.getServiceCount(filter)
            .subscribe(
                data => {
                    this.pagination.totalCnt = data;
                    const pgefilter = {
                        'from': 0,
                        'count': this.pagination.totalCnt,
                        'serviceType-neq': 'donationService',
                        'provider-eq': this.userId
                    };
                    this.setPaginationFilter(pgefilter);
                    this.getServices(pgefilter);
                });
    }
    setPaginationFilter(api_filter) {
        api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.page_count : 0;
        api_filter['count'] = this.page_count;
        return api_filter;
    }
    handle_pageclick(pg) {
        this.pagination.startpageval = pg;
        this.page = pg;
        const pgefilter = {
            'from': this.pagination.startpageval,
            'count': this.pagination.totalCnt,
            'serviceType-neq': 'donationService',
            'provider-eq': this.userId
        };
        this.setPaginationFilter(pgefilter);
        this.getServices(pgefilter);
    }
    redirecToUserSettings() {
        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings']);
    }
    addservice() {
        if (this.adon_total === this.adon_used) {
            this.warningdialogRef = this.dialog.open(ShowMessageComponent, {
                width: '50%',
                panelClass: ['commonpopupmainclass', 'popup-class'],
                disableClose: true,
                data: {
                    warn: this.disply_name
                }
            });
            this.warningdialogRef.afterClosed().subscribe(result => {

            });
        } else {
            this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', 'add']);
        }
    }
    getLicenseUsage() {
        this.provider_services.getLicenseUsage()
            .subscribe(
                data => {
                    this.use_metric = data;
                    this.usage_metric = this.use_metric.metricUsageInfo;
                    this.adon_info = this.usage_metric.filter(sch => sch.metricName === 'Queues/Schedules/Services');
                    this.adon_total = this.adon_info[0].total;
                    this.adon_used = this.adon_info[0].used;
                    this.disply_name = this.adon_info[0].metricName;
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    serviceqrCodegeneraterOnlineID(service) {
        let pid = '';
        let usrid = '';
        if (!this.bprofile.customId) {
            pid = this.bprofile.accEncUid;
        } else {
            pid = this.bprofile.customId;
        }
        if (service && service.provider && service.provider.id) {
            usrid = service.provider.id;
        } else {
            usrid = '';
        }
        this.qrdialogRef = this.dialog.open(ServiceQRCodeGeneratordetailComponent, {
            width: '40%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'servceqrcodesmall'],
            disableClose: true,
            data: {
                accencUid: pid,
                path: this.wndw_path,
                serviceid: service.id,
                userid: usrid
            }
        });
        this.qrdialogRef.afterClosed().subscribe(result => {
        });
    }
}
