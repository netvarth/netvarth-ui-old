import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
// import { ScrollToConfigOptions, ScrollToService } from "@nicky-lenaers/ngx-scroll-to";
import { DomainConfigGenerator } from "../../services/domain-config-generator.service";
import { SharedServices } from "../../services/shared-services";
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { S3UrlProcessor } from '../../services/s3-url-processor.service';
import { LocalStorageService } from "../../services/local-storage.service";

@Component({
  selector: 'app-business-page-home',
  templateUrl: './business-page-home.component.html',
  styleUrls: ['./business-page-home.component.css']

})
export class BusinessPageHomeComponent implements OnInit {

  @ViewChild('privacyPolicy') privacyPolicy: ElementRef;
  @ViewChild('termsConditions') termsConditions: ElementRef;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  // pdfUrl: any;
  accountEncId: string;
  provider_id: any;
  accountProperties: any;
  target: any;
  businessjson: any = [];
  businessName;
  bLogo = '';
  emaillist: any = [];
  phonelist: any = [];
  loading = true;
  selectedMenu = 'contact';

  customConf = {}
  theme: any;


  constructor(private domSanitizer: DomSanitizer,
    private activateroute: ActivatedRoute,
    private router: Router,
    private shared_services: SharedServices,
    private domainConfigService: DomainConfigGenerator,
    private observer: BreakpointObserver,
    private s3Processor: S3UrlProcessor,
    private lStorageService: LocalStorageService) {
  }
  ngOnInit() {
    const _this = this;
    this.activateroute.queryParams.subscribe(
      (queryParams: any) => {
        if (queryParams.target) {
          this.selectedMenu = queryParams.target;
        }
      }
    )
    this.activateroute.paramMap.subscribe(params => {
      this.accountEncId = params.get('id');
      this.getAccountIdFromEncId(this.accountEncId).then(
        (id: any) => {
          _this.provider_id = id;
          _this.domainConfigService.getUIAccountConfig(_this.provider_id).subscribe(
            (uiconfig: any) => {
              _this.accountProperties = uiconfig;
              if (uiconfig['contact']) {
                this.customConf['contact'] = uiconfig['contact'];
              }
              if (uiconfig['refund']) {
                this.customConf['refund'] = uiconfig['refund'];
              }
              if (uiconfig['terms']) {
                if (uiconfig.terms.startsWith('https')) {
                  this.customConf['terms_type'] = 'url';
                  this.customConf['terms'] = this.domSanitizer.bypassSecurityTrustResourceUrl(uiconfig.terms); 
                } else {
                  this.customConf['terms'] = uiconfig['terms']; 
                }
              }
              if (_this.accountProperties['theme']) {
                _this.theme = _this.accountProperties['theme'];
              }
              if (uiconfig['privacy']) {
                if (uiconfig.privacy.startsWith('https')) {
                  this.customConf['privacy_type'] = 'url';
                  this.customConf['privacy'] = this.domSanitizer.bypassSecurityTrustResourceUrl(uiconfig.terms); 
                } else {
                  this.customConf['privacy'] = uiconfig['privacy'];
                }
              }
              _this.gets3curl();
              
            }, (error) => {
              _this.gets3curl();
            },);
        });
    });

    // this.pdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://jaldeeui.s3.ap-south-1.amazonaws.com/ui/scale/config/152877/PRIVACY+POLICY.pdf');
  }
  ngAfterViewInit() {
    const _this= this;
    _this.sidenav.mode = 'over';
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      setTimeout(() => {
        if (res.matches) {
          _this.sidenav.mode = 'over';
          _this.sidenav.close();
        } else {
          _this.sidenav.mode = 'side';
          _this.sidenav.open();
        }
      }, 100);
      
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
  menuClicked(selectedMenu) {
    this.selectedMenu = selectedMenu;
  }
  goBack() {
    this.router.navigate([this.accountEncId]);
  }
  gets3curl() {
    let accountS3List = 'businessProfile';
    this.s3Processor.getJsonsbyTypes(this.provider_id,
      null, accountS3List).subscribe(
        (accountS3s) => {
          if (accountS3s['businessProfile']) {
            this.processS3s('businessProfile', accountS3s['businessProfile']);
          }
          this.loading = false;
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
  setBusinesssProfile(res) {
    const custID = res['customId'] ? res['customId']:res['accEncUid'];
    this.lStorageService.setitemonLocalStorage('customId', custID);
    this.lStorageService.setitemonLocalStorage('accountId', res['id']);
    this.businessjson = res;
    this.businessName = this.businessjson.businessName;
    if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
      if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
        this.bLogo = this.businessjson.logo.url;
      }
    } else {
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
