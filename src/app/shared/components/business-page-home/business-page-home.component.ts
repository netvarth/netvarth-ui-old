import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollToConfigOptions, ScrollToService } from "@nicky-lenaers/ngx-scroll-to";
import { DomainConfigGenerator } from "../../services/domain-config-generator.service";
import { SharedServices } from "../../services/shared-services";
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { S3UrlProcessor } from '../../services/s3-url-processor.service';

@Component({
    selector:'app-business-page-home',
    templateUrl: './business-page-home.component.html',
    styleUrls: ['./business-page-home.component.css']
    
})
export class BusinessPageHomeComponent implements OnInit {
    
    @ViewChild('privacyPolicy') privacyPolicy: ElementRef;
    @ViewChild('termsConditions') termsConditions: ElementRef;
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    // pdfUrl: any;
    accountEncId: string;
    provider_id: any;
    accountProperties: any;
    privacyUrl: any;
    termsUrl: any;
    target: any;
    contact = true;
    termcondition = false;
    privacypolicy =false;
    refundcancell = false;
    shippingdelivry = false;
    contactdetail:any;
    termsdetail:any;
    privacydetail:any;
    refundcanceldetail:any;
    shippingdelivrydetail:any;
    businessjson: any = [];
    bgCover: any;
  businessName;
  bLogo = '';
  emaillist: any = [];
  phonelist: any = [];
    
    constructor(private domSanitizer: DomSanitizer,
        private activateroute:ActivatedRoute,
        private router: Router,
        private shared_services: SharedServices,
        private _scrollToService: ScrollToService,
        private domainConfigService: DomainConfigGenerator,
        private observer: BreakpointObserver,
        private s3Processor: S3UrlProcessor) {
        
    }
    ngOnInit() {
        const _this = this;
        this.activateroute.queryParams.subscribe(
            (queryParams: any) => {
                if (queryParams.target) {
                    this.target = queryParams.target;
                }                
            }
        )
        this.activateroute.paramMap.subscribe(params => {
            this.accountEncId = params.get('id');
            this.getAccountIdFromEncId(this.accountEncId).then(
                (id: any) => {
                    _this.provider_id = id;
                    _this.gets3curl();
                    _this.domainConfigService.getUIAccountConfig(_this.provider_id).subscribe(
                    (uiconfig: any) => {
                    if(uiconfig.contact){
                    this.contactdetail = uiconfig.contact
                    }
                    if(uiconfig.terms){
                      this.termsdetail = uiconfig.terms
                      }                       
                      if(uiconfig.privacy){
                        this.privacydetail = uiconfig.privacy
                        }
                        if(uiconfig.refund){
                          this.refundcanceldetail = uiconfig.refund
                          }
                          if(uiconfig.shipping){
                            this.shippingdelivrydetail = uiconfig.shipping
                            }
                      if (uiconfig.terms) {
                            if(uiconfig.terms.startsWith('https')) {
                                console.log(uiconfig.terms);
                                this.termsUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(uiconfig.terms);
                            } else {
                                this.termsConditions.nativeElement.innerHTML = uiconfig.terms;
                            }
                        }
                        if (uiconfig.privacy) {
                            if(uiconfig.privacy.startsWith('https')) {
                                console.log(uiconfig.privacy);
                                this.privacyUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(uiconfig.privacy);

                            } else {
                                this.privacyPolicy.nativeElement.innerHTML = uiconfig.privacy;
                            }
                        }    
                        
                        if (this.target) {
                            this._scrollToService.scrollTo(this.target);
                        }


                    });
                });
            });

        // this.pdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://jaldeeui.s3.ap-south-1.amazonaws.com/ui/scale/config/152877/PRIVACY+POLICY.pdf');
    }
    ngAfterViewInit() {
        this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
          if (res.matches) {
            this.sidenav.mode = 'over';
            this.sidenav.close();
          } else {
            this.sidenav.mode = 'side';
            this.sidenav.open();
          }
        });
      }
    
    /**
   * 
   * @param encId encId/customId which represents the Account
   * @returns the unique provider id which will gives access to the s3
   */
  getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getBusinessUniqueId(encId).subscribe(
        (id) => {
          resolve(id);
        },
        error => {
          if (error.status === 404) {
            _this.router.navigate(['/not-found']);
          }
          reject();
        }
      );
    });
  }
  public triggerScrollTo(destination) {
      alert(destination);
    const config: ScrollToConfigOptions = {
      target: destination,
      duration: 150,
      easing: 'easeOutElastic',
      offset: 0
    };
    this._scrollToService.scrollTo(config);
  }
  selection(type){
    if(type=='contact'){
        this.contact = true;
        this.termcondition = false;
        this.privacypolicy =false;
    this.refundcancell = false;
    this.shippingdelivry = false;
    } else if (type =='term'){
    this.termcondition = true;
    this.contact = false;
    this.privacypolicy =false;
    this.refundcancell = false;
    this.shippingdelivry = false;
  } else if(type == 'privacy'){
    this.privacypolicy =true;
    this.contact = false;
    this.termcondition = false;
    this.refundcancell = false;
    this.shippingdelivry = false;

  }else if(type == 'refund'){
    this.refundcancell = true;
    this.contact = false;
    this.privacypolicy =false;
    this.termcondition = false;
    this.shippingdelivry = false;

  }else if(type == 'shipping'){
    this.contact = false;
    this.privacypolicy =false;
    this.refundcancell = false;
    this.termcondition = false;
    this.shippingdelivry = true;
  }
}
gets3curl() {
  let accountS3List = 'settings,appointmentsettings,terminologies,coupon,providerCoupon,location,businessProfile,virtualFields,services,apptServices,apptServices,donationServices,departmentProviders';

  this.s3Processor.getJsonsbyTypes(this.provider_id,
    null, accountS3List).subscribe(
      (accountS3s) => {
          if (accountS3s['settings']) {
            this.processS3s('settings', accountS3s['settings']);
          }
          if (accountS3s['terminologies']) {
            this.processS3s('terminologies', accountS3s['terminologies']);
          }
          
          if (accountS3s['businessProfile']) {
            this.processS3s('businessProfile', accountS3s['businessProfile']);
           
          }

          
        }
     
    );
}
processS3s(type, res) {
  let result = this.s3Processor.getJson(res);
  switch (type) {
    case 'businessProfile': {
      this.setBusinesssProfile(result);
      break;
    }
  }
}

   
setBusinesssProfile(res){
      this.businessjson = res;
      this.businessName = this.businessjson.businessName;
       
     
      if (this.businessjson.cover) {
        this.bgCover = this.businessjson.cover.url;
      }
      
      if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
        if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
          this.bLogo = this.businessjson.logo.url;
        }
      } else {
        // this.bLogo = '';
        this.bLogo = '../../../assets/images/img-null.svg';
      }
     
      if (this.businessjson.emails) {
        this.emaillist = this.businessjson.emails;
      }
      if (this.businessjson.phoneNumbers) {
        this.phonelist = this.businessjson.phoneNumbers;
      }
     
    }
     
  
}