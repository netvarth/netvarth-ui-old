import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SearchDetailServices } from '../search-detail/search-detail-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { LoginComponent } from '../../components/login/login.component';
import { SignUpComponent } from '../../components/signup/signup.component';
import { SearchFields } from '../../modules/search/searchfields';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { CheckInComponent } from '../../modules/check-in/check-in.component';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { CouponsComponent } from '../coupons/coupons.component';
import { JdnComponent } from '../jdn-detail/jdn-detail-component';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css'],
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

export class SearchDetailComponent implements OnInit, OnDestroy {

  refine_search_cap = Messages.REFINE_SEARCH_CAP;
  select_domain_cap = Messages.SELECT_DOMAIN_CAP;
  select_subdomain_cap = Messages.SELECT_SUBDOMAIN_CAP;
  select_cap = Messages.SELECT_CAP;
  show_more_cap = Messages.SHOW_MORE_CAP;
  show_less_cap = Messages.SHOW_LESS_CAP;
  other_filters_cap = Messages.OTHER_FILTERS_CAP;
  found_cap = Messages.FOUND_CAP;
  none_cap = Messages.NONE_CAP;
  distance_cap = Messages.DISTANCE_CAP;
  jaldee_verified = Messages.JALDEE_VERIFIED_CAP;
  basic_cap = Messages.BASIC_CAP;
  basic_plus_cap = Messages.BASIC_PLUS_CAP;
  premium_cap = Messages.PREMIUM_CAP;
  send_messages = Messages.SEND_MSG;
  claim_my_business_cap = Messages.CLAIM_BUSINESS_CAP;
  open_now_cap = Messages.OPEN_NOW_CAP;
  sorry_cap = Messages.SORRY_CAP;
  not_allowed_cap = Messages.NOT_ALLOWED_CAP;
  do_you_want_to_cap = Messages.DO_YOU_WANT_TO_CAP;
  for_cap = Messages.FOR_CAP;
  different_date = Messages.DIFFERENT_DATE_CAP;
  no_ynw_results_found = Messages.NO_YNW_RES_FOUND_CAP;
  get_token_btn = Messages.GET_TOKEN;
  people_ahead = Messages.PEOPLE_AHEAD_CAP;
  no_people_ahead = Messages.NO_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  jaldee_coupon = Messages.JALDEE_COUPON;
  first_time_coupon = Messages.FIRST_TIME_COUPON;
  get_token_cap = Messages.GET_FIRST_TOKEN;
  nextAvailDate;
  sortTooltip = Messages.SORT_TOOLTIP;

  public domainlist_data;
  public domain;
  public subdomainlist_data;
  public selected_leftsubdomain;
  public locname;
  public locautoname;
  loctype;
  public latitude;
  public longitude;
  public kw;
  public kwautoname;
  public kwdomain;
  public kwsubdomain;
  public kwtyp;
  public search_string: string;
  public search_return;
  public search_data;
  public search_result_count;
  public sortfield;
  public sortorder;
  activeDistanceSort = false;
  public nosearch_results;
  public startpageval;
  public labelq;
  public subsector;
  public specialization;
  public rating;
  public searchrefine_arr: any = [];
  public searchcommononlyrefine_arr: any = [];
  public searchrefineresult_arr: any = [];
  public refined_querystr = '';
  public searchrefinetextresult_arr: any = [];
  public refined_textquerystr = '';
  public refined_options_url_str = '';
  public querystringrefineretain_arr: any = [];
  public showsearchsection = false;
  obtainedRefined = false;
  public arraycreatedfromquerystring = false;
  public commonfilters;
  public passrefinedfilters;
  public refinedExists = false;
  public showopnow = 0;
  public subdomainleft;
  public scrolltop = 0;
  public retscrolltop = 0;
  ratingholder;
  changedate_req = false;
  specialization_exists = false;
  location_cnt = 0;
  showrefinedsection = true;
  current_provider;
  result_provid: any = [];
  result_providdet: any = [];
  waitlisttime_arr: any = [];
  sidebarheight = '';
  waitlistestimatetimetooltip = Messages.SEARCH_ESTIMATE_TOOPTIP;
  searchfields: SearchFields = new SearchFields();
  screenHeight;
  screenWidth;
  kwdet: any = [];
  refined_domain = '';
  refined_subdomain = '';
  specialization_hide = false;
  showmore_defaultcnt = projectConstants.REFINE_ENUMLIST_DEFAULT_SHOW_CNT;
  holdprovidforCommunicate = 0;
  searchButtonClick = false;
  commTooltip = '';
  refTooltip = '';
  bNameTooltip = '';
  jdnTooltip = '';
 couponTooltip = '';
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  hideRefineifOneresultchk = false;
  checkindialogRef;
  claimdialogRef;
  servicedialogRef;
  commdialogRef;
  coupondialogRef;
  jdndialogRef;
  isfirstCheckinOffer = false;
  btn_clicked = false;
  server_date;
  isCheckinEnabled = true;
  loc_details;
  testuserQry;
  q_str;
  account_type;
  branch_id;
  search_datas: any = [];
  provider_label = '';
  showServices = false;
  departServiceList: any = [];
  selectedDepartment;

  constructor(private routerobj: Router,
    private location: Location,
    private activaterouterobj: ActivatedRoute,
    private shared_service: SharedServices,
    private shared_functions: SharedFunctions,
    private searchdetailserviceobj: SearchDetailServices,
    private dialog: MatDialog) {
    this.onResize();
  }

  ngOnInit() {
    this.loc_details = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.checkRefineSpecial();
    this.couponTooltip = this.shared_functions.getProjectMesssages('COUPON_TOOPTIP');
    this.jdnTooltip = this.shared_functions.getProjectMesssages('JDN_TOOPTIP');
    this.commTooltip = this.shared_functions.getProjectMesssages('COMM_TOOPTIP');
    this.refTooltip = this.shared_functions.getProjectMesssages('REF_TOOPTIP');
    this.bNameTooltip = this.shared_functions.getProjectMesssages('BUSSNAME_TOOPTIP');
    this.showrefinedsection = false; // this is done to override all conditions and to hide the refined filter section by default
    this.getDomainListMain()
      .then(data => {
        this.domainlist_data = data;
        this.activaterouterobj.params
          .subscribe(paramsv => {
            this.setSearchfields(paramsv, 1);
            this.setEnvironment(false);
          });
      });
    const activeUser = this.shared_functions.getitemfromSessionStorage('ynw-user');
    if (activeUser) {
      this.isfirstCheckinOffer = activeUser.firstCheckIn;
    }
    this.nosearch_results = false;
    this.retscrolltop = this.shared_functions.getitemfromSessionStorage('sctop') || 0;
    this.shared_functions.setitemonLocalStorage('sctop', 0);
  }
  stringToInt(stringVal) {
    return parseInt(stringVal, 0);
  }
  ngOnDestroy() {
    if (this.checkindialogRef) {
      this.checkindialogRef.close();
    }
    if (this.claimdialogRef) {
      this.claimdialogRef.close();
    }
    if (this.servicedialogRef) {
      this.servicedialogRef.close();
    }
    if (this.commdialogRef) {
      this.commdialogRef.close();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.showrefinedsection = false;
    }
  }
  @HostListener('window:scroll', ['$event'])
  doScroll(event) {
    this.scrolltop = window.pageYOffset;
  }
  checkRefineSpecial() {
    const ynwsrchbuttonClicked = this.shared_functions.getitemfromLocalStorage('ynw_srchb');
    this.shared_functions.removeitemfromLocalStorage('ynw_srchb');
    if (ynwsrchbuttonClicked === 1) {
      this.hideRefineifOneresultchk = true;
    } else {
      this.hideRefineifOneresultchk = false;
    }
  }

  getDomainListMain() {
    return new Promise((resolve, reject) => {
      const bconfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
      let run_api = true;
      if (bconfig) { // case if data is there in local storage
        if (bconfig.bdata) {
          const bdate = bconfig.cdate;
          const bdata = bconfig.bdata;
          const saveddate = new Date(bdate);
          const diff = this.shared_functions.getdaysdifffromDates('now', saveddate);
          if (diff['hours'] < projectConstants.DOMAINLIST_APIFETCH_HOURS) {
            run_api = false;
            resolve(bdata);
          }
        }
      }
      if (run_api) { // case if data is not there in data
        this.shared_service.bussinessDomains()
          .subscribe(
            res => {
              const today = new Date();
              const postdata = {
                cdate: today,
                bdata: this.domainlist_data
              };
              this.shared_functions.setitemonLocalStorage('ynw-bconf', postdata);
              resolve(res);
            }
          );
      }
    });
  }
  setEnvironment(bypassotherfunction?) {
    if (this.subsector !== '' && this.subsector !== undefined && this.subsector !== 'undefined') {
      const domainobtain = this.getdomainofaSubdomain(this.subsector);
      if (domainobtain !== undefined && domainobtain) {
        this.kwautoname = domainobtain['subdom_dispname'] || '';
        this.kwdomain = domainobtain['dom'] || '';
      }
      this.kwsubdomain = '';
      this.kwtyp = 'subdom';
    }
    let fetchsubdom = true;
    if (this.domain) {
      if (this.kw) {
        if (this.kwtyp === 'subdom') {
          fetchsubdom = false;
        }
        if (this.kwtyp === 'special') {
          if (this.kwsubdomain !== '') {
            fetchsubdom = false;
          }
          this.specialization_exists = true;
        }
      }
      if (fetchsubdom) {
        this.getlistofSubdomains(this.domain, 'setenv');
      }
    }
    this.showsearchsection = true;
    if (!bypassotherfunction) {
      this.setfields();
      if (this.labelq === '') {
        this.getRefinedSearch(true, 0, 'domainlist');
      } else {
        this.buildQuery(false);
      }
    }
  }
  checklocationExistsinStorage() {
    const localloc = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
    const holdLocObj = {
      autoname: this.locautoname || '',
      name: this.locname || '',
      lat: this.latitude || '',
      lon: this.longitude || '',
      typ: this.loctype || ''
    };
    if (this.locname === '') {
      holdLocObj.autoname = projectConstants.SEARCH_DEFAULT_LOCATION.autoname;
      holdLocObj.name = projectConstants.SEARCH_DEFAULT_LOCATION.name;
      holdLocObj.lat = projectConstants.SEARCH_DEFAULT_LOCATION.lat;
      holdLocObj.lon = projectConstants.SEARCH_DEFAULT_LOCATION.lon;
      holdLocObj.typ = projectConstants.SEARCH_DEFAULT_LOCATION.typ;
    }
    this.shared_functions.setitemonLocalStorage('ynw-locdet', holdLocObj);
  }

  setSearchfields(obj, src) {
    if (src === 1) { // case from ngoninit
      this.searchButtonClick = true;
      this.domain = obj.do;
      this.locname = obj.lon;
      this.locautoname = obj.lonauto;
      this.loctype = obj.lontyp;
      this.latitude = obj.la;
      this.longitude = obj.lo;
      this.kw = obj.kw;
      this.kwautoname = obj.kwauto;
      this.kwsubdomain = obj.kwsubdomain;
      this.kwtyp = obj.kwtyp;
      this.labelq = this.shared_functions.Lbase64Decode(obj.lq) || '';
      this.commonfilters = obj.cfilter || '';
      this.checklocationExistsinStorage();
      this.kwdet = {
        kw: this.kw,
        kwautoname: this.kwautoname,
        kwdomain: this.kwdomain,
        kwsubdomain: this.kwsubdomain,
        kwtyp: this.kwtyp
      };

      if (this.kwtyp === 'special') {
        if (this.kwdomain !== '') {
          this.domain = this.kwdomain;
        }
        if (this.kwsubdomain !== '') {
          this.selected_leftsubdomain = this.kwsubdomain;
        }
        this.specialization_hide = true;
      }

      if (this.kwtyp === 'subdom') {
        if (this.kwdomain !== '') {
          this.domain = this.kwdomain;
        }
        if (this.kw !== '') {
          this.selected_leftsubdomain = this.kw;
        }
      }
      // calling method to parse refine filters in query string to respective array
      this.parseRefinedfiltersQueryString(obj);
      if (obj.cpg) { // check whether paging value is there in the url
        let cnumb = Number(obj.cpg);
        if (isNaN(cnumb)) {
          cnumb = 1;
        }
        this.startpageval = cnumb;
      } else {
        this.startpageval = 1;
      }
      if (obj.sort && obj.srt !== ' ') {
        const sr = obj.srt.split(' ');
        this.sortfield = sr[0];
        this.sortorder = sr[1];
      } else {
        this.sortfield = '';
        this.sortorder = '';
      }
      if (this.labelq !== '') { // if came to details page by clicking the search labels
        this.parsesearchLabelsQuerystring(this.labelq, false); // function which parse and set the respective public variable
      } else { // to handle the case of splitting the query string in case of refresh from search result page
        this.parsesearchLabelsQuerystring(obj.q, false);
      }
    } else if (src === 2) { // case of setting values in response to call from the searchdetails page
      this.searchButtonClick = true;
      this.refined_domain = '';
      this.refined_subdomain = '';
      this.subsector = '';
      this.domain = obj.domain;
      this.locname = obj.location;
      this.locautoname = obj.locationautoname;
      this.loctype = obj.locationtype;
      this.latitude = obj.latitude;
      this.longitude = obj.longitude;
      this.kw = obj.kw;
      this.kwautoname = obj.kwautoname;
      this.kw = obj.kw;
      this.kwdomain = obj.kwdomain;
      this.kwsubdomain = obj.kwsubdomain;
      this.kwtyp = obj.kwtyp;
      this.checklocationExistsinStorage();
      this.getlistofSubdomains(this.domain, 'setsearchfields1');
      if (this.kwtyp === 'subdom') {
        this.subsector = this.kw;
        if (this.kwdomain !== '') {
          this.domain = this.kwdomain;
        }
        if (this.domain === '' || this.domain === 'All') {
          const domdet = this.getdomainofaSubdomain(this.kw);
          if (domdet) {
            this.domain = domdet.dom;
          } else {
            this.domain = 'All';
          }
        }
        this.getlistofSubdomains(this.domain, 'searchfields2');
      }
      if (this.kwtyp === 'special') {
        if (this.kwdomain !== '') {
          this.domain = this.kwdomain;
        }
        if (this.kwsubdomain !== '') {
          this.subsector = this.kwsubdomain;
          const domdet = this.getdomainofaSubdomain(this.kwsubdomain);
          if (domdet.dom !== '') {
            this.domain = domdet.dom;
          } else {
            this.domain = 'All';
          }
        }
        this.specialization_hide = true;
        this.specialization_exists = true;
      }
      if (this.subsector !== '' && this.subsector !== undefined && this.subsector !== 'undefined') {
        if (this.kwtyp === 'label') {
          this.kwtyp = 'subdom';
        }
      }
      this.startpageval = 1; // obj.pg;
      if (obj.sortfield) {
        this.sortfield = obj.sortfield;
        this.sortorder = obj.sortorder;
      }
      this.labelq = this.shared_functions.Lbase64Decode(obj.labelq) || '';
      this.commonfilters = obj.commonfilters || '';
      this.passrefinedfilters = obj.passrefinedfilters || [];
      if (this.passrefinedfilters.length > 0) {
        this.searchButtonClick = false;
        const passparam1 = {};
        for (let i = 0; i < this.passrefinedfilters.length; i++) {
          for (const field in this.passrefinedfilters[i]) {
            if (field) {
              let valstr = '';
              for (const fval of this.passrefinedfilters[i][field]) {
                if (valstr !== '') {
                  valstr += '~';
                }
                valstr += fval[0];
              }
              passparam1['myref_' + field.toString()] = valstr;
            }
          }
        }
        this.parseRefinedfiltersQueryString(passparam1);
      }
      if (this.labelq !== '') { // if came to details page by clicking the search labels
        this.parsesearchLabelsQuerystring(this.labelq, true); // function which parse and set the respective public variable
      }
    }
  }
  // function to parse and fetch the details related to dynamic refine filters fields
  parseRefinedfiltersQueryString(obj) {
    this.arraycreatedfromquerystring = false;
    this.refinedExists = false;
    this.querystringrefineretain_arr = [];
    for (const ufield in obj) {
      if (ufield) {
        const sufield = ufield.substr(0, 6);
        if (sufield === 'myref_') {
          const orgfield = ufield.substr(6); // getting the original name by eleminating the prefix
          this.refinedExists = true;
          if (this.check_QuerystrinfieldexistsinArray(sufield) === -1) {
            this.querystringrefineretain_arr[orgfield] = obj[ufield].split('~'); // split values based on delimiter to an array
            // if (orgfield === 'ynw_verified_level') {
            //   for (let jjj = 0; jjj < this.querystringrefineretain_arr[orgfield].length; jjj++) {
            //     this.querystringrefineretain_arr[orgfield][jjj] = Number(this.querystringrefineretain_arr[orgfield][jjj]);
            //   }
            // }
          }
        }
      }
    }
    this.arraycreatedfromquerystring = true;
  }
  // function to get the datatype of the fields obtained from query string from the search refine main array
  getSearchrefineFieldDetails(fname, fvalue) {
    for (let i = 0; i < this.searchrefine_arr.length; i++) {
      if (this.searchrefine_arr[i].cloudSearchIndex === fname) {
        return this.searchrefine_arr[i];
      }
    }
  }
  returnRefineCheckboxRetainValue(fieldheader, fieldname, fieldtype) {
    if (fieldtype === 'EnumList' || fieldtype === 'Enum' || fieldtype === 'Gender') { // case of multiple selection of checkbox
      let retval = false;
      if (this.querystringrefineretain_arr[fieldheader]) {
        if (this.querystringrefineretain_arr[fieldheader].indexOf(fieldname) !== -1) {
          retval = true;
        }
      }
      return retval;
    } else if (fieldtype === 'Boolean') { // case of multiple selection of radio slider
      let retval = false;
      if (this.querystringrefineretain_arr[fieldheader]) {
        retval = true;
      }
      return retval;
    } else if (fieldtype === 'TEXT_MED' || fieldtype === 'TEXT' || fieldtype === 'Rating') { // case of multiple selection of textbox
      let retval = '';
      if (this.querystringrefineretain_arr[fieldheader]) {
        if (fieldtype === 'Rating' && this.querystringrefineretain_arr[fieldheader][0] === '[') {
          retval = this.querystringrefineretain_arr[fieldheader][1];
        } else {
          retval = this.querystringrefineretain_arr[fieldheader][0];
        }
      }
      return retval;
    }
  }
  // method which checks whether a fieldname already exists in the refineresult array
  check_QuerystrinfieldexistsinArray(fieldname) {
    let exists_indx = -1;
    Object.keys(this.querystringrefineretain_arr).forEach(key => {
      if (key === fieldname) {
        exists_indx = 1;
      }
    });
    return exists_indx;
  }
  // function which parse the querystring from search labels
  parsesearchLabelsQuerystring(str = null, calldosearch?) {
    const retarr = {
      'sector': '',
      'subsector': '',
      'specialization': '',
      'rating': ''
    };
    if (str !== null) {
      if (str.match(/\ssector:'(.*?)'/) !== null) {
        retarr['sector'] = str.match(/\ssector:'(.*?)'/)[1];
      }
      if (str.match(/sub_sector:'(.*?)'/) !== null) {
        retarr['subsector'] = str.match(/sub_sector:'(.*?)'/)[1];
      }
      if (str.match(/specialization:'(.*?)'/) !== null) {
        retarr['specialization'] = str.match(/specialization:'(.*?)'/)[1];
        this.specialization_exists = true;
      }
      this.setvariablesbasedonSearchlabel(retarr, calldosearch);
    }
  }
  setvariablesbasedonSearchlabel(obj, calldosearch?) {
    this.domain = obj.sector || '';
    this.subsector = obj.subsector || '';
    this.specialization = obj.specialization || '';
    if (this.subsector !== '' && this.subsector !== undefined && this.subsector !== 'undefined') {
      const domainobtain = this.getdomainofaSubdomain(this.subsector);
      this.kw = this.subsector;
      this.kwsubdomain = this.kw;
      if (domainobtain !== undefined) {
        if (domainobtain['subdom_dispname'] !== '') {
          this.kwautoname = domainobtain['subdom_dispname'] || '';
          this.kwdomain = domainobtain['dom'] || '';
        }
      }
      this.kwtyp = 'subdom';
    } else {
      if (this.domain !== '' && this.domain !== 'All' && this.specialization !== '') {
        const obtarr = this.getSubdomainofaSpecialization(this.specialization, this.domain);
        this.subsector = obtarr['subdom_name'];
        this.kwsubdomain = this.subsector;
        this.specialization_hide = true;
      }
    }
    this.getRefinedSearch(calldosearch, 0, 'setvariablesbasedonSearchlabel');
  }
  goback() {
    this.routerobj.navigateByUrl('');
  }
  resetRefineVariables() {
    // resetting the refine related variables
    this.searchrefineresult_arr = [];
    this.refined_querystr = '';
    this.searchrefinetextresult_arr = [];
    this.refined_textquerystr = '';
    this.refined_options_url_str = '';
    this.querystringrefineretain_arr = [];
  }
  handlesearchClick(obj) {
    this.checkRefineSpecial();
    this.resetRefineVariables(); // calling method to reset the refine variables
    this.setSearchfields(obj, 2);
    this.buildQuery(true); // calling build query to rebuild the query
    // changing the url of the search result page based on the selected criteria
    this.change_url_on_criteria_change();
    if (obj.labelq === '') {
      // Calling api to get the search refine filters
      this.getRefinedSearch(true, 0, 'handlesearchClick');
    }
    // Calling the search function to perform the search
    // this.do_search();
  }
  private change_url_on_criteria_change() {
    let urlstr = '';
    // if (this.labelq) { // if clicked on searchlabels consider that only
    if (this.labelq) {
      urlstr = 'lq=' + this.shared_functions.Lbase64Encode(this.labelq.replace('?q=', ''));
    }
    // } else { // search by clicking on the search button
    if (this.domain) {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'do=' + this.domain;
    }
    if (this.latitude) {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'la=' + this.latitude + ';lo=' + this.longitude;
    }
    if (this.locname) {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'lon=' + this.locname;
    }
    if (this.locautoname) {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'lonauto=' + this.locautoname;
    }
    if (this.loctype) {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'lontyp=' + this.loctype;
    }
    if (this.kw !== '' && this.kw !== undefined && this.kw !== 'undefined') {
      if (urlstr !== '') {
        urlstr += ';';
      }
      let autoname = this.kwautoname;
      autoname = autoname.replace(/\//g, '%2F');    // url encoding (replacing forward slash)
      let kw = this.kwautoname;
      kw = kw.replace(/\//g, '%2F');
      urlstr += 'kw=' + kw + ';kwauto=' + autoname + ';kwdomain=' + this.kwdomain + ';kwsubdomain=' + this.kwsubdomain + ';kwtyp=' + this.kwtyp;
    }
    if (this.commonfilters !== '') {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'cfilter=' + this.commonfilters;
    }
    if (this.startpageval !== '') {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'cpg=' + this.startpageval;
    }
    // case if refine search checkbox ticked
    if (this.refined_options_url_str !== '') {
      urlstr += this.refined_options_url_str;
    }
    if (this.sortfield) {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'srt=' + this.sortfield + ' ' + this.sortorder;
    }
    if (urlstr !== '') {
      urlstr = ';' + urlstr;
    }
    urlstr = 'searchdetail' + urlstr;
    this.location.replaceState(urlstr);
  }
  private do_search() {
    let sortval = '';

    if (this.sortfield) {
      sortval = this.sortfield;
    }
    let q_str = '';
    let locstr = '';
    // q_str = 'title:\'' + 'sony new business' + '\''; // ***** this line needs to be commented after testing
    if (this.latitude) { // case of location is selected
      // calling shared function to get the coordinates for nearybylocation
      const retcoordinates = this.shared_functions.getNearByLocation(this.latitude, this.longitude, this.loctype);
      const coordinates = retcoordinates['locationRange'];
      projectConstants.searchpass_criteria.distance = 'haversin(' + this.latitude + ',' + this.longitude + ',location1.latitude,location1.longitude)';
      locstr = 'location1:' + coordinates;
      q_str = q_str + locstr;
    }
    let phrasestr = '';
    if (this.kwtyp === 'kwtitle') {
      let ptitle = this.kw.replace('/', '');
      ptitle = ptitle.replace(/'/g, '\\\'');
      q_str = q_str + '(or (prefix field=title \'' + ptitle + '\') (phrase field=title \'' + ptitle + '\'))';
    } else if (this.kwtyp === 'kwphrase') {
      const words = [];
      this.kw = this.kw.replace(/'/g, '\\\'');
      let fullWord = this.kw;
      const wordsInQuotes = fullWord.match(/"(.*?)"/g);
      if (wordsInQuotes != null) {
        for (let i = 0; i < wordsInQuotes.length; i++) {
          fullWord = fullWord.replace(wordsInQuotes[i], '').trim();
          words.push(wordsInQuotes[i].replace(/"/g, '').trim());
        }
      }
      const splitSpace = fullWord.trim().split(' ');
      if (splitSpace.length > 0) {
        for (let i = 0; i < splitSpace.length; i++) {
          if (splitSpace[i] !== '') {
            words.push(splitSpace[i]);
          }
        }
      }
      // let queryStr = 'adwords:\'' + this.kw + '\' ';
      // if (words.length > 1) {
      //   queryStr = '(and ';
      //   for (let i = 0; i < words.length; i++) {
      //     queryStr += ('adwords:\'' + words[i] + '\' ');
      //   }
      //   queryStr += ')';
      // }
      phrasestr = ' (or sub_sector_displayname:\'' + this.kw + '\'' + ' sub_sector:\'' + this.kw.toLowerCase() + '\'' + ' specialization:\'' + this.kw.toLowerCase() + '\'' +
        ' specialization_displayname:\'' + this.kw + '\''
        + ' (or (prefix field=title \'' + this.kw + '\') (phrase field=title \'' + this.kw + '\'))' + ' services:\'' + this.kw + '\'' + ' qualification:\'' + this.kw + '\' adwords:\'' + this.kw.replace(' ', projectConstants.ADWORDSPLIT) + '\')';
    }
    if (this.domain && this.domain !== 'All' && this.domain !== 'undefined' && this.domain !== undefined) { // case of domain is selected
      q_str = q_str + 'sector:\'' + this.domain + '\'';
    } else {
      if (this.latitude) {
      }
    }
    if (this.kw) {
      switch (this.kwtyp) {
        case 'subdom':
          q_str = q_str + ' sub_sector:\'' + this.kw + '\'';
          break;
        case 'special':
          q_str = q_str + ' specialization:\'' + this.kw + '\'';
          break;
      }
    }
    let time_qstr = '';
    if (this.commonfilters === 'opennow') { // case of opennow clicked
      const curdatetime = new Date();
      const enddatetime = new Date();
      enddatetime.setMinutes(enddatetime.getMinutes() + 2); // adding 2 minutes to current time
      const starttime = this.shared_functions.addZero(curdatetime.getHours()) + '' + this.shared_functions.addZero(curdatetime.getMinutes());
      const endtime = this.shared_functions.addZero(enddatetime.getHours()) + '' + this.shared_functions.addZero(enddatetime.getMinutes());
      time_qstr = projectConstants.myweekdays[curdatetime.getDay()] + '_time:[' + starttime + ',' + endtime + ']';
    } else if (this.commonfilters === 'always_open1') { // case of opennow clicked
      time_qstr = time_qstr + ' ' + this.commonfilters + ':1 ';
    }
    if (this.labelq) { // if label search then bypass all other criteria
      const labelqarr = this.labelq.split('&');
      q_str = labelqarr[0].replace('?q=', '');
      q_str = q_str.replace('[loc_details]', locstr);
    } else {
      // if (this.latitude || this.domain || this.labelq || this.refined_querystr) {
      if (this.latitude || this.domain || this.labelq || time_qstr || phrasestr) {
        q_str = '(and ' + q_str + time_qstr + phrasestr + ')';
      }
    }
    // Creating criteria to be passed via get
    projectConstants.searchpass_criteria.q = q_str;
    projectConstants.searchpass_criteria.sort = sortval;
    projectConstants.searchpass_criteria.fq = this.refined_querystr;
    this.nosearch_results = false;
    // Finding the start row value for paging
    if (this.startpageval) {
      projectConstants.searchpass_criteria.start = (this.startpageval - 1) * projectConstants.searchpass_criteria.size;
    } else {
      projectConstants.searchpass_criteria.start = 0;
    }
    if (this.search_return) {
      this.search_return.unsubscribe();
    }
    this.search_result_count = 0;
    if (q_str === '') {
    } else {
      this.shared_functions.getCloudUrl()
        .then(url => {
          this.search_return = this.shared_service.DocloudSearch(url, projectConstants.searchpass_criteria)
            .subscribe(res => {
              this.search_data = res;
              this.result_provid = [];
              this.result_providdet = [];
              let schedule_arr = [];
              let locationcnt = 0;
              for (let i = 0; i < this.search_data.hits.hit.length; i++) {
                this.account_type = this.search_data.hits.hit[i].fields.account_type;
                this.branch_id = this.search_data.hits.hit[i].fields.branch_id;
                const addres = this.search_data.hits.hit[i].fields['address1'];
                const place = this.search_data.hits.hit[i].fields['place1'];
                if (addres && addres.includes(place)) {
                  this.search_data.hits.hit[i].fields['isPlaceisSame'] = true;
                } else {
                  this.search_data.hits.hit[i].fields['isPlaceisSame'] = false;
                }
                locationcnt = 0;
                if (this.search_data.hits.hit[i].fields['logo']) {
                  this.search_data.hits.hit[i].fields['logo'] = this.search_data.hits.hit[i].fields['logo'] + '?' + new Date();
                }
                this.search_data.hits.hit[i].fields.rating = this.shared_functions.ratingRounding(this.search_data.hits.hit[i].fields.rating);
                this.search_data.hits.hit[i].fields['checkInsallowed'] = (this.search_data.hits.hit[i].fields.hasOwnProperty('online_checkins')) ? true : false;
                const provid = this.search_data.hits.hit[i].id;
                if (this.search_data.hits.hit[i].fields.claimable !== '1') {
                  this.result_providdet.push({ 'provid': provid, 'searchindx': i });
                } else {
                }
                if (this.search_data.hits.hit[i].fields.hasOwnProperty('place2')) {
                  ++locationcnt;
                }
                if (this.search_data.hits.hit[i].fields.hasOwnProperty('place3')) {
                  ++locationcnt;
                }
                if (this.search_data.hits.hit[i].fields.hasOwnProperty('place4')) {
                  ++locationcnt;
                }
                if (this.search_data.hits.hit[i].fields.hasOwnProperty('place5')) {
                  ++locationcnt;
                }
                this.search_data.hits.hit[i].fields.moreclinics = locationcnt;
                if (this.search_data.hits.hit[i].fields.business_hours1) {
                  schedule_arr = [];
                  const business_hours = JSON.parse(this.search_data.hits.hit[i].fields.business_hours1[0]);
                  for (let j = 0; j < business_hours.length; j++) {
                    const obt_sch = business_hours[j];
                    if (obt_sch && obt_sch.repeatIntervals) {
                      for (let k = 0; k < obt_sch.repeatIntervals.length; k++) {
                        // pushing the schedule details to the respective array to show it in the page
                        schedule_arr.push({
                          day: obt_sch.repeatIntervals[k],
                          sTime: obt_sch.timeSlots[0].sTime,
                          eTime: obt_sch.timeSlots[0].eTime,
                          recurrtype: obt_sch.recurringType
                        });
                      }
                    }
                    this.search_data.hits.hit[i].fields['display_schedule'] = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
                  }
                }

              }
              this.getWaitingTime(this.result_providdet);
              this.search_result_count = this.search_data.hits.found || 0;
              if (this.search_data.hits.found === 0) {
                this.nosearch_results = true;
              }
              if (this.hideRefineifOneresultchk) {
                if (this.search_result_count === 1) {
                  this.showrefinedsection = false;
                } else {
                  if (this.screenWidth <= 767) {
                    this.showrefinedsection = false;
                  } else {
                    this.showrefinedsection = true;
                  }
                }
                this.hideRefineifOneresultchk = false;
                this.showrefinedsection = false; // this is done to override all conditions and to hide the refined filter section by default
              }
              setTimeout(() => {
                window.scrollTo(0, this.retscrolltop);
                this.retscrolltop = 0;
              }, 1000);
            });
        });
    }


  }
  private showinKm(miles) {
    const km = 1.6 * miles;
    if (km < 1) {
      return '<1 km';
    } else {
      return km.toFixed(2) + ' km';
    }
  }
  private getWaitingTime(provids) {
    if (provids.length > 0) {
      const post_provids: any = [];
      for (let i = 0; i < provids.length; i++) {
        post_provids.push(provids[i].provid);
      }
      if (post_provids.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getEstimatedWaitingTime(post_provids)
        .subscribe(data => {
          this.waitlisttime_arr = data;
          if (this.waitlisttime_arr === '"Account doesn\'t exist"') {
            this.waitlisttime_arr = [];
          }
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
          const ctoday = cday + '/' + cmon + '/' + yyyy;
          let srchindx;
          const check_dtoday = new Date(dtoday);
          let cdate;
          for (let i = 0; i < this.waitlisttime_arr.length; i++) {
            srchindx = provids[i].searchindx;
            this.search_data.hits.hit[srchindx].fields['waitingtime_res'] = this.waitlisttime_arr[i];
            this.search_data.hits.hit[srchindx].fields['estimatedtime_det'] = [];
            this.search_data.hits.hit[srchindx].fields['waitingtime_res'] = this.waitlisttime_arr[i];
            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['calculationMode'] = this.waitlisttime_arr[i]['nextAvailableQueue']['calculationMode'];
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['showToken'] = this.waitlisttime_arr[i]['nextAvailableQueue']['showToken'];
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['onlineCheckIn'] = this.waitlisttime_arr[i]['nextAvailableQueue']['onlineCheckIn'];
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['isAvailableToday'] = this.waitlisttime_arr[i]['nextAvailableQueue']['isAvailableToday'];
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['isCheckinAllowed'] = this.waitlisttime_arr[i]['isCheckinAllowed'];
              if (this.waitlisttime_arr[i]['branchSpCount']) {
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['branchSpCount'] = this.waitlisttime_arr[i]['branchSpCount'];
              }
              if (this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['branchSpCount'] === 1) {
                this.provider_label = this.getTerminologyTerm('provider', this.search_data.hits.hit[i].fields);
              } else if (this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['branchSpCount'] > 1) {
                this.provider_label = this.getTerminologyTerm('provider', this.search_data.hits.hit[i].fields) + 's';
              }
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['personAhead'] = this.waitlisttime_arr[i]['nextAvailableQueue']['personAhead'];
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['cdate'] = this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['queue_available'] = 1;
              this.search_data.hits.hit[srchindx].fields['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'] || false;
              cdate = new Date(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['availableToday'] = true;
              } else {
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['availableToday'] = false;
              }
              if (!this.search_data.hits.hit[srchindx].fields['opennow']) {
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = this.nextavailableCaption + ' ';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['date'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['date']
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['nextAvailDate'] = this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['date'] + ',' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              } else {
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  // this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['date'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['date']
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                }
              }
            } else {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['queue_available'] = 0;
            }
            if (this.waitlisttime_arr[i]['message']) {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['message'] = this.waitlisttime_arr[i]['message'];
            }
          }
        });
    }
  }
  private showproviderlogoicon(logo) {
    return this.shared_functions.showlogoicon(logo);
  }
  private getdomain() {
    return this.domain;
  }
  private setfields() {
    this.searchfields = {
      domain: this.domain,
      location: this.locname,
      locationautoname: this.locautoname,
      locationtype: this.loctype,
      latitude: this.latitude,
      longitude: this.longitude,
      sortfield: this.sortfield,
      sortorder: this.sortorder,
      kw: this.kw,
      kwautoname: this.kwautoname,
      kwdomain: this.kwdomain,
      kwsubdomain: this.kwsubdomain,
      kwtyp: this.kwtyp,
      labelq: this.labelq,
      subsector: this.subsector,
      specialization: this.specialization,
      rating: this.rating,
      commonfilters: this.commonfilters || '',
      passrefinedfilters: []
    };
    return this.searchfields;
  }
  private selected_sortfield(boolDistance) {
    let selfield = '';
    let selorder = '';
    this.activeDistanceSort = boolDistance;
    if (boolDistance) {
      selfield = 'claimable asc, distance asc, ynw_verified_level desc';
      selorder = 'asc';
    }
    this.sortfield = selfield;
    this.sortorder = selorder;
    // changing the url of the search result page based on the selected criteria
    this.change_url_on_criteria_change();
    this.do_search();
  }
  private selected_sortorder(sel) {
    this.sortorder = sel;
    // changing the url of the search result page based on the selected criteria
    this.change_url_on_criteria_change();
    this.do_search();
  }
  private pass_totalpages() {
    return this.search_result_count;
  }
  private pass_pagesize() {
    return projectConstants.searchpass_criteria.size;
  }
  private handle_pageclick(pg) {
    this.startpageval = pg;
    this.change_url_on_criteria_change();
    this.do_search();
  }
  // method which get the refined filters
  getRefinedSearch(call_dosearch?, fromrefine?, src?) {
    let subdom = '';
    this.searchrefine_arr = '';
    if (this.kw !== '') {
      if (this.kwtyp === 'subdom') {
        subdom = this.kw;
      } else if (this.kwtyp === 'special') {
        subdom = this.kwsubdomain;
      }
    }
    if (this.kwtyp === 'label' || (this.labelq !== '' && this.labelq !== undefined)) {
      subdom = this.kwsubdomain;
    }
    if (subdom !== '' && (this.domain === '' || this.domain === undefined)) {
      const domdet = this.getdomainofaSubdomain(subdom);
      if (domdet) {
        this.domain = domdet['dom'];
        this.kwautoname = domdet['subdom_dispname'];
      }
    }
    let pasdomain = (this.domain !== 'All') ? this.domain : '';
    if (subdom === '') {
    }
    if (fromrefine === 1) { // case of coming to this function from left side domain or subdomain selection
      if (this.refined_domain !== '' && this.refined_domain !== 'All') {
        pasdomain = this.refined_domain;
      }
      if (pasdomain === '') {
        if (this.domain !== '' && this.domain !== 'All') {
          pasdomain = this.domain;
        }
      }
      if (this.refined_subdomain !== '') {
        subdom = this.refined_subdomain;
      }
      if (subdom === '') {
      }
    }
    this.searchdetailserviceobj.getRefinedSearch(pasdomain, subdom)
      .subscribe(data => {
        // if (pasdomain && subdom) { // case if domain and subdomain are available
        if (pasdomain) { // case if domain and subdomain are available
          if (data['refinedFilters']) {
            this.searchrefine_arr = data['refinedFilters'];
            if (pasdomain && subdom) {
              this.searchdetailserviceobj.getRefinedSearch(pasdomain, '')
                .subscribe(refdata => {
                  const arraytomerge = refdata['refinedFilters'];
                  this.searchrefine_arr = arraytomerge.concat(this.searchrefine_arr);
                });
            }
          }
          if (data['commonFilters']) {
            const mergedarray = this.searchrefine_arr.concat(data['commonFilters']); // merging the refine and common filters
            this.searchrefine_arr = mergedarray; // assigning the merged array to the searchrefine_arr
          }
        } else {
          if (data['commonFilters']) {
            for (let i = 0; i < data['commonFilters'].length; i++) {
              if (data['commonFilters'][i].name === 'opennow') {
                data['commonFilters'][i].cloudSearchIndex = 'opennow';
              }
            }
            this.searchrefine_arr = data['commonFilters'];
          }
        }
        this.searchcommononlyrefine_arr = data['commonFilters'];
        this.obtainedRefined = true;
        // section which populates the respective arrays with criteria based on query string
        Object.keys(this.querystringrefineretain_arr).forEach(key => {
          const obtainedobj = this.getSearchrefineFieldDetails(key, this.querystringrefineretain_arr[key]);
          if (obtainedobj) {
            if (obtainedobj.dataType === 'TEXT' || obtainedobj.dataType === 'TEXT_MED') {
              this.handleTextrefineblur(obtainedobj.cloudSearchIndex, this.querystringrefineretain_arr[key], obtainedobj.dataType, true);
            } else if (obtainedobj.dataType === 'EnumList' || obtainedobj.dataType === 'Enum' || obtainedobj.dataType === 'Gender' || obtainedobj.dataType === 'Boolean' || obtainedobj.dataType === 'Rating') {
              Object.keys(this.querystringrefineretain_arr[key]).forEach(qkey => {
                this.handle_optionclick(obtainedobj.cloudSearchIndex, obtainedobj.dataType, this.querystringrefineretain_arr[key][qkey], true);
              });
            }
          }
        });
        if (call_dosearch === true) {
          this.buildQuery(false);
        }
      });
  }
  getdomainofaSubdomain(subdomname) {
    if (this.domainlist_data) {
      for (let i = 0; i < this.domainlist_data.length; i++) {
        for (const subdom of this.domainlist_data[i].subDomains) {
          if (subdom.subDomain === subdomname) {
            const retarr = { 'dom': this.domainlist_data[i].domain, 'subdom_dispname': subdom.displayName };
            return retarr;
          }
        }
      }
    } else {
      const retarr = { 'dom': '', 'subdom_dispname': '' };
      return retarr;
    }
  }
  getSubdomainofaSpecialization(special, domain) {
    let retarr = { 'dom': '', 'subdom_name': '', 'subdom_dispname': '' };
    if (this.domainlist_data === undefined) {
      const bconfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
      if (bconfig) { // case if data is there in local storage
        this.domainlist_data = bconfig.bdata;
      }
    }
    if (this.domainlist_data) {
      for (let i = 0; i < this.domainlist_data.length; i++) {
        if (this.domainlist_data[i].domain === domain) {
          for (const subdom of this.domainlist_data[i].subDomains) {
            if (subdom.specializations.length > 0) {
              for (const spec of subdom.specializations) {
                if (spec.name.toLowerCase() === special.toLowerCase()) {
                  retarr = { 'dom': this.domainlist_data[i].domain, 'subdom_name': subdom.subDomain, 'subdom_dispname': subdom.displayName };
                  return retarr;
                }
              }
            }
          }
        }
      }
    }
    retarr = { 'dom': '', 'subdom_name': '', 'subdom_dispname': '' };
    return retarr;
  }
  // method which is invoked on clicking the checkboxes or boolean fields
  handle_optionclick(fieldname, fieldtype, selval, bypassbuildquery?) {
    // adding to the array which is used to tick the checkbox in refine search
    const checkExistence = this.check_QuerystrinfieldexistsinArray(fieldname);
    if (fieldname === 'rating') {
      if (checkExistence === -1) {
        selval = '[' + selval + ',5]';
      }
      this.querystringrefineretain_arr[fieldname] = selval;
    } else {
      if (checkExistence === -1) {
        this.querystringrefineretain_arr[fieldname] = [selval];
      } else {
        const len = this.querystringrefineretain_arr[fieldname].length;
        for (let i = 0; i < this.querystringrefineretain_arr[fieldname].length; i++) {
          if (this.querystringrefineretain_arr[fieldname].includes(selval)) {
          } else {
            this.querystringrefineretain_arr[fieldname][len] = selval;
          }
        }
      }
    }

    this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
    this.searchButtonClick = false;
    if (this.searchrefineresult_arr.length) {
      const sec_indx = this.check_fieldexistsinArray(fieldname, fieldtype);
      if (sec_indx === -1) {
        const curi = this.searchrefineresult_arr.length;
        this.searchrefineresult_arr[curi] = new Array();
        this.searchrefineresult_arr[curi][fieldname] = new Array();
        this.searchrefineresult_arr[curi][fieldname][0] = new Array(selval, fieldtype);
      } else {
        if (fieldtype === 'Rating') {  // if current field type is rating, then remove the rating already there
          this.searchrefineresult_arr[sec_indx][fieldname].splice(0, 1);
        }
        const chk_fieldvalexist = this.check_fieldvalexistsinArray(fieldname, selval);
        if (chk_fieldvalexist[0]['indx'] !== -1) {
          this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']][chk_fieldvalexist[0]['field']].splice(chk_fieldvalexist[0]['key'], 1);
          if (this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']][chk_fieldvalexist[0]['field']].length === 0) {
            this.searchrefineresult_arr.splice(chk_fieldvalexist[0]['indx'], 1);
          }
        } else {
          const curindx = this.searchrefineresult_arr[sec_indx][fieldname].length;
          if (fieldtype === 'Rating') { // done to handle the case of rating cleared in refined search
            if (selval !== '') {
              selval = '[' + selval + ',5]';
              this.searchrefineresult_arr[sec_indx][fieldname][curindx] = new Array(selval, fieldtype);
            }
          } else {
            this.searchrefineresult_arr[sec_indx][fieldname][curindx] = new Array(selval, fieldtype);
          }
        }
      }
    } else {
      const curi = this.searchrefineresult_arr.length;
      this.searchrefineresult_arr[curi] = new Array();
      this.searchrefineresult_arr[curi][fieldname] = new Array();
      this.searchrefineresult_arr[curi][fieldname][0] = new Array(selval, fieldtype);
    }
    if (bypassbuildquery === false) {
      this.buildQuery(false);
    }
  }
  // method which checks whether a fieldname already exists in the refineresult array
  check_fieldexistsinArray(fieldname, fieldtype) {
    let exists_indx = -1;
    for (let i = 0; i < this.searchrefineresult_arr.length; i++) {
      Object.keys(this.searchrefineresult_arr[i]).forEach(key => {
        if (key === fieldname) {
          exists_indx = i;
        }
      });
    }
    return exists_indx;
  }

  // method which checks whether a particular field value is already there in the refineresult array, if yes then returns the details
  check_fieldvalexistsinArray(fieldname, selval) {
    let ret_arr = [{ 'indx': -1, 'field': '', 'key': '' }];
    for (let i = 0; i < this.searchrefineresult_arr.length; i++) {
      for (const key in this.searchrefineresult_arr[i][fieldname]) {
        if (this.searchrefineresult_arr[i][fieldname][key][0] === selval) {
          ret_arr = [{ 'indx': i, 'field': fieldname, 'key': key }];
        }
      }
    }
    return ret_arr;
  }
  // method which rebuilds the query string to be used on refine filter selection
  buildQuery(bypassdosearch?) {
    this.refined_querystr = '';
    this.refined_options_url_str = '';
    if (this.refined_domain !== '' && this.refined_domain !== 'All') {
      this.refined_querystr = ' sector:\'' + this.refined_domain + '\'';
    }
    if (this.refined_subdomain !== '') {
      this.refined_querystr = this.refined_querystr + ' sub_sector:\'' + this.refined_subdomain + '\'';
    }
    for (let i = 0; i < this.searchrefineresult_arr.length; i++) {
      for (const field in this.searchrefineresult_arr[i]) {
        if (field) {
          const subst_det = this.getsearchqueryforField(i, field);
          if (subst_det['retstr'] !== '') {
            if (subst_det['retcnt'] > 1) {
              this.refined_querystr += ' (or ' + subst_det['retstr'] + ')';
            } else {
              if (field === 'coupon_enabled') {
                this.refined_querystr += '(not' + subst_det['retstr'] + ')';
              } else {
                this.refined_querystr += ' ' + subst_det['retstr'] + '';
              }
            }
          }
        }
      }
    }
    /* Handling the case of text boxes */
    let textstr = '';
    let tmpholder = '';
    for (const field in this.searchrefinetextresult_arr) {
      if (field) {
        if (this.searchrefinetextresult_arr[field] !== '') {
          tmpholder = this.searchrefinetextresult_arr[field];
          if (typeof this.searchrefinetextresult_arr[field] === 'object') {
            tmpholder = this.searchrefinetextresult_arr[field][0];
          }
          if (tmpholder && tmpholder.includes('\'')) {
            tmpholder = tmpholder.replace(/'/g, '\\\'');
          }
          textstr += ' ' + field + ':' + '\'' + tmpholder + '\'' + ' ';
          this.refined_options_url_str += ';myref_' + field + '=' + this.searchrefinetextresult_arr[field];
        }
      }
    }
    if (textstr !== '') {
      textstr = ' ' + textstr;
    }
    const userobj = this.shared_functions.getitemfromSessionStorage('ynw-user');
    let testUser = false;
    if (userobj !== null) {
      const phno = (userobj.primaryPhoneNumber.toString());
      if (phno.startsWith('55')) {
        testUser = true;
      }
    }
    let testuserQry = '';
    if (!testUser) {
      testuserQry = ' (not test_account:1) ';
    } else {
      testuserQry = ' test_account:1 ';
    }
    if (this.refined_querystr !== '' || textstr !== '' || testuserQry !== '') {
      this.refined_querystr = '(and ' + this.refined_querystr + textstr + testuserQry + ')';
    }
    // calling the method to update the url to reflect the changes done to the refine area
    this.change_url_on_criteria_change();
    if (bypassdosearch === false) {
      // calling the search method to do the actual search
      this.do_search();
    }
  }

  // method with returns the details of fields to use the build query for fields other than textboxes
  getsearchqueryforField(indx, fieldname) {
    let retstr = '';
    let returlstr = '';
    let curcnt = 0;
    for (let i = 0; i < this.searchrefineresult_arr[indx][fieldname].length; i++) {
      if (retstr !== '') {
        retstr += '';
      }
      if (returlstr !== '') {
        returlstr += '~';
      }
      const if_special = fieldname.substr(-10);
      if (if_special === '_location*') {
        retstr += ' ' + fieldname.replace('_location*', '_location1') + ':' + '\'' + this.searchrefineresult_arr[indx][fieldname][i][0] + '\'';
      } else {
        if (fieldname === 'opennow') {
          let time_qstr = '';
          const curdatetime = new Date();
          const enddatetime = new Date();
          enddatetime.setMinutes(enddatetime.getMinutes() + projectConstants.OPEN_NOW_INTERVAL); // adding minutes from project constants file to current time
          const starttime = this.shared_functions.addZero(curdatetime.getHours()) + '' + this.shared_functions.addZero(curdatetime.getMinutes());
          const endtime = this.shared_functions.addZero(enddatetime.getHours()) + '' + this.shared_functions.addZero(enddatetime.getMinutes());
          time_qstr = projectConstants.myweekdays[curdatetime.getDay()] + '_time:[' + starttime + ',' + endtime + '] ';
          retstr += ' ' + time_qstr;
        } else {
          if (fieldname === 'coupon_enabled') {
            retstr += ' ' + fieldname + ':' + '\'' + 0 + '\'';
          } else if (fieldname === 'rating') {
            retstr += ' ' + fieldname + ':' + this.searchrefineresult_arr[indx][fieldname][i][0];
          } else {
            retstr += ' ' + fieldname + ':' + '\'' + this.searchrefineresult_arr[indx][fieldname][i][0] + '\'';
          }
        }
      }
      returlstr += this.searchrefineresult_arr[indx][fieldname][i][0];
      curcnt++;
    }
    if (returlstr !== '') {
      this.refined_options_url_str += ';myref_' + fieldname + '=' + returlstr;
    }
    const retdet = { 'retstr': retstr, 'retcnt': curcnt };
    return retdet;
  }

  // method which will be called onblur on textbox fields of refined filters
  handleTextrefineblur(fieldname, fieldvalue, fieldtype, bypassbuildquery?) {
    this.searchButtonClick = false;
    this.searchrefinetextresult_arr[fieldname] = fieldvalue;
    if (fieldvalue === '') {
      delete this.searchrefinetextresult_arr[fieldname];
    }
    if (bypassbuildquery === false) {
      // calling method to rebuild the query with the details selected from the refine search aswell
      this.buildQuery(false);
    }
  }

  handleTextrefineKeypress(ev, fieldname, fieldvalue, fieldtype, bypassbuildquery?) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      // replacing unwanted characters
      this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
      fieldvalue = fieldvalue.replace(/;/g, '');
      fieldvalue = fieldvalue.replace(/\//g, '');
      this.handleTextrefineblur(fieldname, fieldvalue, fieldtype, bypassbuildquery);
    }
  }

  handleTextrefinefieldBlur(ev, fieldname, fieldvalue, fieldtype, bypassbuildquery?) {
    this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
    fieldvalue = fieldvalue.replace(/;/g, '');
    fieldvalue = fieldvalue.replace(/\//g, '');
    this.handleTextrefineblur(fieldname, fieldvalue, fieldtype, bypassbuildquery);
  }

  getlistofSubdomains(curdomain, src?) {
    this.subdomainlist_data = [];
    if (curdomain !== '' && curdomain !== 'All') {
      for (const domains of this.domainlist_data) {
        if (domains.domain === curdomain) {
          this.subdomainlist_data = domains.subDomains;
        }
      }
    }
  }
  handleratingClick(obj) {
    this.searchButtonClick = false;
    this.handle_optionclick(obj.cloudindex, 'Rating', obj.selectedrating, false);
  }

  togger_refinesection() {
    this.showrefinedsection = !this.showrefinedsection;
  }
  claimBusiness(obj) {
    const myidarr = obj.id.split('-');
    if (myidarr[0]) {
      this.searchdetailserviceobj.getClaimmable(myidarr[0])
        .subscribe(data => {
          const claimdata = data;
          const pass_data = {
            accountId: myidarr[0],
            sector: claimdata['sector'],
            subSector: claimdata['subSector']
          };
          this.SignupforClaimmable(pass_data);
        }, error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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

  checkinClicked(obj, chdatereq) {
    this.current_provider = obj;
    this.changedate_req = chdatereq;
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    if (usertype === 'consumer') {
      this.showCheckin('consumer');
    } else if (usertype === '') {
      const passParam = { callback: '', current_provider: obj };
      this.doLogin('consumer', passParam);
    }
  }
  doSignup(passParam?) {
    // this.api_loading = false;
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
        this.shared_functions.sendMessage(pdata);
        this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          this.showCommunicate(passParam['providerId'], passParam['provider_name']);
        } else if (passParam['callback'] === 'providerdetail') {
          this.showProviderDetails(passParam['providerId']);
        } else if (passParam['callback'] === 'servicedetail') {
          this.serviceClicked(passParam['mname'], passParam['mobj'], 'serviceClick');
        } else {
          this.showCheckin('consumer');
        }
      }
    });
  }
  doLogin(origin?, passParam?) {
    // this.shared_functions.openSnackBar('You need to login to check in');
    const current_provider = passParam['current_provider'];
    let is_test_account = null;
    if (current_provider) {
      if (current_provider.test_account === '1') {
        is_test_account = true;
      } else {
        is_test_account = false;
      }
    }
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '50%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: this.checkProvider(origin),
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
        this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          this.showCommunicate(passParam['providerId'], passParam['provider_name']);
        } else if (passParam['callback'] === 'providerdetail') {
          this.showProviderDetails(passParam['providerId']);
        } else if (passParam['callback'] === 'servicedetail') {
          this.serviceClicked(passParam['mname'], passParam['mobj'], 'serviceClick');
        } else {
          this.showCheckin('consumer');
        }
      } else if (result === 'showsignup') {
        this.doSignup(passParam);
      }
    });
  }

  showCheckin(origin?) {
    this.checkindialogRef = this.dialog.open(CheckInComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'checkin-consumer'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: this.checkProvider(origin),
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 },
        srchprovider: this.current_provider,
        datechangereq: this.changedate_req
      }
    });
    this.checkindialogRef.afterClosed().subscribe(result => {
    });
  }
  checkProvider(type) {
    return (type === 'consumer') ? 'false' : 'true';
  }
  providerDetClicked(obj) {
    if (obj && obj.fields.unique_id !== undefined) {
      // const arr = obj.id.split('-');
      const providforDetails = obj.fields.unique_id;
      // check whether logged in as consumer
      this.shared_functions.setitemOnSessionStorage('sctop', this.scrolltop);
      if (this.shared_functions.checkLogin()) {
        const ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (ctype === 'consumer') {
          this.showProviderDetails(providforDetails);
        }
      } else { // show consumer login
        const passParam = { callback: 'providerdetail', providerId: providforDetails, current_provider: obj };
        this.doLogin('consumer', passParam);
      }
    }
  }
  showProviderDetails(provid) {
    this.routerobj.navigate(['searchdetail', provid]);
  }

  handlerefineddomainchange(val) {
    this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
    this.searchButtonClick = false;
    this.refined_domain = val;
    this.refined_subdomain = '';
    this.searchrefineresult_arr = [];
    this.getlistofSubdomains(val, 'domainchange');
    if (this.subdomainlist_data.length === 1) { // case if there is only one subdomain
      this.handlerefinedsubdomainchange(this.subdomainlist_data[0].subDomain);
    } else {
      this.getRefinedSearch(true, 1);
    }
  }

  handlerefinedsubdomainchange(val) {
    this.searchrefineresult_arr = [];
    this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
    this.searchButtonClick = false;
    this.refined_subdomain = val;
    this.getRefinedSearch(true, 1);
  }
  showmore(indx) {
    this.searchrefine_arr[indx]['showhiddendet'] = true;
  }
  hidemore(indx) {
    this.searchrefine_arr[indx]['showhiddendet'] = false;
  }
  communicateHandler(search_result) {
    const name = search_result.fields.title || null; // providername
    const obj = search_result.id || null;
    if (obj) {
      const arr = obj.split('-');
      const providforCommunicate = arr[0];
      // check whether logged in as consumer
      if (this.shared_functions.checkLogin()) {
        const ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (ctype === 'consumer') {
          this.showCommunicate(providforCommunicate, name);
        }
      } else { // show consumer login
        const passParam = { callback: 'communicate', providerId: providforCommunicate, provider_name: name, current_provider: obj };
        this.doLogin('consumer', passParam);
      }
    }
  }
  showCommunicate(provid, provider_name) {
    this.commdialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        caption: 'Enquiry',
        user_id: provid,
        source: 'consumer-common',
        type: 'send',
        name: provider_name
      }
    });

    this.commdialogRef.afterClosed().subscribe(result => {

    });
  }
  additionalRefineCondition() {
    let retval = false;
    if (this.searchButtonClick) {
      if (this.search_result_count !== undefined) {
        if (this.search_result_count > 0) {
          retval = true;
        } else {
          retval = false;
        }
      } else {
        retval = false;
      }
    } else {
      retval = true;
    }
    return retval;
  }
  isExpanded(datatype, cloudSearchIndex) {
    let vals;
    if (datatype === 'TEXT' || datatype === 'TEXT_MED') {
      vals = this.returnRefineCheckboxRetainValue(cloudSearchIndex, '', datatype);
      if (vals !== '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  isOnlineCheckinEnabled(obj) {
    if (obj) {
      if (obj.fields.hasOwnProperty('online_checkins')) {
        return false;
      } else {
        return false;
      }
    }
  }
  getTerminologyTerm(term, fields) {
    let terminologies = null;
    if (fields.terminologies !== undefined) {
      terminologies = JSON.parse(fields.terminologies[0]);
    }
    if (terminologies !== null) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      if (terminologies) {
        return this.shared_functions.firstToUpper((terminologies[term_only]) ? terminologies[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.shared_functions.firstToUpper((term === term_only) ? term_only : term);
      }
    } else {
      return this.shared_functions.firstToUpper(term);
    }
  }
  checkserviceClicked(name, obj, origin) {
    this.btn_clicked = true;
    this.serviceClicked(name, obj, origin);
  }
  /* Service Clicked
    * name  Service Name
    * obj Search Result
    */
  serviceClicked(name, obj, origin) {
    const s3id = obj.fields.unique_id;
    const busname = obj.fields.title;
    // get services details from s3
    let selected_service = null;
    const UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          const s3url = res;
          this.shared_service.getbusinessprofiledetails_json(s3id, s3url, 'services', UTCstring)
            .subscribe(services => {
              let servicesList: any = [];
              servicesList = services;
              if (origin === 'serviceClick') {
                for (let i = 0; i < servicesList.length; i++) {
                  if (servicesList[i].name === name) {
                    selected_service = servicesList[i];
                    break;
                  }
                }
              }
              if (origin === 'deptServiceClick') {
                for (let i = 0; i < servicesList.length; i++) {
                  for (let j = 0; j < servicesList[i].services.length; j++) {
                    if (servicesList[i].services[j].name === name) {
                      selected_service = servicesList[i].services[j];
                      break;
                    }
                  }
                }
              }
              if (selected_service !== null) {
                this.showServiceDetail(selected_service, busname);
              } else {
                this.btn_clicked = false;
              }
            });
        });
  }
  // departmentClicked(deptName, searchData) {
  //   this.showServices = true;
  //   const s3id = searchData.fields.unique_id;
  //   const UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
  //   this.shared_functions.getS3Url('provider')
  //     .then(
  //       res => {
  //         const s3url = res;
  //         this.shared_service.getbusinessprofiledetails_json(s3id, s3url, 'services', UTCstring)
  //           .subscribe(services => {
  //             let deptList: any = [];
  //             deptList = services;
  //             for (let i = 0; i < deptList.length; i++) {
  //               if (deptList[i].departmentName === deptName) {
  //                 this.departServiceList = deptList[i].services;
  //                 this.selectedDepartment = deptName;
  //               }
  //             }
  //           });
  //       });
  // }
  showServiceDetail(serv, busname) {
    this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {
        bname: busname,
        serdet: serv
      }
    });
    this.servicedialogRef.afterClosed().subscribe(result => {
      this.btn_clicked = false;
    });
  }
  openCoupons(obj, type) {
    this.btn_clicked = true;
    const s3id = obj.fields.unique_id;
    const busname = obj.fields.title;
    const UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          const s3url = res;
          this.shared_service.getbusinessprofiledetails_json(s3id, s3url, 'coupon', UTCstring)
            .subscribe(couponsList => {
              this.coupondialogRef = this.dialog.open(CouponsComponent, {
                width: '60%',
                panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
                disableClose: true,
                data: {
                  couponsList: couponsList,
                  type: type
                }
              });
              this.coupondialogRef.afterClosed().subscribe(result => {
                this.btn_clicked = false;
              });
            });
        });
  }

  openJdn(obj){

    const s3id = obj.fields.unique_id;
    const UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          const s3url = res;
          this.shared_service.getbusinessprofiledetails_json(s3id, s3url, 'jaldeediscount', UTCstring)
            .subscribe(jdnList => {
              this.jdndialogRef = this.dialog.open(JdnComponent, {
                width: '60%',
                panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
                disableClose: true,
                data: {
                  jdnList: jdnList
                }
              });
              this.jdndialogRef.afterClosed().subscribe(result => {
                
              });
            });
        });

  }
}
