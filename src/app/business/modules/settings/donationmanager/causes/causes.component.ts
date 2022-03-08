import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../functions/provider-shared-functions';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../app.component';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceQRCodeGeneratordetailComponent } from '../..../../../../../../shared/modules/service/serviceqrcodegenerator/serviceqrcodegeneratordetail.component';
import { ProviderDataStorageService } from '../../../../services/provider-datastorage.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
    selector: 'app-donation-causelist',
    templateUrl: './causes.component.html',
    styleUrls: ['causes.component.css']
})
export class DonationCauseListComponent implements OnInit, OnDestroy {
    add_new_serv_cap = Messages.SER_ADD_NEW_SER_CAP;
    est_duration_cap = Messages.SER_EST_DURATION_CAP;
    min_cap = Messages.SER_MIN_CAP;
    price_cap = Messages.SER_PRICE_CAP;
    isServiceBillable = false;
    api_loading = true;
    service_list: any = [];
    api_error = null;
    api_success = null;
    add_button ='Click to create a cause';
    tooltipcls = projectConstants.TOOLTIP_CLS;
    domain: any;
    trackStatus: string;
    cause_list: any = [];
    causes_list: any;
    order = 'status';
    bprofile: any = [];
    qrdialogRef: any;
    wndw_path = projectConstantsLocal.PATH;
    constructor(private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        private groupService: GroupStorageService,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private dateTimeProcessor: DateTimeProcessor,
        private provider_datastorage: ProviderDataStorageService,
        public router: Router) { }

    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getBusinessProfile();
        this.getDomainSubdomainSettings();
        this.getServices();
    }

    ngOnDestroy() {
    }
    performActions(action) {
        if (action === 'addcause') {
            this.router.navigate(['provider', 'settings', 'donationmanager', 'causes', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/donationmanager->causes']);
        }
    }
    getServices() {
        this.api_loading = true;
        const filter = { 'scope-eq': 'account', 'serviceType-eq': 'donationService' };
        this.provider_services.getCauses(filter)
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
    getBusinessProfile() {
        this.provider_services.getBussinessProfile()
            .subscribe(
                data => {
                    this.bprofile = data;
                    
                    this.provider_datastorage.set('bProfile', data);
                });
    }

    changeServiceStatus(service) {
        this.provider_shared_functions.changeServiceStatus(this, service);
    }
    disableService(service) {
        this.provider_services.disableService(service.id)
            .subscribe(
                () => {
                    this.getServices();
                },
                (error) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServices();
                });
    }
    enableService(service) {
        this.provider_services.enableService(service.id)
            .subscribe(
                () => {
                    this.getServices();
                },
                (error) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServices();
                });
    }
    editService(service) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'donationmanager', 'causes', service.id], navigationExtras);
    }

    goServiceDetail(service) {
        this.router.navigate(['provider', 'settings', 'donationmanager', 'causes', service.id]);
    }

    getDomainSubdomainSettings() {
        this.api_loading = true;
        const user_data = this.groupService.getitemFromGroupStorage('ynw-user');
        const domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        this.provider_services.domainSubdomainSettings(domain, sub_domain)
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
    redirecToDonation() {
        this.router.navigate(['provider', 'settings' , 'donationmanager']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/donationmanager->causes']);
    }
    addcause() {
        this.router.navigate(['provider', 'settings', 'donationmanager', 'causes', 'add']);
    }
    serviceqrCodegeneraterOnlineID(service){
        let pid = '';
        let usrid = '';
        if(!this.bprofile.customId){
          pid = this.bprofile.accEncUid;
        } else {
          pid = this.bprofile.customId;
        }
        if(service && service.provider && service.provider.id){
          usrid = service.provider.id;
        } else {
          usrid = '';
        }
      this.qrdialogRef = this.dialog.open(ServiceQRCodeGeneratordetailComponent, {
          width: '40%',
          panelClass: ['popup-class', 'commonpopupmainclass','servceqrcodesmall'],
          disableClose: true,
          data: {
            accencUid: pid,
            path: this.wndw_path,
            serviceid: service.id,
            userid: usrid
          }
        });
    
        this.qrdialogRef.afterClosed().subscribe(result => {
        //   if (result === 'reloadlist') {
        //     this.getBusinessProfile();
        //   }
        });
    }
}
