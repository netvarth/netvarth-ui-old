import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SubSink } from 'subsink';
import { SharedFunctions } from '../../../../../../src/app/shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../../src/app/business/services/provider-datastorage.service';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from '../../show-messages/show-messages.component';
// import { SharedFunctions } from '../../../../../../src/app/shared/functions/shared-functions';

@Component({
  selector: 'app-leadmanager',
  templateUrl: './leadmanager.component.html',
  styleUrls: ['./leadmanager.component.css']
})
export class LeadmanagerComponent implements OnInit,OnDestroy {
    public customer_label:any;
    leadstatus;
    pos_statusstr = 'Off';
    frm_public_self_cap = '';
    domain;
    nodiscountError = false;
    noitemError = false;
    itemError = '';
    discountError = '';
    discount_list;
    discount_count = 0;
    item_list;
    item_count = 0;
    pos;
    catalog_list: any = [];
    private subscriptions = new SubSink();
    lead_status: string;
    bProfile = null;
    locationExists = false;
    constructor( private routerobj: Router,
        private shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
        private provider_datastorage: ProviderDataStorageService,
        private snackbarService: SnackbarService,
        private dialog: MatDialog,
        private groupService: GroupStorageService){
            this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.getBusinessProfile();
        this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getLeadStatus();
      }
      ngOnDestroy() {
        this.subscriptions.unsubscribe();
      }
      handleleadStatus(event) {
        if(event.checked){
          this.lead_status =  'Enable';
        }
        else{
          this.lead_status =  'Disable';
        }
        const status = (event.checked) ? 'enabled' : 'disabled';
        if (event.checked && !this.locationExists) {
          const confirmdialogRef = this.dialog.open(ShowMessageComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
              'type': 'lead'
            }
          });
          this.subscriptions.sink = confirmdialogRef.afterClosed().subscribe(result => {
            this.getLeadStatus();
          });
        } else {
          this.subscriptions.sink = this.provider_services.setProviderLeadStatus(this.lead_status).subscribe(data => {
            this.snackbarService.openSnackBar('Lead settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
            this.getLeadStatus();
          }, (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.getLeadStatus();
          });
        }
      }
    //   handleleadStatus(event) {
    //     if (this.locationExists) {
    //     if(event.checked){
    //       this.lead_status =  'Enable';
    //     }
    //     else{
    //       this.lead_status =  'Disable';
    //     }
    //     const status = (event.checked) ? 'enabled' : 'disabled';
    //       this.subscriptions.sink = this.provider_services.setProviderLeadStatus(this.lead_status).subscribe(data => {
    //         this.snackbarService.openSnackBar('Lead settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
    //         this.getLeadStatus();
    //       }, (error) => {
    //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //         this.getLeadStatus();
    //       });
    //     }
    //     else{
    //       this.snackbarService.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
    //     }
        
    //   }
      getBusinessProfile() {
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
    }
     
      getLeadStatus() {
        this.subscriptions.sink = this.provider_services.getProviderLeadSettings().subscribe((data: any) => {
          this.leadstatus = data.enableLead;
          this.pos_statusstr = (this.leadstatus) ? 'On' : 'Off';
          this.shared_functions.sendMessage({ 'ttype': 'leadstatus', leadstatus: this.leadstatus });
        });
      }
      redirecToSettings() {
        this.routerobj.navigate(['provider', 'settings']);
      }
      redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
      }
}