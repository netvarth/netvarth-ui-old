import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { ProviderSharedFuctions } from '../../../../../../ynw_provider/shared/functions/provider-shared-functions';
// import { MatDialogRef } from '@angular/material';
import { UserDataStorageService } from './user-datastorage.service';
import { Subscription } from 'rxjs';
import { QuestionService } from '../../../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';

@Component({
  selector: 'app-managesettings',
  templateUrl: './manage-settings.component.html'
})
export class ManageSettingsComponent implements OnInit, AfterViewChecked {
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      url: '/provider/settings/general',
      title: Messages.GENERALSETTINGS
    },
    {
      title: 'Users',
      url: '/provider/settings/general/users'
    }
  ];
  domain;
  frm_set_ser_cap = '';
  breadcrumbs = this.breadcrumbs_init;
  isCorp = false;
  isMultilevel = false;
  accountType: any;
  cust_domain_name = '';
  provider_domain_name = '';
  customer_label = '';
  provider_label = '';
  user;
  holiday;
  logo: any = [];
  you_have_cap = Messages.YOU_HAVE_CAP;
  more_cap = Messages.MORE_CAP;
  add_cap = Messages.ADD_BTN;

  edit_cap = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  click_here_cap = Messages.CLICK_HERE_CAP;
  sorry_cap = Messages.SORRY_CAP;

  your_proflie_cap = Messages.BPROFILE_PROFILE_CAP;
  disabled_Cap = Messages.BPROFILE_DISABLED_CAP;
  not_visible_cap = Messages.BPROFILE_ONLINE_VISIBLE_CAP;
  set_up_cap = Messages.BPROFILE_SET_UP_CAP;
  profile_summary_cap = Messages.BPROFILE_SUMMARY_CAP;

  current_status_cap = Messages.BPROFILE_CURRENT_STATUS;
  on_cap = Messages.BPROFILE_ON_CAP;
  off_cap = Messages.BPROFILE_OFF_CAP;
  profile_visible_cap = Messages.BPROFILE_VISIBILITY_CAP;
  online_jaldee_cap = Messages.BPROFILE_ONLINE_JALDEE_CAP;
  offline_cap = Messages.BPROFILE_OFFLINE_CAP;

  have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  basic_info_cap = Messages.BPROFILE_BASIC_INFORMATION_CAP;
  such_as_cap = Messages.BPROFILE_SUCH_AS_CAP;
  name_summary_cap = Messages.BPROFILE_BUSINESS_NAME_CAP;
  profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
  add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;

  change_cap = Messages.BPROFILE_CHANGE_CAP;
  pic_cap = Messages.BPROFILE_PICTURE_CAP;
  delete_pic = Messages.BPROFILE_DELETE_PICTURE_CAP;
  info_cap = Messages.BPROFILE_INFORMATION_CAP;
  please_use_cap = Messages.BPROFILE_PLEASE_CAP;
  btn_to_compl_cap = Messages.BPROFILE_BUTTON_COMPLETE_CAP;
  pin_cap = Messages.BPROFILE_PIN_CAP;
  more_loc_cap = Messages.BPROFILE_MORE_LOCATIONS_CAP;
  locations_cap = Messages.BPROFILE_LOCATIONS_CAP;
  page_cap = Messages.BPROFILE_PAGE_CAP;
  can_change_hours = Messages.BPROFILE_CHANGE_WORKING_HOURS_CAP;
  visible_cap = Messages.BPROFILE_VISIBLE_CAP;
  add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
  name_cap = Messages.PRO_NAME_CAP;


  checked = false;
  bProfile = null;
  serviceSector = null;
  public_search = false;
  error_msg = '';

  bprofile_btn_text: string;
  weightageValue: any;
  weightageClass: string;
  progress_bar_four: number;
  progress_bar_three: number;
  progress_bar_two: number;
  progress_bar_one: number;
  subscription: Subscription;
  businessProfile_weightageArray: any[];
  user_arr;
  jaldee_online_status_str = '';
  jaldee_online_status;
  domainList: any = [];
  subDomains: any = [];
  subDomain;
  additionalInfoDomainFields: any = [];
  additionalInfoSubDomainFields: any = [];
  userMandatoryfieldArray: any = [];
  userAdditionalInfoSubDomainFields: any[];
  userAdditionalInfoDomainFields: any[];
  specialization_arr: any = [];
  languages_arr: any = [];
  orgsocial_list: any = [];
  domain_fields;
  domain_questions = [];
  subdomain_fields = [];
  subdomain_questions = [];
  que_type = 'domain_questions';
  normal_domainfield_show = 1;
  normal_subdomainfield_show = 1;
  social_arr: any = [];
  social_list: any = [];
  showaddsocialmedia = false;
  field;
  grid_row_index;
  subDomainId;
  vkeyNameMap = {};
  reqFields: any = {
    name: false,
    location: false,
    schedule: false,
    domainvirtual: false,
    subdomainvirtual: false,
    specialization: false
  };
  blogo: any = [];
  item_pic = {
    files: [],
    base64: null
  };
  selitem_pic = '';
  profimg_exists = false;
  badgeIcons: any = [];
  badgeArray: any = [];


  tooltipcls = projectConstants.TOOLTIP_CLS;
  breadcrumb_moreoptions: any = [];

  normal_profile_active = 1;  // [1 - loading]  [2 - no info] [3 - info available]
  normal_basicinfo_show = 1;

  loadingParams: any = { 'diameter': 40, 'strokewidth': 15 };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fa fa-trash-o',
        type: ButtonType.DELETE,
        ariaLabel: 'custom plus aria label',
        title: 'Delete',
        fontSize: '20px'
      },
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  businessConfig: any = [];
  // customer_label = '';
  maintooltip = this.sharedfunctionObj.getProjectMesssages('BPROFILE_TOOPTIP');
  primarydialogRef;
  cacheavoider = '';
  frm_additional_cap = '';
  frm_gallery_cap = '';
  frm_social_cap = '';
  frm_profile_name_cap = Messages.FRM_LEVEL_PROFILE_NAME_CAP;
  isCheckin;
  success_error = null;
  error_list = [];
  editMode = 3;
  active_user;
  frm_lang_cap = '';
  userId: any;
  frm_set_working_hr_cap = Messages.FRM_LEVEL_SETT_WORKING_HR_MSG;
  service_count: any;
  queues_count: any;
  // domain;
  schedules_count;
  businessname: any;

  settings: any = [];
  showToken = false;
  constructor(
    private router: Router,
    private routerobj: Router,
    private user_datastorage: UserDataStorageService,
    public shared_functions: SharedFunctions,
    private service: QuestionService,
    private cdref: ChangeDetectorRef,
    private sharedfunctionObj: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions,
    private activatedRoot: ActivatedRoute,
    private provider_services: ProviderServices
  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
    this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
    this.activatedRoot.params.subscribe(params => {
      this.userId = params.id;
    });
  }
  ngOnInit() {
    this.user_datastorage.setWeightageArray([]);
    this.getUser();
    this.getUserPublicSearch();
    this.getScheduleCount();
    this.getServiceCount();
    this.getQueuesCount();
    this.getProviderSettings();
    this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
    this.frm_set_ser_cap = Messages.FRM_LEVEL_SETT_SERV_MSG.replace('[customer]', this.customer_label);
    this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
    this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
    this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.domainList = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
    this.subscription = this.user_datastorage.getWeightageArray().subscribe(result => {
      this.businessProfile_weightageArray = result;
      console.log( JSON.stringify(this.businessProfile_weightageArray));
      this.weightageValue = this.calculateWeightage(result);
    });
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
        }, () => {
      });
  }
  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }
  getUser() {
    this.provider_services.getUser(this.userId)
      .subscribe((data: any) => {
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
          breadcrumbs.push(e);
        });
        breadcrumbs.push({
          title: data.firstName,
          url: '/provider/settings/general/users/add?type=edit&val=' + this.userId,
        });
        breadcrumbs.push({
          title: 'Settings'
        });
        this.breadcrumbs = breadcrumbs;

        for (let i = 0; i < this.domainList.bdata.length; i++) {
          if (this.domainList.bdata[i].domain === this.domain) {
            for (let j = 0; j < this.domainList.bdata[i].subDomains.length; j++) {
              if (this.domainList.bdata[i].subDomains[j].id === data.subdomain) {
                this.subDomain = this.domainList.bdata[i].subDomains[j].subDomain;
                // this.getSpecializations(this.domain, this.subDomain);
                // this.initSpecializations();
                // this.bProfile['subDomain'] = this.subDomain;
                this.getBusinessProfile();
                }
            }
          }
        }
      });
  }
  getUserPublicSearch() {
    this.provider_services.getUserPublicSearch(this.userId)
      .subscribe(
        data => {
          this.public_search = (data && data.toString() === 'true') ? true : false;
          this.jaldee_online_status_str = (this.public_search === true) ? 'On' : 'Off';
          this.jaldee_online_status = this.public_search;
         },
        () => {
        }
      );
  }
  getBusinessProfile() {
    this.bProfile = [];
    this.additionalInfoDomainFields = [];
    this.additionalInfoSubDomainFields = [];
    this.userMandatoryfieldArray = [];
    this.reqFields = {};
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          this.businessname = this.bProfile.businessName;
          this.provider_services.getVirtualFields(this.domain).subscribe(
            domainfields => {
              this.provider_services.getVirtualFields(this.domain, this.subDomain).subscribe(
                subdomainfields => {
                  this.reqFields = this.provider_shared_functions.getuserProfileRequiredFields(domainfields, subdomainfields);
                  this.userMandatoryfieldArray = this.provider_shared_functions.getUserAdditonalInfoMandatoryFields();
                  this.userAdditionalInfoDomainFields = this.provider_shared_functions.getUserAdditionalNonDomainMandatoryFields();
                  this.userAdditionalInfoSubDomainFields = this.provider_shared_functions.getUserAdditionalNonSubDomainMandatoryFields();
                  this.getDomainVirtualFields();
                  if (this.subDomain) {
                  this.getSubDomainVirtualFields();
                  }
                });
            });
        if (this.bProfile.logo) {
            this.blogo = this.bProfile.logo;
            const cnow = new Date();
            const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
            this.cacheavoider = dd;
            this.user_datastorage.updateProfilePicWeightage(true);
          } else {
           this.user_datastorage.updateProfilePicWeightage(false);
          }
          // if (this.bProfile.status === 'ACTIVE') {
          //   this.normal_profile_active = 3;
          // } else {
          //   this.normal_profile_active = 2;
          // }
          // check whether normal business profile section can be displayed
          // if ((this.bProfile.businessName !== '' && this.bProfile.businessName !== undefined)
          //   || (this.bProfile.businessDesc !== '' && this.bProfile.businessDesc !== undefined)) {
          //   // this.getProviderLogo();
           //   this.normal_basicinfo_show = 3;
          // } else {
          //   this.normal_basicinfo_show = 2;
          // }
          // this.showaddsocialmedia = false;
          // this.user_datastorage.set('bProfile', this.bProfile);
          // this.normal_socialmedia_show = 2;
          // this.social_arr = [];
          // if (this.bProfile.socialMedia) {
          //   if (this.bProfile.socialMedia.length > 0) {
          //     this.normal_socialmedia_show = 3;
          //     for (let i = 0; i < this.bProfile.socialMedia.length; i++) {
          //       if (this.bProfile.socialMedia[i].resource !== '') {
          //         this.social_arr.push({ 'Sockey': this.bProfile.socialMedia[i].resource, 'Socurl': this.bProfile.socialMedia[i].value });
          //       }
          //     }
          //   }
          // }
          // if (this.social_arr.length < this.orgsocial_list.length) {
          //   this.showaddsocialmedia = true;
          // }
          this.user_datastorage.set('bProfile', this.bProfile);
          this.user_datastorage.setUserBusinessProfileWeightage(this.bProfile);

        },
        () => {
          // this.normal_basicinfo_show = 2;
          // this.normal_socialmedia_show = 2;
        }
      );
  }
  getDomainVirtualFields() {
    const userWeightageObjectOfDomain: any = {};
    this.getVirtualFields(this.domain)
      .then(
        data => {
          let user_mandatorydomain = false;
          let user_mandatorydomainFilled = false;
          let user_additionalInfoFilledStatus = false;
          this.domain_fields = data['fields'];
          this.domain_questions = data['questions'] || [];
          // this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          if (this.userMandatoryfieldArray.length !== 0 && this.domain_fields.some(domain => domain.mandatory === true)) {
            user_mandatorydomain = true;
            this.userMandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.domain_fields, mandatoryField)) {
                user_mandatorydomainFilled = true;
              } else {
                user_mandatorydomainFilled = false;
                return;
              }
            });


          } else {
            user_mandatorydomain = false;
          }

          if (this.checkAdditionalFieldsFullyFilled(this.userAdditionalInfoDomainFields, this.domain_fields)) {
            user_additionalInfoFilledStatus = true;
          }
          userWeightageObjectOfDomain.mandatoryDomain = user_mandatorydomain;
          userWeightageObjectOfDomain.mandatoryDomainFilledStatus = user_mandatorydomainFilled;
          userWeightageObjectOfDomain.additionalDomainFullyFilled = user_additionalInfoFilledStatus;
          this.user_datastorage.setWeightageObjectOfDomain(userWeightageObjectOfDomain);



        }
      );

  }

  getSubDomainVirtualFields() {
    const userWeightageObjectOfSubDomain: any = {};
    this.getVirtualFields(this.domain,
      this.subDomain).then(
        data => {
          let user_mandatorysubdomain = false;
          let user_mandatorySubDomainFilled = false;
          let user_additionalInfoFilledStatus = false;
          this.subdomain_fields = data['fields'];

          this.subdomain_questions = data['questions'] || [];
          if (this.userMandatoryfieldArray.length !== 0 && this.subdomain_fields.some(subdomain => subdomain.mandatory === true)) {
            user_mandatorysubdomain = true;
            this.userMandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.subdomain_fields, mandatoryField)) {
                user_mandatorySubDomainFilled = true;
              } else {
                user_mandatorySubDomainFilled = false;
                return;
              }
            });

          }
          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoSubDomainFields, this.subdomain_fields)) {
            user_additionalInfoFilledStatus = true;
          }

          userWeightageObjectOfSubDomain.mandatorySubDomain = user_mandatorysubdomain;
          userWeightageObjectOfSubDomain.mandatorySubDomainFilledStatus = user_mandatorySubDomainFilled;
          userWeightageObjectOfSubDomain.additionalSubDomainFullyFilled = user_additionalInfoFilledStatus;
          this.user_datastorage.setWeightageObjectOfSubDomain(userWeightageObjectOfSubDomain);
          this.normal_subdomainfield_show = (this.normal_subdomainfield_show === 2) ? 4 : 3;

          for (let fdIndex = 0; fdIndex < this.subdomain_fields.length; fdIndex++) {
            // tslint:disable-next-line:no-unused-expression
            if (this.subdomain_fields[fdIndex]['dataType'] === 'DataGrid') {
              for (let colIndex = 0; colIndex < this.subdomain_fields[fdIndex]['Columns'].length; colIndex++) {
                if (this.subdomain_fields[fdIndex]['Columns'][colIndex]['type'] === 'Enum') {
                  for (let enumIndex = 0; enumIndex < this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'].length; enumIndex++) {
                    this.vkeyNameMap[this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['name']] = this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['displayName'];
                  }
                }
              }
            }
          }
          this.user_datastorage.updateMandatoryAndAdditionalFieldWeightage();

        }
      );
  }
  checkMandatoryFieldsInResultSet(domainFields, fieldname) {
    let fullyfilledStatus = true;
    domainFields.forEach(function (dom) {
      if (dom.name === fieldname) {
        if (!dom['value'] || (dom.value === undefined || dom.value == null)) {
          fullyfilledStatus = false;
          return;
        }
      }
    });
    return fullyfilledStatus;
  }
  checkAdditionalFieldsFullyFilled(additionalInfoFields, dom_subdom_list) {

    let fullyfilledStatus = true;
    additionalInfoFields.forEach(function (field) {
      if (fullyfilledStatus) {
        if (!dom_subdom_list.some(domobject => domobject.name === field)) {
          fullyfilledStatus = false;
          return;
        } else {
          dom_subdom_list.forEach(function (data_object) {
            if (data_object.name === field) {
              if (!data_object['value'] || (data_object.value === undefined || data_object.value == null)) {
                fullyfilledStatus = false;
                return;
              }
            }
          });
        }
      }
    });

    return fullyfilledStatus;
  }
  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            const set_data = [];
            set_data['fields'] = _this.setFieldValue(data, subdomin);
            set_data['questions'] = _this.service.getQuestions(set_data['fields']);
            resolve(set_data);
          },
          () => {
            reject();
          }
        );
    });
  }

  setFieldValue(data, subdomin) {
    let fields = [];
    if (subdomin) {
      fields = (this.bProfile['subDomainVirtualFields'] &&
        this.bProfile['subDomainVirtualFields'][0]) ?
        this.bProfile['subDomainVirtualFields'][0][subdomin] : [];
    } else {
      fields = (this.bProfile['domainVirtualFields']) ?
        this.bProfile['domainVirtualFields'] : [];
    }
    if (fields) {
      for (const i in data) {
        if (data[i]) {
          const row = data[i];
          if (fields[row.name]) {
            data[i]['value'] = fields[row.name];
          } else {
            delete data[i]['value'];
          }
        }
      }
      return data;
    } else {
      return data;
    }
  }

  getFieldQuestion(field_key = null, type = 'domain_questions') {
    const questions = (type === 'subdomain_questions') ? this.subdomain_questions : this.domain_questions;
    if (field_key != null) {
      const field = [];
      for (const que of questions) {
        if (que.key === field_key) {
          field.push(que);
        }
      }
      return field;
    }
  }
  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getUserBussinessProfile(_this.userId)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
  showimg() {
    let logourl = '';
    this.profimg_exists = false;
    if (this.item_pic.base64) {
      this.profimg_exists = true;
      return this.item_pic.base64;
    } else {
      if (this.blogo) {
        this.profimg_exists = true;
        // const today = new Date();
        //  logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + tday : '';
         logourl = (this.blogo.url) ? this.blogo.url + '?' + this.cacheavoider : '';
      }
        return this.sharedfunctionObj.showjplimg(logourl);
    }
  }
  getBusinessProfileWeightageText() {
    let businessProfileWeightageText = '';
    const weightage = this.weightageValue;
    if (weightage <= 25) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'danger';
      this.progress_bar_one = weightage;
      this.progress_bar_two = 0;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      return businessProfileWeightageText;

    }
    if (weightage > 25 && weightage < 50) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'warning';
      this.progress_bar_one = 25;
      this.progress_bar_two = weightage - 25;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      return businessProfileWeightageText;
    } else if
    (weightage >= 50 && weightage < 75) {
      businessProfileWeightageText = Messages.PROFILE_MINIMALLY_COMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'info';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = weightage - 50;
      this.progress_bar_four = 0;
      return businessProfileWeightageText;

    } else if (weightage >= 75 && weightage < 100) {
      businessProfileWeightageText = Messages.GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_STRENGTHEN_YOUR_PROFILE;
      this.weightageClass = 'primary';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = weightage - 75;
      return businessProfileWeightageText;
    } else if (weightage === 100) {
      businessProfileWeightageText = Messages.VERY_GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_MANAGE_YOUR_PROFILE;
      this.weightageClass = 'success';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = 25;
      return businessProfileWeightageText;

    }

  }
  calculateWeightage(data) {
    let total = 0;
    if (data != null && data.length > 0) {
      data.forEach(x => total += x.value);
    }
    return total;

  }
  getServiceCount() {
    // this.loading = true;
    const filter = { 'provider-eq': this.userId , 'serviceType-neq': 'donationService'};
    this.provider_services.getServiceCount(filter)
      .subscribe(
        data => {
          this.service_count = data;
        });
    // this.loading = false;
  }
  getQueuesCount() {
    // this.loading = true;
    const filter = { 'provider-eq': this.userId };
    this.provider_services.getQueuesCount(filter)
      .subscribe(
        data => {
          this.queues_count = data;
        });
    // this.loading = false;
  }
  services() {
    this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services']);
  }
  Queues() {
    this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'queues']);
  }
  NonWorkingDay() {
    this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'holidays']);
  }
  Notifications() {
    this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'notifications'], this.userId);
  }
  schedules() {
    this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'schedules']);
  }
  gotoOnlineProfile() {
      this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile']);
    }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    if (mod === 'notifications') {
    this.routerobj.navigate(['/provider/' + this.domain + '/comm->' + mod]);
    } else if (mod === 'settings-services' || mod === 'settings-time_windows') {
      this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->' + mod]);
    } else if (mod === 'schedules') {
      this.routerobj.navigate(['/provider/' + this.domain + '/appointmentmanager->' + mod]);
    }  else if (mod === 'nonworking') {
      this.routerobj.navigate(['/provider/' + this.domain + '/general->' + mod]);
    }  else  {
      this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
    }
  }

  getScheduleCount() {
    // this.loading = true;
    const filter = { 'provider-eq': this.userId };
    this.provider_services.getSchedulesCount(filter)
      .subscribe(
        data => {
          this.schedules_count = data;
        });
    // this.loading = false;
  }
  redirecToUsers() {
    this.routerobj.navigate(['provider',  'settings' , 'general' , 'users']);
}
}
