import { Component, Inject, OnInit, HostListener, ViewChild } from '@angular/core';
import { Messages } from '../../../constants/project-messages';
import { SharedFunctions } from '../../../functions/shared-functions';
import { SharedServices } from '../../../services/shared-services';
import {
  AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, PlainGalleryConfig, PlainGalleryStrategy
} from '@ks89/angular-modal-gallery';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomainConfigGenerator } from '../../../services/domain-config-generator.service';
import { S3UrlProcessor } from '../../../services/s3-url-processor.service';
import { WordProcessor } from '../../../services/word-processor.service';
import { Location } from '@angular/common';
import { SearchDetailServices } from '../../search-detail/search-detail-services.service';
import { DateTimeProcessor } from '../../../services/datetime-processor.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { GroupStorageService } from '../../../services/group-storage.service';
// import { VirtualFieldsComponent } from '../../../../ynw_consumer/components/virtualfields/virtualfields.component';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ConsumerJoinComponent } from '../../../../ynw_consumer/components/consumer-join/join.component';
import { SignUpComponent } from '../../signup/signup.component';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../../../shared/services/auth-service';
import { CheckavailabilityComponent } from '../../checkavailability/checkavailability.component';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css']
})

export class ServiceViewComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  service_cap = Messages.SERVICE_CAP;
  duration_cap = Messages.DURATION_CAP;
  price_cap = Messages.PRICES_CAP;
  prepayment_amount = Messages.PREPAYMENT_AMOUNT_CAP;
  description_cap = Messages.DESCRIPTION_CAP;
  close_btn_cap = Messages.CLOSE_BTN;
  servc_detils = Messages.SERVCE_DETAILS;
  donation_dtls = Messages.DONATION_DETAILS;
  service_duration = Messages.SERVICE_DURATIONS_CAP;
  api_error = null;
  api_success = null;
  is_donation_serv = false;
  minutes: any;
  min = 0;
  hour = 0;
  HHMM: any;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
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
  image_list_popup: any = [];
  serviceGalleryPopup: any = [];
  busname: any;
  serviceid: string;
  accountEncId: string;
  provider_id: any;
  userId: string;
  domainList: any = [];
  accountProperties: any;
  screenWidth: number;
  small_device_display = false;
  profileSettings: any;
  theme: any;
  bLogo = '';
  galleryExists = false;
  location_exists = false;
  galleryjson: any = [];
  settingsjson: any = [];
  businessjson: any = [];
  servicesjson: any = [];
  apptServicesjson: any = [];
  donationServicesjson: any = [];
  showDepartments = false;
  apptSettingsJson: any = [];
  customId: any;
  accEncUid: any;
  businessId: any;
  accountId: any;
  businessName: any;
  bgCover: any;
  branch_id: any;
  account_Type: any;
  business_exists: boolean;
  provider_bussiness_id: any;
  bNameStart: any;
  bNameEnd: any;
  terminologiesjson: any;
  apptfirstArray: any = [];
  apptTempArray: any;
  galleryenabledArr: any[];
  tempgalleryjson: any;
  extra_img_count: number;
  imgLength: any;
  locationjson: any;
  deptUsers: any;
  subDomainList: any;
  selectedLocation: any;
  wlServices: any;
  apptServices: any;
  servicesAndProviders: any[];
  donationServices: any[];
  serviceCount: number;
  images:any;
  userCount: number;
  waitlisttime_arr: any;
  appttime_arr: any;
  onlinePresence: any;
  showmoreDesc = false;
  server_date;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  buttonCaption = '';
  changedate_req = false;
  userType: any;
  activeUser: any;
  futureAllowed = true;
  consumerVirtualinfo: any;
  servicename: any;
  deptname: any;
  servicedetails: any;
  sector: any;
  personsAheadText: string;
  timingCaption: string;
  timings: string;
  timingCaptionapt: string;
  timingsapt: string;
  accountIdExists = false;
  loading_direct = false;
  loading = true;
  source: any;
  showpreinfo = false;
  showpostinfo = false;
  checkavailabilitydialogref: any;
  extra_service_img_count: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    private routerobj: Router,
    private domainConfigService: DomainConfigGenerator,
    private s3Processor: S3UrlProcessor,
    public wordProcessor: WordProcessor,
    private locationobj: Location,
    private lStorageService: LocalStorageService,
    private searchdetailserviceobj: SearchDetailServices,
    private groupService: GroupStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    public sharedFunctionobj: SharedFunctions,
    private authService: AuthService,
  //  private observer: BreakpointObserver,
    private dialog: MatDialog,
    private activaterouterobj: ActivatedRoute) {
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
  customOptions: any = {
    dots: false,
    nav: true,
    navText: [
        '<i class="fa fa-angle-left fa-2x"  aria-hidden="true"></i>',
        '<i class="fa fa-angle-right fa-2x"  aria-hidden="true"></i>'
    ],
    autoplay: true,
    autoplayTimeout: 6000,
    autoplaySpeed: 1000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    autoWidth: true,
    loop: true,
    responsiveClass: true,
    responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 2 }, 1200: { items: 3 } }
}
  ngOnInit() {

    console.log("Image Galley :",this.galleryenabledArr)

    const _this = this;
    _this.accountIdExists = false;
    if (_this.sharedFunctionobj.isBusinessOwner()) {
      _this.authService.providerLogout().then(
        () => {
          _this.initPage();
        }
      )
    } else {
      _this.initPage();
    }
  }

  initPage () {
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.activaterouterobj.paramMap
      .subscribe(params => {
        this.serviceid = params.get('serid');
        this.accountEncId = params.get('id');
        if (params.get('userEncId')) {
          this.userId = params.get('userEncId');
        } else {
          this.userId = null;
        }       
        const _this = this;
        this.domainConfigService.getDomainList().then(
          (domainConfig) => {
            _this.domainList = domainConfig;
            this.getAccountIdFromEncId(_this.accountEncId).then(
              (id: any) => {
                _this.provider_id = id;      
                _this.customId = _this.accountEncId;
                _this.accEncUid = _this.accountEncId;     
                _this.accountIdExists = true;      
                _this.domainConfigService.getUIAccountConfig(_this.provider_id).subscribe(
                  (uiconfig: any) => {
                    _this.accountProperties = uiconfig;
                    if (_this.small_device_display) {
                      _this.profileSettings = _this.accountProperties['smallDevices'];
                    } else {
                      _this.profileSettings = _this.accountProperties['normalDevices'];
                    }
                    if (_this.accountProperties['theme']) {
                      _this.theme = _this.accountProperties['theme'];
                    }
                    _this.gets3curl();
                  }, (error: any) => {
                    _this.gets3curl();
                  }
                )
              }, (error) => {
                console.log(error);
              }
            );
          }
        )
      });
    this.activaterouterobj.queryParams.subscribe(qparams => {
      console.log(qparams);
      if (qparams.source) {
        this.source = qparams.source;
      }
    });
  }
  goBack() {
    this.locationobj.back();
    this.userId = null;
  }

  getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getBusinessUniqueId(encId).subscribe(
        (id) => {
          resolve(id);
        },
        error => {
          if (error.status === 404) {
            _this.routerobj.navigate(['/not-found']);
          }
          reject();
        }
      );
    });
  }
  
  gets3curl() {
    let accountS3List = 'settings,appointmentsettings,terminologies,coupon,providerCoupon,location';
    let userS3List = 'providerBusinessProfile,providerVirtualFields,providerservices,providerApptServices';
    if (!this.userId) {
      accountS3List += ',businessProfile,virtualFields,services,apptServices,donationServices,departmentProviders' //gallery
    }
    this.s3Processor.getJsonsbyTypes(this.provider_id,
      null, accountS3List).subscribe(
        (accountS3s) => {
          if (this.userId) {
            if (accountS3s['settings']) {
              this.processS3s('settings', accountS3s['settings']);
            }
            if (accountS3s['appointmentsettings']) {
              this.processS3s('appointmentsettings', accountS3s['appointmentsettings']);
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
            if (accountS3s['appointmentsettings']) {
              this.processS3s('appointmentsettings', accountS3s['appointmentsettings']);
            }
            if (accountS3s['terminologies']) {
              this.processS3s('terminologies', accountS3s['terminologies']);
            }
            if (accountS3s['location']) {
              this.processS3s('location', accountS3s['location']);
            }
            if (accountS3s['businessProfile']) {
              this.processS3s('businessProfile', accountS3s['businessProfile']);
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
      case 'appointmentsettings': {
        this.apptSettingsJson = [];
        this.apptSettingsJson = result;
        break;
      }
      case 'terminologies': {
        this.terminologiesjson = result;
        this.wordProcessor.setTerminologies(this.terminologiesjson);
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
      case 'donationServices': {
        this.donationServicesjson = result;
        for (let dIndex = 0; dIndex < this.donationServicesjson.length; dIndex++) {
          if (this.donationServicesjson[dIndex]['id'] == this.serviceid) {
            this.is_donation_serv =true;
            this.servicename = this.donationServicesjson[dIndex]['name'];
            this.servicedetails = this.donationServicesjson[dIndex];
            console.log("Donation:");
            this.setServiceGallery(this.servicedetails);
          }
        }
        break;
      }
      case 'departmentProviders': {
        this.deptUsers = result;
        break;
      }
      case 'providerBusinessProfile': {
        this.setUserBusinessProfile(result);
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
  setServiceGallery(servicedetails: any) {
    console.log(servicedetails);
    this.serviceGalleryPopup = [];
    if (servicedetails.servicegallery && servicedetails.servicegallery.length > 0) {
      if (servicedetails.servicegallery.length > 5) {
        this.extra_service_img_count = servicedetails.servicegallery.length - 5;
      }
        for (let i = 0; i < servicedetails.servicegallery.length; i++) {
          const imgobj = new Image(
            i,
            { // modal
              img: servicedetails.servicegallery[i].url,
              description: servicedetails.servicegallery.caption || ''
            });
          this.serviceGalleryPopup.push(imgobj);
        }
      }
  }
  showDesc() {
    if (this.showmoreDesc) {
      this.showmoreDesc = false;
    } else {
      this.showmoreDesc = true;
    }
  }
  setBusinesssProfile(res) {
    this.onlinePresence = res['onlinePresence'];
    this.accEncUid = res['accEncUid'];
    const custID = res['customId'] ? res['customId']:res['accEncUid'];
    this.customId = custID;
    this.lStorageService.setitemonLocalStorage('customId', custID);
    this.lStorageService.setitemonLocalStorage('accountId', res['id']);
    if (!this.userId) {
      this.businessjson = res;
      console.log("business",this.businessjson)

      this.sector = this.businessjson.serviceSector.domain;
      this.businessId = this.accEncUid;
      this.accountId = this.businessjson.id;
      this.businessName = this.businessjson.businessName;
      if (this.businessjson.cover) {
        this.bgCover = this.businessjson.cover.url;
      }
      this.branch_id = this.businessjson.branchId;
      this.account_Type = this.businessjson.accountType;
      this.business_exists = true;
      this.provider_bussiness_id = this.businessjson.id;
      if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
        if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
          this.bLogo = this.businessjson.logo.url;
        }
      } else {
        this.bLogo = '../../../assets/images/img-null.svg';
      }
      const holdbName = this.businessjson.businessDesc || '';
      const maxCnt = 120;
      if (holdbName.length > maxCnt) {
        this.bNameStart = holdbName.substr(0, maxCnt);
        this.bNameEnd = holdbName.substr(maxCnt, holdbName.length);
      } else {
        this.bNameStart = holdbName;
      }
    }
  }
  setUserBusinessProfile(res) {
    this.businessjson = res;
    this.sector = this.businessjson.serviceSector.domain;
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
      }
    } else {
      this.bLogo = '../../../assets/images/img-null.svg';
    }
    const holdbName = this.businessjson.businessDesc || '';
    const maxCnt = 120;
    if (holdbName.length > maxCnt) {
      this.bNameStart = holdbName.substr(0, maxCnt);
      this.bNameEnd = holdbName.substr(maxCnt, holdbName.length);
    } else {
      this.bNameStart = holdbName;
    }
  }
  setAccountLocations(res) {
    this.locationjson = res;
    console.log(this.locationjson);
    this.location_exists = true;
    let location;
    for (let i = 0; i < this.locationjson.length; i++) {
      const addres = this.locationjson[i].address;
      const place = this.locationjson[i].place;
      if (addres && addres.includes(place)) {
        this.locationjson['isPlaceisSame'] = true;
      } else {
        this.locationjson['isPlaceisSame'] = false;
      }
      if(this.locationjson[i].baseLocation){
        console.log("gf"+JSON.stringify(this.locationjson[i]));
         location = this.locationjson[i];
      }
      if (this.locationjson[i].parkingType) {
        this.locationjson[i].parkingType = this.locationjson[i].parkingType.charAt(0).toUpperCase() + this.locationjson[i].parkingType.substring(1);
      }
    }
    this.changeLocation(location);
  }
  changeLocation(loc) {
    this.selectedLocation = loc;
    this.generateServicesAndDoctorsForLocation(this.provider_id, this.selectedLocation.id);
  }
  generateServicesAndDoctorsForLocation(providerId, locationId) {
    const _this = this;
    _this.loading = true;
    _this.getWaitlistServices(locationId)
      .then((wlServices: any) => {
        _this.wlServices = wlServices;
        for (let aptIndex = 0; aptIndex < _this.wlServices.length; aptIndex++) {
          if (_this.wlServices[aptIndex]['id'] == _this.serviceid && _this.wlServices[aptIndex].serviceAvailability) {
            _this.servicename = _this.wlServices[aptIndex]['name'];
            _this.servicedetails = _this.wlServices[aptIndex];
            console.log("Waitlist:");
            _this.setServiceGallery(_this.servicedetails);
            console.log("detailswait" + JSON.stringify(_this.servicedetails));
           if (_this.servicedetails.serviceAvailability['personAhead'] >= 0) {
            _this.personsAheadText = 'People in line : ' + _this.servicedetails.serviceAvailability['personAhead'];
            }
            _this.getduration(_this.servicedetails);
            if (_this.servicedetails.serviceAvailability['calculationMode'] !== 'NoCalc') {
              if (_this.servicedetails.serviceAvailability['serviceTime']) {
                _this.timingCaption = 'Next Available Time';
                _this.timings = _this.getAvailibilityForCheckin(_this.servicedetails.serviceAvailability['availableDate'], _this.servicedetails.serviceAvailability['serviceTime']);
              } else {
                _this.timingCaption = 'Est Wait Time';
                _this.timings = _this.getTimeToDisplay(_this.servicedetails.serviceAvailability['queueWaitingTime']);
              }
            }
            if (_this.wlServices[aptIndex]['deptName']) {
              _this.deptname = _this.wlServices[aptIndex]['deptName'];
            }
          }
        }
        console.log(_this.wlServices);
        _this.getAppointmentServices(locationId)
          .then((apptServices: any) => {
            _this.apptServices = apptServices;
            for (let aptIndex = 0; aptIndex < _this.apptServices.length; aptIndex++) {
              if (_this.apptServices[aptIndex]['id'] == _this.serviceid && _this.apptServices[aptIndex].serviceAvailability) {
                _this.servicename = _this.apptServices[aptIndex]['name'];
                _this.servicedetails = _this.apptServices[aptIndex];
                console.log("details" + JSON.stringify(_this.servicedetails));
                console.log("Appt:");
                _this.setServiceGallery(_this.servicedetails);
                _this.getduration(_this.servicedetails);
                if (_this.servicedetails.serviceAvailability['nextAvailable']) {
                  _this.timingCaptionapt = 'Next Available Time';
                  _this.timingsapt = _this.getAvailabilityforAppt(_this.servicedetails.serviceAvailability.nextAvailableDate, _this.servicedetails.serviceAvailability.nextAvailable);
                }
                if (_this.apptServices[aptIndex]['deptName']) {
                  _this.deptname = _this.apptServices[aptIndex]['deptName'];
                }
              }
              // console.log("Service Images :",_this.apptServices[aptIndex]['servicegallery']);
              // this.images  = _this.apptServices[aptIndex]['servicegallery'];
              // console.log("List Images : ",this.images)

            }
            console.log("",_this.apptServices);
            _this.setServiceUserDetails();
            _this.loading = false;
          },
            error => {
              _this.wordProcessor.apiErrorAutoHide(_this, error);
              _this.loading = false;
            });
      }, 
        error => {
          _this.wordProcessor.apiErrorAutoHide(_this, error);
          _this.loading = false;
        });
  }
  getduration(servicedetails: any) {
    this.minutes = servicedetails.serviceDuration;
    if (this.minutes) {
      this.min = this.minutes % 60;
      this.hour = (this.minutes - this.min) / 60;
      if (this.hour > 0 && this.min > 0) {
        if (this.hour > 1) {
          this.HHMM = this.hour + ' ' + 'hrs' + ' ' + this.min + ' ' + 'mins';
        } else {
          this.HHMM = this.hour + ' ' + 'hr' + ' ' + this.min + ' ' + 'mins';
        }
      } else if (this.hour === 0) {
        this.HHMM = this.min + ' ' + 'mins';
      } else if (this.min === 0) {
        if (this.hour > 1) {
          this.HHMM = this.hour + ' ' + 'hrs';
        } else {
          this.HHMM = this.hour + ' ' + 'hr';
        }
      }
    }
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
  setAccountGallery(res) {
    this.galleryenabledArr = []; // For showing gallery
    this.image_list_popup = [];
    this.tempgalleryjson = res;
    console.log("Image Length : ",this.tempgalleryjson);
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
  setAccountApptServices(res) {
    this.apptServicesjson = res;
    console.log(this.apptServicesjson);
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
  setAccountSettings(res) {
    this.settingsjson = res;
    this.showDepartments = this.settingsjson.filterByDept;
  }

  setAccountServices(res) {
    this.servicesjson = res;
    if (this.servicesjson[0] && this.servicesjson[0].hasOwnProperty('departmentName')) {
      this.showDepartments = true;
    }
  }
  openImageModalRow(image: Image, gallery, index) {
    console.log("openImageModalRow", gallery);
    // const index: number = this.getCurrentIndexCustomLayout(image, gallery);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  // private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
  //   return image ? images.indexOf(image) : -1;
  // }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  setServiceUserDetails() {
    this.servicesAndProviders = [];
    const servicesAndProviders = [];
    this.donationServices = [];
    this.serviceCount = 0;
    this.userCount = 0;
    // tslint:disable-next-line:no-shadowed-variable
    if (this.userId) {
      if (this.apptServices) {
        for (let aptIndex = 0; aptIndex < this.apptServices.length; aptIndex++) {
          if (this.apptServices[aptIndex]['id'] == this.serviceid && this.apptServices[aptIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'appt', 'item': this.apptServices[aptIndex] });
            this.serviceCount++;
          }
        }
      }
      if (this.wlServices) {
        for (let wlIndex = 0; wlIndex < this.wlServices.length; wlIndex++) {
          if (this.wlServices[wlIndex]['id'] == this.serviceid && this.wlServices[wlIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'waitlist', 'item': this.wlServices[wlIndex] });
            this.serviceCount++;
          }
        }
      }
    } else {
      if (this.apptServices) {
        for (let aptIndex = 0; aptIndex < this.apptServices.length; aptIndex++) {
          if (this.apptServices[aptIndex]['id'] == this.serviceid && this.apptServices[aptIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'appt', 'item': this.apptServices[aptIndex] });
            this.serviceCount++;
          }
        }
      }
      if (this.wlServices) {
        for (let wlIndex = 0; wlIndex < this.wlServices.length; wlIndex++) {
          if (this.wlServices[wlIndex]['id'] == this.serviceid && this.wlServices[wlIndex].serviceAvailability) {
            servicesAndProviders.push({ 'type': 'waitlist', 'item': this.wlServices[wlIndex] });
            this.serviceCount++;
          }
        }
      }
    }
    console.log("serv1" + JSON.stringify(servicesAndProviders));
    this.servicesAndProviders = servicesAndProviders;
    console.log("ghdg" + this.servicesAndProviders);

    if (this.businessjson.donationFundRaising && this.onlinePresence && this.donationServicesjson.length >= 1) {
      for (let dIndex = 0; dIndex < this.donationServicesjson.length; dIndex++) {
        if (this.donationServicesjson[dIndex]['id'] == this.serviceid) {
          this.donationServices.push({ 'type': 'donation', 'item': this.donationServicesjson[dIndex] });
          this.serviceCount++;
        }
      }
      console.log("donation" + JSON.stringify(this.donationServicesjson));
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
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
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
          this.setServiceUserDetails();
        });
    }
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
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }
  getButtontype(item) {
    console.log("getButtontype:",item);
    if (item.type == 'waitlist') {
      if (item.item.serviceAvailability['showToken']) {
        this.buttonCaption = Messages.GET_TOKEN;
      } else {
        this.buttonCaption = 'Get ' + this.getTerminologyTerm('waitlist');
      }
    } else if (item.type == 'appt') {
      this.buttonCaption = 'Get Appointment';
    } else if (item.type == 'donation') {
      this.buttonCaption = 'Donate';
    }
    return this.buttonCaption;
  }
  getTerminologyTerm(term) {
    const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
    if (this.terminologiesjson) {
      return this.wordProcessor.firstToUpper((this.terminologiesjson[term_only]) ? this.terminologiesjson[term_only] : ((term === term_only) ? term_only : term));
    } else {
      return this.wordProcessor.firstToUpper((term === term_only) ? term_only : term);
    }
  }
  bttonClick(item, type?) {

    if(type=='checkavailability') {
      item['location']=this.selectedLocation;
      item['service'] = item['item']
      console.log("item..",item)
      this.opencheckavail(item)
      
    }
    else if (item.type == 'waitlist') {
      this.checkinClicked(this.selectedLocation, item.item)
    } else if (item.type == 'appt') {
      this.appointmentClicked(this.selectedLocation, item.item);
    } else if (item.type == 'donation') {
      this.payClicked(this.selectedLocation.id, this.selectedLocation.place, new Date(), item.item);
    }
  }
  opencheckavail(actionObj) {
      this.checkavailabilitydialogref = this.dialog.open(CheckavailabilityComponent, {
        width: '100%',
        panelClass: ['loginmainclass', 'popup-class', this.theme],
        height: 'auto',
        data: {
        alldetails:actionObj,
        apptSettingsJson:this.apptSettingsJson,
        domain: this.businessjson.serviceSector.domain
        }
      });

    this.checkavailabilitydialogref.afterClosed().subscribe(result => {
     
      if(result!='undefined') { 
        actionObj['location']['time']=result[0];
        actionObj['location']['date']=result[1];
        if(actionObj['service']['bType']=='Appointment') {
          this.appointmentClicked(actionObj['location'], actionObj['service']);
        } if(actionObj['service']['bType']=='Waitlist' || !actionObj['service']['bType']) {
          console.log("***Waitlist***");
          this.checkinClicked(actionObj['location'], actionObj['service']);
        }


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
    if(location.time) {
      current_provider['ctime']=location.time
    }    if(location.date) {
      current_provider['cdate']=location.date
      service.serviceAvailability.availableDate=location.date
    }

    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
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
    _this.loading_direct = true;
    // _this.goThroughLogin().then(
    //   (status) => {
    //     if (status) {
    //       console.log("logged In");
    //       _this.userType = _this.sharedFunctionobj.isBusinessOwner('returntyp');
    //       if (_this.userType === 'consumer') {
              _this.showCheckin(location.id, location.place, location.googleMapUrl, service.serviceAvailability.availableDate, service, 'consumer',current_provider['ctime']);
      //     }
      //   } else {
      //     const passParam = { callback: '', current_provider: current_provider };
      //     _this.doLogin('consumer', passParam);
      //   }
      // });
  }
  appointmentClicked(location, service) {
    const _this = this;
    this.futureAllowed = true;
    const current_provider = {
      'id': location.id,
      'place': location.place,
      'location': location,
      'cdate': service.serviceAvailability.nextAvailableDate,
      'service': service
    };
    if(location.time) {
      current_provider['ctime']=location.time
    }    if(location.date) {
      current_provider['cdate']=location.date
      service.serviceAvailability.nextAvailableDate=location.date
    }
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
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
    _this.loading_direct = true;
    // _this.goThroughLogin().then(
    //   (status) => {
    //     if (status) {
    //       _this.userType = _this.sharedFunctionobj.isBusinessOwner('returntyp');
    //       if (_this.userType === 'consumer') {
              _this.showAppointment(location.id, location.place, location.googleMapUrl, service.serviceAvailability.nextAvailableDate, service, 'consumer', current_provider['ctime']);
      //     }
      //   } else {
      //     const passParam = { callback: 'appointment', current_provider: current_provider };
      //     _this.doLogin('consumer', passParam);
      //   }
      // });
  }
  payClicked(locid, locname, cdate, service) {
    const _this = this;
    _this.loading_direct = true;
    // _this.goThroughLogin().then(
    //   (status) => {
    //     if (status) {
    //       _this.userType = _this.sharedFunctionobj.isBusinessOwner('returntyp');
    //       if (_this.userType === 'consumer') {
            this.showDonation(locid, cdate, service);
      //     }
      //   } else {
      //     const passParam = { callback: 'donation', loc_id: locid, name: locname, date: cdate, service: service, consumer: 'consumer' };
      //     this.doLogin('consumer', passParam);
      //   }
      // });
  }
  goThroughLogin() {
    return new Promise((resolve) => {
      const qrpw = this.lStorageService.getitemfromLocalStorage('qrp');
      let qrusr = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
      qrusr = JSON.parse(qrusr);
      if (qrusr && qrpw) {
        const data = {
          'countryCode': qrusr.countryCode,
          'loginId': qrusr.loginId,
          'password': qrpw,
          'mUniqueId': null
        };
        this.shared_services.ConsumerLogin(data).subscribe(
          (loginInfo: any) => {
            this.authService.setLoginData(loginInfo, data, 'consumer');
            this.lStorageService.setitemonLocalStorage('qrp', data.password);
            resolve(true);
          },
          (error) => {
            if (error.status === 401 && error.error === 'Session already exists.') {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );
      } else {
        resolve(false);
      }
    });
  }
  showAppointment(locid, locname, gMapUrl, curdate, service: any, origin?,ctime?, virtualinfo?) {
    console.log("Service Appt: ");
    console.log(service);
    let queryParam = {
      loc_id: locid,
      locname: locname,
      googleMapUrl: gMapUrl,
      cur: this.changedate_req,
      unique_id: this.provider_id,
      account_id: this.provider_bussiness_id,
      user: this.userId,
      futureAppt: this.futureAllowed,
      service_id: service.id,
      sel_date: curdate,
      virtual_info: JSON.stringify(virtualinfo),
      ctime:ctime
    };
    if (service['serviceType']==='virtualService') {
      queryParam['tel_serv_stat'] = true;
    } else {
      queryParam['tel_serv_stat'] = false;
    }
    if (service['department']) {
      queryParam['dept'] = service['department'];
      queryParam['theme'] = this.theme;
    }
    queryParam['customId'] = this.accountEncId;
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.routerobj.navigate(['consumer', 'appointment'], navigationExtras);
  }
  showCheckin(locid, locname, gMapUrl, curdate, service: any, origin?, virtualinfo?,ctime?) {
    console.log("Service Checkin ");
    console.log(service);
    let queryParam = {
      loc_id: locid,
      locname: locname,
      googleMapUrl: gMapUrl,
      sel_date: curdate,
      cur: this.changedate_req,
      unique_id: this.provider_id,
      account_id: this.provider_bussiness_id,
      user: this.userId,
      service_id: service.id,
      virtual_info: JSON.stringify(virtualinfo),
      ctime:ctime
    };
    if (service['serviceType']==='virtualService') {
      queryParam['tel_serv_stat'] = true;
    } else {
      queryParam['tel_serv_stat'] = false;
    }
    if (service['department']) {
      queryParam['dept'] = service['department'];
      queryParam['theme'] = this.theme;
    }
    queryParam['customId'] = this.accountEncId;
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam,
    };
    this.routerobj.navigate(['consumer', 'checkin'], navigationExtras);
  }
  doLogin(origin?, passParam?) {
    const current_provider = passParam['current_provider'];
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
      // this.loading_direct = true;
      if (result === 'success') {
        this.loading_direct = true;
        this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'donation') {
          this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        } else if (passParam['callback'] === 'appointment') {
          this.showAppointment(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer',current_provider['ctime']);
        } else {
            this.showCheckin(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer',current_provider['ctime']);
        }
      } else if (result === 'showsignup') {
        this.doSignup(passParam);
      } else {
          this.loading_direct = false;
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
        accountId: this.provider_bussiness_id,
        service_id: service.id,
        theme: this.theme,
        customId: this.accountEncId
      }
    };
    this.routerobj.navigate(['consumer', 'donations', 'new'], navigationExtras);
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
        this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'donation') {
          this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        } else if (passParam['callback'] === 'appointment') {
            this.showAppointment(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
        } else {
            this.showCheckin(current_provider['location']['id'], current_provider['location']['place'], current_provider['location']['googleMapUrl'], current_provider['cdate'], current_provider['service'], 'consumer');
        }
      } else {
        this.loading_direct = false;
      }
    });
  }
  getAvailibilityForCheckin(date, serviceTime) {
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
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
    const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
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
    console.log("time is" + time);
    if (dtoday === date) {
      return ('Today' + ', ' + this.getSingleTime(time));
    } else {
      return (this.dateTimeProcessor.formatDate(date, { 'rettype': 'monthname' }) + ', '
        + this.getSingleTime(time));
    }
  }
  getTimeToDisplay(min) {
    return this.dateTimeProcessor.convertMinutesToHourMinute(min);
  }
  dashboardClicked() {
    const _this = this;
    _this.loading_direct = true;
    _this.goThroughLogin().then(
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
      'accountId': this.provider_bussiness_id
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParam
    };
    this.routerobj.navigate(['consumer'], navigationExtras);
  }
  preInfoClick(){
    if(this.showpreinfo){
      this.showpreinfo = false;
    } else {
      this.showpreinfo = true;
    }
  }
  postInfoClick(){
    if(this.showpostinfo){
      this.showpostinfo = false;
    } else {
      this.showpostinfo = true;
    }
  }
  cardClicked(actionObj) {
    console.log('entering into Service page');
    console.log(actionObj);
    if (actionObj['type'] === 'waitlist') {
      if (actionObj['action'] === 'view') {
        // this.showServiceDetail(actionObj['service'], this.businessjson.businessName);
      } else {
        this.checkinClicked(actionObj['location'], actionObj['service']);
      }
    } else if (actionObj['type'] == 'checkavailability') {
      this.opencheckavail(actionObj);
    } else if (actionObj['type'] === 'appt') {
      if (actionObj['action'] === 'view') {
        // this.showServiceDetail(actionObj['service'], this.businessjson.businessName);
      } else {
        this.appointmentClicked(actionObj['location'], actionObj['service']);
      }
    } else if (actionObj['type'] === 'donation') {
      if (actionObj['action'] === 'view') {
        // this.showServiceDetail(actionObj['service'], this.businessjson.businessName);
      } else {
        this.payClicked(actionObj['location'].id, actionObj['location'].place, new Date(), actionObj['service']);
      }
    }
  }
}
