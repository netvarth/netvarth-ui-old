import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { PublishDialogComponent } from './publish-dialog/publish-dialog.component';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-publish-coupon',
  templateUrl: './publish-coupon.component.html',
  styleUrls: ['./publish-coupon.component.css']
})
export class PublishCouponComponent implements OnInit,OnDestroy {

  couponId: any;
  coupon: any;
  rules_cap = Messages.COUPON_RULES_CAP;
  disc_value = Messages.COUP_DISC_VALUE;
  pro_use_limit=Messages.MAX_PRO_USE_LIMIT;
  checkin_label = '';
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  api_loading=true;
  title='';
  private subs = new SubSink();
  constructor(
    private wordProcessor: WordProcessor,
    private router: Router,
    private dialog:MatDialog,
    private provider_services: ProviderServices,
    private activated_route:ActivatedRoute) { 
   this.subs.sink= this.activated_route.params.subscribe(params => {
      this.couponId = params.id;
      this.getcouponDetails(this.couponId).then((data)=>{
       this.coupon=data;
       if(this.coupon.couponRules.published){
         this.title="Coupon " +this.coupon.couponCode +" Published";
       }else{
         this.title="Publish Coupon "+this.coupon.couponCode
       }
       this.api_loading=false;
      });
    });
    this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');

    
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  
  getcouponDetails( couponId){
    const _this=this;
    return new Promise((resolve) => {
      _this.provider_services.getProviderCoupons(couponId).subscribe(
        (result: any) => {
         this.coupon = result;
          resolve(result);
        });
    });
  }


  redirecToCoupon() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
         coupon_list:'own_coupon'
         
      }
  };
    this.router.navigate(['provider', 'settings', 'pos', 'coupon'],navigationExtras);
  }
  
  publish() {
    const dialogrefd = this.dialog.open(PublishDialogComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'coupon': this.coupon,
        
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
       this.getcouponDetails(this.coupon.id);
    });
   
    
  }

}
