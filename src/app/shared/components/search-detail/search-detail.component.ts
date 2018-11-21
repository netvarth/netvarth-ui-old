
import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SearchDetailServices } from '../search-detail/search-detail-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { ProviderDetailService } from '../provider-detail/provider-detail.service';
import { LoginComponent } from '../../components/login/login.component';
import { SignUpComponent } from '../../components/signup/signup.component';

import { SearchFields } from '../../modules/search/searchfields';
import { Messages } from '../../../shared/constants/project-messages';

import { projectConstants } from '../../../shared/constants/project-constants';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { CheckInComponent } from '../../modules/check-in/check-in.component';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { CouponsComponent } from '../coupons/coupons.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

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
  send_message_cap = Messages.SEND_MSG_CAP;
  claim_my_business_cap =Messages.CLAIM_BUSINESS_CAP;
  open_now_cap = Messages.OPEN_NOW_CAP;
  sorry_cap = Messages.SORRY_CAP;
  not_allowed_cap = Messages.NOT_ALLOWED_CAP;
  do_you_want_to_cap = Messages.DO_YOU_WANT_TO_CAP;
  for_cap = Messages.FOR_CAP;
  different_date = Messages.DIFFERENT_DATE_CAP;
  no_ynw_results_found = Messages.NO_YNW_RES_FOUND_CAP;

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
  sortfieldsels = '';
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
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  hideRefineifOneresultchk = false;
  checkindialogRef;
  claimdialogRef;
  servicedialogRef;
  commdialogRef;
  coupondialogRef;
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
    this.checkRefineSpecial();
    this.commTooltip = this.shared_functions.getProjectMesssages('COMM_TOOPTIP');
    this.refTooltip = this.shared_functions.getProjectMesssages('REF_TOOPTIP');
    this.bNameTooltip = this.shared_functions.getProjectMesssages('BUSSNAME_TOOPTIP');
    // this.activaterouterobj.queryParams
    this.getDomainListMain()
      .then(data => {
        this.domainlist_data = data;

        this.activaterouterobj.params
          .subscribe(paramsv => {
            this.setSearchfields(paramsv, 1);
            this.setEnvironment(false);
            // this.do_search();
          });
      });
    // this.sortfieldsels = 'distanceasc';
    this.nosearch_results = false;
        this.retscrolltop = this.shared_functions.getitemfromLocalStorage('sctop') || 0;
    this.shared_functions.setitemonLocalStorage('sctop', 0);
    // setTimeout(() => {
    //   console.log('i am here', scrolltop);
    //   window.scrollTo(0, scrolltop);
    //  }, 3200);

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
    // console.log('here', this.screenWidth, this.screenHeight);
  }
  @HostListener('window:scroll', ['$event'])
doScroll(event) {
  this.scrolltop = window.pageYOffset;
  // console.log('scroll', this.scrolltop);
}
  checkRefineSpecial() {
    const ynwsrchbuttonClicked = this.shared_functions.getitemfromLocalStorage('ynw_srchb');
    // console.log('test', ynwsrchbuttonClicked);
    this.shared_functions.removeitemfromLocalStorage('ynw_srchb');
    if (ynwsrchbuttonClicked === 1) {
      this.hideRefineifOneresultchk = true;
    } else {
      this.hideRefineifOneresultchk = false;
    }
    // console.log('ref check', this.hideRefineifOneresultchk);
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
    // console.log('diff hours search', diff['hours']);
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
      // this.getRefinedSearch(true);
      if (this.labelq === '') {
        this.getRefinedSearch(true, 0, 'domainlist');
      } else {
        this.buildQuery(false);
      }
    }
  }
  checklocationExistsinStorage() {
    const localloc = this.shared_functions.getitemfromLocalStorage('ynw-locdet');

    // if (!localloc) {
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
    // }
  }

  setSearchfields(obj, src) {
    // console.log('src', src, 'details', obj);
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
      this.kwdomain = obj.kwdomain;
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
        // if (this.domain === '' || this.domain === undefined || this.domain === 'undefined') {
        if (this.kwdomain !== '') {
          this.domain = this.kwdomain;
          // this.getlistofSubdomains(this.domain);
          // console.log('reached here');
        }
        if (this.kwsubdomain !== '') {
          this.selected_leftsubdomain = this.kwsubdomain;
        }
        // }
        this.specialization_hide = true;
      }

      if (this.kwtyp === 'subdom') {
        // if (this.domain === '' || this.domain === undefined || this.domain === 'undefined') {
        if (this.kwdomain !== '') {
          this.domain = this.kwdomain;
          // this.getlistofSubdomains(this.domain);
          // console.log('reached here');
        }
        // console.log('subdom', this.kw);
        if (this.kw !== '') {
          this.selected_leftsubdomain = this.kw;
        }
        // }
      }
      // calling method to parse refine filters in query string to respective array
      this.parseRefinedfiltersQueryString(obj);
      // console.log('refined', this.querystringrefineretain_arr);
      // console.log('ref_query', this.refined_querystr);
      // console.log('cpg', obj.cpg);
      if (obj.cpg) { // check whether paging value is there in the url
        let cnumb = Number(obj.cpg);
        if (isNaN(cnumb)) {
          cnumb = 1;
        }
        this.startpageval = cnumb;
      } else {
        this.startpageval = 1;
      }
      // this.startpageval = 1;
      /* console.log('domain', this.domain, 'locname', this.locname, 'locautoname',
         this.locautoname, 'lat', this.latitude, 'lon', this.longitude, 'kw', this.kw, 'kwauto', this.kwautoname, 'kwdomain', this.kwdomain, 'kwsubdom', this.kwsubdomain, 'kwtyp', this.kwtyp);*/
      if (obj.sort && obj.srt !== ' ') {
        const sr = obj.srt.split(' ');
        this.sortfield = sr[0];
        this.sortorder = sr[1];
      } else {
        this.sortfield = '';
        this.sortorder = '';
      }
      if (this.labelq !== '') { // if came to details page by clicking the search labels
        // console.log('case1');
        this.parsesearchLabelsQuerystring(this.labelq, false); // function which parse and set the respective public variable
      } else { // to handle the case of splitting the query string in case of refresh from search result page
        // console.log('case2', obj.lq, this.labelq);
        this.parsesearchLabelsQuerystring(obj.q, false);
      }
    } else if (src === 2) { // case of setting values in response to call from the searchdetails page
      // console.log('details obj', obj);
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
      // console.log('kwtyp', this.kwtyp);
      // console.log('obj', obj);
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
          // this.selected_leftsubdomain = this.kwsubdomain;
          const domdet = this.getdomainofaSubdomain(this.kwsubdomain);
          if (domdet.dom !== '') {
            this.domain = domdet.dom;
          } else {
            this.domain = 'All';
          }
        }
        this.specialization_hide = true;
        this.specialization_exists = true;
        // console.log('reached here');
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
              // console.log('field', field, this.moreoptions_arr[i][field]);
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
        // console.log('passparam1', passparam1);



      }
      // console.log('passed refine filter', this.passrefinedfilters);
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
          // console.log('splitfield', orgfield);
          this.refinedExists = true;
          if (this.check_QuerystrinfieldexistsinArray(sufield) === -1) {
            // console.log('iamhere');
            this.querystringrefineretain_arr[orgfield] = obj[ufield].split('~'); // split values based on delimiter to an array
            if (orgfield === 'ynw_verified_level') {
              // console.log('fieldval', this.querystringrefineretain_arr[orgfield]);
              for (let jjj = 0; jjj < this.querystringrefineretain_arr[orgfield].length; jjj++) {
                this.querystringrefineretain_arr[orgfield][jjj] = Number(this.querystringrefineretain_arr[orgfield][jjj]);
              }
            }
            // console.log('field', orgfield);
          }
        }
      }
    }
    console.log('qrystr', this.refinedExists, this.querystringrefineretain_arr);
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
    // console.log('nowhere', fieldheader, fieldtype);
    if (fieldtype === 'EnumList' || fieldtype === 'Enum' || fieldtype === 'Gender') { // case of multiple selection of checkbox
      let retval = false;
      if (this.querystringrefineretain_arr[fieldheader]) {
        // console.log('flxname',fieldheader,fieldname, this.querystringrefineretain_arr[fieldheader].indexOf(fieldname));
        if (this.querystringrefineretain_arr[fieldheader].indexOf(fieldname) !== -1) {
          retval = true;
        }
      }
      // this.handle_optionclick(fieldheader, fieldtype, fieldname, true);
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
        retval = this.querystringrefineretain_arr[fieldheader][0];
        // console.log('text', fieldheader, retval, fieldtype);
        // this.handleTextrefineblur(fieldheader, retval, fieldtype, true);
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
    // console.log('str', str);
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
    // console.log('subsec', this.subsector);
    if (this.subsector !== '' && this.subsector !== undefined && this.subsector !== 'undefined') {
      const domainobtain = this.getdomainofaSubdomain(this.subsector);
      // console.log(domainobtain);
      this.kw = this.subsector;
      this.kwsubdomain = this.kw;
      // console.log('domainobtained', domainobtain);
      if (domainobtain !== undefined) {
        if (domainobtain['subdom_dispname'] !== '') {
          this.kwautoname = domainobtain['subdom_dispname'] || '';
          this.kwdomain = domainobtain['dom'] || '';
        }
      }
      // this.kwsubdomain = '';
      this.kwtyp = 'subdom';
      // this.showsearchsection = true;
    } else {
      if (this.domain !== '' && this.domain !== 'All' && this.specialization !== '') {
        // console.log('special reached here', this.specialization, this.domain);
        const obtarr = this.getSubdomainofaSpecialization(this.specialization, this.domain);
        // console.log('returned subdom', obtarr);
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
    // console.log('from details', obj);
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

    /*if (this.provider) {
      if (urlstr != '') {
        urlstr += '&';
      }
      urlstr += 'prov=' + this.provider;
    }*/
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

    // console.log('kw' + this.kw);
    if (this.kw !== '' && this.kw !== undefined && this.kw !== 'undefined') {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'kw=' + this.kw + ';kwauto=' + this.kwautoname + ';kwdomain=' + this.kwdomain + ';kwsubdomain=' + this.kwsubdomain + ';kwtyp=' + this.kwtyp;
    }
    // }

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
    // if (this.sortfield === '') {
    //   this.sortfield = 'title';
    //   this.sortorder = 'asc';
    // }
    if (this.sortfield) {
      if (urlstr !== '') {
        urlstr += ';';
      }
      urlstr += 'srt=' + this.sortfield + ' ' + this.sortorder;
    }
    /*if (urlstr !== '' && !this.labelq) {
      urlstr = ';' + urlstr;
    }*/
    if (urlstr !== '') {
      urlstr = ';' + urlstr;
    }
    urlstr = 'searchdetail' + urlstr;
    this.location.replaceState(urlstr);
  }
  private do_search() {
    let sortval = '';

    if (this.sortfield) {
      sortval = this.sortfield + ' ' + this.sortorder;
    }
    let q_str = '';
    let locstr = '';
    // q_str = 'title:\'' + 'sony new business' + '\''; // ***** this line needs to be commented after testing
    if (this.latitude) { // case of location is selected
      // calling shared function to get the coordinates for nearybylocation
      const retcoordinates = this.shared_functions.getNearByLocation(this.latitude, this.longitude, this.loctype);
      // console.log('loctype', this.loctype);
      const coordinates = retcoordinates['locationRange'];
      // const locstr = 'location1:' + coordinates + ' ' + 'location2:' + coordinates + 'location3:' + coordinates + 'location4:' + coordinates + 'location5:' + coordinates;
      // q_str = q_str + ' ( or ' + locstr + ')';
      projectConstants.searchpass_criteria.distance = 'haversin(' + this.latitude + ',' + this.longitude + ',location1.latitude,location1.longitude)';
      locstr = 'location1:' + coordinates;
      q_str = q_str + locstr;
    }
    let phrasestr = '';
    if (this.kwtyp === 'kwtitle') {
      let ptitle = this.kw.replace('/', '');
      ptitle = ptitle.replace(/'/g, '\\\'');
      q_str = q_str + ' title:\'' + ptitle + '\'';
      // q_str = q_str + ' title:\'' + this.kw.replace('/', '') + '\'';
    } else if (this.kwtyp === 'kwphrase') {
      let phrase = this.kw.replace('/', '');
      phrase = phrase.replace(/'/g, '\\\'');
      phrasestr = ' (phrase \'' + phrase + '\') ';
      // q_str = q_str + ' title:\'' + this.kw.replace('/', '') + '\'';
    }
    if (this.domain && this.domain !== 'All' && this.domain !== 'undefined' && this.domain !== undefined) { // case of domain is selected
      q_str = q_str + 'sector:\'' + this.domain + '\'';
    } else {
      if (this.latitude) {
        // q_str = q_str + '\'\'';
        // q_str = q_str + '\'';
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
    // console.log('Iamhere', this.labelq);
    if (this.labelq) { // if label search then bypass all other criteria
      // console.log('labelq', this.labelq);
      const labelqarr = this.labelq.split('&');
      q_str = labelqarr[0].replace('?q=', '');
      q_str = q_str.replace('[loc_details]', locstr);

      /*if (this.latitude) { // case of location is selected
        // calling shared function to get the coordinates for nearybylocation
        q_str = q_str + '( and location1:' + this.shared_functions.getNearByLocation(this.latitude, this.longitude) + ')';
      }*/
      // console.log('labelarr', labelqarr);
      // projectConstants.searchpass_criteria.parser = labelqarr[1].replace('q.parser=', '');
      // projectConstants.searchpass_criteria.return = labelqarr[2].replace('return=', '');
    } else {
      // if (this.latitude || this.domain || this.labelq || this.refined_querystr) {
      if (this.latitude || this.domain || this.labelq || time_qstr || phrasestr) {
        // if location or domain is selected, then the criteria should include following syntax
        // q_str = '(and ' + time_qstr + q_str + this.refined_querystr + ')';
        q_str = '(and ' + phrasestr + time_qstr + q_str + ')';
      }
    }
    // Creating criteria to be passed via get
    // console.log('refined query', this.refined_querystr);
    // console.log('search query', q_str);
    projectConstants.searchpass_criteria.q = q_str;
    projectConstants.searchpass_criteria.sort = sortval;
    projectConstants.searchpass_criteria.fq = this.refined_querystr;


    this.nosearch_results = false;
    // console.log('pg', this.startpageval);
    // Finding the start row value for paging
    if (this.startpageval) {
      projectConstants.searchpass_criteria.start = (this.startpageval - 1) * projectConstants.searchpass_criteria.size;
    } else {
      projectConstants.searchpass_criteria.start = 0;
    }
    // this.search_string = base_url + q_str + suffix_url;
    if (this.search_return) {
      this.search_return.unsubscribe();
    }
    this.search_result_count = 0;
    if (q_str === '') {
      // console.log('no criteria');
    } else {
      this.shared_functions.getCloudUrl()
        .then(url => {

          /* const userobj = this.shared_functions.getitemfromLocalStorage('ynw-user');
           // console.log("Hai:"+ JSON.stringify(userobj));
           let testUser = false;
           if (userobj !== null) {
             const phno = (userobj.primaryPhoneNumber.toString());
             if (phno.startsWith('55')) {
               testUser = true;
             }
           }
           console.log('testuser', testUser, projectConstants.searchpass_criteria.fq);
           const qvar = projectConstants.searchpass_criteria.fq;
           let qvarlen;
           if (!testUser) {
             if (qvar !== '') {
               qvarlen = qvar.length;
               projectConstants.searchpass_criteria.fq = qvar.substring(0, (qvarlen - 1)) + ' (not test_account:1) ' + qvar.substring(qvarlen - 1, 1);
             } else {
               projectConstants.searchpass_criteria.fq = ' (not test_account:1) ';
             }
           } else {
             if (qvar !== '') {
               qvarlen = qvar.length;
               projectConstants.searchpass_criteria.fq = qvar.substring(0, (qvarlen - 1)) + ' test_account:1 ' + qvar.substring(qvarlen - 1, 1);
             } else {
               projectConstants.searchpass_criteria.fq = ' (and test_account:1) ';
             }
           }
           console.log('testuser2', testUser, projectConstants.searchpass_criteria.fq);*/
          // console.log(projectConstants.searchpass_criteria);
          this.search_return = this.shared_service.DocloudSearch(url, projectConstants.searchpass_criteria)
            .subscribe(res => {
              this.search_data = res;
              this.result_provid = [];
              this.result_providdet = [];
              // console.log('search', this.search_data.hits.hit);
              let schedule_arr = [];
              let locationcnt = 0;
              for (let i = 0; i < this.search_data.hits.hit.length; i++) {
                // console.log('result terminologies', this.search_data.hits.hit[i].fields.title, JSON.parse(this.search_data.hits.hit[i].fields.terminologies));
                // this.getTerminologyTerm('waitlist', this.search_data.hits.hit[i].fields);
                locationcnt = 0;
                this.search_data.hits.hit[i].fields.rating = this.shared_functions.ratingRounding(this.search_data.hits.hit[i].fields.rating);
                this.search_data.hits.hit[i].fields['checkInsallowed'] = (this.search_data.hits.hit[i].fields.hasOwnProperty('online_checkins')) ? true : false;
                // console.log('rating', this.shared_functions.ratingRounding(this.search_data.hits.hit[i].fields.rating));
                // const providarr = this.search_data.hits.hit[i].id.split('-');
                const provid = this.search_data.hits.hit[i].id;
                // this.result_provid[i] = this.search_data.hits.hit[i].id;
                if (this.search_data.hits.hit[i].fields.claimable !== '1') {
                  // this.result_provid[i] = providarr[0]; // this.search_data.hits.hit[i].id;
                  // this.result_providdet.push({'provid': providarr[0], 'searchindx': i});
                  this.result_providdet.push({ 'provid': provid, 'searchindx': i });
                } else {
                  // console.log('claimable', this.search_data.hits.hit[i].fields.claimable );
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
                /*if (this.search_data.hits.hit[i].fields.business_hours1) {
                  schedule_arr = [];
                  for (let j = 0; j < this.search_data.hits.hit[i].fields.business_hours1.length; j++) {
                    const obt_sch = JSON.parse(this.search_data.hits.hit[i].fields.business_hours1[j]);
                   // console.log('business', obt_sch[0].repeatIntervals);
                      for (let k = 0; k < obt_sch[0].repeatIntervals.length; k++) {
                        // pushing the schedule details to the respective array to show it in the page
                        schedule_arr.push({
                            day: obt_sch[0].repeatIntervals[k],
                            sTime: obt_sch[0].timeSlots[0].sTime,
                            eTime: obt_sch[0].timeSlots[0].eTime
                        });
                      }
                      this.search_data.hits.hit[i].fields['display_schedule'] = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
                  }
                }*/

                if (this.search_data.hits.hit[i].fields.business_hours1) {
                  schedule_arr = [];
                  const business_hours = JSON.parse(this.search_data.hits.hit[i].fields.business_hours1[0]);
                  for (let j = 0; j < business_hours.length; j++) {
                    const obt_sch = business_hours[j];
                    // console.log('business', obt_sch[0].repeatIntervals);
                    for (let k = 0; k < obt_sch.repeatIntervals.length; k++) {
                      // pushing the schedule details to the respective array to show it in the page
                      schedule_arr.push({
                        day: obt_sch.repeatIntervals[k],
                        sTime: obt_sch.timeSlots[0].sTime,
                        eTime: obt_sch.timeSlots[0].eTime
                      });
                    }
                    this.search_data.hits.hit[i].fields['display_schedule'] = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
                  }
                }

              }
              // console.log('search after', this.search_data.hits.hit);
              /*let display_schedule = [];
              display_schedule =  this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
              this.queues[ii]['displayschedule'] = display_schedule;*/
              this.getWaitingTime(this.result_providdet);
              this.search_result_count = this.search_data.hits.found || 0;
              if (this.search_data.hits.found === 0) {
                this.nosearch_results = true;
              }
              if (this.hideRefineifOneresultchk) {
                if (this.search_result_count === 1) {
                  this.showrefinedsection = false;
                } else {
                  // console.log('screen width', this.screenWidth);
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
              // console.log('i am here', this.retscrolltop);
               window.scrollTo(0, this.retscrolltop);
               this.retscrolltop = 0;
              }, 1000);
            });
        });
    }
  }
  private getWaitingTime(provids) {
    if (provids.length > 0) {
      const post_provids: any = [];
      for (let i = 0; i < provids.length; i++) {
        // if (provids[i] !== undefined) {
        post_provids.push(provids[i].provid);
        // }
      }
      this.searchdetailserviceobj.getEstimatedWaitingTime(post_provids)
        .subscribe(data => {
          // console.log('estimated', data);
          this.waitlisttime_arr = data;
          if (this.waitlisttime_arr === '"Account doesn\'t exist"') {
            this.waitlisttime_arr = [];
          }
          const today = new Date();
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
          let cdate = new Date();
          // console.log('prov id', provids);
          for (let i = 0; i < this.waitlisttime_arr.length; i++) {
            srchindx = provids[i].searchindx;
            this.search_data.hits.hit[srchindx].fields['waitingtime_res'] = this.waitlisttime_arr[i];
            this.search_data.hits.hit[srchindx].fields['estimatedtime_det'] = [];

            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['calculationMode'] = this.waitlisttime_arr[i]['nextAvailableQueue']['calculationMode'];
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['queue_available'] = 1;
              this.search_data.hits.hit[srchindx].fields['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'] || false;
              cdate = new Date(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              // if (this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
              if (cdate.getTime() !== check_dtoday.getTime()) {
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = this.nextavailableCaption + ' ';
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['isFuture'] = 1;
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                }
              } else {
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['isFuture'] = 2;
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
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
    // console.log('setfields', this.kw, this.kwautoname, this.kwtyp);
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

    // console.log('ret search fields', this.searchfields);
    return this.searchfields;
  }
  private selected_sortfield(sel) {
    let selfield = '';
    let selorder = '';
    switch (sel) {
      // case 'titleasc':
      //   selfield = 'title';
      //   selorder = 'asc';
      // break;
      // case 'titledesc':
      //   selfield = 'title';
      //   selorder = 'desc';
      // break;
      // case 'sectorasc':
      //  selfield = 'sector';
      //  selorder = 'asc';
      // break;
      // case 'sectordesc':
      //   selfield = 'sector';
      //   selorder = 'desc';
      // break;
      case 'distanceasc':
        selfield = 'distance';
        selorder = 'asc';
        break;
      case 'ynw_verified_levelasc':
        selfield = 'ynw_verified_level';
        selorder = 'desc';
        break;
    }
    this.sortfieldsels = sel;
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
    // console.log('src', src);
    let subdom = '';
    this.searchrefine_arr = '';
    if (this.kw !== '') {
      if (this.kwtyp === 'subdom') {
        subdom = this.kw;
      } else if (this.kwtyp === 'special') {
        subdom = this.kwsubdomain;
      }
    }
    // if (this.kwtyp === 'label') {
    if (this.kwtyp === 'label' || (this.labelq !== '' && this.labelq !== undefined)) {
      subdom = this.kwsubdomain;
    }
    // console.log('obtained domain prefix', subdom, this.domain, this.kwtyp);
    if (subdom !== '' && (this.domain === '' || this.domain === undefined)) {
      const domdet = this.getdomainofaSubdomain(subdom);
      if (domdet) {
        // console.log('obtained domain', domdet);
        this.domain = domdet['dom'];
        this.kwautoname = domdet['subdom_dispname'];
      }
    }
    let pasdomain = (this.domain !== 'All') ? this.domain : '';
    if (subdom === '') {
      // pasdomain = '';
    }
    // console.log('pass dom subdom', pasdomain, subdom);
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
        // pasdomain = '';
      }
    }
    // console.log('ref', pasdomain, subdom);
    this.searchdetailserviceobj.getRefinedSearch(pasdomain, subdom)
      .subscribe(data => {
        // if (pasdomain && subdom) { // case if domain and subdomain are available
        if (pasdomain) { // case if domain and subdomain are available
          if (data['refinedFilters']) {
            this.searchrefine_arr = data['refinedFilters'];
          }
          if (data['commonFilters']) {
            const mergedarray = this.searchrefine_arr.concat(data['commonFilters']); // merging the refine and common filters
            this.searchrefine_arr = mergedarray; // assigning the merged array to the searchrefine_arr
          }
        } else {
          if (data['commonFilters']) {
            // console.log('common', data['commonFilters']);
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
        // console.log('refined', this.searchrefine_arr);
        // console.log('qrystr', this.querystringrefineretain_arr);

        // section which populates the respective arrays with criteria based on query string
        Object.keys(this.querystringrefineretain_arr).forEach(key => {
          const obtainedobj = this.getSearchrefineFieldDetails(key, this.querystringrefineretain_arr[key]);
          // console.log('obtained', obtainedobj);
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
          // this.do_search();
          this.buildQuery(false);
        }
      });
  }
  getdomainofaSubdomain(subdomname) {
    // console.log('domain data list', this.domainlist_data);
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
    // console.log('domainlist', this.domainlist_data);
    if (this.domainlist_data === undefined) {
      const bconfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
      // console.log('subdomspec', bconfig);
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
                // console.log('spec name', spec.name.toLowerCase(), special.toLowerCase());
                if (spec.name.toLowerCase() === special.toLowerCase()) {
                  retarr = { 'dom': this.domainlist_data[i].domain, 'subdom_name': subdom.subDomain, 'subdom_dispname': subdom.displayName };
                  return retarr;
                }
              }
            }
          }
        }
      }
    }//  else {
    retarr = { 'dom': '', 'subdom_name': '', 'subdom_dispname': '' };
    return retarr;
    // }
  }
  // method which is invoked on clicking the checkboxes or boolean fields
  handle_optionclick(fieldname, fieldtype, selval, bypassbuildquery?) {
    this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
    this.searchButtonClick = false;
    // console.log('click', fieldname, fieldtype, selval);
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
        // console.log('val exist', chk_fieldvalexist);
        if (chk_fieldvalexist[0]['indx'] !== -1) {
          this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']][chk_fieldvalexist[0]['field']].splice(chk_fieldvalexist[0]['key'], 1);
          //  console.log('count', this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']][chk_fieldvalexist[0]['field']].length);
          /*if (this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']].length === 0) {
            this.searchrefineresult_arr.splice(chk_fieldvalexist[0]['indx'], 1);
          }*/
          if (this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']][chk_fieldvalexist[0]['field']].length === 0) {
            this.searchrefineresult_arr.splice(chk_fieldvalexist[0]['indx'], 1);
          }
        } else {
          const curindx = this.searchrefineresult_arr[sec_indx][fieldname].length;
          if (fieldtype === 'Rating') { // done to handle the case of rating cleared in refined search
            if (selval !== '') {
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
    // console.log('refine filter', this.searchrefineresult_arr);
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
      // console.log('inside', this.searchrefineresult_arr[i], fieldname);
      for (const key in this.searchrefineresult_arr[i][fieldname]) {
        // console.log('inner', this.searchrefineresult_arr[i][fieldname][key]);
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
          // console.log(field, 'str=', subst_det['retstr'], 'cnt=', subst_det['retcnt']);
          if (subst_det['retstr'] !== '') {
            if (subst_det['retcnt'] > 1) {
              this.refined_querystr += ' (or ' + subst_det['retstr'] + ')';
            } else {
              this.refined_querystr += ' ' + subst_det['retstr'] + '';
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
          // textstr += ' ' + field + '_cust:' + '\'' + this.searchrefinetextresult_arr[field] + '\'' + ' ';
          tmpholder = this.searchrefinetextresult_arr[field];
          if (tmpholder) {
            tmpholder = tmpholder.replace(/'/g, '\\\'');
          }
          // textstr += ' ' + field + ':' + '\'' + this.searchrefinetextresult_arr[field] + '\'' + ' ';
          textstr += ' ' + field + ':' + '\'' + tmpholder + '\'' + ' ';
          this.refined_options_url_str += ';myref_' + field + '=' + this.searchrefinetextresult_arr[field];
        }
      }
    }
    if (textstr !== '') {
      textstr = ' ' + textstr;
    }
    const userobj = this.shared_functions.getitemfromLocalStorage('ynw-user');
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

    // this.refined_querystr = ' and (' + this.refined_querystr + textstr + ')';
    // this.refined_querystr = this.refined_querystr + textstr;
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
    // console.log('valcnt', this.searchrefineresult_arr[indx][fieldname].length);
    for (let i = 0; i < this.searchrefineresult_arr[indx][fieldname].length; i++) {
      if (retstr !== '') {
        retstr += '';
      }
      if (returlstr !== '') {
        returlstr += '~';
      }
      const if_special = fieldname.substr(-10);
      if (if_special === '_location*') {
        // for (let j = 1; j <= 1; j++) {
        retstr += ' ' + fieldname.replace('_location*', '_location1') + ':' + '\'' + this.searchrefineresult_arr[indx][fieldname][i][0] + '\'';
        //   curcnt++;
        // }
        /*for (let j = 1; j <= 5; j++) {
          retstr += ' ' + fieldname.replace('_location*', '_location' + j) + ':' + '\'' + this.searchrefineresult_arr[indx][fieldname][i][0] + '\'';
          curcnt++;
        }*/
        /*if (curcnt === this.searchrefineresult_arr[indx][fieldname].length) {} {
          retstr = ' ( or ' + retstr + ') ';
        }*/
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
          retstr += ' ' + fieldname + ':' + '\'' + this.searchrefineresult_arr[indx][fieldname][i][0] + '\'';
        }
      }
      // retstr += ' ' + fieldname + '_cust:' + '\'' + this.searchrefineresult_arr[indx][fieldname][i][0] + '\'';

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
      // console.log('enter key');
      // replacing unwanted characters
      this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
      fieldvalue = fieldvalue.replace(/;/g, '');
      fieldvalue = fieldvalue.replace(/\//g, '');
      this.handleTextrefineblur(fieldname, fieldvalue, fieldtype, bypassbuildquery);
    }
  }

  /* handleleftdomainchange(domain) {
     // setting the domain in the selected_domain holder variable
     if (domain === 'All') {
       domain = '';
     }
     this.selected_leftsubdomain = '';
     this.domain = domain;
     this.searchfields.domain = this.domain;
     // console.log('domainchange', this.searchfields.domain);
     this.showopnow = 1;
     this.change_url_on_criteria_change();
     this.subdomainlist_data = '';
     this.getlistofSubdomains();
     // this.loadkeywordAPIreponsetoArray();
   }*/
  getlistofSubdomains(curdomain, src?) {
    // const curdomain = this.refined_domain;
    // console.log('psubdomain', curdomain, this.domainlist_data);
    this.subdomainlist_data = [];
    if (curdomain !== '' && curdomain !== 'All') {
      for (const domains of this.domainlist_data) {
        if (domains.domain === curdomain) {
          this.subdomainlist_data = domains.subDomains;
        }
      }
            // if (this.subdomainlist_data.length === 1) {
      //  console.log('subdom', this.subdomainlist_data[0].subDomain, src);
        // this.handlerefinedsubdomainchange(this.subdomainlist_data[0].subDomain);
      // }
    }
    // console.log('subdomains', this.subdomainlist_data);
  }
  /* handleleftsubdomainchange(subdom) {
  //  console.log('selsubdom', subdom);
    for (const csubdom of this.subdomainlist_data) {
      if (csubdom.subDomain === subdom) {
        this.kwautoname =  csubdom.displayName;
        this.kw = csubdom.subDomain;
        this.kwdomain = this.domain;
        this.kwsubdomain = '';
        this.kwtyp = 'subdom';

        this.subdomainleft = {'kw': this.kw, 'kwautoname': this.kwautoname, 'kwdomain': this.kwdomain, 'kwsubdomain': this.kwsubdomain, 'kwtyp': this.kwtyp };

        this.searchfields.kwautoname = this.kwautoname;
        this.searchfields.kw = this.kw;
        this.searchfields.kwdomain = this.domain;
        this.searchfields.kwsubdomain = this.kwsubdomain;
        this.searchfields.kwtyp = this.kwtyp;


        this.getRefinedSearch(true);
      }
    }
  }*/
  handleratingClick(obj) {
    this.searchButtonClick = false;
    // this.ratingholder = obj.selectedrating;
    // console.log('rating holder', this.ratingholder);
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
            subsector: claimdata['subSector']
          };
          // console.log('Claim Business', obj.id, 'dta', data, 'pass data', pass_data);
          this.SignupforClaimmable(pass_data);
        }, error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    } else {

    }
  }

  SignupforClaimmable(passData) {
    const cClass = 'commonpopupmainclass';
    this.claimdialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', cClass],
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
      panelClass: ['signupmainclass', 'consumerpopupmainclass'],
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
            this.serviceClicked(passParam['mname'], passParam['mobj']);
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
      panelClass: ['loginmainclass', 'consumerpopupmainclass'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: this.checkProvider(origin),
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('login / signup return ', result);
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
        this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          this.showCommunicate(passParam['providerId'], passParam['provider_name']);
        } else if (passParam['callback'] === 'providerdetail') {
          this.showProviderDetails(passParam['providerId']);
        } else if (passParam['callback'] === 'servicedetail') {
            this.serviceClicked(passParam['mname'], passParam['mobj']);
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
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
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
      this.shared_functions.setitemonLocalStorage('sctop', this.scrolltop);
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
    // console.log('refineddomain', val);
    this.refined_domain = val;
    this.refined_subdomain = '';
    this.getlistofSubdomains(val, 'domainchange');
    if (this.subdomainlist_data.length === 1) { // case if there is only one subdomain
      console.log('subdom', this.subdomainlist_data[0].subDomain);
      this.handlerefinedsubdomainchange(this.subdomainlist_data[0].subDomain);
    } else {
      this.getRefinedSearch(true, 1);
    }
  }

  handlerefinedsubdomainchange(val) {
    this.startpageval = 1; // added now to reset the paging to the first page if any refine filter option is clicked
    this.searchButtonClick = false;
    // console.log('refinedSubdomain', val);
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
          // console.log('communicate provid ', providforCommunicate);
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
      panelClass: 'consumerpopupmainclass',
      disableClose: true,
      data: {
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
    // console.log('condi', this.searchButtonClick, this.search_result_count);
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
        // if (obj.fields.online_checkins === 1) {
        //  return true;
        // } else {
        return false;
        // }
      } else {
        return false;
      }
    }
  }

  getTerminologyTerm(term, fields) {
    let terminologies = null;
    // console.log('fields.terminolog', fields.terminologies, terminologies);
    if (fields.terminologies !== undefined) {
      terminologies = JSON.parse(fields.terminologies[0]);
    }
    // console.log('term', term, fields, 'terminologies', terminologies);
    if (terminologies !== null) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      // const terminologies = this.common_datastorage.get('terminologies');
      if (terminologies) {
        return this.shared_functions.firstToUpper((terminologies[term_only]) ? terminologies[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.shared_functions.firstToUpper((term === term_only) ? term_only : term);
      }
    } else {
      return this.shared_functions.firstToUpper(term);
    }
  }

  checkserviceClicked(name, obj) {
    console.log('here', name, obj);
    if (this.shared_functions.checkLogin()) {
      const ctype = this.shared_functions.isBusinessOwner('returntyp');
     // if (ctype === 'consumer') {
        this.serviceClicked(name, obj);
     // }
    } else { // show consumer login
      const passParam = {callback: 'servicedetail', mname: name, mobj: obj };
      this.doLogin('consumer', passParam);
    }
  }
  /* Service Clicked
    * name  Service Name
    * obj Search Result
    */
  serviceClicked(name, obj) {
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
              // console.log(services);
              let servicesList: any = [];
              servicesList = services;
              for (let i = 0; i < servicesList.length; i++) {
                if (servicesList[i].name === name) {
                  selected_service = servicesList[i];
                  break;
                }
              }
              if (selected_service !== null) {
                this.showServiceDetail(selected_service, busname);
              }
            });
        });
  }
  showServiceDetail(serv, busname) {
    this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'specialclass'],
      disableClose: true,
      data: {
        bname: busname,
        serdet: serv
      }
    });

    this.servicedialogRef.afterClosed().subscribe(result => {
    });
  }
  openCoupons() {
    // alert('Clicked coupon');
    this.coupondialogRef = this.dialog.open(CouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'specialclass'],
      disableClose: true,
      data: {
      }
    });
    this.coupondialogRef.afterClosed().subscribe(result => {
    });
  }
}
