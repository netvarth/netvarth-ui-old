import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../app.component';
import { MatDialog } from '@angular/material/dialog';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { CouponsComponent } from '../coupons/coupons.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SearchDetailServices } from '../search-detail/search-detail-services.service';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { JdnComponent } from '../jdn-detail/jdn-detail-component';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../constants/project-constants';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from '../../services/local-storage.service';
import { GroupStorageService } from '../../services/group-storage.service';
import { WordProcessor } from '../../services/word-processor.service';
import { DomainConfigGenerator } from '../../services/domain-config-generator.service';
import { QRCodeGeneratordetailComponent } from '../qrcodegenerator/qrcodegeneratordetail.component';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { S3UrlProcessor } from '../../services/s3-url-processor.service';
import { SubSink } from '../../../../../node_modules/subsink';
import { VirtualFieldsComponent } from '../../../ynw_consumer/components/virtualfields/virtualfields.component';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.css'],
  animations: [
    trigger('search_data', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('10ms', [
          animate('.4s ease-out', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])

  ]
})
export class BusinessPageComponent implements OnInit, AfterViewInit, OnDestroy {
  catalogimage_list_popup: Image[];
  catalogImage = '../../../../assets/images/order/catalogueimg.svg';
  spId_local_id: any;
  go_back_cap = Messages.GO_BACK_CAP;
  more_cap = Messages.MORE_CAP;
  less_cap = Messages.LESS_CAP;
  contact_details_cap = Messages.CONTACT_DETAILS_CAP;
  add_to_fav_cap = Messages.ADD_TO_FAV;
  rem_from_fav_cap = Messages.REM_FROM_FAV_CAP;
  send_msgs_cap = Messages.SEND_MSGS_CAP;
  you_have_cap = Messages.YOU_HAVE_CAP;
  at_this_loc_cap = Messages.AT_THIS_LOC_CAP;
  get_directions_cap = Messages.GET_DIRECTIONS_CAP;
  workig_hrs_cap = Messages.WORKING_HRS_CAP;
  services_offered = Messages.SERV_OFFERED_CAP;
  coupons_offered = Messages.COUPONS_OFFERED_CAP;
  open_now_cap = Messages.OPEN_NOW_CAP;
  do_you_want_to_cap = Messages.DO_YOU_WANT_TO_CAP;
  for_cap = Messages.FOR_CAP;
  different_date_cap = Messages.DIFFERENT_DATE_CAP;
  sorry_cap = Messages.SORRY_CAP;
  not_allowed_cap = Messages.NOT_ALLOWED_CAP;
  get_token_btn = Messages.GET_TOKEN;
  people_ahead = Messages.PEOPLE_AHEAD_CAP;
  jaldee_coupon = Messages.JALDEE_COUPON;
  coupon = Messages.COUPONS_CAP;
  first_time_coupon = Messages.FIRST_TIME_COUPON;
  history_cap = Messages.HISTORY_CAP;
  no_people_ahead = Messages.NO_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  waitinglineCap = Messages.WAITINGLINE;
  get_token_cap = Messages.GET_FIRST_TOKEN;
  small_device_display = false;
  screenHeight;
  screenWidth;
  s3url;
  retval;
  kwdet: any = [];
  provider_id;
  provider_bussiness_id;
  settingsjson: any = [];
  businessjson: any = [];
  servicesjson: any = [];
  galleryjson: any = [];
  tempgalleryjson: any = [];
  locationjson: any = [];
  virtualfieldsjson = null;
  virtualfieldsDomainjson = null;
  virtualfieldsSubdomainjson = null;
  virtualfieldsCombinedjson = null;
  genderType = null;
  showVirtualfieldsSection = false;
  waitlisttime_arr: any = [];
  favprovs: any = [];
  specializationslist: any = [];
  specializationslist_more: any = [];
  socialMedialist: any = [];
  settings_exists = false;
  business_exists = false;
  galleryExists = false;
  location_exists = false;
  isInFav;
  terminologiesjson: any = null;
  futuredate_allowed = false;
  maxsize = 0;
  frstChckinCupnCunt = 0;
  viewallServices = false;
  viewallSpec = false;
  showmoreDesc = false;
  showmoreSpec = false;
  bNameStart = '';
  bNameEnd = '';
  image_list: any = [];
  image_list_popup: Image[];
  ratingenabledCnt = 0;
  ratingenabledHalf = false;
  ratingdisabledCnt = 0;
  ratingenabledArr;
  ratingdisabledArr;
  serMaxcnt = 3;
  specMaxcnt = 5;
  inboxCntFetched = false;
  inboxUnreadCnt;
  changedate_req = false;
  showMore = false;
  gender = '';
  bLogo = '';
  orgsocial_list;
  emaillist: any = [];
  phonelist: any = [];
  showEmailPhonediv = false;
  coupondialogRef;
  jdndialogRef;
  femaleTooltip = projectConstants.TOOLTIP_FEMALE;
  maleTooltip = projectConstants.TOOLTIP_MALE;
  virtualsectionHeader = 'Click here to View More Details';
  isPlaceisSame = false;
  jdnDiscountType;
  playstore = true;
  appstore = true;
  selectedLocation;
  catlog: any;
  catalogItem: any;
  order_count: number;
  price: number;
  orderList: any = [];
  counter = 0;
  itemCount: any;
  orderItems: any = [];
  itemQty: number;
  activeCatalog: any;
  qrdialogRef;
  wndw_path = projectConstants.PATH;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customPlainGallerycatalogRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };

  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  waitlistestimatetimetooltip = Messages.SEARCH_ESTIMATE_TOOPTIP;

  // Edited//
  public domain;
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  // Edited//
  commdialogRef;
  remdialogRef;
  checkindialogRef;
  extChecindialogRef;
  servicedialogRef;
  s3CouponList: any = {
    JC: [], OWN: []
  };
  isfirstCheckinOffer;
  server_date;
  isCheckinEnabled = true;
  departmentlist: any = [];
  branch_id;
  account_Type;
  searchCount;
  nextAvailDate;
  search_data;
  search_return;
  q_str;
  loc_details;
  testuserQry;
  latitude;
  longitude;
  loctype;
  newarr: any = [];
  groubedByTeam: any = [];
  showToken = false;
  departServiceList: any = [];
  showServices = false;
  selectedDepartment;
  showDepartments = false;
  services: any = [];
  deptlist: any = [];
  jaldeediscountJson;
  maximumDiscount: any;
  jdnlength;
  jdnTooltip = '';
  result_data: any;
  provider_data: any;
  gender_length: any;
  api_loading = false;
  pageFound = false;
  results_data;
  appttime_arr: any = [];
  apptServicesjson: any = [];
  donationServicesjson: any = [];
  userId;
  domainList: any = [];
  subDomainList: any = [];
  departmentId;
  deptUsers: any = [];
  loading = false;
  loading_direct = false;
  pSource;
  apptfirstArray: any = [];
  apptTempArray: any = [];
  showType = 'more';
  futureAllowed = true;
  galleryenabledArr = [];
  gallerydisabledArr = [];
  onlinePresence = false;
  imgLength;
  extra_img_count: number;
  servicesAndProviders: any = [];
  bgCover: any;
  serviceCount: number;
  userCount: number;
  donationServices: any[];
  service_cap = 'Services and Consultations';
  // cSource  = 'qr';
  @ViewChild('popupforApp') popUp: ElementRef;
  orderstatus: any;
  orderType = '';
  advance_amount: any;
  dotor_specialization_hint = Messages.DOCTORS_SPECIALIZATION_HINT;
  store_pickup: boolean;
  home_delivery: boolean;
  choose_type = 'store';
  sel_checkindate;
  deliveryCharge = 0;
  nextAvailableTime;
  customId: any;
  accEncUid: any;

  accountEncId: string;
  userEncId: string;

  // bsModalRef: BsModalRef;
  nonfirstCouponCount = 0;
  activeUser: any;
  checkinProviderList: any = [];
  wlServices;
  apptServices;
  private subscriptions = new SubSink();
  consumerVirtualinfo: any;
  constructor(
    private activaterouterobj: ActivatedRoute,
    public sharedFunctionobj: SharedFunctions,
    private shared_services: SharedServices,
    private routerobj: Router,
    private dialog: MatDialog,
    private searchdetailserviceobj: SearchDetailServices,
    public router: Router,
    private locationobj: Location,
    private titleService: Title,
    private metaService: Meta,
    private lStorageService: LocalStorageService,
    private groupService: GroupStorageService,
    public wordProcessor: WordProcessor,
    private domainConfigService: DomainConfigGenerator,
    // private modalService: BsModalService,
    private dateTimeProcessor: DateTimeProcessor,
    private s3Processor: S3UrlProcessor
  ) {
    // this.domainList = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    console.log("ngOninit of Businesspage")
    this.api_loading = true;
    this.userId = null;
    this.provider_id = null;
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.loc_details = this.lStorageService.getitemfromLocalStorage('ynw-locdet');
    this.jdnTooltip = this.wordProcessor.getProjectMesssages('JDN_TOOPTIP');
    console.log("Before checking mobile tpye");
    const isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };
    if (isMobile.Android()) {
      this.playstore = true;
      this.appstore = false;
    } else if (isMobile.iOS()) {
      this.playstore = false;
      this.appstore = true;
    } else {
      this.playstore = true;
      this.appstore = true;
    }
    if (this.activeUser) {
      this.isfirstCheckinOffer = this.activeUser.firstCheckIn;
    }
    this.orgsocial_list = projectConstantsLocal.SOCIAL_MEDIA_CONSUMER;
    // this.getInboxUnreadCnt();
    this.activaterouterobj.queryParams.subscribe(qparams => {
      if (qparams.src) {
        this.pSource = qparams.src;

      }
      this.businessjson = [];
      this.servicesjson = [];
      this.apptServicesjson = [];
      this.apptfirstArray = [];
      this.apptTempArray = [];
      this.donationServicesjson = [];
      this.image_list_popup = [];
      this.catalogimage_list_popup = [];
      this.galleryjson = [];
      this.deptUsers = [];
      if (qparams.psource) {
        this.pSource = qparams.psource;
        if (qparams.psource === 'business') {
          this.loading = true;
          this.showDepartments = false;
          setTimeout(() => {
            this.loading = false;
          }, 2500);
        }
      }
    });
    console.log("Going to check query parameters : ");
    this.activaterouterobj.paramMap
      .subscribe(params => {
        this.accountEncId = params.get('id');
        // alert(this.accountEncId);
        console.log("My Id is : " + this.accountEncId);
        if (params.get('userEncId')) {
          this.userEncId = params.get('userEncId');
          this.userId = this.userEncId;
        } else {
          this.userId = null;
        }
        this.domainConfigService.getDomainList().then(
          (domainConfig) => {
            this.domainList = domainConfig;
            this.getAccountIdFromEncId(this.accountEncId).then(
              (id: string) => {
                this.provider_id = id;
                this.gets3curl();
              }, (error) => {
                console.log(error);
                this.shared_services.callHealth(error.message);
              }
            )
          }, (error) => {
            console.log(error);
            this.shared_services.callHealth(error.message);
          }
        )
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
          console.log(error);
          this.shared_services.callHealth(error.message);
          if (error.status === 404) {
            _this.routerobj.navigate(['/not-found']);
          }
          reject();
        }
      );
    });
  }

  ngAfterViewInit() {
    // const appPopupDisplayed = this.lStorageService.getitemfromLocalStorage('a_dsp');
    // if (!appPopupDisplayed) {
    //   this.popUp.nativeElement.style.display = 'block';
    // }
  }
  // closeModal() {
  //   this.lStorageService.setitemonLocalStorage('a_dsp', true);
  //   this.popUp.nativeElement.style.display = 'none';
  // }
  ngOnDestroy() {
    if (this.commdialogRef) {
      this.commdialogRef.close();
    }
    if (this.remdialogRef) {
      this.remdialogRef.close();
    }
    if (this.servicedialogRef) {
      this.servicedialogRef.close();
    }
    if (this.checkindialogRef) {
      this.checkindialogRef.close();
    }
    if (this.extChecindialogRef) {
      this.extChecindialogRef.close();
    }
    this.subscriptions.unsubscribe();
  }

  getSocialdet(key, field) {
    const retdet = this.orgsocial_list.filter(
      soc => soc.key === key);
    let returndet = retdet[0][field];
    if (returndet === 'BizyGlobe') {
      returndet = 'bizyGlobe';
    }
    return returndet;
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }

  gets3curl() {
    this.showServices = false;
    let accountS3List = 'settings,terminologies,coupon,providerCoupon,location';
    let userS3List = 'providerBusinessProfile,providerVirtualFields,providerservices,providerApptServices';

    if (!this.userId) {
      accountS3List += ',businessProfile,virtualFields,services,apptServices,apptServices,donationServices,departmentProviders' //gallery
    }

    this.subscriptions.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
      null, accountS3List).subscribe(
        (accountS3s) => {

          if (this.userId) {
            if (accountS3s['settings']) {
              this.processS3s('settings', accountS3s['settings']);
            }
            if (accountS3s['terminologies']) {
              this.processS3s('terminologies', accountS3s['terminologies']);
            }
            if (accountS3s['location']) {
              this.processS3s('location', accountS3s['location']);
            }
            if (accountS3s['coupon']) {
              this.processS3s('coupon', accountS3s['coupon']);
            }
            if (accountS3s['providerCoupon']) {
              this.processS3s('providerCoupon', accountS3s['providerCoupon']);
            }
            this.s3Processor.getJsonsbyTypes(this.provider_id, this.userId, userS3List).subscribe(
              (userS3s) => {
                if (userS3s['providerBusinessProfile']) {
                  this.processS3s('providerBusinessProfile', userS3s['providerBusinessProfile']);
                }
                if (userS3s['providerVirtualFields']) {
                  this.processS3s('providerVirtualFields', userS3s['providerVirtualFields']);
                }
                if (userS3s['providerservices']) {
                  this.processS3s('providerservices', userS3s['providerservices']);
                }
                if (userS3s['providerApptServices']) {
                  this.processS3s('providerApptServices', userS3s['providerApptServices']);
                }
              }
            );
          } else {
            if (accountS3s['settings']) {
              this.processS3s('settings', accountS3s['settings']);
            }
            if (accountS3s['terminologies']) {
              this.processS3s('terminologies', accountS3s['terminologies']);
            }
            if (accountS3s['location']) {
              this.processS3s('location', accountS3s['location']);
            }
            if (accountS3s['coupon']) {
              this.processS3s('coupon', accountS3s['coupon']);
            }
            if (accountS3s['providerCoupon']) {
              this.processS3s('providerCoupon', accountS3s['providerCoupon']);
            }

            if (accountS3s['businessProfile']) {
              this.processS3s('businessProfile', accountS3s['businessProfile']);
              this.titleService.setTitle(this.businessjson.businessName);
              this.metaService.addTags([
                // {name: 'keywords', content: 'Angular, Universal, Example'},
                { name: 'description', content: this.businessjson.businessDesc }
                // {name: 'robots', content: 'index, follow'}
              ]);
            }

            if (accountS3s['virtualFields']) {
              this.processS3s('virtualFields', accountS3s['virtualFields']);
            }
            if (accountS3s['services']) {
              this.processS3s('services', accountS3s['services']);
            }
            if (accountS3s['apptServices']) {
              this.processS3s('apptServices', accountS3s['apptServices']);
            }
            if (accountS3s['donationServices']) {
              this.processS3s('donationServices', accountS3s['donationServices']);
            }
            if (accountS3s['departmentProviders']) {
              this.processS3s('departmentProviders', accountS3s['departmentProviders']);
            }

            if (accountS3s['gallery']) {
              this.processS3s('gallery', accountS3s['gallery']);
            } else {
              this.setGalleryNotFound();
            }
          }
        }, (error) => {
          console.log(error);
          this.shared_services.callHealth(error.message);
        }
      );
  }

  processS3s(type, res) {
    let result = this.s3Processor.getJson(res);
    switch (type) {
      case 'settings': {
        this.setAccountSettings(result);
        break;
      }
      case 'terminologies': {
        this.terminologiesjson = result;
        break;
      }
      case 'businessProfile': {
        this.setBusinesssProfile(result);
        break;
      }
      case 'services': {
        this.setAccountServices(result)
        break;
      }
      case 'apptServices': {
        this.setAccountApptServices(result);
        break;
      }
      case 'gallery': {
        this.setAccountGallery(result);
        break;
      }
      case 'location': {
        this.setAccountLocations(result);
      }
      case 'coupon': {
        this.setAccountCoupons(result);
        break;
      }
      case 'providerCoupon': {
        this.SetAccountStoreCoupons(result);
        break;
      }
      case 'virtualFields': {
        this.setAccountVirtualFields(result);
      }
      case 'donationServices': {
        this.donationServicesjson = result;
        break;
      }
      case 'departmentProviders': {
        this.deptUsers = result;
        if (!this.userId) {
          this.setUserWaitTime();
        }
        break;
      }
      case 'jaldeediscount': {
        this.jaldeediscountJson = result;
        this.jdnlength = Object.keys(this.jaldeediscountJson).length;
      }
      case 'providerBusinessProfile': {
        this.setUserBusinessProfile(result);
        break;
      }
      case 'providerVirtualFields': {
        this.setUserVirtualFields(result);
        break;
      }
      case 'providerservices': {
        this.setUserServices(result);
        break;
      }
      case 'providerApptServices': {
        this.setUserApptServices(result);
        break;
      }
    }
  }
  setUserWaitTime() {
    let apptTimearr = [];
    let waitTimearr = [];
    if (this.deptUsers && this.deptUsers.length > 0) {
      for (let dept of this.deptUsers) {
        if (!this.showDepartments) {
          apptTimearr.push({ 'locid': this.businessjson.id + '-' + this.locationjson[0].id + '-' + dept.id });
          waitTimearr.push({ 'locid': dept.id + '-' + this.locationjson[0].id });
        } else {
          if (dept.users && dept.users.length > 0) {
            for (let user of dept.users) {
              apptTimearr.push({ 'locid': this.businessjson.id + '-' + this.locationjson[0].id + '-' + user.id });
              waitTimearr.push({ 'locid': user.id + '-' + this.locationjson[0].id });
            }
          }
        }
      }
    }
    this.getUserApptTime(apptTimearr, waitTimearr);
  }
  setBusinesssProfile(res) {
    this.onlinePresence = res['onlinePresence'];
    this.customId = res['customId'];
    this.accEncUid = res['accEncUid'];
    if (!this.userId) {
      this.api_loading = false;
      this.pageFound = true;
      this.socialMedialist = [];
      this.businessjson = res;
      if (this.businessjson.serviceSector.name !== 'healthCare') {
        this.service_cap = 'Services';
      }
      if (this.businessjson.cover) {
        this.bgCover = this.businessjson.cover.url;
      }
      this.branch_id = this.businessjson.branchId;
      this.account_Type = this.businessjson.accountType;
      // if (this.account_Type === 'BRANCH') {
      //   this.getbusinessprofiledetails_json('departmentProviders', true);
      // }
      this.business_exists = true;
      this.provider_bussiness_id = this.businessjson.id;
      if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
        if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
          this.bLogo = this.businessjson.logo.url;
        }
      } else {
        // this.bLogo = '';
        this.bLogo = '../../../assets/images/img-null.svg';
      }
      this.specializationslist = [];
      this.specializationslist_more = [];
      if (this.businessjson.specialization) {
        // this.specializationslist = this.businessjson.specialization;

        for (let i = 0; i < this.businessjson.specialization.length; i++) {
          if (i <= 2 && this.businessjson.specialization[i] !== 'Not Applicable') {
            this.specializationslist.push(this.businessjson.specialization[i]);
          } else if (this.businessjson.specialization[i] !== 'Not Applicable') {
            this.specializationslist_more.push(this.businessjson.specialization[i]);
          }
        }
      }
      if (this.businessjson.socialMedia) {
        this.socialMedialist = this.businessjson.socialMedia;
      }
      if (this.businessjson.emails) {
        this.emaillist = this.businessjson.emails;
      }
      if (this.businessjson.phoneNumbers) {
        this.phonelist = this.businessjson.phoneNumbers;
      }
      // this.getbusinessprofiledetails_json('gallery', true);
      const holdbName = this.businessjson.businessDesc || '';
      const maxCnt = 120;
      if (holdbName.length > maxCnt) {
        this.bNameStart = holdbName.substr(0, maxCnt);
        this.bNameEnd = holdbName.substr(maxCnt, holdbName.length);
      } else {
        this.bNameStart = holdbName;
      }
      this.ratingenabledCnt = this.businessjson.avgRating || 0;
      if (this.ratingenabledCnt > 0) {
        this.ratingenabledCnt = this.sharedFunctionobj.ratingRounding(this.ratingenabledCnt);
      }
      const ratingenabledInt = parseInt(this.ratingenabledCnt.toString(), 10);
      if (ratingenabledInt < this.ratingenabledCnt) {
        this.ratingenabledHalf = true;
        this.ratingenabledCnt = ratingenabledInt;
        this.ratingdisabledCnt = 5 - (ratingenabledInt + 1);
      } else {
        this.ratingdisabledCnt = 5 - ratingenabledInt;
      }
      this.ratingenabledArr = [];
      this.ratingdisabledArr = [];
      for (let i = 0; i < this.ratingenabledCnt; i++) {
        this.ratingenabledArr.push(i);
      }
      for (let i = 0; i < this.ratingdisabledCnt; i++) {
        this.ratingdisabledArr.push(i);
      }
      // this.getbusinessprofiledetails_json('location', true);
    }
  }
  setAccountSettings(res) {
    this.settingsjson = res;
    this.showToken = this.settingsjson.showTokenId;
    this.settings_exists = true;
    this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
    this.maxsize = this.settingsjson.maxPartySize;
    if (this.maxsize === undefined) {
      this.maxsize = 1;
    }
    this.showDepartments = this.settingsjson.filterByDept;
  }

  setAccountServices(res) {
    this.servicesjson = res;
    if (this.servicesjson[0] && this.servicesjson[0].hasOwnProperty('departmentName')) {
      this.showDepartments = true;
    }
  }

  setAccountApptServices(res) {
    this.apptServicesjson = res;
    setTimeout(() => {
      // merge two arrays without duplicates
      if (this.servicesjson && this.servicesjson.length > 0) {
        const ids = new Set(this.apptServicesjson.map(d => d.id));
        const merged = [...this.apptServicesjson, ...this.servicesjson.filter(d => !ids.has(d.id))];
        this.apptServicesjson = merged;
      }
      for (let i = 0; i < this.apptServicesjson.length; i++) {
        if (i < 3) {
          this.apptfirstArray.push(this.apptServicesjson[i]);
        }
      }
      this.apptTempArray = this.apptfirstArray;
    });
  }

  setAccountGallery(res) {
    this.galleryenabledArr = []; // For showing gallery
    this.image_list_popup = [];
    this.tempgalleryjson = res;
    if (this.tempgalleryjson.length > 5) {
      this.extra_img_count = this.tempgalleryjson.length - 5;
    }
    let indx = 0;
    if (this.bLogo !== '../../../assets/images/img-null.svg') {
      this.galleryjson[0] = { keyName: 'logo', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
      indx = 1;
    }
    for (let i = 0; i < this.tempgalleryjson.length; i++) {
      this.galleryjson[(i + indx)] = this.tempgalleryjson[i];
    }
    if (this.galleryjson.length > 0) {
      this.galleryExists = true;
      for (let i = 0; i < this.galleryjson.length; i++) {
        const imgobj = new Image(
          i,
          { // modal
            img: this.galleryjson[i].url,
            description: this.galleryjson[i].caption || ''
          });
        this.image_list_popup.push(imgobj);
      }
    }
    this.imgLength = this.image_list_popup.length;
    const imgLength = this.image_list_popup.length > 5 ? 5 : this.image_list_popup.length;
    for (let i = 0; i < imgLength; i++) {
      this.galleryenabledArr.push(i);
    }
  }

  setAccountLocations(res) {
    this.locationjson = res;
    this.location_exists = true;
    for (let i = 0; i < this.locationjson.length; i++) {
      const addres = this.locationjson[i].address;
      const place = this.locationjson[i].place;
      if (addres && addres.includes(place)) {
        this.locationjson['isPlaceisSame'] = true;
      } else {
        this.locationjson['isPlaceisSame'] = false;
      }
      if (this.locationjson[i].parkingType) {
        this.locationjson[i].parkingType = this.locationjson[i].parkingType.charAt(0).toUpperCase() + this.locationjson[i].parkingType.substring(1);
      }
    }
    this.changeLocation(this.locationjson[0]);
    this.api_loading = false;
  }

  setAccountCoupons(res) {

    if (res !== undefined) {
      this.s3CouponList.JC = res;
    } else {
      this.s3CouponList.JC = [];
    }
    this.firstChckinCuponCunt(this.s3CouponList);
    this.nonfirstPresent(this.s3CouponList);
  }

  SetAccountStoreCoupons(res) {
    if (res !== undefined) {
      this.s3CouponList.OWN = res;
    } else {
      this.s3CouponList.OWN = [];
    }
    this.firstChckinCuponCunt(this.s3CouponList);
    this.nonfirstPresent(this.s3CouponList);
  }

  setAccountVirtualFields(res) {
    this.virtualfieldsjson = res;
    this.virtualfieldsCombinedjson = [];
    this.virtualfieldsDomainjson = [];
    this.virtualfieldsSubdomainjson = [];
    if (this.virtualfieldsjson.domain) {
      this.virtualfieldsDomainjson = this.sortVfields(this.virtualfieldsjson.domain);
    }
    if (this.virtualfieldsjson.subdomain) {
      this.virtualfieldsSubdomainjson = this.sortVfields(this.virtualfieldsjson.subdomain);
    }
    if (this.virtualfieldsSubdomainjson.length && this.virtualfieldsDomainjson.length) {
      this.virtualfieldsCombinedjson = this.virtualfieldsSubdomainjson.concat(this.virtualfieldsDomainjson);
    } else if (this.virtualfieldsSubdomainjson.length && !this.virtualfieldsDomainjson.length) {
      this.virtualfieldsCombinedjson = this.virtualfieldsSubdomainjson;
    } else if (!this.virtualfieldsSubdomainjson.length && this.virtualfieldsDomainjson.length) {
      this.virtualfieldsCombinedjson = this.virtualfieldsDomainjson;
    }
    if (this.virtualfieldsCombinedjson.length > 0) {
      this.showVirtualfieldsSection = true;
    }
  }

  setUserBusinessProfile(res) {
    this.socialMedialist = [];
    this.businessjson = res;
    this.titleService.setTitle(this.businessjson.businessName);
    this.metaService.addTags([
      // {name: 'keywords', content: 'Angular, Universal, Example'},
      { name: 'description', content: this.businessjson.businessDesc },
      // {name: 'robots', content: 'index, follow'}
    ]);
    const dom = this.domainList.bdata.filter(domain => domain.id === this.businessjson.serviceSector.id);
    this.subDomainList = dom[0].subDomains;
    const subDom = this.subDomainList.filter(subdomain => subdomain.id === this.businessjson.userSubdomain);
    this.businessjson['serviceSubSector'] = subDom[0];
    this.branch_id = this.businessjson.branchId;
    this.account_Type = this.businessjson.accountType;
    this.business_exists = true;
    this.provider_bussiness_id = this.businessjson.id;
    if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
      if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
        this.bLogo = this.businessjson.logo.url;
        // this.galleryjson[0] = { keyName: 'logo', caption: '', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
      }
    } else {
      // this.bLogo = '';
      this.bLogo = '../../../assets/images/img-null.svg';
    }
    if (this.businessjson.specialization) {
      this.specializationslist = this.businessjson.specialization;
    }
    if (this.businessjson.socialMedia) {
      this.socialMedialist = this.businessjson.socialMedia;
    }
    if (this.businessjson.emails) {
      this.emaillist = this.businessjson.emails;
    }
    if (this.businessjson.phoneNumbers) {
      this.phonelist = this.businessjson.phoneNumbers;
    }
    const holdbName = this.businessjson.businessDesc || '';
    const maxCnt = 120;
    if (holdbName.length > maxCnt) {
      this.bNameStart = holdbName.substr(0, maxCnt);
      this.bNameEnd = holdbName.substr(maxCnt, holdbName.length);
    } else {
      this.bNameStart = holdbName;
    }
    this.ratingenabledCnt = this.businessjson.avgRating || 0;
    if (this.ratingenabledCnt > 0) {
      this.ratingenabledCnt = this.sharedFunctionobj.ratingRounding(this.ratingenabledCnt);
    }
    const ratingenabledInt = parseInt(this.ratingenabledCnt.toString(), 10);
    if (ratingenabledInt < this.ratingenabledCnt) {
      this.ratingenabledHalf = true;
      this.ratingenabledCnt = ratingenabledInt;
      this.ratingdisabledCnt = 5 - (ratingenabledInt + 1);
    } else {
      this.ratingdisabledCnt = 5 - ratingenabledInt;
    }
    this.ratingenabledArr = [];
    this.ratingdisabledArr = [];
    for (let i = 0; i < this.ratingenabledCnt; i++) {
      this.ratingenabledArr.push(i);
    }
    for (let i = 0; i < this.ratingdisabledCnt; i++) {
      this.ratingdisabledArr.push(i);
    }

  }

  setUserVirtualFields(res) {
    this.virtualfieldsjson = res;
    this.virtualfieldsCombinedjson = [];
    this.virtualfieldsDomainjson = [];
    this.virtualfieldsSubdomainjson = [];
    if (this.virtualfieldsjson.domain) {
      this.virtualfieldsDomainjson = this.sortVfields(this.virtualfieldsjson.domain);
    }
    if (this.virtualfieldsjson.subdomain) {
      this.virtualfieldsSubdomainjson = this.sortVfields(this.virtualfieldsjson.subdomain);
    }
    if (this.virtualfieldsSubdomainjson.length && this.virtualfieldsDomainjson.length) {
      this.virtualfieldsCombinedjson = this.virtualfieldsSubdomainjson.concat(this.virtualfieldsDomainjson);
    } else if (this.virtualfieldsSubdomainjson.length && !this.virtualfieldsDomainjson.length) {
      this.virtualfieldsCombinedjson = this.virtualfieldsSubdomainjson;
    } else if (!this.virtualfieldsSubdomainjson.length && this.virtualfieldsDomainjson.length) {
      this.virtualfieldsCombinedjson = this.virtualfieldsDomainjson;
    }
    if (this.virtualfieldsCombinedjson.length > 0) {
      this.showVirtualfieldsSection = true;
    }
  }

  setUserServices(res) {
    if (this.settingsjson.filterByDept) {
      for (const dept of res) {
        if (dept.services && dept.services.length > 0) {
          for (const serv of dept.services) {
            if (this.servicesjson.indexOf(serv) === -1) {
              this.servicesjson.push(serv);
            }
          }
        }
      }
    } else {
      this.servicesjson = res;
    }
  }

  setUserApptServices(res) {
    if (this.settingsjson.filterByDept) {
      for (const dept of res) {
        if (dept.services && dept.services.length > 0) {
          for (const serv of dept.services) {
            if (this.apptServicesjson.indexOf(serv) === -1) {
              this.apptServicesjson.push(serv);
            }
          }
        }
      }
    } else {
      this.apptServicesjson = res;
    }
    setTimeout(() => {
      // merge two arrays without duplicates
      if (this.servicesjson && this.servicesjson.length > 0) {
        const ids = new Set(this.apptServicesjson.map(d => d.id));
        const merged = [...this.apptServicesjson, ...this.servicesjson.filter(d => !ids.has(d.id))];
        this.apptServicesjson = merged;
      }
      for (let i = 0; i < this.apptServicesjson.length; i++) {
        if (i < 3) {
          this.apptfirstArray.push(this.apptServicesjson[i]);
        }
      }
      this.apptTempArray = this.apptfirstArray;
    });
  }

  setGalleryNotFound() {
    this.galleryjson = [];
    if (this.bLogo !== '../../../assets/images/img-null.svg') {
      this.galleryExists = true;
      this.image_list_popup = [];
      this.galleryjson[0] = { keyName: 'logo', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
      const imgobj = new Image(0,
        { // modal
          img: this.galleryjson[0].url,
          description: this.galleryjson[0].caption || ''
        });
      this.image_list_popup.push(imgobj);
    } else {
      this.bLogo = '../../../assets/images/img-null.svg';
    }
  }

  isfirstCheckinOfferProvider() {
    let firstCheckin = true;
    if (this.activeUser) {
      this.checkinProviderList = this.activeUser.checkedInProviders;
      if (this.checkinProviderList && this.checkinProviderList.length > 0) {
        if (this.checkinProviderList.includes(this.provider_bussiness_id)) {
          firstCheckin = false;
          console.log('already taken');
        } else {
          firstCheckin = true;

        }
      } else {
        firstCheckin = true;
      }

    }
    return firstCheckin;
  }
  getUserApptTime(provids_locid, waitTimearr) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getUserApptTime(post_provids_locid)
        .subscribe(data => {
          this.appttime_arr = data;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const dd = today.getDate();
          const mm = today.getMonth() + 1; // January is 0!
          const yyyy = today.getFullYear();
          let cday = '';
          if (dd < 10) {
            cday = '0' + dd;
          } else {
            cday = '' + dd;
          }
          let cmon;
          if (mm < 10) {
            cmon = '0' + mm;
          } else {
            cmon = '' + mm;
          }
          const dtoday = yyyy + '-' + cmon + '-' + cday;
          for (let i = 0; i < this.appttime_arr.length; i++) {
            if (this.appttime_arr[i]['availableSlots']) {
              this.appttime_arr[i]['caption'] = 'Next Available Time';
              if (dtoday === this.appttime_arr[i]['availableSlots']['date']) {
                this.appttime_arr[i]['date'] = 'Today' + ', ' + this.getAvailableSlot(this.appttime_arr[i]['availableSlots'].availableSlots);
              } else {
                this.appttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.appttime_arr[i]['availableSlots']['date'], { 'rettype': 'monthname' }) + ', '
                  + this.getAvailableSlot(this.appttime_arr[i]['availableSlots'].availableSlots);
              }
            }
          }
          this.getUserWaitingTime(waitTimearr);
        });
    }
  }
  getUserWaitingTime(provids) {
    if (provids.length > 0) {
      const post_provids: any = [];
      for (let i = 0; i < provids.length; i++) {
        post_provids.push(provids[i].locid);
      }
      if (post_provids.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getUserEstimatedWaitingTime(post_provids)
        .subscribe(data => {
          this.waitlisttime_arr = data;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const dd = today.getDate();
          const mm = today.getMonth() + 1; // January is 0!
          const yyyy = today.getFullYear();
          let cday = '';
          if (dd < 10) {
            cday = '0' + dd;
          } else {
            cday = '' + dd;
          }
          let cmon;
          if (mm < 10) {
            cmon = '0' + mm;
          } else {
            cmon = '' + mm;
          }
          const dtoday = yyyy + '-' + cmon + '-' + cday;
          for (let i = 0; i < this.waitlisttime_arr.length; i++) {
            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              if (!this.waitlisttime_arr[i]['nextAvailableQueue']['openNow']) {
                this.waitlisttime_arr[i]['caption'] = 'Next Available Time ';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.waitlisttime_arr[i]['date'] = 'Today' + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  } else {
                    this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                      + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  }
                } else {
                  this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.dateTimeProcessor.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
              } else {
                this.waitlisttime_arr[i]['caption'] = 'Est Wait Time'; // 'Estimated Waiting Time';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.waitlisttime_arr[i]['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.waitlisttime_arr[i]['date'] = 'Today' + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  } else {
                    this.waitlisttime_arr[i]['date'] = this.dateTimeProcessor.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                      + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  }
                }
              }
            }
          }
          this.setServiceUserDetails();
        });
    }
  }
  changeLocation(loc) {

    this.selectedLocation = loc;
    this.generateServicesAndDoctorsForLocation(this.provider_id, this.selectedLocation.id);

  }

  sortVfields(dataF) {
    let temp;
    const temp1 = new Array();
    let temp2 = new Array();
    let temp3 = new Array();
    for (let i = 0; i < dataF.length; i++) {
      temp2 = [];
      let str = '';
      dataF[i]['type'] = typeof dataF[i].value;
      switch (dataF[i].dataType) {
        case 'Gender':
          this.genderType = dataF[i].value;
          break;
        case 'Enum':
        case 'EnumList':
          str = '';
          temp3 = [];
          for (let jj = 0; jj < dataF[i].value.length; jj++) {
            if (str !== '') {
              str += ', ';
            }
            str += dataF[i].value[jj].displayName;
          }
          temp3.push(str);
          temp2.push(temp3);
          dataF[i].value = temp2;
          temp1.push(dataF[i]);
          break;
        case 'DataGrid':
          for (let ii = 0; ii < dataF[i].value.length; ii++) {
            temp3 = [];
            Object.keys(dataF[i].value[ii]).forEach(nkeys => {
              temp3.push(dataF[i].value[ii][nkeys]);
            });
            temp2.push(temp3);
          }
          dataF[i].value = temp2;
          temp1.push(dataF[i]);
          break;
        case 'Boolean':
          if (dataF[i].value === 'true') {
            dataF[i].value = 'Yes';
          } else {
            dataF[i].value = 'No';
          }
          temp1.push(dataF[i]);
          break;
        default:
          temp1.push(dataF[i]);
          break;
      }
    }
    dataF = temp1;
    for (let i = 0; i < dataF.length; i++) {
      for (let j = i + 1; j < dataF.length; j++) {
        if (parseInt(dataF[i].order, 10) > parseInt(dataF[j].order, 10)) {
          temp = dataF[i];
          dataF[i] = dataF[j];
          dataF[j] = temp;
        }
      }
    }
    return dataF;
  }
  ORGsortVfields(dataF) {
    let temp;
    const temp1 = new Array();
    let temp2 = new Array();
    let temp3 = new Array();
    for (let i = 0; i < dataF.length; i++) {
      temp2 = [];
      dataF[i]['type'] = typeof dataF[i].value;
      if (dataF[i].name !== 'gender') {
        if (dataF[i]['type'] === 'object') {
          let str = '';
          temp3 = [];
          if (typeof dataF[i].value[0] === 'string') {
            for (let jj = 0; jj < dataF[i].value.length; jj++) {
              str += ' ' + dataF[i].value[jj];
            }
            temp3.push(str);
            temp2.push(temp3);
          } else {
            for (let ii = 0; ii < dataF[i].value.length; ii++) {
              temp3 = [];
              if (typeof dataF[i].value[ii] === 'string') {
                temp3.push(dataF[i].value[ii]);
              } else {
                Object.keys(dataF[i].value[ii]).forEach(nkeys => {
                  temp3.push(dataF[i].value[ii][nkeys]);
                });
              }
              temp2.push(temp3);
            }
          }
          dataF[i].value = temp2;
        }
        temp1.push(dataF[i]);
      } else {
        this.genderType = dataF[i].value;
      }
    }
    dataF = temp1;
    for (let i = 0; i < dataF.length; i++) {
      for (let j = i + 1; j < dataF.length; j++) {
        if (parseInt(dataF[i].order, 10) > parseInt(dataF[j].order, 10)) {
          temp = dataF[i];
          dataF[i] = dataF[j];
          dataF[j] = temp;
        }
      }
    }
    return dataF;
  }
  objectToVal(dataF) {
    const retval = new Array();
    for (let i = 0; i < dataF.length; i++) {
      if (dataF[i]['type'] === 'object') {
        Object.keys(dataF[i].value).forEach(key => {
          Object.keys(dataF[i].value[key]).forEach(keys => {
            retval.push(keys);
          });
        });
      }
    }
    return retval;
  }
  showallServices() {
    if (this.viewallServices) {
      this.viewallServices = false;
    } else {
      this.viewallServices = true;
    }
  }
  showallSpecial() {
    if (this.viewallSpec) {
      this.viewallSpec = false;
    } else {
      this.viewallSpec = true;
    }
  }
  showDesc() {
    if (this.showmoreDesc) {
      this.showmoreDesc = false;
    } else {
      this.showmoreDesc = true;
    }
  }
  showSpec() {
    if (this.showmoreSpec) {
      this.showmoreSpec = false;
    } else {
      this.showmoreSpec = true;
    }
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  openCatalogImageModalRow(image: Image) {

    const index: number = this.getCurrentIndexCustomLayout(image, this.catalogimage_list_popup);
    this.customPlainGallerycatalogRowConfig = Object.assign({}, this.customPlainGallerycatalogRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  getServicesByDepartment(dept) {
    this.routerobj.navigate(['searchdetail', this.provider_id, dept.departmentId], { queryParams: { source: 'business' } });
  }
  backtoDetails() {
    this.locationobj.back();
    if (this.pSource === 'business') {
      this.userId = null;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2500);
    }
  }
  getExistingCheckinsByLocation(locid, passedIndx) {
    this.shared_services.getExistingCheckinsByLocation(locid)
      .subscribe(data => {
        this.locationjson[passedIndx]['checkins'] = data;
      },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        });
  }
  getWaitlistingFor(obj) {
    let str = '';
    if (obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        if (str !== '') {
          str += ', ';
        }
        str += obj[i].firstName;
      }
    }
    return str;
  }
  getDateDisplay(dt) {
    let str = '';
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const today = new Date(todaydt);
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    let cday = '';
    if (dd < 10) {
      cday = '0' + dd;
    } else {
      cday = '' + dd;
    }
    let cmon;
    if (mm < 10) {
      cmon = '0' + mm;
    } else {
      cmon = '' + mm;
    }
    const dtoday = yyyy + '-' + cmon + '-' + cday;

    if (dtoday === dt) {
      str = 'Today';
    } else {
      const dtr = dt.split('-');
      str = dtr[2] + '-' + dtr[1] + '-' + dtr[0];
    }
    return str;
  }


  goThroughLogin() {
    const _this = this;
    console.log("Entered to goThroughLogin Method");
    return new Promise((resolve) => {
      if (_this.lStorageService.getitemfromLocalStorage('pre-header') && _this.lStorageService.getitemfromLocalStorage('authToken')){
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
  redirectToHistory() {
    console.log("Inside redirectToHistory");
    const _this = this;
    _this.goThroughLogin().then(
      (status) => {
        if (status) {
          _this.routerobj.navigate(['searchdetail', _this.provider_bussiness_id, 'history']);
        } else {
          const passParam = { callback: 'history' };
          _this.doLogin('consumer', passParam);
        }
      });
  }
  communicateHandler() {
    const _this = this;
    const providforCommunicate = this.provider_bussiness_id;
    _this.goThroughLogin().then(
      (status) => {
        if (status) {
          _this.showCommunicate(providforCommunicate);
        } else {
          const passParam = { callback: 'communicate', providerId: providforCommunicate, provider_name: name };
          _this.doLogin('consumer', passParam);
        }
      }
    );
  }
  openJdn() {
    this.jdndialogRef = this.dialog.open(JdnComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {
        jdnList: this.jaldeediscountJson
      }
    });
    this.jdndialogRef.afterClosed().subscribe(() => {
    });
  }
  showCommunicate(provid) {
    this.commdialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      minHeight: '100vh',
      minWidth: '100vw',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-bor-rad-0'],
      disableClose: true,
      data: {
        caption: 'Send Message',
        user_id: provid,
        userId: this.userId,
        source: 'consumer-common',
        type: 'send',
        terminologies: this.terminologiesjson,
        name: this.businessjson.businessName,
        typeOfMsg: 'single'
      }
    });
    this.commdialogRef.afterClosed().subscribe(() => {
    });
  }
  checkinClicked(location, service) {
    console.log("Checkin Clicked");
    const current_provider = {
      'id': location.id,
      'place': location.place,
      'location': location,
      'cdate': service.serviceAvailability.availableDate,
      'service': service
    };
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const today = new Date(todaydt);
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    let cday = '';
    if (dd < 10) {
      cday = '0' + dd;
    } else {
      cday = '' + dd;
    }
    let cmon;
    if (mm < 10) {
      cmon = '0' + mm;
    } else {
      cmon = '' + mm;
    }
    const dtoday = yyyy + '-' + cmon + '-' + cday;
    if (dtoday === service.serviceAvailability.availableDate) {
      this.changedate_req = false;
    } else {
      this.changedate_req = true;
    }
    const _this = this;
    _this.goThroughLogin().then(
      (status) => {
        console.log("Current Login status:" + status);
        if (status) {
            if (service.serviceType === 'virtualService') {
              _this.checkVirtualRequiredFieldsEntered().then((consumerdata) => {
                _this.collectRequiredinfo(location.id, location.place, location.googlemapUrl, service.serviceAvailability.availableDate, 'checkin', service, consumerdata);
              });
            }
            else {
              _this.showCheckin(location.id, location.place, location.googleMapUrl, service.serviceAvailability.availableDate, service, 'consumer');
            }
        } else {
          const passParam = { callback: '', current_provider: current_provider };
          _this.doLogin('consumer', passParam);
        }
      });
  }
  appointmentClicked(location, service: any) {
    const _this = this;
    this.futureAllowed = true;
    const current_provider = {
      'id': location.id,
      'place': location.place,
      'location': location,
      'cdate': service.serviceAvailability.nextAvailableDate,
      'service': service
    };
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const today = new Date(todaydt);
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    let cday = '';
    if (dd < 10) {
      cday = '0' + dd;
    } else {
      cday = '' + dd;
    }
    let cmon;
    if (mm < 10) {
      cmon = '0' + mm;
    } else {
      cmon = '' + mm;
    }
    const dtoday = yyyy + '-' + cmon + '-' + cday;
    if (dtoday === service.serviceAvailability.nextAvailableDate) {
      this.changedate_req = false;
    } else {
      this.changedate_req = true;
    }
    if (!location.futureAppt) {
      this.futureAllowed = false;
    }

    _this.goThroughLogin().then(
      (status) => {
        if (status) {
              _this.showAppointment(location.id, location.place, location.googleMapUrl, service.serviceAvailability.nextAvailableDate, service, 'consumer');
        } else {
          const passParam = { callback: 'appointment', current_provider: current_provider };
          _this.doLogin('consumer', passParam);
        }
      });
  }
   collectRequiredinfo(id, place, location, date, type, service?, consumerdata?) {
    console.log("Collect Required Info");
    const _this = this;
    let virtualFields = {};
    if(this.checkallvirtualFilledByConsumer(consumerdata)){
      if(consumerdata.parent){
        virtualFields['dob'] = consumerdata.userProfile.dob;
        virtualFields['gender'] = consumerdata.userProfile.gender;
        let locationObj = {};
        locationObj['Name'] = consumerdata.bookingLocation.city;
        locationObj['State'] = consumerdata.bookingLocation.state;
        locationObj['Pincode'] = consumerdata.bookingLocation.pincode;
        virtualFields['location'] = locationObj;
        virtualFields['preferredLanguage'] = this.s3Processor.getJson(consumerdata.preferredLanguages);
        if (virtualFields['preferredLanguage'][0] === 'English') {
          virtualFields['islanguage'] = 'yes';
        }
      }else{
        virtualFields['dob'] = consumerdata.userProfile.dob;
        virtualFields['gender'] = consumerdata.userProfile.gender;
        let locationObj = {};
        locationObj['Name'] = consumerdata.userProfile.city;
        locationObj['State'] = consumerdata.userProfile.state;
        locationObj['Pincode'] = consumerdata.userProfile.pinCode;
        virtualFields['location'] = locationObj;
        virtualFields['pincode'] = consumerdata.userProfile.pinCode;
        virtualFields['preferredLanguage'] = this.s3Processor.getJson(consumerdata.userProfile.preferredLanguages);
        if (virtualFields['preferredLanguage'][0] === 'English') {
          virtualFields['islanguage'] = 'yes';
        } 
      }
      if (type === 'appt') {
        _this.showAppointment(id, place, location, date, service, 'consumer', virtualFields);
      } else {
        _this.showCheckin(id, place, location, date, service, 'consumer', virtualFields);
      } 
    }else{
      const virtualdialogRef = _this.dialog.open(VirtualFieldsComponent, {
        width: '50%',
        minHeight: '100vh',
        minWidth: '100vw',
        panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-border-radius-0'],
        disableClose: true,
        data: { consumer: consumerdata,service:service,businessDetails:this.businessjson }
      });
      virtualdialogRef.afterClosed().subscribe(result => {
        _this.loading_direct = true;
        if (result) {
          console.log("Virtual fields updated successfully....");
          _this.consumerVirtualinfo = result;
          if (type === 'appt') {
            _this.showAppointment(id, place, location, date, service, 'consumer', result);
          } else {
            _this.showCheckin(id, place, location, date, service, 'consumer', result);
          } 
        } else {
          _this.loading_direct = false;
        }
      });
    }
  }
  checkallvirtualFilledByConsumer(consumerdata){
    let allrequiredFieldsFilled=false;
    if(consumerdata.parent){
    if(consumerdata.userProfile.dob &&consumerdata.userProfile.dob!==''&&consumerdata.userProfile.gender && consumerdata.preferredLanguages&&consumerdata.preferredLanguages!==null&& consumerdata.bookingLocation && consumerdata.bookingLocation.pincode&&consumerdata.bookingLocation.pincode.trim()!==''){
      allrequiredFieldsFilled=true;
    }

  }else if(consumerdata.userProfile.dob &&consumerdata.userProfile.dob!==''&&consumerdata.userProfile.gender && consumerdata.userProfile.preferredLanguages&&consumerdata.userProfile.preferredLanguages!==null&& consumerdata.bookingLocation && consumerdata.userProfile.pinCode&&consumerdata.userProfile.pinCode.trim()!==''){
    allrequiredFieldsFilled=true;
  }
  return allrequiredFieldsFilled;
}

  checkVirtualRequiredFieldsEntered() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getProfile(_this.activeUser.id, 'consumer')
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            console.log(error);
            _this.shared_services.callHealth(error.message);
            reject();
          }
        );
    });

  }

  doLogin(origin?, passParam?) {
    console.log("In doLogin Method");
    const _this=this;
    const current_provider = passParam['current_provider'];
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '50%',
      minHeight: '100vh',
      minWidth: '100vw',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-bor-rad-0'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        console.log("Login is successful. No I can move on....");
        _this.activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
        const pdata = { 'ttype': 'updateuserdetails' };
        _this.sharedFunctionobj.sendMessage(pdata);
        _this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          // this.getFavProviders();
          _this.showCommunicate(passParam['providerId']);
        } else if (passParam['callback'] === 'history') {
          _this.redirectToHistory();
        } else if (passParam['callback'] === 'donation') {
          _this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        } else if (passParam['callback'] === 'appointment') {
            _this.showAppointment(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
        } else {
          if (current_provider['service']['serviceType'] === 'virtualService') {
            _this.checkVirtualRequiredFieldsEntered().then((consumerdata) => {
              _this.collectRequiredinfo(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googlemapUrl'], current_provider['cdate'], 'checkin', current_provider['service'], consumerdata);
            });
          } else {
            _this.showCheckin(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
          }
        }
      }
    });
  }
  showCheckin(locid, locname, gMapUrl, curdate, service: any, origin?, virtualinfo?) {
    // if (this.servicesjson[0] && this.servicesjson[0].department) {
    //   deptId = this.servicesjson[0].department;
    // }
    const queryParam = {
      loc_id: locid,
      locname: locname,
      googleMapUrl: gMapUrl,
      sel_date: curdate,
      cur: this.changedate_req,
      unique_id: this.provider_id,
      account_id: this.provider_bussiness_id,
      tel_serv_stat: this.businessjson.virtualServices,
      user: this.userId,
      service_id: service.id,
      virtual_info: JSON.stringify(virtualinfo)
    };
    if (service['department']) {
      queryParam['dept'] = service['department'];
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.router.navigate(['consumer', 'checkin'], navigationExtras);
  }
  showAppointment(locid, locname, gMapUrl, curdate, service: any, origin?, virtualinfo?) {
    // let deptId;
    // if (this.servicesjson[0] && this.servicesjson[0].department) {
    //   deptId = this.servicesjson[0].department;
    // }
    const queryParam = {
      loc_id: locid,
      locname: locname,
      googleMapUrl: gMapUrl,
      cur: this.changedate_req,
      unique_id: this.provider_id,
      account_id: this.provider_bussiness_id,
      tel_serv_stat: this.businessjson.virtualServices,
      user: this.userId,
      futureAppt: this.futureAllowed,
      service_id: service.id,
      sel_date: curdate,
      virtual_info: JSON.stringify(virtualinfo)
    };
    if (service['department']) {
      queryParam['dept'] = service['department'];
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.router.navigate(['consumer', 'appointment'], navigationExtras);
  }
  showcheckInButton(servcount?) {
    if (this.settingsjson && this.settingsjson.onlineCheckIns && this.settings_exists && this.business_exists && this.location_exists && (servcount > 0)) {
      return true;
    }
  }
  handlesearchClick() {
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
  showServiceDetail(serv, busname) {
    let servData;
    if (serv.serviceType && serv.serviceType === 'donationService') {
      servData = {
        bname: busname,
        sector: this.businessjson.serviceSector.domain,
        serdet: serv,
        serv_type: 'donation'
      };
    } else {
      servData = {
        bname: busname,
        sector: this.businessjson.serviceSector.domain,
        serdet: serv
      };
    }

    // const initialState = {
    //   data: servData
    // };

    // this.bsModalRef = this.modalService.show(ServiceDetailComponent, {
    //   initialState,
    //   class: 'commonpopupmainclass popup-class specialclass service-detail-modal',
    //   backdrop: "static"
    // });

    // $('modal-container:has(.service-detail-modal)').addClass('service-detail-modal-container');

    this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      minHeight: '100vh',
      minWidth: '100vw',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-bor-rad-0'],
      disableClose: true,
      data: servData
    });
    this.servicedialogRef.afterClosed().subscribe(() => {
    });
  }
  getTerminologyTerm(term) {
    if (this.terminologiesjson) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      // const terminologies = this.common_datastorage.get('terminologies');
      if (this.terminologiesjson) {
        return this.wordProcessor.firstToUpper((this.terminologiesjson[term_only]) ? this.terminologiesjson[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.wordProcessor.firstToUpper((term === term_only) ? term_only : term);
      }
    } else {
      return term;
    }
  }
  handleEmailPhonediv() {
    if (this.showEmailPhonediv) {
      this.showEmailPhonediv = false;
    } else {
      this.showEmailPhonediv = true;
    }
  }
  handlepanelClose() {
    this.virtualsectionHeader = 'Click here to view more details';
  }
  handlepanelOpen() {
    this.virtualsectionHeader = 'Click here to hide details';
  }
  openCoupons(type?) {
    this.coupondialogRef = this.dialog.open(CouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {
        couponsList: this.s3CouponList,
        type: type
      }
    });
    this.coupondialogRef.afterClosed().subscribe(() => {
    });
  }

  firstChckinCuponCunt(CouponList) {
    for (let index = 0; index < CouponList.JC.length; index++) {
      if (CouponList.JC[index].firstCheckinOnly === true) {
        this.frstChckinCupnCunt = this.frstChckinCupnCunt + 1;
      }
    }
    for (let index = 0; index < CouponList.OWN.length; index++) {
      if (CouponList.OWN[index].couponRules.firstCheckinOnly === true) {
        this.frstChckinCupnCunt = this.frstChckinCupnCunt + 1;
      }
    }
  }
  nonfirstPresent(CouponList) {
    for (let index = 0; index < CouponList.JC.length; index++) {
      if (CouponList.JC[index].firstCheckinOnly === false) {
        this.nonfirstCouponCount = this.nonfirstCouponCount + 1;
      }
    }
    for (let index = 0; index < CouponList.OWN.length; index++) {
      if (CouponList.OWN[index].couponRules.firstCheckinOnly === false) {
        this.nonfirstCouponCount = this.nonfirstCouponCount + 1;
      }
    }
  }
  payClicked(locid, locname, cdate, service) {
    const _this = this;
    _this.goThroughLogin().then(
      (status) => {
        if (status) {
            this.showDonation(locid, cdate, service);
        } else {
          const passParam = { callback: 'donation', loc_id: locid, name: locname, date: cdate, service:service, consumer: 'consumer' };
          this.doLogin('consumer', passParam);
        }
      });
  }
  showDonation(locid, curdate, service) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loc_id: locid,
        sel_date: curdate,
        cur: this.changedate_req,
        unique_id: this.provider_id,
        account_id: this.provider_bussiness_id,
        service_id: service.id
      }
    };
    this.routerobj.navigate(['consumer', 'donations', 'new'], navigationExtras);
  }

  getTimeToDisplay(min) {
    return this.dateTimeProcessor.convertMinutesToHourMinute(min);
  }
  getAvailibilityForCheckin(date, serviceTime) {
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const today = new Date(todaydt);
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    let cday = '';
    if (dd < 10) {
      cday = '0' + dd;
    } else {
      cday = '' + dd;
    }
    let cmon;
    if (mm < 10) {
      cmon = '0' + mm;
    } else {
      cmon = '' + mm;
    }
    const dtoday = yyyy + '-' + cmon + '-' + cday;
    if (dtoday === date) {
      return ('Today' + ', ' + serviceTime);
    } else {
      return (this.dateTimeProcessor.formatDate(date, { 'rettype': 'monthname' }) + ', '
        + serviceTime);
    }
  }
  getAvailabilityforAppt(date, time) {
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const today = new Date(todaydt);
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    let cday = '';
    if (dd < 10) {
      cday = '0' + dd;
    } else {
      cday = '' + dd;
    }
    let cmon;
    if (mm < 10) {
      cmon = '0' + mm;
    } else {
      cmon = '' + mm;
    }
    const dtoday = yyyy + '-' + cmon + '-' + cday;
    if (dtoday === date) {
      return ('Today' + ', ' + this.getSingleTime(time));
    } else {
      return (this.dateTimeProcessor.formatDate(date, { 'rettype': 'monthname' }) + ', '
        + this.getSingleTime(time));
    }
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  getAvailableSlot(slots) {
    let slotAvailable = '';
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].active) {
        slotAvailable = this.getSingleTime(slots[i].time);
        break;
      }
    }
    return slotAvailable;
  }
  getServiceByDept(department) {
    if (department && department.departmentId) {
      const service = this.servicesjson.filter(dpt => dpt.departmentId === department.departmentId);
      if (service[0] && service[0].services) {
        return service[0].services;
      }
    } else {
      return [];
    }
  }
  showmore(type) {
    this.showType = type;
    if (type === 'less') {
      this.apptfirstArray = this.apptServicesjson;
    } else {
      this.apptfirstArray = this.apptTempArray;
    }
  }
  providerDetClicked(userId) {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     src: 'bp'
    //   }
    // };
    this.routerobj.navigate([this.accountEncId, userId]);
  }

  cardClicked(actionObj) {

    if (actionObj['type'] === 'waitlist') {
      if (actionObj['action'] === 'view') {
        this.showServiceDetail(actionObj['service'], this.businessjson.name);
      } else {
        this.checkinClicked(actionObj['location'], actionObj['service']);
      }

    } else if (actionObj['type'] === 'appt') {
      if (actionObj['action'] === 'view') {
        this.showServiceDetail(actionObj['service'], this.businessjson.name);
      } else {
        this.appointmentClicked(actionObj['location'], actionObj['service']);
      }
    } else if (actionObj['type'] === 'donation') {
      if (actionObj['action'] === 'view') {
        this.showServiceDetail(actionObj['service'], this.businessjson.name);
      } else {
        this.payClicked(actionObj['location'].id, actionObj['location'].place, new Date(), actionObj['service']);
      }
    } else {
      this.providerDetClicked(actionObj['userId']);
    }
  }

  getBusinessHours(location) {
    let message = '';
    for (let i = 0; i < location.display_schedule.length; i++) {
      message += location.display_schedule[i].dstr + ' ' + location.display_schedule[i].time;

      if (location.display_schedule[i].recurrtype === 'Once') {
        message += '(only for today)';
      }

      message += '\r\n';
    }
    return message;
  }
  showMoreInfo() {
    this.showMore = !this.showMore;
  }
  goBack() {
    this.locationobj.back();
    this.userId = null;
    this.pSource = null;
  }
  getPic(user) {
    if (user.profilePicture) {
      return this.s3Processor.getJson(user.profilePicture)['url'];
    }
    return 'assets/images/img-null.svg';
  }
  getWaitlistServices(locationId) {
    const _this = this;
    return new Promise(function (resolve) {
      _this.shared_services.getServicesByLocationId(locationId)
        .subscribe((wlServices: any) => {
          resolve(wlServices);
        },
          () => {
            resolve([]);
          }
        );
    });
  }
  getAppointmentServices(locationId) {
    const _this = this;
    return new Promise(function (resolve) {
      _this.shared_services.getServicesforAppontmntByLocationId(locationId)
        .subscribe((apptServices: any) => {
          resolve(apptServices);
        },
          () => {
            resolve([]);
          }
        );
    });
  }
  generateServicesAndDoctorsForLocation(providerId, locationId) {
    this.getWaitlistServices(locationId)
      .then((wlServices: any) => {
        this.wlServices = wlServices;
        this.getAppointmentServices(locationId)
          .then((apptServices: any) => {
            this.apptServices = apptServices;
            this.setServiceUserDetails();
          },
            error => {
              this.wordProcessor.apiErrorAutoHide(this, error);
            });
      },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        });
  }
  /**
   * Order Related Code
   */
  setServiceUserDetails() {
    this.servicesAndProviders = [];
    const servicesAndProviders = [];
    this.donationServices = [];
    this.serviceCount = 0;
    this.userCount = 0;
    if (this.showDepartments) {
      if (this.userId) {
        for (let aptIndex = 0; aptIndex < this.apptServices.length; aptIndex++) {
          if (this.apptServices[aptIndex]['provider'] && this.apptServices[aptIndex]['provider']['id'] === JSON.parse(this.userId) && this.apptServices[aptIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'appt', 'item': this.apptServices[aptIndex] });
            this.serviceCount++;
          }
        }
        for (let wlIndex = 0; wlIndex < this.wlServices.length; wlIndex++) {
          if (this.wlServices[wlIndex]['provider'] && this.wlServices[wlIndex]['provider']['id'] === JSON.parse(this.userId) && this.wlServices[wlIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'waitlist', 'item': this.wlServices[wlIndex] });
            this.serviceCount++;
          }
        }
      } else {
        for (let dIndex = 0; dIndex < this.deptUsers.length; dIndex++) {
          const deptItem = {};
          deptItem['departmentName'] = this.deptUsers[dIndex]['departmentName'];
          deptItem['departmentCode'] = this.deptUsers[dIndex]['departmentCode'];
          deptItem['departmentId'] = this.deptUsers[dIndex]['departmentId'];
          deptItem['departmentItems'] = [];
          for (let aptIndex = 0; aptIndex < this.apptServices.length; aptIndex++) {
            if (!this.apptServices[aptIndex]['provider'] && this.apptServices[aptIndex].serviceAvailability && deptItem['departmentId'] === this.apptServices[aptIndex].department) {
              deptItem['departmentItems'].push({ 'type': 'appt', 'item': this.apptServices[aptIndex] });
              this.serviceCount++;
            }
          }
          for (let wlIndex = 0; wlIndex < this.wlServices.length; wlIndex++) {
            if (!this.wlServices[wlIndex]['provider'] && this.wlServices[wlIndex].serviceAvailability && deptItem['departmentId'] === this.wlServices[wlIndex].department) {
              deptItem['departmentItems'].push({ 'type': 'waitlist', 'item': this.wlServices[wlIndex] });
              this.serviceCount++;
            }
          }
          if (!this.userId) {
            for (let pIndex = 0; pIndex < this.deptUsers[dIndex]['users'].length; pIndex++) {
              const userWaitTime = this.waitlisttime_arr.filter(time => time.provider.id === this.deptUsers[dIndex]['users'][pIndex].id);
              const userApptTime = this.appttime_arr.filter(time => time.provider.id === this.deptUsers[dIndex]['users'][pIndex].id);
              this.deptUsers[dIndex]['users'][pIndex]['waitingTime'] = userWaitTime[0];
              this.deptUsers[dIndex]['users'][pIndex]['apptTime'] = userApptTime[0];
              deptItem['departmentItems'].push({ 'type': 'provider', 'item': this.deptUsers[dIndex]['users'][pIndex] });
              this.userCount++;
            }
          }
          servicesAndProviders.push(deptItem);
        }
      }
      this.servicesAndProviders = servicesAndProviders;
      // });
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      const servicesAndProviders = [];
      if (this.userId) {
        for (let aptIndex = 0; aptIndex < this.apptServices.length; aptIndex++) {
          if (this.apptServices[aptIndex]['provider'] && this.apptServices[aptIndex]['provider']['id'] === JSON.parse(this.userId) && this.apptServices[aptIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'appt', 'item': this.apptServices[aptIndex] });
            this.serviceCount++;
          }
        }
        for (let wlIndex = 0; wlIndex < this.wlServices.length; wlIndex++) {
          if (this.wlServices[wlIndex]['provider'] && this.wlServices[wlIndex]['provider']['id'] === JSON.parse(this.userId) && this.wlServices[wlIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'waitlist', 'item': this.wlServices[wlIndex] });
            this.serviceCount++;
          }
        }
      } else {
        for (let aptIndex = 0; aptIndex < this.apptServices.length; aptIndex++) {
          if (!this.apptServices[aptIndex]['provider'] && this.apptServices[aptIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'appt', 'item': this.apptServices[aptIndex] });
            this.serviceCount++;
          }
        }
        for (let wlIndex = 0; wlIndex < this.wlServices.length; wlIndex++) {
          if (!this.wlServices[wlIndex]['provider'] && this.wlServices[wlIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'waitlist', 'item': this.wlServices[wlIndex] });
            this.serviceCount++;
          }
        }
        for (let dIndex = 0; dIndex < this.deptUsers.length; dIndex++) {
          this.deptUsers[dIndex]['waitingTime'] = this.waitlisttime_arr[dIndex];
          this.deptUsers[dIndex]['apptTime'] = this.appttime_arr[dIndex];
          servicesAndProviders.push({ 'type': 'provider', 'item': this.deptUsers[dIndex] });
          this.userCount++;
        }
      }
      this.servicesAndProviders = servicesAndProviders;
    }
    if (this.businessjson.donationFundRaising && this.onlinePresence && this.donationServicesjson.length >= 1) {
      for (let dIndex = 0; dIndex < this.donationServicesjson.length; dIndex++) {
        this.donationServices.push({ 'type': 'donation', 'item': this.donationServicesjson[dIndex] });
        this.serviceCount++;
      }
    }
  }

  reset() {

  }

  qrCodegeneraterOnlineID(accEncUid) {
    this.qrdialogRef = this.dialog.open(QRCodeGeneratordetailComponent, {
      width: '40%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        accencUid: accEncUid,
        path: this.wndw_path,
        businessName: this.businessjson.businessName
      }
    });

    this.qrdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }
  gotoDeptServicePage(deptId) {
    this.router.navigate([this.accountEncId + '/department/' + deptId]);
  }
  gotoDonation(service) {
    this.payClicked(this.locationjson[0].id, this.locationjson[0].place, new Date(), service);
  }
}