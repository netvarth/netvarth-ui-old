import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../shared/constants/project-constants';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { SharedServices } from '../../../../../../shared/services/shared-services';
import { ProviderDataStorageService } from '../../../../../../ynw_provider/services/provider-datastorage.service';
import { ProviderSharedFuctions } from '../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderBprofileSearchPrimaryComponent } from '../../../../../../ynw_provider/components/provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-managesettings',
  templateUrl: './manageSettings.component.html'
})
export class ManageSettingsComponent implements OnInit {
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      url: '/provider/settings/miscellaneous',
      title: 'Miscellaneous'
    },
    {
      title: 'Users',
      url: '/provider/settings/miscellaneous/users'
    }
  ];
  domain;
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
  service_count: any;
  queues_count: any;
  // domain;
  schedules_count;

  constructor(
    private router: Router,
    private routerobj: Router,
    public shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions,
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
    this.getScheduleCount();
    this.getServiceCount();
    this.getQueuesCount();
    this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
    this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
    this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: this.userId,
      url: '/provider/settings/miscellaneous/users/' + this.userId,
    });
    breadcrumbs.push({
      title: 'Settings'
    });
    this.breadcrumbs = breadcrumbs;
  }
  getServiceCount() {
    // this.loading = true;
    const filter = { 'provider-eq': this.userId };
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
    this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'services']);
  }
  Queues() {
    this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'queues']);
  }
  NonWorkingDay() {
    this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'holidays']);
  }
  Notifications() {
    this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'notifications'], this.userId);
  }
  schedules() {
    this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'schedules']);
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
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
}
