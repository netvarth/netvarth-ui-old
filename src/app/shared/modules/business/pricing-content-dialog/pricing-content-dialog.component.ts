import {Component, Inject, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PricingDialogData {
  part: 'multiChannelBookings' | 'apptManager' | 'qManager' | 'webAndQR' | 'busListing' | 'privateCustomerDB' | 'teleHealth' | 'onlinePayments' |
  'posBilling' | 'smsEmailCampaigns' | 'tvDisplayborad' | 'multiDept_Spec' | 'medicalRecords' | 'ePrescription' | 'liveTracking' | 'customDomain' | 
  'discountCoupons' |  'b2bReferral' | 'frontDeskLite' | 'dedicatedRelationMgr' | 'multiUser' | 'personalMobile' | 'seo' | 'performAnaysis' | 
  'frontDeskFull' | 'dedicatedCallCenter';
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PricingDialogData) 
    { 
      this.part = data.part;
    }
}