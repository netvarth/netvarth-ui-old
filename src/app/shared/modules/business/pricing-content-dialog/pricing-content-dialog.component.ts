import {Component, Inject, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

export interface PricingDialogData {
  part: 'multiChannelBookings' | 'apptManager' | 'qManager' | 'webAndQR' | 'busListing' | 'privateCustomerDB' | 'teleHealth' | 'onlinePayments' |
  'posBilling' | 'smsEmailCampaigns' | 'tvDisplayborad' | 'multiDept_Spec' | 'medicalRecords' | 'ePrescription' | 'liveTracking' | 'customDomain' | 
  'discountCoupons' |  'b2bReferral' | 'frontDeskLite' | 'dedicatedRelationMgr' | 'multiUser' | 'personalMobile' | 'seo' | 'performAnaysis' | 
  'frontDeskFull' | 'dedicatedCallCenter'| 'customBrandLimits' | 'jaldeeListing';
  type: 'patients' | 'customers';
}

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'app-pricing-dialog',
  templateUrl: 'pricing-content-dialog.component.html',
  styleUrls: ['./pricing-content-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PricingContentDialog {
  part: string;
  type: string;
  customer_label:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PricingDialogData,
    private wordProcessor: WordProcessor,) 
    { 
      this.part = data.part;
      this.type = data.type;
    }
    ngOnInit(){
      this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
}