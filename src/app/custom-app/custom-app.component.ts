import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { SubSink } from "subsink";
// import { SignUpComponent } from "../shared/components/signup/signup.component";
import { AuthService } from "../shared/services/auth-service";
import { DomainConfigGenerator } from "../shared/services/domain-config-generator.service";
import { GroupStorageService } from "../shared/services/group-storage.service";
import { LocalStorageService } from "../shared/services/local-storage.service";
import { S3UrlProcessor } from "../shared/services/s3-url-processor.service";
import { SharedServices } from "../shared/services/shared-services";
import { ConsumerJoinComponent } from "../ynw_consumer/components/consumer-join/join.component";
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
  
  private subscriptions = new SubSink();
  loading: boolean = true;
  theme: any;
  activeUser: any;
  loginRequired = false;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private shared_services: SharedServices,
    private router: Router,
    private domainConfigService: DomainConfigGenerator,
    private customappService: CustomappService,
    private s3Processor: S3UrlProcessor,
    private authService: AuthService,
    private dialog: MatDialog,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService
  ) {
    this.activatedRoute.queryParams.subscribe(qparams => {
      if (qparams && qparams.at) {
        this.lStorageService.setitemonLocalStorage('authToken', qparams.at);
      }
      if (qparams && qparams.muid) {
        this.lStorageService.setitemonLocalStorage('mUniqueId', qparams.muid);
      }
      if(qparams && qparams.mode) {
        this.lStorageService.setitemonLocalStorage('ios', true);
      }
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
  ngOnInit() {
    const _this = this;
    _this.lStorageService.setitemonLocalStorage('reqFrom', 'cuA');
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
            _this.provider_id = id;
            _this.accountExists = true;
            _this.domainConfigService.getHometemplate(_this.provider_id).subscribe(
              (templateJson: any) => {
                this.theme = templateJson.theme;
                this.lStorageService.setitemonLocalStorage('theme',this.theme);
                this.customappService.setTemplateJson(templateJson);
                console.log("TemplateJson:",templateJson);
                this.templateJson = templateJson;
                _this.getBusinessProfile(_this.provider_id).then(
                  (businessJsons: any) => {
                    console.log(businessJsons);
                    _this.customappService.setBusinessJsons(businessJsons);
                    // const businessProfile = this.s3Processor.getJson(businessJsons['businessProfile']);                
                    _this.accountId = _this.customappService.getAccountId();                    
                    _this.loading = false;
                    if (this.isLoggedIn || !templateJson.loginRequired) {                      
                      _this.router.navigate(['customapp',_this.accountEncId, { outlets : {template: [templateJson.template]}}]);
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

  loginPerformed(status) {
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
    _this.loading = true;
    _this.authService.goThroughLogin().then(
      (status) => {
        if (status) {
          this.viewDashboard();
        } else {
          const passParam = { callback: 'dashboard' };
          this.doLogin('consumer', passParam);
        }
      });
  }

  viewDashboard() {
    let queryParam = {
      'customId': this.accountEncId,
      'accountId': this.accountId
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.router.navigate(['consumer'], navigationExtras);
  }


  doLogin(origin?, passParam?) {
    // const current_provider = passParam['current_provider'];
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class', this.theme],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        theme: this.theme,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        // if (passParam['callback'] === 'communicate') {
        //   this.showCommunicate(passParam['providerId']);
        // } else if (passParam['callback'] === 'history') {
        //   this.redirectToHistory();
        // } else 
        if (passParam['callback'] === 'dashboard') {
          this.viewDashboard();
        } 
        // else if (passParam['callback'] === 'donation') {
        //   this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        // } else if (passParam['callback'] === 'appointment') {
        //   this.showAppointment(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
        // } else if (passParam['callback'] === 'order') {
        //   if (this.orderType === 'SHOPPINGLIST') {
        //     this.shoppinglistupload();
        //   } else {
        //     this.checkout();
        //   }
        // } else {
        //   this.showCheckin(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
        // }
      } else if (result === 'showsignup') {
        // this.doSignup(passParam);
      } else {
        this.loading = false;
      }
    });
  }
  // checkinClicked(location, service) {
  //   const current_provider = {
  //     'id': location.id,
  //     'place': location.place,
  //     'location': location,
  //     'cdate': service.serviceAvailability.availableDate,
  //     'service': service
  //   };
  //   const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
  //   const today = new Date(todaydt);
  //   const dd = today.getDate();
  //   const mm = today.getMonth() + 1; // January is 0!
  //   const yyyy = today.getFullYear();
  //   let cday = '';
  //   if (dd < 10) {
  //     cday = '0' + dd;
  //   } else {
  //     cday = '' + dd;
  //   }
  //   let cmon;
  //   if (mm < 10) {
  //     cmon = '0' + mm;
  //   } else {
  //     cmon = '' + mm;
  //   }
  //   const dtoday = yyyy + '-' + cmon + '-' + cday;
  //   if (dtoday === service.serviceAvailability.availableDate) {
  //     this.changedate_req = false;
  //   } else {
  //     this.changedate_req = true;
  //   }
  //   const _this = this;
  //   _this.loading_direct = true;
  //   _this.goThroughLogin().then(
  //     (status) => {
  //       if (status) {
  //         _this.userType = _this.sharedFunctionobj.isBusinessOwner('returntyp');
  //         if (_this.userType === 'consumer') {
  //           _this.showCheckin(location.id, location.place, location.googleMapUrl, service.serviceAvailability.availableDate, service, 'consumer');
  //         }
  //       } else {
  //         const passParam = { callback: '', current_provider: current_provider };
  //         _this.doLogin('consumer', passParam);
  //       }
  //     });
  // }
  // showCheckin(locid, locname, gMapUrl, curdate, service: any, origin?, virtualinfo?) {
  //   let queryParam = {
  //     loc_id: locid,
  //     locname: locname,
  //     googleMapUrl: gMapUrl,
  //     sel_date: curdate,
  //     cur: this.changedate_req,
  //     unique_id: this.provider_id,
  //     account_id: this.provider_bussiness_id,
  //     user: this.userId,
  //     service_id: service.id,
  //     virtual_info: JSON.stringify(virtualinfo)
  //   };
  //   if (service['serviceType'] === 'virtualService') {
  //     queryParam['tel_serv_stat'] = true;
  //   } else {
  //     queryParam['tel_serv_stat'] = false;
  //   }
  //   if (service['department']) {
  //     queryParam['dept'] = service['department'];
  //     queryParam['theme'] = this.theme;
  //   }
  //   queryParam['customId'] = this.accountEncId;
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: queryParam,
  //   };
  //   this.router.navigate(['consumer', 'checkin'], navigationExtras);
  // }
  // showAppointment(locid, locname, gMapUrl, curdate, service: any, origin?, virtualinfo?) {
  //   let queryParam = {
  //     loc_id: locid,
  //     locname: locname,
  //     googleMapUrl: gMapUrl,
  //     cur: this.changedate_req,
  //     unique_id: this.provider_id,
  //     account_id: this.provider_bussiness_id,
  //     user: this.userId,
  //     futureAppt: this.futureAllowed,
  //     service_id: service.id,
  //     sel_date: curdate,
  //     virtual_info: JSON.stringify(virtualinfo)
  //   };
  //   if (service['serviceType'] === 'virtualService') {
  //     queryParam['tel_serv_stat'] = true;
  //   } else {
  //     queryParam['tel_serv_stat'] = false;
  //   }
  //   if (service['department']) {
  //     queryParam['dept'] = service['department'];
  //     queryParam['theme'] = this.theme;
  //   }
  //   queryParam['customId'] = this.accountEncId;
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: queryParam
  //   };
  //   this.router.navigate(['consumer', 'appointment'], navigationExtras);
  // }
}