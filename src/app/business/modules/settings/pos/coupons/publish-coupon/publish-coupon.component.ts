import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';


@Component({
  selector: 'app-publish-coupon',
  templateUrl: './publish-coupon.component.html',
  styleUrls: ['./publish-coupon.component.css']
})
export class PublishCouponComponent implements OnInit {
  public publishForm: FormGroup;
  couponId: any;
  startdateError: boolean;
  enddateError: boolean;
  constructor(private formbuilder: FormBuilder,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private router: Router,
    private activated_route:ActivatedRoute) { 
    this.activated_route.params.subscribe(params => {
      this.couponId = params.id;
      this.getcouponDetails(this.couponId);
    });
    this.createForm();
    
  }

  ngOnInit(): void {
  }
  createForm() {
    this.publishForm = this.formbuilder.group({
      couponRules: this.formbuilder.group({
      publishedFrom: ['', [Validators.required]],
      publishedTo: ['', [Validators.required]]
      })
    });
      

  }
  compareDate(dateValue, startOrend) {
    const UserDate = dateValue;
    this.startdateError = false;
    this.enddateError = false;
    const ToDate = new Date().toString();
    const l = ToDate.split(' ').splice(0, 4).join(' ');
    const sDate = this.publishForm.get('publishedFrom').value;
    const sDate1 = new Date(sDate).toString();
    const l2 = sDate1.split(' ').splice(0, 4).join(' ');
    if (startOrend === 0) {
      if (new Date(UserDate) < new Date(l)) {
        return this.startdateError = true;
      }
      return this.startdateError = false;
    } else if (startOrend === 1 && dateValue) {
      if (new Date(UserDate) < new Date(l2)) {
        return this.enddateError = true;
      }
      return this.enddateError = false;
    }
  }
  getcouponDetails( couponId){
    const _this=this;
    return new Promise((resolve) => {
      _this.provider_services.getProviderCoupons(couponId).subscribe(
        (result: any) => {
     
          resolve(result);
        });
    });
  }

  onSubmit(){
    const form_data=this.publishForm.value;
    form_data.id=this.couponId;
    this.provider_services.publishCoupon(form_data,this.couponId)
    .subscribe(result=>{
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('COUPON_PUBLISHED'));

    })

  }
  redirecToCoupon() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupon']);
  }

}
