import { Component, OnInit, OnDestroy } from '@angular/core';
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
// import { ProviderDetailService } from '../provider-detail/provider-detail.service';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { ExistingCheckinComponent } from '../existing-checkin/existing-checkin.component';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { SignUpComponent } from '../signup/signup.component';
import { SearchDetailServices } from '../search-detail/search-detail-services.service';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { JdnComponent } from '../jdn-detail/jdn-detail-component';
import { Location } from '@angular/common';
import { VisualizeComponent } from '../../../business/modules/visualizer/visualize.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { GroupStorageService } from '../../services/group-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { DomainConfigGenerator } from '../../services/domain-config-generator.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { QRCodeGeneratordetailComponent } from '../qrcodegenerator/qrcodegeneratordetail.component';
import { DateTimeProcessor } from '../../services/datetime-processor.service';


@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.css'],
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
export class ProviderDetailComponent implements OnInit, OnDestroy {
  catalog_loading = false;
  catalogimage_list_popup: Image[];
  catalogImage = '../../../../assets/images/order/catalogueimg.svg';
  clear_cart_dialogRef: any;
  spId_local_id: any;
  go_back_cap = Messages.GO_BACK_CAP;
  more_cap = Messages.MORE_CAP;
  less_cap = Messages.LESS_CAP;
  contact_details_cap = Messages.CONTACT_DETAILS_CAP;
  add_to_fav_cap = Messages.ADD_TO_FAV;
  rem_from_fav_cap = Messages.REM_FROM_FAV_CAP;
  send_msgs_cap = Messages.SEND_MSG_CAP;
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
  coupon=Messages.COUPONS_CAP;
  first_time_coupon = Messages.FIRST_TIME_COUPON;
  history_cap = Messages.HISTORY_CAP;
  no_people_ahead = Messages.NO_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  waitinglineCap = Messages.WAITINGLINE;
  get_token_cap = Messages.GET_FIRST_TOKEN;
  claim_my_business_cap = Messages.CLAIM_BUSINESS_CAP;
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
  isLinear = true;

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
  s3CouponList :any= {
  JC:[],OWN:[]
  };
 //  s3CouponList: any[] =[{'JC':[]}],[{'OWN':[]}];
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
  claimdialogRef;
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
  userType = '';
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
  pSource;
  apptfirstArray: any = [];
  apptTempArray: any = [];
  showType = 'more';
  futureAllowed = true;
  galleryenabledArr = [];
  // gallerydisabledArr = [];
  onlinePresence = false;
  extra_img_count: number;
  bgCover: any;
  donationServices: any;
  serviceCount: any;
  servicesAndProviders: any[];
  userCount: any;
  selectedLocation: any;
  catlog: any;
  catalogItem: any;
  order_count: number;
  price: number;
  orderList: any = [];
  counter = 0;
  itemCount: any;
  orderItems: any[];
  itemQty: number;
  activeCatalog: any;
  service_cap = 'Services and Consultations';
  orderstatus: any;
  shoppinglistdialogRef;
  choose_type = 'store';
  store_pickup: boolean;
  home_delivery: boolean;
  sel_checkindate;
  deliveryCharge = 0;
  nextAvailableTime;
  advance_amount: any;
  orderType = '';
  dotor_specialization_hint = Messages.DOCTORS_SPECIALIZATION_HINT;
  accountEncId: string;
  userEncId: string;
  locId;
  bsModalRef: BsModalRef;
  qrdialogRef: any;
  wndw_path = projectConstants.PATH;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  checkinProviderList: any;
  activeUser: any;
  nonfirstCouponCount=0;
  constructor(
    private activaterouterobj: ActivatedRoute,
    // private providerdetailserviceobj: ProviderDetailService,
    public sharedFunctionobj: SharedFunctions,
    private shared_services: SharedServices,
    private routerobj: Router,
    private dialog: MatDialog,
    private searchdetailserviceobj: SearchDetailServices,
    public router: Router,
    private locationobj: Location,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    public wordProcessor: WordProcessor,
    private domainConfigService: DomainConfigGenerator,
    private modalService: BsModalService,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    // this.domainList = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    // this.s3CouponList=new Array[2];
  }
  ngOnInit() {
    this.api_loading = true;
    this.userId = null;
    this.provider_id = null;
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.loc_details = this.lStorageService.getitemfromLocalStorage('ynw-locdet');
    this.jdnTooltip = this.wordProcessor.getProjectMesssages('JDN_TOOPTIP');
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
      if (qparams.userId) {
        this.userId = qparams.userId;
      }
      if (qparams.src) {
        this.pSource = qparams.src;
      }
      if (qparams.locId) {
        this.locId = qparams.locId;
      }
      this.businessjson = [];
      this.servicesjson = [];
      this.apptServicesjson = [];
      this.apptfirstArray = [];
      this.apptTempArray = [];
      this.donationServicesjson = [];
      this.image_list_popup = [];
      this.galleryjson = [];
      this.deptUsers = [];
      this.catalogimage_list_popup = [];
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
    this.domainConfigService.getDomainList();
    this.activaterouterobj.paramMap
      .subscribe(params => {

        this.accountEncId = params.get('id');

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
              }
            )
          }
        )
        // this.provider_id = params.get('id');
        // const customId = params.get('id').replace(/\s/g, '');

        // const inputValues = customId.split('___');

        // if (inputValues.length > 1) {
        //   this.provider_id = inputValues[0];
        //   this.userId = inputValues[1];
        //   this.gets3curl();
        // } else {
        //   this.shared_services.getBusinessUniqueId(customId).subscribe(
        //     id => {
        //       this.provider_id = id;
        //       this.gets3curl();
        //     },
        //     error => {
        //       this.provider_id = customId;
        //       this.gets3curl();
        //     }
        //   );
        // }
      });
  }
  getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getBusinessUniqueId(encId).subscribe(
        (id) => {
          resolve(id);
        },
        error => {
          resolve(encId);
        }
      );
    });
  }

  isfirstCheckinOfferProvider(){
  let firstCheckin = true;
    if (this.activeUser) {
      this.checkinProviderList = this.activeUser.checkedInProviders;
      if (this.checkinProviderList.length > 0) {
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
    this.retval = this.sharedFunctionobj.getS3Url('provider')
      .then(
        (res:any) => {
          this.s3url = res;
          this.getbusinessprofiledetails_json('settings', true);
          this.getbusinessprofiledetails_json('terminologies', true);
          this.getbusinessprofiledetails_json('coupon', true);
          this.getbusinessprofiledetails_json('providerCoupon', true);
          // this.getbusinessprofiledetails_json('jaldeediscount', true);
          if (this.userId) {
            this.getUserbusinessprofiledetails_json('providerBusinessProfile', this.userId, true);
          } else {
            this.getbusinessprofiledetails_json('businessProfile', true);
            this.getbusinessprofiledetails_json('virtualFields', true);
            this.getbusinessprofiledetails_json('services', true);
            this.getbusinessprofiledetails_json('apptServices', true);
            this.getbusinessprofiledetails_json('donationServices', true);
          }
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }
  // gets the various json files based on the value of "section" parameter
  // Some of functions copied to Consumer Home also.
  getbusinessprofiledetails_json(section, modDateReq: boolean) {
    this.showServices = false;
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe((res :any)=> {
        switch (section) {
          case 'businessProfile': {
            this.onlinePresence = res['onlinePresence'];
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
            this.business_exists = true;

            this.provider_bussiness_id = this.businessjson.id;
            if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
              if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
                this.bLogo = this.businessjson.logo.url + '?' + new Date();
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
            this.getbusinessprofiledetails_json('gallery', true);
            if (this.userType === 'consumer') {
              this.getFavProviders();
            }
            const holdbName = this.businessjson.businessDesc || '';
            const maxCnt = 250;
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
            this.getbusinessprofiledetails_json('location', true);
            break;
          }
          case 'services': {
            this.servicesjson = res;
            if (this.servicesjson[0] && this.servicesjson[0].hasOwnProperty('departmentName')) {
              this.showDepartments = true;
              break;
            }
            break;
          }
          case 'apptServices': {
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
            break;
          }
          case 'gallery': {
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
              // this.galleryenabledArr.push(0);
            }
            // for (let i = 0; i < this.galleryjson.length; i++) {
            //   this.galleryenabledArr.push(i);
            // }
            for (let i = 0; i < this.tempgalleryjson.length; i++) {
              this.galleryjson[(i + indx)] = this.tempgalleryjson[i];
              // if (this.galleryenabledArr.length < 5) {
              //   this.galleryenabledArr.push(i + indx);
              // }
            }
            // const count = 5 - this.galleryenabledArr.length;
            // if (count > 0) {
            //   for (let ind = 0; ind < count; ind++) {
            //     this.gallerydisabledArr.push(ind);
            //   }
            // }
            // this.gallery_exists = true;
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
            const imgLength = this.image_list_popup.length > 5 ? 5 : this.image_list_popup.length;
            for (let i = 0; i < imgLength; i++) {
              this.galleryenabledArr.push(i);
            }
            break;
          }
          case 'settings': {
            this.settingsjson = res;
            this.showToken = this.settingsjson.showTokenId;
            this.settings_exists = true;
            this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
            this.maxsize = this.settingsjson.maxPartySize;
            if (this.maxsize === undefined) {
              this.maxsize = 1;
            }
            this.showDepartments = this.settingsjson.filterByDept;
            break;
          }
          case 'location': {
            this.locationjson = res;
            if (this.account_Type === 'BRANCH') {
              this.getbusinessprofiledetails_json('departmentProviders', true);
            }
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
     
            if (this.locId) {
              const location = this.locationjson.filter(loc => loc.id === JSON.parse(this.locId));
              this.changeLocation(location[0]);
            } else {
              this.changeLocation(this.locationjson[0]);
            }
            this.api_loading = false;
            break;
          }
          case 'terminologies': {
            this.terminologiesjson = res;
            break;
          }
          case 'coupon': {
            if(res!==undefined){
              this.s3CouponList.JC=res;
            }else{
              this.s3CouponList.JC=[];
            }
            this.firstChckinCuponCunt(this.s3CouponList);
            this.nonfirstPresent(this.s3CouponList);
            break;
          }
          case 'providerCoupon': {
            if(res!==undefined){
              this.s3CouponList.OWN=res;
            }else{
              this.s3CouponList.OWN=[];
            }
            this.firstChckinCuponCunt(this.s3CouponList);
            this.nonfirstPresent(this.s3CouponList);
            break;
          }
          case 'virtualFields': {
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
            break;
          }
          case 'donationServices': {
            this.donationServicesjson = res;
            break;
          }
          case 'departmentProviders': {
            this.deptUsers = res;
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
            this.getUserWaitingTime(waitTimearr);
            this.getUserApptTime(apptTimearr);
            break;
          }
          case 'jaldeediscount':
            this.jaldeediscountJson = res;
            this.jdnlength = Object.keys(this.jaldeediscountJson).length;
        }
      },
        (error) => {
          if (section === 'businessProfile') {
            this.routerobj.navigate(['/not-found']);
          }
          if (section === 'gallery') {
            this.galleryjson = [];
            if (this.bLogo !== '../../../assets/images/img-null.svg') {
              this.galleryExists = true;
              this.image_list_popup = [];
              this.galleryjson[0] = { keyName: 'logo', caption: '', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
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
          if (section === 'coupon') {
            this.s3CouponList.JC=[];
          }
          if (section === 'providerCoupon') {
            this.s3CouponList.OWN=[];
          }
        
       
        }
      );
  }
  getUserApptTime(provids_locid) {
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
        });
    }
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
  getUserbusinessprofiledetails_json(section, userId, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getUserbusinessprofiledetails_json(this.provider_id, userId, this.s3url, section, UTCstring)
      .subscribe((res: any) => {
        switch (section) {
          case 'providerBusinessProfile': {
            this.socialMedialist = [];
            this.businessjson = res;
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
                this.bLogo = this.businessjson.logo.url + '?' + new Date();
                this.galleryjson[0] = { keyName: 'logo', caption: '', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
              }
            } else {
              // this.bLogo = '';
              this.bLogo = '../../../assets/images/img-null.svg';
            }
            this.image_list_popup = [];
            if (this.galleryjson.length > 0) {
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
            this.getUserbusinessprofiledetails_json('providerVirtualFields', this.userId, true);
            this.getUserbusinessprofiledetails_json('providerservices', this.userId, true);
            this.getUserbusinessprofiledetails_json('providerApptServices', this.userId, true);
            this.getbusinessprofiledetails_json('location', true);
            // this.api_loading = false;
            break;
          }
          case 'providerVirtualFields': {
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
            break;
          }
          case 'providerservices': {
            // this.showDepartments = this.settingsjson.filterByDept;
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
            break;
          }
          case 'providerApptServices': {
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
            break;
        }
      },
        () => {
        });
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
  redirectToHistory() {
    if (this.sharedFunctionobj.checkLogin()) {
      this.routerobj.navigate(['consumer', 'checkin', 'history'], { queryParams: { accountId: this.businessjson.id } });
    } else { // show consumer login
      const passParam = { callback: 'history' };
      this.doLogin('consumer', passParam);
    }
  }
  getInboxUnreadCnt() {
    const usertype = 'consumer';
    this.shared_services.getInboxUnreadCount(usertype)
      .subscribe(data => {
        this.inboxCntFetched = true;
        this.inboxUnreadCnt = data;
      },
        () => {
        });
  }
  communicateHandler() {
    const providforCommunicate = this.provider_bussiness_id;
    // check whether logged in as consumer
    if (this.sharedFunctionobj.checkLogin()) {
      this.showCommunicate(providforCommunicate);
    } else { // show consumer login
      const passParam = { callback: 'communicate', providerId: providforCommunicate, provider_name: name };
      this.doLogin('consumer', passParam);
    }
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
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        // caption: 'Enquiry',
        user_id: provid,
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
  getFavProviders(mod?) {
    if (mod) {
      this.handle_Fav(mod);
    } else {
      this.shared_services.getFavProvider()
        .subscribe(data => {
          this.favprovs = data;
          if (this.favprovs.length !== 0) {
            const provider = this.favprovs.filter(fav => fav.id === this.provider_bussiness_id);
            if (provider.length !== 0) {
              this.isInFav = true;
            }
          }
        }, error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        });
    }
  }
  handle_Fav(mod) {
    if (this.sharedFunctionobj.checkLogin()) {
      const accountid = this.provider_bussiness_id;
      if (mod === 'add' && !this.isInFav) {
        this.shared_services.addProvidertoFavourite(accountid)
          .subscribe(() => {
            this.isInFav = true;
          },
            error => {
              this.wordProcessor.apiErrorAutoHide(this, error);
            });
      } else if (mod === 'remove') {
        this.shared_services.removeProviderfromFavourite(accountid)
          .subscribe(() => {
            this.isInFav = false;
          },
            error => {
              this.wordProcessor.apiErrorAutoHide(this, error);
            });
      }
    } else {
      const passParam = { callback: 'fav' };
      this.doLogin('consumer', passParam);
    }
  }
  doRemoveFav() {
    this.remdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to remove this provider from your favourite list?'
      }
    });
    this.remdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handle_Fav('remove');
      }
    });
  }
  checkinClicked(location, service) {
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
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      this.showCheckin(location.id, location.place, location.googleMapUrl, service.serviceAvailability.availableDate, service, 'consumer');
    } else if (this.userType === '') {
      const passParam = { callback: '', current_provider: current_provider };
      this.doLogin('consumer', passParam);
    }
  }
  appointmentClicked(location, service: any) {
    this.futureAllowed = true;
    const current_provider = {
      'id': location.id,
      'place': location.place,
      'location': location,
      'service': service,
      'cdate': service.serviceAvailability.nextAvailableDate
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
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      this.showAppointment(location.id, location.place, location.googleMapUrl, service.serviceAvailability.nextAvailableDate, service, 'consumer');
    } else if (this.userType === '') {
      const passParam = { callback: 'appointment', current_provider: current_provider };
      this.doLogin('consumer', passParam);
    }
  }
  doLogin(origin?, passParam?) {
    // this.snackbarService.openSnackBar('You need to login to check in');
    const current_provider = passParam['current_provider'];
    // let is_test_account = null;
    // if (current_provider) {
    //   if (current_provider.test_account === '1') {
    const is_test_account = true;
    //   } else {
    //     is_test_account = false;
    //   }
    // }
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
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
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          this.getFavProviders();
          this.showCommunicate(passParam['providerId']);
        } else if (passParam['callback'] === 'history') {
          this.redirectToHistory();
        } else if (passParam['callback'] === 'fav') {
          this.getFavProviders(passParam['mod']);
        } else if (passParam['callback'] === 'donation') {
          this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        } else if (passParam['callback'] === 'appointment') {
          this.showAppointment(current_provider['id'], current_provider['place'], current_provider['location']['googlemapUrl'], current_provider['cdate'], 'consumer');
        } else if (passParam['callback'] === 'order') {
          if (this.orderType === 'SHOPPINGLIST') {
            this.shoppinglistupload();
          } else {
            this.checkout();
          }
        } else {
          this.getFavProviders();
          this.showCheckin(current_provider['id'], current_provider['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], 'consumer');
        }
      } else if (result === 'showsignup') {
        this.doSignup(passParam);
      }
    });
  }
  doSignup(passParam?) {
    const current_provider = passParam['current_provider'];
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'false',
        moreParams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          this.showCommunicate(passParam['providerId']);
        } else if (passParam['callback'] === 'history') {
          this.redirectToHistory();
        } else if (passParam['callback'] === 'fav') {
          this.getFavProviders(passParam['mod']);
        } else if (passParam['callback'] === 'donation') {
          this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        } else if (passParam['callback'] === 'appointment') {
          this.showAppointment(current_provider['id'], current_provider['place'], current_provider['location']['googlemapUrl'], current_provider['cdate'], 'consumer');
        } else if (passParam['callback'] === 'order') {
          if (this.orderType === 'SHOPPINGLIST') {
            this.shoppinglistupload();
          } else {
            this.checkout();
          }
        } else {
          this.showCheckin(current_provider['id'], current_provider['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], 'consumer');
        }
      }
    });
  }
  showCheckin(locid, locname, gMapUrl, curdate, service: any, origin?) {

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
      service_id: service.id
    };
    if (service['department']) {
      queryParam['dept'] = service['department'];
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.router.navigate(['consumer', 'checkin'], navigationExtras);
  }
  showAppointment(locid, locname, gMapUrl, curdate, service: any, origin?) {
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
      sel_date: curdate
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
  // Edited//
  handlesearchClick() {
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
  // Edited//
  showExistingCheckin(locId, locName, index) {
    this.extChecindialogRef = this.dialog.open(ExistingCheckinComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        locId: locId,
        locName: locName,
        terminologies: this.terminologiesjson,
        settings: this.settingsjson
      }
    });

    this.extChecindialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getExistingCheckinsByLocation(locId, index);
      }
    });
  }


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

    const initialState = {
      data: servData
    };

    this.bsModalRef = this.modalService.show(ServiceDetailComponent, {
      initialState,
      class: 'commonpopupmainclass popup-class specialclass serv-detail-modal',
      backdrop: "static"
    });

    $('modal-container:has(.serv-detail-modal)').addClass('serv-detail-modal-container');

    /*     this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
          disableClose: true,
          data: servData
        });
        this.servicedialogRef.afterClosed().subscribe(() => {
        }); */

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

  claimBusiness() {
    const myidarr = this.businessjson.id;
    if (myidarr) {
      this.searchdetailserviceobj.getClaimmable(myidarr)
        .subscribe(data => {
          const claimdata = data;
          const pass_data = {
            accountId: myidarr,
            sector: claimdata['sector'],
            subSector: claimdata['subSector']
          };
          this.SignupforClaimmable(pass_data);
        }, error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    } else {
    }
  }
  SignupforClaimmable(passData) {
    this.claimdialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'true',
        claimData: passData
      }
    });
    this.claimdialogRef.afterClosed().subscribe(result => {
    });
  }
  payClicked(locid, locname, cdate, service) {
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      this.showDonation(locid, cdate, service);
    } else if (this.userType === '') {
      const passParam = { callback: 'donation', loc_id: locid, date: cdate, service: service };
      this.doLogin('consumer', passParam);
    }
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
    // const account = this.provider_id + '___' + userId;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        src: 'bp'
      }
    };
    this.routerobj.navigate([this.accountEncId, userId], navigationExtras);
    // this.routerobj.navigate([account], navigationExtras);
    // this.routerobj.navigate([this.provider_id], { queryParams: { userId: userId, pId: this.businessjson.id, psource: 'details-page' } });
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
  getContactInfo(phonelist, emaillist) {
    const contactinfo = [];
    if ((phonelist && phonelist.length > 0) || (emaillist && emaillist.length > 0)) {
      if (phonelist.length > 0) {
        for (let i = 0; i < phonelist.length; i++) {
          contactinfo.push(phonelist[i].instance + '-' + this.phonelist[i].label);
        }
      }
      if (emaillist && emaillist.length > 0) {
        for (let i = 0; i < emaillist.length; i++) {
          contactinfo.push(emaillist[i].instance + '-' + emaillist[i].label);
        }
      }
    }
    return contactinfo;
  }

  showContactInfo(phonelist, emaillist) {
    const contactinfo = [];
    if ((phonelist && phonelist.length > 0) || (emaillist && emaillist.length > 0)) {
      if (phonelist.length > 0) {
        for (let i = 0; i < phonelist.length; i++) {
          contactinfo.push(phonelist[i].instance + '-' + this.phonelist[i].label + '<br/>');
        }
      }
      if (emaillist && emaillist.length > 0) {
        for (let i = 0; i < emaillist.length; i++) {
          contactinfo.push(emaillist[i].instance + '-' + emaillist[i].label + '<br/>');
        }
      }
    }
    this.dialog.open(VisualizeComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'displayContent': contactinfo
      }
    });
  }
  showMoreInfo() {
    this.showMore = !this.showMore;
  }
  goBack() {
    this.userId = null;
    this.pSource = null;
    if (this.userId) {
      this.router.navigate(['/']);
    } else {
      this.locationobj.back();
    }
  }
  getPic(user) {
    if (user.profilePicture) {
      return JSON.parse(user.profilePicture)['url'];
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
    this.servicesAndProviders = [];
    const servicesAndProviders = [];
    this.donationServices = [];
    this.serviceCount = 0;
    this.userCount = 0;
    this.getWaitlistServices(locationId)
      .then((wlServices: any) => {
        this.getAppointmentServices(locationId)
          .then((apptServices: any) => {
            if (this.showDepartments) {
              if (this.userId) {
                for (let aptIndex = 0; aptIndex < apptServices.length; aptIndex++) {
                  if (apptServices[aptIndex]['provider'] && apptServices[aptIndex]['provider']['id'] === this.userId && apptServices[aptIndex].serviceAvailability) {
                    servicesAndProviders.push({ 'type': 'appt', 'item': apptServices[aptIndex] });
                    this.serviceCount++;
                  }
                }
                for (let wlIndex = 0; wlIndex < wlServices.length; wlIndex++) {
                  if (wlServices[wlIndex]['provider'] && wlServices[wlIndex]['provider']['id'] === this.userId && wlServices[wlIndex].serviceAvailability) {
                    servicesAndProviders.push({ 'type': 'waitlist', 'item': wlServices[wlIndex] });
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
                  for (let aptIndex = 0; aptIndex < apptServices.length; aptIndex++) {
                    if (!apptServices[aptIndex]['provider'] && apptServices[aptIndex].serviceAvailability && deptItem['departmentId'] === apptServices[aptIndex].department) {
                      deptItem['departmentItems'].push({ 'type': 'appt', 'item': apptServices[aptIndex] });
                      this.serviceCount++;
                    }
                  }
                  for (let wlIndex = 0; wlIndex < wlServices.length; wlIndex++) {
                    if (!wlServices[wlIndex]['provider'] && wlServices[wlIndex].serviceAvailability && deptItem['departmentId'] === wlServices[wlIndex].department) {
                      deptItem['departmentItems'].push({ 'type': 'waitlist', 'item': wlServices[wlIndex] });
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
                for (let aptIndex = 0; aptIndex < apptServices.length; aptIndex++) {
                  if (apptServices[aptIndex]['provider'] && apptServices[aptIndex]['provider']['id'] === this.userId && apptServices[aptIndex].serviceAvailability) {
                    servicesAndProviders.push({ 'type': 'appt', 'item': apptServices[aptIndex] });
                    this.serviceCount++;
                  }
                }
                for (let wlIndex = 0; wlIndex < wlServices.length; wlIndex++) {
                  if (wlServices[wlIndex]['provider'] && wlServices[wlIndex]['provider']['id'] === this.userId && wlServices[wlIndex].serviceAvailability) {
                    servicesAndProviders.push({ 'type': 'waitlist', 'item': wlServices[wlIndex] });
                    this.serviceCount++;
                  }
                }
              } else {
                for (let aptIndex = 0; aptIndex < apptServices.length; aptIndex++) {
                  if (!apptServices[aptIndex]['provider'] && apptServices[aptIndex].serviceAvailability) {
                    servicesAndProviders.push({ 'type': 'appt', 'item': apptServices[aptIndex] });
                    this.serviceCount++;
                  }
                }
                for (let wlIndex = 0; wlIndex < wlServices.length; wlIndex++) {
                  if (!wlServices[wlIndex]['provider'] && wlServices[wlIndex].serviceAvailability) {
                    servicesAndProviders.push({ 'type': 'waitlist', 'item': wlServices[wlIndex] });
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
          },
            error => {
              this.wordProcessor.apiErrorAutoHide(this, error);
            });
      },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        });
    if (this.businessjson.donationFundRaising && this.onlinePresence && this.donationServicesjson.length >= 1) {
      for (let dIndex = 0; dIndex < this.donationServicesjson.length; dIndex++) {
        this.donationServices.push({ 'type': 'donation', 'item': this.donationServicesjson[dIndex] });
        this.serviceCount++;
      }
    }
  }
  changeLocation(loc) {
    this.selectedLocation = loc;
    this.generateServicesAndDoctorsForLocation(this.provider_id, this.selectedLocation.id);
    this.shared_services.getOrderSettings(this.provider_bussiness_id).subscribe(
      (settings: any) => {
        this.orderstatus = settings.enableOrder;
        this.getCatalogs(this.provider_bussiness_id);
      }
    );
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
    } else if (actionObj['type'] === 'item') {
      if (actionObj['action'] === 'view') {
        this.itemDetails(actionObj['service']);
      } else if (actionObj['action'] === 'add') {
        this.increment(actionObj['service']);
      } else if (actionObj['action'] === 'remove') {
        this.decrement(actionObj['service']);
      }
    } else {
      this.providerDetClicked(actionObj['userId']);
    }
  }


  /**
   * Order Related Code
   */

  getCatalogs(bprovider_id) {
    const account_Id = this.provider_bussiness_id;
    this.shared_services.setaccountId(account_Id);
    this.orderItems = [];
    if (this.orderstatus && this.userId == null) {
      this.shared_services.getConsumerCatalogs(account_Id).subscribe(
        (catalogs: any) => {
          if (catalogs.length !== 0) {
            this.catalog_loading = true;
            this.activeCatalog = catalogs[0];
            this.orderType = this.activeCatalog.orderType;
            if (this.activeCatalog.catalogImages && this.activeCatalog.catalogImages[0]) {
              this.catalogImage = this.activeCatalog.catalogImages[0].url;
              this.catalogimage_list_popup = [];
              const imgobj = new Image(0,
                { // modal
                  img: this.activeCatalog.catalogImages[0].url,
                  description: ''
                });
              this.catalogimage_list_popup.push(imgobj);
            }
            // this.updateLocalStorageItems();
            this.catlogArry();
            this.advance_amount = this.activeCatalog.advanceAmount;
            if (this.activeCatalog.pickUp) {
              if (this.activeCatalog.pickUp.orderPickUp && this.activeCatalog.nextAvailablePickUpDetails) {
                this.store_pickup = true;
                this.choose_type = 'store';
                this.sel_checkindate = this.activeCatalog.nextAvailablePickUpDetails.availableDate;
                this.nextAvailableTime = this.activeCatalog.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.activeCatalog.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
              }
            }
            if (this.activeCatalog.homeDelivery) {
              if (this.activeCatalog.homeDelivery.homeDelivery && this.activeCatalog.nextAvailableDeliveryDetails) {
                this.home_delivery = true;

                if (!this.store_pickup) {
                  this.choose_type = 'home';
                  this.deliveryCharge = this.activeCatalog.homeDelivery.deliveryCharge;
                  this.sel_checkindate = this.activeCatalog.nextAvailableDeliveryDetails.availableDate;
                  this.nextAvailableTime = this.activeCatalog.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.activeCatalog.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
                }
              }
            }
            this.shared_services.setOrderDetails(this.activeCatalog);
            for (let itemIndex = 0; itemIndex < this.activeCatalog.catalogItem.length; itemIndex++) {
              const catalogItemId = this.activeCatalog.catalogItem[itemIndex].id;
              const minQty = this.activeCatalog.catalogItem[itemIndex].minQuantity;
              const maxQty = this.activeCatalog.catalogItem[itemIndex].maxQuantity;
              const showpric = this.activeCatalog.showPrice;
              if (this.activeCatalog.catalogItem[itemIndex].item.isShowOnLandingpage) {
                this.orderItems.push({ 'type': 'item', 'minqty': minQty, 'maxqty': maxQty, 'id': catalogItemId, 'item': this.activeCatalog.catalogItem[itemIndex].item, 'showpric': showpric });
                this.itemCount++;
              }
            }
            // this.orderItems = orderItems;
          }
        });
    }
  }



  // OrderItem add to cart
  addToCart(itemObj) {
    const item = itemObj.item;
    const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (spId === null) {
      this.orderList = [];
      this.lStorageService.setitemonLocalStorage('order_spId', this.provider_bussiness_id);
      this.orderList.push(itemObj);
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.getTotalItemAndPrice();
      this.getItemQty(item);
    } else {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (spId !== this.provider_bussiness_id) {
          if (this.getConfirmation()) {
            this.lStorageService.removeitemfromLocalStorage('order');
          }
        } else {
          this.orderList.push(itemObj);
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
          this.getTotalItemAndPrice();
          this.getItemQty(item);
        }
      } else {
        this.orderList.push(itemObj);
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
        this.getTotalItemAndPrice();
        this.getItemQty(item);
      }
    }

  }


  getConfirmation() {
    let can_remove = false;
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': '  All added items in your cart for different Provider will be removed ! '
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        can_remove = true;
        this.orderList = [];
        this.lStorageService.removeitemfromLocalStorage('order_sp');
        this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
        this.lStorageService.removeitemfromLocalStorage('order_spId');
        this.lStorageService.removeitemfromLocalStorage('order');
        return true;
      } else {
        can_remove = false;

      }
    });
    return can_remove;
  }
  removeFromCart(itemObj) {
    const item = itemObj.item;

    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        if (this.orderList.length > 0 && this.orderList !== null) {
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
        } else {
          this.lStorageService.removeitemfromLocalStorage('order_sp');
          this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
          this.lStorageService.removeitemfromLocalStorage('order_spId');
          this.lStorageService.removeitemfromLocalStorage('order');
        }

        break;
      }
    }
    this.getTotalItemAndPrice();
  }
  getTotalItemAndPrice() {
    this.price = 0;
    this.order_count = 0;
    for (const itemObj of this.orderList) {
      let item_price = itemObj.item.price;
      if (itemObj.item.showPromotionalPrice) {
        item_price = itemObj.item.promotionalPrice;
      }
      const totalPrice = this.price + item_price;
      this.price = totalPrice;
      this.order_count = this.order_count + 1;
    }
  }
  checkout() {
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      let blogoUrl;
      if (this.businessjson.logo) {
        blogoUrl = this.businessjson.logo.url;
      } else {
        blogoUrl = '';
      }
      const businessObject = {
        'bname': this.businessjson.businessName,
        'blocation': this.locationjson[0].place,
        'logo': blogoUrl
      };
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
      const navigationExtras: NavigationExtras = {
        queryParams: {
          account_id: this.provider_bussiness_id,
          unique_id: this.provider_id,
        }
      };
      this.router.navigate(['order/shoppingcart'], navigationExtras);

    } else if (this.userType === '') {
      const passParam = { callback: 'order' };
      this.doLogin('consumer', passParam);
    }


  }
  itemDetails(item) {
    let blogoUrl;
    if (this.businessjson.logo) {
      blogoUrl = this.businessjson.logo.url;
    } else {
      blogoUrl = '';
    }
    const businessObject = {
      'bname': this.businessjson.businessName,
      'blocation': this.locationjson[0].place,
      'logo': blogoUrl
    };
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        item: JSON.stringify(item),
        providerId: this.provider_bussiness_id,
        showpric: this.activeCatalog.showPrice,
        businessDetails: businessObject

      }

    };
    this.router.navigate(['order', 'item-details'], navigationExtras);
    // this.router.navigate(['consumer', 'order', 'item-details']);
  }
  increment(item) {
    this.addToCart(item);
  }

  decrement(item) {
    this.removeFromCart(item);
  }
  getItemQty(itemObj) {
    let qty = 0;
    if (this.orderList !== null && this.orderList.filter(i => i.item.itemId === itemObj.itemId)) {
      qty = this.orderList.filter(i => i.item.itemId === itemObj.itemId).length;
    }
    return qty;
  }
  catlogArry() {
    if (this.lStorageService.getitemfromLocalStorage('order') !== null) {
      this.orderList = this.lStorageService.getitemfromLocalStorage('order');
    }
    this.getTotalItemAndPrice();
  }

  reset() {

  }
  showOrderFooter() {
    let showFooter = false;
    this.spId_local_id = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (this.spId_local_id !== null) {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (this.spId_local_id !== this.provider_bussiness_id) {
          showFooter = false;
        } else {
          showFooter = true;
        }
      }

    }
    return showFooter;
  }

  shoppinglistupload() {
    const chosenDateTime = {
      delivery_type: this.choose_type,
      catlog_id: this.activeCatalog.id,
      nextAvailableTime: this.nextAvailableTime,
      order_date: this.sel_checkindate,
      advance_amount: this.advance_amount,
      account_id: this.provider_bussiness_id

    };
    this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      let blogoUrl;
      if (this.businessjson.logo) {
        blogoUrl = this.businessjson.logo.url;
      } else {
        blogoUrl = '';
      }
      const businessObject = {
        'bname': this.businessjson.businessName,
        'blocation': this.locationjson[0].place,
        'logo': blogoUrl
      };
      // this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
      const navigationExtras: NavigationExtras = {
        queryParams: {

          providerId: this.provider_bussiness_id,
        }

      };
      this.router.navigate(['order', 'shoppingcart', 'checkout'], navigationExtras);
    } else if (this.userType === '') {
      const passParam = { callback: 'order' };
      this.doLogin('consumer', passParam);
    }
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

}
