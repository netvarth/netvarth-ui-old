import { Component, OnInit, ElementRef, Inject, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Messages } from '../../../shared/constants/project-messages';
import { GoogleMapComponent } from '../googlemap/googlemap.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ViewChild } from '@angular/core';
import { QuestionService } from '../dynamicforms/dynamic-form-question.service';
import { ProviderBprofileSearchDynamicComponent } from '../provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';

@Component({
  selector: 'app-provider-bwizard',
  templateUrl: './provider-bwizard.component.html'
})

export class ProviderbWizardComponent implements OnInit {


  add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
  congradulations_cap = Messages.WIZ_CONGRATULATIONS_CAP;
  right_choice_by_signin_up_cap = Messages.WIZ_RIGHT_CHOICE_BY_SIGNIN_UP_CAP;
  jaldee_cap = Messages.WIZ_JALDEE_CAP;
  enable_p_search_cap = Messages.WIZ_WILL_WALK_TO_ENABLE_P_SEARCH_CAP;
  remember_cap = Messages.WIZ_REMEMBER_CAP;
  adjust_sett_cap = Messages.WIZ_ADJUST_SETNGS_CAP;
  business_pro_cap = Messages.WIZ_BUSIESS_PROFILE_CAP;
  under_set_cap = Messages.WIZ_UNDER_SETTINGS_CAP;
  get_start_cap = Messages.WIZ_LET_GET_STARTED_CAP;
  profile_name_summary_cap = Messages.WIZ_PROFILE_NAME_SUMMARY_CAP;
  business_name_cap = Messages.WIZ_BUSINESS_NAME_CAP;
  your_cap = Messages.WIZ_YOUR_CAP;
  view_in_pub_search_cap = Messages.WIZ_VIEW_IN_PUBLIC_SEARCH_CAP;
  profile_summary_cap = Messages.WIZ_PROFILE_SUMMARY_CAP;
  next_cap = Messages.WIZ_NEXT_CAP;
  location_cap = Messages.WIZ_LOCATION_CAP;
  add_more_loc_in_set_cap = Messages.WIZ_ADD_MORE_LOC_IN_THE_SETT_CAP;
  add_more_services_in_set_cap = Messages.WIZ_ADD_MORE_SERVICE_IN_THE_SETT_CAP;
  add_more_queue_in_set_cap;
  choose_loc_cap = Messages.WIZ_CHOOSE_YOUR_LOCA_CAP;
  loc_not_avail_cap = Messages.WIZ_LOC_NOT_AVAIL_CAP;
  gps_coordinates_cap = Messages.WIZ_GPS_COORDINATES_CAP;
  gps_coordinated_needeed_cap = Messages.WIZ_GPS_COORDINATES_NEEDED_CAP;
  mob_for_loc_proximity_cap = Messages.WIZ_MOB_FOR_LOCA_PROXIMITY_CAP;
  address_cap = Messages.WIZ_ADDRESS_CAP;
  enter_addr_cap = Messages.WIZ_ENTER_ADDRESS_CAP;
  can_find_you_cap = Messages.WIZ_CAN_FIND_YOU_CAP;
  loc_name_cap = Messages.WIZ_LOC_NAME_CAP;
  disp_name_loc_cap = Messages.WIZ_DISPL_NAME_LOCA_CAP;
  google_map_url_cap = Messages.WIZ_GOOGLE_MAP_URL_CAP;
  used_find_exact_loc = Messages.WIZ_USED_FIND_EXACT_LOC_CAP;
  back_cap = Messages.WIZ_BACK_CAP;
  working_hrs_cap = Messages.WIZ_WORKING_HOURS_CAP;
  shows_b_hrs_cap = Messages.WIZ_SHOWS_B_HOURS_CAP;
  public_search_cap = Messages.WIZ_PUBLIC_SEARCH_CAP;
  turn_on_off_cap = Messages.WIZ_TURN_ON_OFF_CAP;
  turn_on_of = Messages.WIZ_TURN_ON_OF_CAP;
  prof_searchable_viewable_cap = Messages.WIZ_PRO_SEARCHABLE_VIEWABLE_CAP;
  turnon_pub_search_cap = Messages.WIZ_TURN_ON_P_SEARCH_CAP;
  your_pro_visible_cap = Messages.WIZ_YOUR_PROF_VISIBLE_TO_CAP;
  online_at_cap = Messages.WIZ_ONLINE_AT_CAP;
  jaldee_com_cap = Messages.WIZ_JALDEE_COM_CAP;
  turnoff_publ_search_cap = Messages.WIZ_TURN_OFF_P_SEARCH_CAP;
  prof_not_visible_cap = Messages.WIZ_PROF_NOT_VIBLE_TO_CAP;
  some_info_missing_cap = Messages.WIZ_SOME_INFO_MISSING_CAP;
  settings_cap = Messages.WIZ_SETTINGS_CAP;
  complete_your_pro_cap = Messages.WIZ_COMPL_YOUR_PRO_CAP;
  pub_search_cap = Messages.WIZ_PUB_SEARCH_CAP;
  service_cap = Messages.PRO_SERVICE_CAP;
  description_cap = Messages.DESCRIPTION_CAP;
  price_cap = Messages.PRICE_CAP;
  service_name_cap = Messages.SERVICE_NAME_CAP;
  est_duration_cap = Messages.EST_DURATION_CAP;
  enable_prepayment_cap = Messages.ENABLE_PREPAYMENT_CAP;
  prepayment_cap = Messages.PREPAYMENT_CAP;
  tax_applicable_cap = Messages.TAX_APPLICABLE_CAP;
  service_notify_cap = '';
  push_message_cap = Messages.PUSH_MESSAGE_CAP;
  service_email_cap = Messages.SERVICE_EMAIL_CAP;
  gallery_cap = Messages.GALLERY_CAP;
  select_image_cap = Messages.SELECT_IMAGE_CAP;
  go_to_service_cap = Messages.GO_TO_SERVICE_CAP;
  delete_btn = Messages.DELETE_BTN;
  cancel_btn = Messages.CANCEL_BTN;
  service_price_cap = Messages.SERVPRICE_CAP;
  foodServc_frmsentns = Messages.FOODSRVC_FORMLEVEL_CAP;
  rupee_symbol = '₹';
  @ViewChild('bnameId') bnameIdref: ElementRef;
  tbprof;

  amForm: FormGroup;
  number_decimal_pattern = '^[0-9]+\.?[0-9]*$';
  number_pattern = projectConstants.VALIDATOR_NUMBERONLY;
  service;
  payment_settings: any = [];
  payment_loading = false;
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  taxpercentage = 0;
  taxDetails: any = [];
  api_error = null;
  api_success = null;
  error_msg = null;
  name_placeholder;

  base_licence = false;
  businessConfig: any = [];
  userdet: any = [];
  active_step: number;
  wizard_data_holder: any = [];
  loc_list: any = [];
  schedule_arr: any = [];
  schedule_json: any = [];
  display_schedule: any = [];
  general_scheduleholder: any = [];
  general_schedule: any = [];
  schedule_alreadyexists_for_location = false;
  ischange_schedule_clicked = true;
  loading_active = true;
  search_status = 'DISABLE';
  search_active = false;
  coord_error = '';
  locname_error = '';
  bProfile;
  address_error = '';
  gurl_error = '';
  error_Exists = false;
  schedule_exists = false;
  customer_label = '';
  checkin_label = '';
  multipeLocationAllowed = false;
  disablebuttonsInSchedule = false;
  loc_exist = true;
  show_error = false;
  maxlimit = projectConstants.PRICE_MAX_VALUE;
  frm_wiz_one_cap = Messages.FRM_LEVEL_PRO_WIZ_ONE_MSG;
  frm_wiz_two_cap = Messages.FRM_LEVEL_PRO_WIZ_TWO_MSG;
  frm_wiz_three_cap = Messages.FRM_LEVEL_PRO_WIZ_THREE_MSG;
  frm_wiz_four_cap = Messages.FRM_LEVEL_PRO_WIZ_FOUR_MSG;
  frm_wiz_five_cap = Messages.FRM_LEVEL_PRO_WIZ_FIVE_MSG;
  frm_wiz_five1_cap = '';
  frm_wiz_five2_cap = '';
  frm_wiz_six_cap = Messages.FRM_LEVEL_PRO_WIZ_SIX_MSG;
  isServiceBillable;
  domain_fields;
  specializations_cap = Messages.SPECIALIZATIONS_CAP;
  speclization_caps = Messages.SPECIALIZATIONS_CAPS;
  no_speci_found_cap = Messages.NO_SPECI_FOUND_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;

  specialization_arr: any = [];
  query_done = false;
  selspecialization_arr: any = [];

  showAddSection = false;
  showAddSection1 = false;
  domain_questions = [];
  normal_domainfield_show = 1;
  subdomain_fields = [];
  subdomain_questions = [];
  normal_subdomainfield_show = 1;
  showSpecial = true;
  que_type = 'domain_questions';
  type;
  field;
  grid_row_index;
  subdomain;
  showvirtualadd = false;
  showAddbtn = false;
  origins = 'bwizard';

  constructor(
    private fb: FormBuilder,
    public shared_functions: SharedFunctions,
    public shared_services: SharedServices,
    public provider_services: ProviderServices,
    public fed_service: FormMessageDisplayService,
    private dialog: MatDialog,
    private routerobj: Router, private qservice: QuestionService,
    @Inject(DOCUMENT) public document
  ) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
  }

  ngOnInit() {
    this.getDomainSubdomainSettings();
    this.turn_on_off_cap = Messages.WIZ_TURN_ON_OFF_CAP.replace('[customer]', this.customer_label);
    this.turn_on_of = Messages.WIZ_TURN_ON_OF_CAP.replace('[customer]', this.customer_label);
    this.frm_wiz_five2_cap = Messages.FRM_LEVEL_PRO_WIZ_FIVE2_MSG.replace('[customer]', this.customer_label);
    this.frm_wiz_five1_cap = Messages.FRM_LEVEL_PRO_WIZ_FIVE1_MSG.replace('[customer]', this.customer_label);
    this.service_notify_cap = Messages.SERVICE_NOTIFY_CAP.replace('[customer]', this.customer_label);
    this.wizard_data_holder = {
      'name': '',
      'summary': '',
      'lat': '',
      'lon': '',
      'address': '',
      // 'searchstatus': false,
      'accountstatus': '',
      'location': ''
    };
    this.search_status = 'DISABLE';
    this.shared_functions.setBusinessDetailsforHeaderDisp('', '', '', '');
    const pdata = { 'ttype': 'updateuserdetails' };
    this.shared_functions.sendMessage(pdata);
    this.getServices();
    this.getgeneralBusinessSchedules(); // method to fetch the default schedule from the ynwconf API respose
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    // this.display_schedule =  this.shared_functions.arrageScheduleforDisplay(this.schedule_arr);
    this.getUserdetails();
    // this.getBusinessProfile();
    this.getBusinessConfiguration();
    const package_id = (this.userdet['accountLicenseDetails']['accountLicense']['licPkgOrAddonId']) ?
      this.userdet['accountLicenseDetails']['accountLicense']['licPkgOrAddonId'] : null;
    this.base_licence = (package_id === 1) ? true : false;
    this.active_step = 0;
    localStorage.removeItem('new_provider');

  }

  getUserdetails() {
    this.userdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
  }

  showStep(changetostep) {
    this.loading_active = true;
    this.resetErrors();
    if (changetostep === 2) {
      // this.ischange_schedule_clicked = false;
    } else if (changetostep === 4) {
      this.getSearchstatus();
    }
    const curstep = this.active_step; // taking the current step number to a local variable
    this.save_setDetails(curstep, changetostep);
    if (changetostep === 1) {
      setTimeout(() => {
        if (this.document.getElementById('bnameId')) {
          this.document.getElementById('bnameId').focus();
        }
      }, 1000);
    } else if (changetostep === 2) {
      this.createForm();
      this.setValue(this.service);
    } else if (changetostep === 3) {
      setTimeout(() => {
        if (this.document.getElementById('blatId')) {
          this.document.getElementById('blatId').focus();
        }
      }, 1000);
    }
  }

  save_setDetails(stepid, changetostep) {
    switch (stepid) {
      case 0:
        this.active_step = changetostep;
        this.loading_active = false;
        break;
      case 1:
        const post_itemdata1 = {
          'businessName': this.wizard_data_holder.name || '',
          'businessDesc': this.wizard_data_holder.summary || ''
        };

        // adding the basic data to the submit_data
        /* const blob_itemdata1 = new Blob([JSON.stringify(post_itemdata1)], { type: 'application/json' });
        const submit_data1: FormData = new FormData();
        submit_data1.append('data', blob_itemdata1);*/
        // this.provider_services.createPrimaryFields(submit_data1)
        this.provider_services.patchbProfile(post_itemdata1)
          .subscribe(
            data => {
              this.setBprofile_to_object(data);
              this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
              this.loading_active = false;
              // calling function which saves the business related details to show in the header
              const subsectorname = this.shared_functions.retSubSectorNameifRequired(data['serviceSector']['domain'], data['serviceSubSector']['displayName']);
              this.shared_functions.setBusinessDetailsforHeaderDisp(data['businessName'] || '', data['serviceSector']['displayName'], subsectorname, '');
              const pdata = { 'ttype': 'updateuserdetails' };
              this.shared_functions.sendMessage(pdata);
            },
            () => {
              this.loading_active = false;
            }
          );
        break;
      case 2:
        this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
        this.loading_active = false;
        break;
      case 3:
        let latlon_Exists = false;
        const blankpattern = new RegExp(projectConstants.VALIDATOR_BLANK);
        const floatpattern = new RegExp(projectConstants.VALIDATOR_FLOAT);
        const urlpattern = new RegExp(projectConstants.VALIDATOR_URL);
        let latexists = false;
        let lonexists = false;
        // validating the fields if they are entered
        if (this.wizard_data_holder.lon !== '' && this.wizard_data_holder.lon !== undefined) {
          latlon_Exists = true;
          const lon_validate = floatpattern.test(this.wizard_data_holder.lon);
          latexists = true;
          if (!lon_validate) {
            this.error_Exists = true;
            this.coord_error = 'Only number are allowed for GPS Coordinate';
          }
        }
        if (this.wizard_data_holder.lat !== '' && this.wizard_data_holder.lat !== undefined) {
          latlon_Exists = true;
          lonexists = true;
          const lat_validate = floatpattern.test(this.wizard_data_holder.lat);
          if (!lat_validate) {
            this.error_Exists = true;
            this.coord_error = 'Only number are allowed for GPS Coordinate';
          }
        }

        if (latlon_Exists) { // if lat or lan or both exist, then the location name is required
          if (!latexists || !lonexists) {
            this.error_Exists = true;
            this.coord_error = 'Both coordinates are required';
          }
          if (this.wizard_data_holder.location === undefined) {
            this.wizard_data_holder.location = '';
          }
          const locname_validate = blankpattern.test(this.wizard_data_holder.location);
          if (locname_validate) {
            this.error_Exists = true;
            this.locname_error = 'Please enter the location name';
          }
          const addr_validate = blankpattern.test(this.wizard_data_holder.address);
          if (addr_validate) {
            this.error_Exists = true;
            this.address_error = 'Please enter the address';
          }
          const mapurlexists_validate = blankpattern.test(this.wizard_data_holder.mapurl);
          if (!mapurlexists_validate) {
            const mapurl_validate = urlpattern.test(this.wizard_data_holder.mapurl);
            if (!mapurl_validate) {
              this.error_Exists = true;
              this.gurl_error = 'Invalid Google map URL';
            }
          }
        }
        if (this.wizard_data_holder.location && this.wizard_data_holder.location.trim() !== '' && !latlon_Exists) {
          this.error_Exists = true;
          this.coord_error = 'Both coordinates are required';
        }

        if (this.error_Exists === true) {
          this.loading_active = false;
          return;
        }
        const post_itemdata2 = {
          'baseLocation': {
            'place': this.wizard_data_holder.location || '',
            'longitude': this.wizard_data_holder.lon || '',
            'lattitude': this.wizard_data_holder.lat || '',
            'googleMapUrl': this.wizard_data_holder.mapurl || '',
            // 'pinCode': this.wizard_data_holder.pincode || '',
            'address': this.wizard_data_holder.address || '',
            'bSchedule': {
              'timespec': []
            }
          }
        };

        // Check whether atleast one schedule is added. If not setting the base schedule from constants to save it as the schedule for base location
        if (this.schedule_arr.length === 0) {
          // this.schedule_arr = projectConstants.BASE_SCHEDULE;
          this.setDefaultSchedules();
        }

        // Preparing the respective json variable with the schedule details
        this.schedule_json = [];
        const cdate2 = new Date();
        const mon2 = (cdate2.getMonth() + 1);
        let month2 = '';
        if (mon2 < 10) {
          month2 = '0' + mon2;
        }
        const today2 = cdate2.getFullYear() + '-' + month2 + '-' + cdate2.getDate();
        const save_schedule2 = this.shared_functions.prepareScheduleforSaving(this.schedule_arr);
        for (const schedule of save_schedule2) {
          this.schedule_json.push({
            'recurringType': 'Weekly',
            'repeatIntervals': schedule.daystr,
            'startDate': today2,
            'terminator': {
              'endDate': '',
              'noOfOccurance': ''
            },
            'timeSlots': [{
              'sTime': schedule.stime,
              'eTime': schedule.etime
            }]
          });
        }
        // assiging the schedule json to the object to save it
        // post_itemdata2.baseLocation.bSchedule.timespec = this.schedule_json;
        this.provider_services.patchbProfile(post_itemdata2)
          .subscribe(
            data => {
              this.setBprofile_to_object(data);
              this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
              this.loading_active = false;
            },
            (error) => {
              this.loading_active = false;
              this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
              // this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
        break;
      case 4:
        let post_itemdata3;
        // Check whether atleast one schedule is added
        if (this.schedule_arr.length === 0) {
          this.schedule_json = [];
        } else {
          this.schedule_json = [];
          const cdate = new Date();
          const mon = (cdate.getMonth() + 1);
          let month = '';
          if (mon < 10) {
            month = '0' + mon;
          }
          const today = cdate.getFullYear() + '-' + month + '-' + cdate.getDate();
          const save_schedule = this.shared_functions.prepareScheduleforSaving(this.schedule_arr);
          for (const schedule of save_schedule) {
            this.schedule_json.push({
              'recurringType': 'Weekly',
              'repeatIntervals': schedule.daystr,
              'startDate': today,
              'terminator': {
                'endDate': '',
                'noOfOccurance': ''
              },
              'timeSlots': [{
                'sTime': schedule.stime,
                'eTime': schedule.etime
              }]
            });
          }
        }

        post_itemdata3 = {
          'baseLocation': {
            'id': this.wizard_data_holder.locid,
            'bSchedule': {
              'timespec': this.schedule_json
            }
          }
        };
        // this.loading_active = false;

        // adding the schedule for the location
        /* const blob_itemdata3 = new Blob([JSON.stringify(post_itemdata3)], { type: 'application/json' });
        const submit_data3: FormData = new FormData();
        submit_data3.append('data', blob_itemdata3);*/
        // this.provider_services.createPrimaryFields(submit_data3)

        this.provider_services.patchbProfile(post_itemdata3)
          .subscribe(
            data => {
              this.setBprofile_to_object(data);
              this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
              this.loading_active = false;
            },
            (error) => {
              this.loading_active = false;
              if (changetostep > this.active_step) {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              } else {
                this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
              }
            }
          );
        break;
      case 5:
        this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
        this.loading_active = false;
        break;
      case 6:
        // this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
        this.active_step = 5;
        this.loading_active = false;
        break;
    }
  }
  onSubmit(form_data) {
    this.resetApiErrors();
    form_data.bType = 'Waitlist';
    if (!this.isServiceBillable) {
      form_data['totalAmount'] = 0;
      form_data['isPrePayment'] = false;
      form_data['taxable'] = false;
    } else {
      form_data.minPrePaymentAmount = (!form_data.isPrePayment || form_data.isPrePayment === false) ?
        0 : form_data.minPrePaymentAmount;
      form_data.isPrePayment = (!form_data.isPrePayment || form_data.isPrePayment === false) ? false : true;
    }
    form_data.id = this.service.id;
    this.updateService(form_data);
  }
  wizardPageShowDecision(curstep, changetostep) {
    let changerequired = false;
    let changeid = -1;
    if (curstep === 3 && changetostep === 4) { // from location to schedule
      // check whether the is sufficient location details to show the schedule
      /*if (this.wizard_data_holder.lat === '' || this.wizard_data_holder.lon  === '' || this.wizard_data_holder.location === '' ) {
        // case if sufficient info is not there to show the schedule page, so navigate user to the no sufficient page
        changerequired = true;
        changeid = 5; // commented since ynw told that schedule page should be shown even if location details are blank
      }*/
    } else if (curstep === 4 && changetostep === 5) { // from schedule to search
      if (this.wizard_data_holder.lat === '' || this.wizard_data_holder.lon === '' || this.wizard_data_holder.location === '' ||
        this.wizard_data_holder.name === '') {
        changerequired = true;
        changeid = 5;
      }
    } else if (curstep === 6 && changetostep === 5) { // from missing data to search
      this.loading_active = true;
      if (this.wizard_data_holder.name === '') { // if business name is blank, then take user to step 1
        changerequired = true;
        changeid = 1;
      } else if (this.wizard_data_holder.lat === '' || this.wizard_data_holder.lon === '' || this.wizard_data_holder.location === '') {
        // if location basic details are missing, then take user to step 2
        changerequired = true;
        changeid = 3;
      } else if (this.schedule_arr.length === 0) { // if schedule details are missing, take user to step 3
        changerequired = true;
        changeid = 4;
      }
      this.loading_active = false;
    }
    if (changerequired) {
      return changeid;
    } else {
      return changetostep;
    }
  }

  getBusinessProfile() {
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
        if (this.bProfile.specialization) {
          if (this.bProfile.specialization.length > 0) {
            this.showAddbtn = false;
          } else {
            this.showAddbtn = true;
          }
        } else {
          this.showAddbtn = true;
        }
        this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
        this.getDomainVirtualFields();
        if (this.bProfile['serviceSubSector']['subDomain']) {
          this.getSubDomainVirtualFields();
        }
        this.getSpecializations(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['subDomain']);
        this.setBprofile_to_object(data);
        this.tbprof = data;
        this.name_placeholder = projectConstants.PROFILE_ERROR_STACK[this.tbprof.serviceSector.domain];
        const subsectorname = this.shared_functions.retSubSectorNameifRequired(data['serviceSector']['domain'], data['serviceSubSector']['displayName']);
        this.shared_functions.setBusinessDetailsforHeaderDisp(data['businessName'] || '', data['serviceSector']['displayName'], subsectorname, '');
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
        for (let i = 0; i < this.businessConfig.length; i++) {
          if (this.businessConfig[i].id === this.tbprof['serviceSector']['id']) {
            if (this.businessConfig[i].multipleLocation) {
              this.multipeLocationAllowed = true;
            }
          }
        }
        this.loading_active = false;
      });
  }

  setBprofile_to_object(obj) {
    this.bProfile = obj;
    this.wizard_data_holder = {
      'name': obj.businessName || '',
      'summary': obj.businessDesc || '',
      'accountstatus': obj.status || ''
    };
    if (obj.baseLocation) {
      this.wizard_data_holder.locid = obj.baseLocation.id || '';
      this.wizard_data_holder.lat = obj.baseLocation.lattitude || '';
      this.wizard_data_holder.lon = obj.baseLocation.longitude || '';
      this.wizard_data_holder.address = obj.baseLocation.address || '';
      // this.wizard_data_holder.pincode =  obj.baseLocation.pinCode || '';
      this.wizard_data_holder.location = obj.baseLocation.place || '';
      this.wizard_data_holder.mapurl = obj.baseLocation.googleMapUrl || '';
      if (this.wizard_data_holder.mapurl === '' && this.wizard_data_holder.lat.trim() !== '' && this.wizard_data_holder.lon.trim !== '') {
        this.wizard_data_holder.mapurl = projectConstants.MAP_BASE_URL + this.wizard_data_holder.lat + ',' + this.wizard_data_holder.lon + '/@' + this.wizard_data_holder.lat + ',' + this.wizard_data_holder.lon + ',15z';
      }
      if (obj.baseLocation.bSchedule.timespec) {
        if (obj.baseLocation.bSchedule.timespec.length > 0) {
          this.schedule_arr = [];
        }
        // extracting the schedule intervals
        for (let i = 0; i < obj.baseLocation.bSchedule.timespec.length; i++) {
          for (let j = 0; j < obj.baseLocation.bSchedule.timespec[i].repeatIntervals.length; j++) {
            // pushing the schedule details to the respective array to show it in the page
            this.schedule_arr.push({
              day: obj.baseLocation.bSchedule.timespec[i].repeatIntervals[j],
              sTime: obj.baseLocation.bSchedule.timespec[i].timeSlots[0].sTime,
              eTime: obj.baseLocation.bSchedule.timespec[i].timeSlots[0].eTime
            });
          }
        }
      }
    }
    this.display_schedule = [];
    this.display_schedule = this.shared_functions.arrageScheduleforDisplay(this.schedule_arr);
  }

  skipMe() {
    this.redirecttoProfile();
  }
  changeSchedule_clicked() {
    this.ischange_schedule_clicked = true;
  }

  // Save schedule to arr
  handlesSaveschedule(obj) {
    this.schedule_arr = obj;
    this.display_schedule = this.shared_functions.arrageScheduleforDisplay(this.schedule_arr);
    this.disablebuttonsInSchedule = false;
    // this.ischange_schedule_clicked = false;
  }
  handleCancelschedule(obj) {
    this.handlesSaveschedule(obj);
    this.disablebuttonsInSchedule = false;
    // this.ischange_schedule_clicked = false;
  }
  handleaddeditscheduleclicked(obj) {
    if (obj === 'addeditclicked') {
      this.disablebuttonsInSchedule = true;
    }
  }

  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }

  showGooglemap() {
    const dialogRef = this.dialog.open(GoogleMapComponent, {
      width: '50%',
      panelClass: 'googlemainmappopup',
      disableClose: true,
      data: {
        type: 'add',
        passloc: { 'lat': this.wizard_data_holder['lat'], 'lon': this.wizard_data_holder['lon'] }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result['status'] === 'selectedonmap') {
          if (result['map_point'].latitude) {
            const mapurl = projectConstants.MAP_BASE_URL + result['map_point'].latitude + ',' + result['map_point'].longitude + '/@' + result['map_point'].latitude + ',' + result['map_point'].longitude + ',15z';

            this.wizard_data_holder['lat'] = result['map_point'].latitude || null;
            this.wizard_data_holder['lon'] = result['map_point'].longitude || null;
            this.wizard_data_holder['address'] = result['address'] || null;
            // this.wizard_data_holder['pincode'] = result['pincode'] || null;
            this.wizard_data_holder['mapurl'] = mapurl || null;
            if (!this.wizard_data_holder['address']) {
              if (this.document.getElementById('locaddress')) {
                this.document.getElementById('locaddress').focus();
              }
            }
          //  if (!this.wizard_data_holder['location']) {
              const addr = result['address'] || null;
              if (addr) {
                this.wizard_data_holder['location'] = addr.split(',')[0];
              }
           // }
          }
        }
      }
    });
  }
  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        const bprof = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
        if (bprof === null || bprof === undefined) {
          const today = new Date();
          const postdata = {
            cdate: today,
            bdata: this.businessConfig
          };
          this.shared_functions.setitemonLocalStorage('ynw-bconf', postdata);
        }
        this.getBusinessProfile();
      },
        () => {

        });
  }

  getSearchstatus() {
    this.provider_services.getPublicSearch()
      .subscribe(data => {
        if (data) {
          // this.wizard_data_holder['searchstatus'] = 1;
          this.search_status = 'ENABLE';
        } else {
          // this.wizard_data_holder['searchstatus'] = 2;
          this.search_status = 'DISABLE';
        }
      });
  }

  handle_searchstatus(status) {
    const prevstat = this.search_status;
    if (status === 'ENABLE') {
      if (this.search_status === 'ENABLE') {
        return;
      }
    } else if (status === 'DISABLE') {
      if (this.search_status === 'DISABLE') {
        return;
      }
    }
    this.provider_services.updatePublicSearch(status)
      .subscribe(() => {
        if (status === 'ENABLE') {
          // this.wizard_data_holder['searchstatus'] = 1;
          this.search_status = 'ENABLE';
        } else if (status === 'DISABLE') {
          // this.wizard_data_holder['searchstatus'] = 2;
          this.search_status = 'DISABLE';
        }
      }, error => {
        if (status === 'ENABLE') {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
        this.search_status = prevstat;
      });
  }

  redirecttoProfile() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile-search']);
  }

  checkClose() {
    let show_incomplete = false;
    const bname = (this.wizard_data_holder.name) ? this.wizard_data_holder.name.trim() : '';
    const lat = (this.wizard_data_holder.lat) ? this.wizard_data_holder.lat.trim() : '';
    const lon = (this.wizard_data_holder.lon) ? this.wizard_data_holder.lon.trim() : '';
    const lname = (this.wizard_data_holder.location) ? this.wizard_data_holder.location.trim() : '';
    const sch = this.schedule_arr.length;
    if (bname === '') {
      show_incomplete = true;
    }
    if (lat === '') {
      show_incomplete = true;
    }
    if (lon === '') {
      show_incomplete = true;
    }
    if (lname === '') {
      show_incomplete = true;
    }
    if (sch === 0 || sch === '') {
      show_incomplete = true;
    }
    if (show_incomplete) { // if incomplete data is there then show the incomplete page
      this.active_step = 7;
    } else { // if sufficient data is there, then show the bprofile
      this.redirecttoProfile();
    }
  }
  resetErrors() {
    this.error_Exists = false;
    this.coord_error = '';
    this.locname_error = '';
    this.address_error = '';
    this.gurl_error = '';
  }

  getgeneralBusinessSchedules() {
    this.provider_services.getgeneralBusinessSchedules()
      .subscribe(data => {
        this.general_scheduleholder = data;
        this.general_schedule = [];
        for (let j = 0; j < this.general_scheduleholder.length; j++) {
          const obt_sch = this.general_scheduleholder[j];
          for (let k = 0; k < obt_sch.repeatIntervals.length; k++) {
            // pushing the schedule details to the respective array to show it in the page
            for (let l = 0; l < obt_sch.timeSlots.length; l++) {
              this.general_schedule.push({
                day: obt_sch.repeatIntervals[k],
                sTime: obt_sch.timeSlots[l].sTime,
                eTime: obt_sch.timeSlots[l].eTime
              });
            }
          }
        }
        this.setDefaultSchedules();
      },
        () => {
        });
  }

  setDefaultSchedules() {
    if (this.general_schedule.length > 0) {
      this.schedule_arr = this.general_schedule;
    } else {
      this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    }
    // this.display_schedule =  this.shared_functions.arrageScheduleforDisplay(this.schedule_arr);
  }
  handlekeyup(mod) {
    switch (mod) {
      case 'locname_error':
        this.locname_error = '';
        break;
      case 'address_error':
        this.address_error = '';
        break;
      case 'coord_error':
        this.coord_error = '';
        break;
    }
  }

  // Service Section
  createForm() {
    if (!this.isServiceBillable) {
      this.amForm = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        description: ['', Validators.compose([Validators.maxLength(500)])],
        // serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])],
        serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_pattern), Validators.maxLength(10)])],
        // totalAmount: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
        // isPrePayment: [{'value': false , 'disabled': this.base_licence }],
        // taxable: [false],
        notification: [false]
      });
    } else {
      this.amForm = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        description: ['', Validators.compose([Validators.maxLength(500)])],
        // serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])],
        serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_pattern), Validators.maxLength(10)])],
        totalAmount: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
        isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
        taxable: [false],
        notification: [false]
      });
    }
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amForm.get('description').value.length;
  }
  lostDescFocus() {
    this.isfocused = false;
  }
  setCharCount() {
    this.char_count = this.max_char_count - this.amForm.get('description').value.length;
  }
  changeNotification() {
    if (this.amForm.get('notification').value === false) {
      this.amForm.removeControl('notificationType');
    } else {

      const value = (this.service['notificationType']) ?
        this.service['notificationType'] : 'email';
      this.amForm.addControl('notificationType',
        new FormControl(value));
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
    this.error_msg = null;
  }
  getPaymentSettings() {
    this.payment_loading = true;
    this.provider_services.getPaymentSettings()
      .subscribe(
        data => {
          this.payment_settings = data;
          this.payment_loading = false;
          if (!this.payment_settings.onlinePayment) {
            this.shared_functions.apiErrorAutoHide(this, Messages.SERVICE_PRE_PAY_ERROR);
            if (this.isServiceBillable) {
              this.amForm.get('isPrePayment').setValue(false);
              this.changePrepayment();
            }
          }
        },
        () => {
          // this.shared_functions.apiErrorAutoHide(this, error);
          // this.amForm.get('isPrePayment').setValue(false);
        }
      );
  }
  taxapplicableChange() {
    if (this.taxpercentage <= 0) {
      this.api_error = this.shared_functions.getProjectMesssages('SERVICE_TAX_ZERO_ERROR');
      setTimeout(() => {
        this.api_error = null;
      }, projectConstants.TIMEOUT_DELAY_LARGE);
      this.amForm.get('taxable').setValue(false);
    } else {
      this.api_error = null;
    }
  }
  setValue(data) {
    if (!this.isServiceBillable) {
      this.amForm.setValue({
        'name': data['name'] || this.amForm.get('name').value,
        'description': data['description'] || this.amForm.get('description').value,
        'serviceDuration': data['serviceDuration'] || this.amForm.get('serviceDuration').value,
        /*'totalAmount': data['totalAmount'] || this.amForm.get('totalAmount').value,
        'isPrePayment': (!this.base_licence && data['minPrePaymentAmount'] &&
                                data['minPrePaymentAmount'] !== 0
                                ) ? true : false,
        'taxable': data['taxable'] || this.amForm.get('taxable').value,*/
        'notification': false,
      });
    } else {
      this.amForm.setValue({
        'name': data['name'] || this.amForm.get('name').value,
        'description': data['description'] || this.amForm.get('description').value,
        'serviceDuration': data['serviceDuration'] || this.amForm.get('serviceDuration').value,
        'totalAmount': data['totalAmount'] || this.amForm.get('totalAmount').value || '0',
        'isPrePayment': (!this.base_licence && data['minPrePaymentAmount'] &&
          data['minPrePaymentAmount'] !== 0
        ) ? true : false,
        'taxable': data['taxable'] || this.amForm.get('taxable').value,
        'notification': false,
      });
    }
    this.changeNotification();
    this.changePrepayment();
  }
  updateService(post_data) {
    this.provider_services.updateService(post_data)
      .subscribe(
        () => {
          this.service = post_data;
          this.showStep(3);
          this.add_more_queue_in_set_cap = Messages.WIZ_ADD_MORE_QUEUE_IN_THE_SETT_CAP;
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.shared_functions.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getServices() {
    this.provider_services.getServicesList()
      .subscribe(
        data => {
          this.service = data[0];
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );
  }

  isvalid(evt) {
    return this.shared_functions.isValid(evt);
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }

  changePrepayment() {
    if (this.isServiceBillable) {
      if (this.amForm.get('isPrePayment').value === false) {
        this.amForm.removeControl('minPrePaymentAmount');
      } else {
        if (this.amForm.get('isPrePayment').value === true) {
          this.getPaymentSettings();
        }
        const value = (this.service['minPrePaymentAmount']) ?
          this.service['minPrePaymentAmount'] : '';

        this.amForm.addControl('minPrePaymentAmount',
          new FormControl(value, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])));
      }
    }
  }
  getDomainSubdomainSettings() {
    const user_data = this.shared_functions.getitemfromLocalStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    this.provider_services.domainSubdomainSettings(domain, sub_domain)
      .subscribe(
        (data: any) => {
          if (data.serviceBillable) {
            this.isServiceBillable = true;
          } else {
            this.isServiceBillable = false;
          }
        },
        error => {

        }
      );
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

  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            const set_data = [];
            set_data['fields'] = _this.setFieldValue(data, subdomin);
            set_data['questions'] = _this.qservice.getQuestions(set_data['fields']);
            resolve(set_data);
          },
          () => {
            reject();
          }
        );
    });
  }

  getDomainVirtualFields() {
    this.getVirtualFields(this.bProfile['serviceSector']['domain'])
      .then(
        data => {
          this.domain_fields = data['fields'];
          this.domain_questions = data['questions'] || [];
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
        }
      );
  }

  getSubDomainVirtualFields() {
    this.getVirtualFields(this.bProfile['serviceSector']['domain'],
      this.bProfile['serviceSubSector']['subDomain']).then(
        data => {
          this.subdomain_fields = data['fields'];
          this.subdomain_questions = data['questions'] || [];
          this.normal_subdomainfield_show = (this.normal_subdomainfield_show === 2) ? 4 : 3;
        }
      );
  }

  getSpecializations(domain, subdomain) {
    this.provider_services.getSpecializations(domain, subdomain)
      .subscribe(data => {
        this.specialization_arr = data;
      });
  }

  getSpecializationName(n) {
    for (let i = 0; i < this.specialization_arr.length; i++) {
      if (this.specialization_arr[i].name === n) {
        return this.specialization_arr[i].displayName;
      }
    }
  }

  specializationSel(sel) {
    if (this.selspecialization_arr.length > 0) {
      const existindx = this.selspecialization_arr.indexOf(sel);
      if (existindx === -1) {
        this.selspecialization_arr.push(sel);
      } else {
        this.selspecialization_arr.splice(existindx, 1);
      }
    } else {
      this.selspecialization_arr.push(sel);
    }
  }

  checkspecializationExists(lang) {
    if (this.selspecialization_arr.length > 0) {
      const existindx = this.selspecialization_arr.indexOf(lang);
      if (existindx !== -1) {
        return true;
      }
    } else {
      return false;
    }
  }

  saveSpecializations() {
    this.resetApiErrors();
    const postdata = {
      'specialization': this.selspecialization_arr
    };
    this.provider_services.updatePrimaryFields(postdata)
      .subscribe(data => {
        this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_SPECIALIZATION_SAVED');
        this.showSpecial = true;
        this.getBusinessProfile();
        setTimeout(() => {
        }, projectConstants.TIMEOUT_DELAY);
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  addDynamicField(field, type) {
    if (field.dataType === 'DataGrid') {
      this.editGridDynamicField(field.name, type, null);
    } else {
      this.editDynamicField(field.name, type);
    }
  }

  editDynamicField(field_name, type) {
    const field = this.getFieldQuestion(field_name, type);
    this.showDynamicFieldPopup(field, type);
    this.showAddSection = false;
    this.showAddSection1 = true;
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

  editGridDynamicField(field_name, type, index = 0) {
    const field = JSON.parse(JSON.stringify(this.getFieldQuestion(field_name, type)));
    if (index !== null) {
      const column = field[0]['columns'][index] || [];
      field[0]['columns'] = [];
      field[0]['columns'].push(column);

      const selected_row = field[0]['value'][index] || [];
      field[0]['value'] = [];
      field[0]['value'].push(selected_row);
    } else {
      const column = field[0]['columns'][0] || [];
      field[0]['columns'] = [];
      field[0]['columns'].push(column);
      column.map((e) => { delete e.value; });
    }
    this.showDynamicFieldPopup(field, type, index);
    this.showAddSection1 = false;
    this.showAddSection = true;
  }

  deleteGridDynamicField(field_name, type = 'domain_questions', index = 0) {
    const pre_value = (type === 'domain_questions') ? JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields'])) :
      JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
    const grid_list = pre_value[field_name] || [];
    if (grid_list.length === 1 && index === 0) {
      delete pre_value[field_name];
    } else {
      grid_list.splice(index, 1);
      pre_value[field_name] = grid_list;
    }
    if (type === 'domain_questions') {
      this.onDomainsFormSubmit(pre_value);
    } else if (type === 'subdomain_questions') {
      this.onSubDomainsFormSubmit(pre_value);
    }
  }

  showDynamicFieldPopup(field, type, grid_row_index = null) {
    this.que_type = type;
    this.field = field;
    this.grid_row_index = grid_row_index;
  }

  onDomainsFormSubmit(post_data) {
    this.provider_services.updateDomainSubDomainFields(post_data,
      this.bProfile['serviceSector']['domain'])
      .subscribe(
        () => {
          this.getBusinessProfile();
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  onSubDomainsFormSubmit(post_data) {
    this.provider_services.updateDomainSubDomainFields(post_data, null,
      this.bProfile['serviceSubSector']['subDomain'])
      .subscribe(
        () => {
          this.getBusinessProfile();
          this.showAddSection = false;
          this.showAddSection1 = false;
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  onDomainFormSubmit(submit_data) {
    this.resetApiErrors();
    submit_data = this.checkEnumList(this.domain_questions, submit_data);
    submit_data = this.checkGridQuestion(this.domain_questions, submit_data);
    const post_data = this.setPostData(submit_data);
    this.provider_services.updateDomainSubDomainFields(post_data, this.bProfile['serviceSector']['domain'])
      .subscribe(
        () => {
          this.onDomainsFormSubmit(submit_data);
          this.showAddSection = false;
          this.showAddSection1 = false;
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  onSubDomainFormSubmit(submit_data) {
    this.resetApiErrors();
    submit_data = this.checkEnumList(this.subdomain_questions, submit_data);
    submit_data = this.checkGridQuestion(this.subdomain_questions, submit_data);
    const post_data = this.setPostData(submit_data);
    const hold_data = post_data; // additional checking to avoid blank arrays related issues reported in bug
    Object.keys(hold_data).forEach(key => {
      if (typeof hold_data[key] === 'object') {
        if (hold_data[key].length > 0) {
          post_data[key] = hold_data[key];
        } else {
          delete post_data[key];
        }
      } else {
        post_data[key] = hold_data[key];
      }
    });
    this.provider_services.updateDomainSubDomainFields(post_data, null,
      this.bProfile['serviceSubSector']['subDomain'])
      .subscribe(
        () => {
          this.onSubDomainsFormSubmit(submit_data);
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  checkEnumList(questions, submit_data) {
    for (const row of questions) {
      // if (row.controlType === 'enumlist') {
      //   submit_data[row.key] = this.changeEnumValues(submit_data[row.key]);
      // }
    }
    return submit_data;
  }

  changeEnumValues(grid_value_list) {
    const value = [];
    if (grid_value_list[0]) {
      const loop_val = grid_value_list[0];
      for (const key in loop_val) {
        if (loop_val[key] === true) {
          value.push(key);
        }
      }
      return value;
    } else {
      return [];
    }
  }

  setPostData(submit_data) {
    const keys = Object.keys(submit_data);
    let pre_value = {};
    if (this.que_type === 'domain_questions' && typeof this.bProfile['domainVirtualFields'] === 'object') {
      pre_value = JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields']));
    } else if (this.que_type === 'subdomain_questions' && typeof this.bProfile['subDomainVirtualFields'] === 'object') {
      pre_value = JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
    }
    for (const key of keys) {
      if (pre_value[key]) {
        if (typeof submit_data[key] === 'string' && submit_data[key] !== '' ||
          (typeof submit_data[key] === 'object' && submit_data[key].length !== 0)) {
          pre_value[key] = submit_data[key];
        } else {
          delete pre_value[key];
        }
      } else {
        pre_value[key] = submit_data[key];
      }
    }
    return pre_value;
  }

  checkGridQuestion(questions, submit_data) {
    for (const row of questions) {
      if (row.controlType === 'datagrid') {
        submit_data[row.key] = this.changeGridValues(submit_data[row.key], row.key);
      }
    }
    return submit_data;
  }

  changeGridValues(grid_value_list, key) {
    let pre_value = {};
    if (this.que_type === 'domain_questions' &&
      typeof this.bProfile['domainVirtualFields'] === 'object') {
      pre_value = JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields']));
    } else if (this.que_type === 'subdomain_questions' && typeof this.bProfile['subDomainVirtualFields'] === 'object') {
      pre_value = JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
    }
    if (pre_value[key]) {
      if (pre_value[key][this.grid_row_index]) {
        pre_value[key][this.grid_row_index] = grid_value_list[0];
      } else {
        if (grid_value_list) {
          pre_value[key].push(grid_value_list[(grid_value_list.length - 1)]);
        }
      }
      return pre_value[key];
    } else {
      return grid_value_list;
    }
  }

  handleSpecialization() {
    this.showSpecial = false;
  }

  cancel() {
    this.showSpecial = true;
  }

  handleCancel(obj) {
    this.showAddSection1 = false;

  }
  handlegridCancel(obj) {
    this.showAddSection = false;
  }
}

