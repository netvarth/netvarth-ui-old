import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { SubSink } from "subsink";
import { projectConstantsLocal } from "../shared/constants/project-constants";
import { AuthService } from "../shared/services/auth-service";
import { DomainConfigGenerator } from "../shared/services/domain-config-generator.service";
import { I18nService } from "../shared/services/i18n-service";
import { LocalStorageService } from "../shared/services/local-storage.service";
import { S3UrlProcessor } from "../shared/services/s3-url-processor.service";
import { SharedServices } from "../shared/services/shared-services";
import { CustomappService } from "./customapp.service";

@Component({
  selector: 'app-customapp',
  templateUrl: './custom-app.component.html',
  styleUrls: ['./custom-app.component.css']
})
export class CustomAppComponent implements OnInit, OnDestroy {
  small_device_display: boolean;
  screenWidth: number;
  accountEncId: any;
  provider_id: any;
  isLoggedIn: boolean;
  accountExists: boolean;
  accountId: any;
  templateJson;
  accountConfig: any;
  private subscriptions = new SubSink();
  loading: boolean = true;
  theme: any;
  activeUser: any;
  loginRequired = false;
  callback: any;
  languages = projectConstantsLocal.SUPPORTEDLANGUAGES;
  langselected = 'English';
  paramUniqueId: any;
  uniqueId: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private shared_services: SharedServices,
    private router: Router,
    private domainConfigService: DomainConfigGenerator,
    private customappService: CustomappService,
    private s3Processor: S3UrlProcessor,
    private authService: AuthService,
    private lStorageService: LocalStorageService,
    private translate: TranslateService,
    private i18nService: I18nService
  ) {
    this.activatedRoute.queryParams.subscribe(qparams => {
      if (qparams && qparams.uid) {
        this.paramUniqueId = qparams.uid;
        this.lStorageService.setitemonLocalStorage('appUniqueId', qparams.uid);
      }
      if (qparams && qparams.callback) {
        this.callback = qparams.callback;
      }
      if (qparams && qparams.cl_dt) {
        console.log(qparams.cl_dt);
        if ((qparams.cl_dt=="true" || qparams.cl_dt==true) && !this.lStorageService.getitemfromLocalStorage('cleared')) {
          this.clearStorage();
        }
      }
      if (qparams && qparams.inst_id) {
        this.lStorageService.setitemonLocalStorage('installId', qparams.inst_id);
      }
      if (qparams && qparams.app_id) {
        this.lStorageService.setitemonLocalStorage('appId', qparams.app_id);
      }
      if (qparams && qparams.muid) {
        this.lStorageService.setitemonLocalStorage('mUniqueId', qparams.muid);
      }
      if(qparams && qparams.mode) {
        this.lStorageService.setitemonLocalStorage('ios', true);
      }
      if (qparams && qparams.lan) {
        if (!this.lStorageService.getitemfromLocalStorage('translatevariable')) {
          this.i18nService.changeLocale(qparams.lan);
        }
      }
      this.i18nService.changeLocale('mal');
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.small_device_display = false;
    }
    if (this.screenWidth <= 1040) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  changeLocale(locale: string, languagename) {
    this.langselected = languagename;
    console.log('lang', this.langselected)

    this.translate.use(locale);

    this.i18nService.changeLocale(locale);

  }
  ngOnInit() {
    const _this = this;
    _this.lStorageService.setitemonLocalStorage('reqFrom', 'cuA');
    
    if (this.lStorageService.getitemfromLocalStorage('appUniqueId')) {
      this.paramUniqueId = this.lStorageService.getitemfromLocalStorage('appUniqueId');
    }
    if (!this.lStorageService.getitemfromLocalStorage('sysdate')) {
      this.customappService.getSystemDate().subscribe(
        (date) => {
          this.lStorageService.setitemonLocalStorage('sysdate', date);
        }
      )
    }
    this.isLoggedIn = this.customappService.checkLogin();
    this.activatedRoute.paramMap
      .subscribe(params => {
        this.accountEncId = params.get('id');
        this.lStorageService.setitemonLocalStorage('customId', this.accountEncId);
        this.customappService.setAccountEncId(this.accountEncId );
        
        this.getAccountIdFromEncId(this.accountEncId).then(
          (id: any) => {
            this.uniqueId = id;
            if (_this.paramUniqueId) {
              _this.provider_id = this.paramUniqueId;
            } else {
              _this.provider_id = id;
            }
            
            _this.accountExists = true;
            _this.customappService.setNews(_this.provider_id);
            _this.domainConfigService.getUIAccountConfig(_this.provider_id).subscribe(
              (account_config: any) => {
                _this.accountConfig = account_config;
                _this.customappService.setAccountConfig(account_config);
              }
            )

            _this.domainConfigService.getHometemplate(_this.provider_id).subscribe(
              (templateJson: any) => {
                this.theme = templateJson.theme;
                this.lStorageService.setitemonLocalStorage('theme',this.theme);
                this.customappService.setTemplateJson(templateJson);
                console.log("TemplateJson:",templateJson);
                this.templateJson = templateJson;
                _this.getBusinessProfile(_this.uniqueId).then(
                  (businessJsons: any) => {
                    console.log(businessJsons);
                    _this.customappService.setBusinessJsons(businessJsons);
                    _this.accountId = _this.customappService.getAccountId();                    
                    _this.loading = false;
                    if (this.isLoggedIn || !templateJson.loginRequired) {
                      let queryParams = {};
                      if (this.callback) {
                        queryParams['callback'] = this.callback;
                      }
                      const navigationExtras: NavigationExtras = {
                        queryParams: queryParams
                      };

                      _this.router.navigate(['customapp',_this.accountEncId, { outlets : {template: [templateJson.template]}}], navigationExtras);
                    } else {
                      _this.loginRequired = true;
                    } 
                  }
                )
              });

          }, (error) => {
            console.log(error);
          }
        );
      });
  }

  actionPerformed(status) {
    if (status) {
      this.router.navigate(['customapp',this.accountEncId, { outlets : {template: [this.templateJson.template]}}]);
      this.loginRequired = false;
    }
  }
  /**
   * Unsubscribe all subscriptions
   */
  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }

  /**
   * 
   * @returns Business Profile
   */
  getBusinessProfile(uniqueId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      let accountS3List = 'businessProfile,settings,appointmentsettings,terminologies,location,donationServices,departmentProviders,gallery';
      _this.subscriptions.sink = _this.s3Processor.getJsonsbyTypes(uniqueId,
        null, accountS3List).subscribe(
          (accountS3s: any) => {
            resolve(accountS3s);
          });
    })
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

    /**
   * Common Code
   */

   dashboardClicked() {
    const _this = this;
    _this.authService.goThroughLogin().then(
      (status) => {
        if (status) {
          this.viewDashboard();
        } else {
          let dashboardUrl = 'consumer?accountId=' + this.accountId + '&customId='+this.accountEncId + '&theme='+ this.theme;
          this.lStorageService.setitemonLocalStorage('target', dashboardUrl);
          this.router.navigate([this.accountEncId , 'login']);
        }
      });
  }

  viewDashboard() {
    let queryParam = {
      'customId': this.accountEncId,
      'accountId': this.accountId,
      'theme': this.theme
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.router.navigate(['consumer'], navigationExtras);
  }
  clearStorage() {
    this.lStorageService.clearAll();
    this.lStorageService.setitemonLocalStorage('cleared', true);
  }
}