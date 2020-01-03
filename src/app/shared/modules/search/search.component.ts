/* tslint:disable:forin */
import { Component, OnInit, Input, Output, EventEmitter, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAutocompleteTrigger, MatSelect, MatInput } from '@angular/material';
import { Messages } from '../../constants/project-messages';
import { SharedServices } from '../../services/shared-services';
import { SearchDataStorageService } from '../../services/search-datastorage.services';
import { SharedFunctions } from '../../functions/shared-functions';
import { SearchFields } from './searchfields';
import * as locationjson from '../../../../assets/json/locations.json';
import * as metrojson from '../../../../assets/json/metros_capital.json';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { projectConstants } from '../../constants/project-constants';
import { Subscription } from 'rxjs';
export class Locscls {
  constructor(public autoname: string, public name: string, public lat: string, public lon: string, public typ: string, public rank: number) { }
}
export class Keywordsgroupcls {
  constructor(public displayname: string, public name: string) { }
}
export class Keywordscls {
  constructor(public autoname: string, public name: string, public domain: string, public subdomain: string, public typ: string) { }
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges, DoCheck {
  all_cap = Messages.ALL_DOMAINSCAP;
  more_options_cap = Messages.MORE_OPTIONS_CAP;
  @Input() searchfields: SearchFields;
  @Input() showopennow: number;
  @Input() domainpassedfromrefined: string;
  @Input() subdomainpassedfromrefined: any;
  @Input() domainlistpassed: any = [];
  @Input() includedfrom: any;
  @Input() passedDomain: string;
  @Input() passedkwdet: any = [];
  @Input() passedRefine: any = [];
  @Output() searchclick = new EventEmitter<any>();
  myControl_prov: FormControl = new FormControl();
  myControl_loc: FormControl = new FormControl();
  myControl_domain: FormControl = new FormControl();
  public domainlist_data;
  public location_exists: boolean;
  public location_data;
  public nocriteria: boolean;
  public loading = false;
  public subscription;
  public searchlabels_dataholder;
  public searchlabels_data;
  public location_name;
  public sortfield;
  public sortorder;
  public hide_location_div: boolean;
  public kw_autoname = '';
  public prov_subscription;
  public provider_data;
  public suggestions = [];
  public prolocation_exists: boolean;
  public prov_loading = false;
  public prov_nocriteria: boolean;
  public hide_prov_div: boolean;
  public prov_id;
  public prov_name;
  public search_string: string;
  public selected_domain;
  public popular_search;
  public opennow_search;
  public searchlabel_search;
  public show_popularsrchlabellist;
  public show_searchlabellist;
  public commonfilters;
  public insidelocloop;
  showMoreOptionsOverlay = false;
  curlabel = { typ: '', query: '' };
  moreoptions_arr: any = [];
  location_arr: any = [];
  state_arr: any = [];
  statename_arr: any = [];
  city_arr: any = [];
  cityname_arr: any = [];
  area_arr: any = [];
  areaname_arr: any = [];
  locationList: Locscls[] = [];
  displaylocationList: Locscls[] = [];
  locsearchcriteria = '';
  keywordList: Keywordscls[] = [];
  displaykeywordList: Keywordscls[] = [];
  keyssearchcriteria = '';
  subdomainList: Keywordscls[] = [];
  holdisplaylist: Keywordscls[] = [];
  holdisplaySearchlist: Keywordscls[] = [];
  specilizationList: Keywordscls[] = [];
  titleobj: Keywordscls[] = [];
  keywordgroupList: Keywordsgroupcls[] = [];
  locationholder: Locscls;
  keywordholder: Keywordscls;
  showmoreoptionsSec = false;
  holdsrchlocname = '';
  clearLocationCalled = false;
  @ViewChild('locrefrence') private locRef: ElementRef;
  @ViewChild('locrefrence', { read: MatAutocompleteTrigger }) locationRef: MatAutocompleteTrigger;
  @ViewChild('provbox', { read: MatAutocompleteTrigger }) provRef: MatAutocompleteTrigger;
  moreoptionsTooltip = '';
  show = false;
  showmorepopularoptions = false;
  showMorepopularOptionsOverlay = false;
  jsonlist;
  subscriptions: Subscription;
  popularSearchList: any = [];
  paginationLimit = 6;
  startPage = 0;
  domainSuggestionPlaceholder = '';
  searchLabelList: any = [];
  lng;
  lat;
  geoLocation;
  isCurrentLocation = false;
  searchLength = 0;
  showmoreSearch = false;
  @ViewChild('seldomain') seldomain: MatSelect;

  constructor(
    private shared_service: SharedServices,
    private shared_functions: SharedFunctions,
    private searchdataserviceobj: SearchDataStorageService,
    private routerobj: Router) {
    this.myControl_prov.valueChanges.subscribe(val => {
      this.filterKeywords(val);
    });
    this.myControl_loc.valueChanges.subscribe(val => {
      this.filterLocation(val);
    });

    this.subscriptions = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'popular':
          this.setKeyword(message.target);
          break;
      }
    });
  }

  ngOnInit() {
    this.selected_domain = 'All';
    if (this.passedDomain) {
      this.selected_domain = this.passedDomain;
    }
    this.getAllsearchlabels();
    // const searchlabel = this.shared_functions.getitemfromLocalStorage('srchLabels');
    // if (searchlabel) {
    //   this.jsonlist = searchlabel.popularSearchLabels.all.labels;
    // }
    this.moreoptionsTooltip = this.shared_functions.getProjectMesssages('MOREOPTIONS_TOOLTIP');
    if (this.passedkwdet.kwtyp === 'label') {
      if (this.passedkwdet.kwdomain !== '' && this.passedkwdet.kwdomain !== undefined) {
        this.curlabel.typ = 'label';
        this.curlabel.query = this.passedkwdet.kwdomain;
      }
    }
    if (this.domainlistpassed.length > 0) {
      this.domainlist_data = this.domainlistpassed;
    } else {
      this.getDomainList();
    }
    this.setNulllocationvalues('');
    this.setNullKeyword('');
    this.hide_location_div = false;
    this.initialize_fields();
    this.loadLocationjsontoArray();
    // Checking whether the location is blank, if yes, then set it to the default location mentioned in the constants file
    this.checktoSetLocationtoDefaultLocation();
  }
  checktoSetLocationtoDefaultLocation() {
    if (this.locationholder.autoname === '' || this.locationholder.autoname === undefined || this.locationholder.autoname === null) {
      /* if the location details are saved in the local storage, fetch them and set it as the location */
      const localloc = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
      if (localloc) {
        if (localloc.autoname !== '' && localloc.autoname !== undefined && localloc.autoname !== null) {
          this.locationholder = localloc;
          this.location_name = localloc.autoname;
          if (this.location_name === 'Current Location') {
            this.isCurrentLocation = true;
          }
        } else { // case if details are not there in the local storage
          this.location_name = projectConstants.SEARCH_DEFAULT_LOCATION.autoname;
          this.locationholder.autoname = this.location_name;
          this.locationholder.name = projectConstants.SEARCH_DEFAULT_LOCATION.name;
          this.locationholder.lat = projectConstants.SEARCH_DEFAULT_LOCATION.lat;
          this.locationholder.lon = projectConstants.SEARCH_DEFAULT_LOCATION.lon;
          this.locationholder.typ = projectConstants.SEARCH_DEFAULT_LOCATION.typ;
          this.shared_functions.setitemonLocalStorage('ynw-locdet', this.locationholder);
        }
      } else {
        if (navigator) {
          navigator.geolocation.getCurrentPosition(pos => {
            const curLoc = {};
            curLoc['autoname'] = 'Current Location';
            curLoc['name'] = 'Current Location';
            curLoc['lat'] = +pos.coords.latitude;
            curLoc['lon'] = +pos.coords.longitude;
            curLoc['rank'] = 4;
            curLoc['typ'] = 'city';
            this.setLocation(curLoc);
            this.isCurrentLocation = true;
            this.location_name = curLoc['autoname'];

            // });
          },
            error => {
              this.setDefaultLocation();
            });
        } else {
          this.setDefaultLocation();
        }
      }
    }
  }
  private setDefaultLocation() {
    this.location_name = projectConstants.SEARCH_DEFAULT_LOCATION.autoname;
    this.locationholder.autoname = this.location_name;
    this.locationholder.name = projectConstants.SEARCH_DEFAULT_LOCATION.name;
    this.locationholder.lat = projectConstants.SEARCH_DEFAULT_LOCATION.lat;
    this.locationholder.lon = projectConstants.SEARCH_DEFAULT_LOCATION.lon;
    this.locationholder.typ = projectConstants.SEARCH_DEFAULT_LOCATION.typ;
    this.shared_functions.setitemonLocalStorage('ynw-locdet', this.locationholder);
  }
  private setLocation(loc) {
    if (loc) {
      this.locationholder = {
        name: loc.name,
        autoname: loc.autoname,
        lat: loc.lat,
        lon: loc.lon,
        typ: loc.typ,
        rank: loc.rank
      };
      this.shared_functions.setitemonLocalStorage('ynw-locdet', this.locationholder);
      this.location_data = undefined;
    }
    setTimeout(() => {
      this.locationRef.closePanel();
      this.seldomain.focus();
    }, 100);
    // this.handleNormalSearchClick();
  }
  locationClick(value) {
    if (value.keyCode === 13) {
      if (this.displaylocationList) {
        this.setLocation(this.displaylocationList[0]);
      }
    }
  }
  ngDoCheck() {
  }
  ngOnChanges() {
    if (this.domainpassedfromrefined) {
      this.selected_domain = this.domainpassedfromrefined;
    }
    if (this.subdomainpassedfromrefined) {
      this.keywordholder.autoname = this.subdomainpassedfromrefined.kwautoname;
      this.keywordholder.name = this.subdomainpassedfromrefined.kw;
      this.keywordholder.domain = this.subdomainpassedfromrefined.kwdomain;
      this.keywordholder.subdomain = this.subdomainpassedfromrefined.kwsubdomain;
      this.keywordholder.typ = this.subdomainpassedfromrefined.kwtyp;
      this.kw_autoname = this.keywordholder.autoname;
    }
    if (this.searchfields.sortfield) {
      this.sortfield = this.searchfields.sortfield;
    }
    if (this.searchfields.sortorder) {
      this.sortorder = this.searchfields.sortorder;
    }
  }
  closeMoreoptions() {
    this.showmoreoptionsSec = false;
    this.showMoreOptionsOverlay = false;
  }
  showMoreOptions() {
    if (this.showmoreoptionsSec) {
      this.showmoreoptionsSec = false;
      this.showMoreOptionsOverlay = false;
    } else {
      this.showmoreoptionsSec = true;
      this.showMoreOptionsOverlay = true;
    }
  }
  isNameExists(name) {
    const found = this.holdisplaySearchlist['label'].some(function (el) {
      return el.autoname === name;
    });
    if (!found) {
      return false;
    }
    return true;
  }
  handleNormalSearchClick() {
    this.moreoptions_arr = [];
    this.showmoreoptionsSec = false;
    const srchtxt = this.kw_autoname;
    if (!this.kw_autoname || this.kw_autoname.trim() === '') {
      this.do_search(null);
    } else if (this.holdisplaySearchlist['label'].length !== 0) {
      if (!this.isNameExists(this.kw_autoname)) {
        this.kw_autoname = srchtxt;
        this.do_search();
      } else {
        this.setKeyword(this.holdisplaySearchlist['label'][0]);
      }
    } else {
      this.kw_autoname = srchtxt;
      this.do_search();
    }
  }
  handleSearchmoreSearchClick(result) {
    this.moreoptions_arr = result;
    this.showmoreoptionsSec = false;
    this.do_search('');
  }
  // method with decides whether the more option link is to be display
  chk_moreoptionshow() {
    if ((this.selected_domain !== '' && this.selected_domain !== undefined
      && this.selected_domain !== 'undefined' && this.selected_domain !== 'All')
      || (this.keywordholder.name !== '') || (this.locationholder.name !== '' && this.locationholder.name !== null)) {
      const currenturl = this.routerobj.url.split(';');
      if (currenturl[0] !== '/searchdetail') {
        return true;
      }
    }
  }
  // loads the location details in json file to the respective array
  private loadLocationjsontoArray() {
    for (const state of locationjson['states']) {
      const objstate = { autoname: state.name + ', India', name: state.name, lat: state.latitude, lon: state.longitude, typ: 'state', rank: 4 };
      this.locationList.push(objstate);
      for (const city of state.cities) {
        const objcity = { autoname: city.name + ', ' + state.name, name: city.name, lat: city.latitude, lon: city.longitude, typ: 'city', rank: 3 };
        this.locationList.push(objcity);
        for (const area of city.locations) {
          const objarea = { autoname: area.name + ', ' + city.name + ', ' + state.name, name: area.name, lat: area.latitude, lon: area.longitude, typ: 'area', rank: 5 };
          this.locationList.push(objarea);
        }
      }
    }
    for (const metro of metrojson['metros']) {
      const objstate = { autoname: metro.name + ' (Metro)', name: metro.name, lat: metro.latitude, lon: metro.longitude, typ: 'metro', rank: 1 };
      this.locationList.push(objstate);
    }
    for (const capital of metrojson['capitals']) {
      const objstate = { autoname: capital.name + ' (Capital)', name: capital.name, lat: capital.latitude, lon: capital.longitude, typ: 'capital', rank: 2 };
      this.locationList.push(objstate);
    }
    this.locationList.sort((a, b) => a.rank.toString().localeCompare(b.rank.toString()));
  }
  private filterLocation(criteria: string = '') {
    this.locsearchcriteria = criteria;
    this.displaylocationList = [];
    const maxcnt = projectConstants.AUTOSUGGEST_LOC_MAX_CNT;
    let curcnt = 1;
    if (criteria === '') {
      this.setNulllocationvalues('');
      this.searchfields.location = '';
      this.searchfields.locationautoname = '';
      this.searchfields.locationtype = '';
      this.searchfields.latitude = undefined;
      this.searchfields.longitude = undefined;
    } else {
      if (criteria.length >= projectConstants.AUTOSUGGEST_MIN_CHAR) {
        const hold_criteria = criteria.toLowerCase();
        for (const locs of this.locationList) {
          const holdlocname = locs.autoname.toLowerCase();
          if (holdlocname.startsWith(hold_criteria)) {
            if (curcnt <= maxcnt) {
              this.displaylocationList.push(locs);
            }
            curcnt++;
          }
        }
      }
    }
  }
  filterKeywords(criteria: string = '') {
    this.keyssearchcriteria = criteria.toLowerCase();
    this.holdisplaylist = [];
    // Defining the types of details that will be displayed for keywords autocomplete
    // Check whether search labels exists
    if (this.show_popularsrchlabellist) {
      for (const label of this.show_popularsrchlabellist) {
        let holdkeyword;
        if (label.displayname && label.displayname !== '') {
          holdkeyword = label.displayname.toLowerCase();
          // if (holdkeyword.includes(this.keyssearchcriteria) || this.keyssearchcriteria === this.selected_domain.toLowerCase()) {
          const lbl = label.query.split('&');
          const labelspec = { autoname: label.displayname, name: label.name, subdomain: '', domain: this.shared_functions.Lbase64Encode(lbl[0]), typ: 'label', origin: 'popular' };
          this.holdisplaylist.push(labelspec);
          // }
        }
      }
    }
    // assiging the details to the displayed in the autosuggestion for keywords box
    if (this.selected_domain !== '') {
      this.popularSearchList = this.holdisplaylist;
      const pdata = { 'ttype': 'popularList', 'target': this.popularSearchList };
      this.shared_functions.sendMessage(pdata);
      if (this.popularSearchList) {
        this.shared_functions.setitemonLocalStorage('popularSearch', this.popularSearchList);
      }
    }

    // Auto suggestions list in 3rd search box
    this.displaykeywordList = [];
    this.keywordgroupList = [];
    this.holdisplaySearchlist = [];
    if (criteria === '') {
      this.setNullKeyword('');
      this.searchfields.kw = '';
      this.searchfields.kwautoname = '';
      this.searchfields.kwdomain = '';
      this.searchfields.kwsubdomain = '';
      this.searchfields.kwtyp = '';
    } else {
      this.holdisplaySearchlist['kwtitle'] = new Array();
      this.holdisplaySearchlist['onlineid'] = new Array();
      if (criteria.length >= projectConstants.AUTOSUGGEST_MIN_CHAR) {
        this.holdisplaySearchlist['kwtitle'].push({ autoname: criteria, name: criteria, domain: '', subdomain: '', typ: 'kwtitle', origin: 'gloablsearch' });
        this.holdisplaySearchlist['onlineid'].push({ autoname: criteria, name: criteria, domain: '', subdomain: '', typ: 'onlineid', origin: 'gloablsearch' });
      }
    }
    // Defining the types of details that will be displayed for keywords autocomplete
    const keywordgroup_val = [];
    // Check whether search labels exists
    // if (this.show_searchlabellist) {
    if (this.searchLabelList) {
      this.holdisplaySearchlist['label'] = [];
      this.holdisplaySearchlist['special'] = [];
      for (const label of this.searchLabelList) {
        let holdkeyword;
        if (label.displayname && label.displayname !== '') {
          holdkeyword = label.displayname.toLowerCase();
          if (holdkeyword.includes(this.keyssearchcriteria) || this.keyssearchcriteria === this.selected_domain.toLowerCase()) {
            const lbl = label.query.split('&');
            if (label.type === 'special') {
              const labelspec = { autoname: label.displayname, name: label.name, subdomain: '', domain: this.shared_functions.Lbase64Encode(lbl[0]), typ: label.type };
              this.holdisplaySearchlist['special'].push(labelspec);
            } else {
              const labelspec = { autoname: label.displayname, name: label.name, subdomain: '', domain: this.shared_functions.Lbase64Encode(lbl[0]), typ: 'label' };
              this.holdisplaySearchlist['label'].push(labelspec);
            }
          }
        }
      }
      // Check whether search labels heading is to be displayed
      if (this.holdisplaySearchlist['kwtitle']) {
        if (this.holdisplaySearchlist['kwtitle'].length > 0) {
          const groupdomainobj = { displayname: 'Business Name/Keyword', name: 'kwtitle' };
          keywordgroup_val.push(groupdomainobj);
        }
      }
      if (this.holdisplaySearchlist['onlineid']) {
        if (this.holdisplaySearchlist['onlineid'].length > 0) {
          const groupdomainobj = { displayname: 'Online ID', name: 'onlineid' };
          keywordgroup_val.push(groupdomainobj);
        }
      }
      if (this.holdisplaySearchlist['label'].length > 0) {
        const grouplabelsobj = { displayname: 'Suggested Searches', name: 'label' };
        keywordgroup_val.push(grouplabelsobj);
      }
      if (this.holdisplaySearchlist['special'].length > 0) {
        const grouplabelsobj = { displayname: 'Specialization', name: 'special' };
        keywordgroup_val.push(grouplabelsobj);
      }
    }
    this.keywordgroupList = keywordgroup_val;
    // assiging the details to the displayed in the autosuggestion for keywords box
    this.displaykeywordList = this.holdisplaySearchlist;
  }

  // this method decides how the items are shown in the autosuggestion list
  highlightSelText(curtext, classname, mod?) {
    let criteria = '';
    switch (mod) {
      case 'keyword':
        criteria = this.keyssearchcriteria;
        break;
      case 'location':
        criteria = this.locsearchcriteria;
        break;
    }
    const regexp = new RegExp(criteria, 'gi');
    if (criteria !== '' && criteria.length >= projectConstants.AUTOSUGGEST_MIN_CHAR) {
      // convert the criteria and current text to lower case to find the position of criteria in the string
      const l_criteria = criteria.toLowerCase();
      const l_curtext = curtext.toLowerCase();
      const index = l_curtext.indexOf(l_criteria);
      const foundstr = curtext.substr(index, criteria.length);
      return curtext.replace(regexp, '<span class="' + classname + '">' + foundstr + '</span>');
    } else {
      return curtext;
    }
  }
  private initialize_fields() {
    if (this.searchfields.domain) {
      this.selected_domain = this.searchfields.domain;
    }
    if (this.passedDomain !== undefined && this.passedDomain !== '') { // case if domain details passed to this component via input variable
      this.selected_domain = this.passedDomain;
    }
    if (this.searchfields.sortfield) {
      this.sortfield = this.searchfields.sortfield;
    }
    if (this.searchfields.sortorder) {
      this.sortorder = this.searchfields.sortorder;
    }
    if (this.searchfields.location) { // set the location related fields to the respective holders
      this.location_name = this.searchfields.locationautoname;
      this.locationholder.autoname = this.searchfields.locationautoname;
      this.locationholder.typ = this.searchfields.locationtype;
      this.locationholder.name = this.searchfields.location;
      this.locationholder.lat = this.searchfields.latitude;
      this.locationholder.lon = this.searchfields.longitude;
    }
    if (this.searchfields.kw) { // set the keyword related fields to the respective holders
      this.kw_autoname = this.searchfields.kwautoname;
      this.keywordholder.autoname = this.searchfields.kwautoname;
      this.keywordholder.name = this.searchfields.kw;
      this.keywordholder.domain = this.searchfields.kwdomain;
      this.keywordholder.subdomain = this.searchfields.kwsubdomain;
      this.keywordholder.typ = this.searchfields.kwtyp;
    }
    if (this.passedkwdet && this.passedkwdet.kw !== undefined) { // case if kw details passed to this component via input variable
      this.kw_autoname = this.passedkwdet.kwautoname;
      this.keywordholder.autoname = this.passedkwdet.kwautoname;
      this.keywordholder.name = this.passedkwdet.kw;
      this.keywordholder.domain = this.passedkwdet.kwdomain;
      this.keywordholder.subdomain = this.passedkwdet.kwsubdomain;
      this.keywordholder.typ = this.passedkwdet.kwtyp;
    }
    if (this.searchfields.commonfilters) {
      this.commonfilters = this.searchfields.commonfilters;
    }
  }
  getDomainList() {
    const bconfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
    let run_api = true;
    if (bconfig) {
      if (bconfig.bdata) { // case if data is there in local storage
        const bdate = bconfig.cdate;
        const bdata = bconfig.bdata;
        const saveddate = new Date(bdate);
        const diff = this.shared_functions.getdaysdifffromDates('now', saveddate);
        if (diff['hours'] < projectConstants.DOMAINLIST_APIFETCH_HOURS) {
          run_api = false;
          this.domainlist_data = bdata;
        }
      }
    }
    if (run_api) { // case if data is not there in data
      this.shared_service.bussinessDomains()
        .subscribe(
          res => {
            this.domainlist_data = res;
            const today = new Date();
            const postdata = {
              cdate: today,
              bdata: this.domainlist_data
            };
            this.shared_functions.setitemonLocalStorage('ynw-bconf', postdata);
          }
        );
    }
  }
  getAllsearchlabels() {
    // check whether search labels exists in local storage
    const srchlabels = this.shared_functions.getitemfromLocalStorage('srchLabels');
    if (srchlabels) {
      this.searchlabels_data = srchlabels || [];
      this.searchdataserviceobj.set(this.searchlabels_data);
      this.handledomainchange(this.selected_domain, 1);
      this.jsonlist = this.searchlabels_data.popularSearchLabels.all.labels;
      if (this.jsonlist) {
        this.searchLength = this.jsonlist.length;
        for (let i = 0; i < this.jsonlist.length; i++) {
          if (i < this.paginationLimit) {
            this.jsonlist[i].show = true;
          }
        }
      }
    } else {
      this.shared_service.getAllSearchlabels()
        .subscribe(
          res => {
            this.shared_functions.setitemonLocalStorage('srchLabels', res);
            this.searchlabels_data = res || [];
            this.jsonlist = this.searchlabels_data.popularSearchLabels.all.labels;
            if (this.jsonlist) {
              this.searchLength = this.jsonlist.length;
              for (let i = 0; i < this.jsonlist.length; i++) {
                if (i < this.paginationLimit) {
                  this.jsonlist[i].show = true;
                }
              }
            }
            this.shared_functions.setitemonLocalStorage('popularSearch', this.jsonlist);
            const pdata = { 'ttype': 'popularSearchList', 'target': this.jsonlist };
            this.shared_functions.sendMessage(pdata);
            this.searchdataserviceobj.set(this.searchlabels_data);
            this.handledomainchange(this.selected_domain, 1);
          }
        );
    }
  }

  // To get searchlabels for 3rd search box
  getSearchLabels(selected_domain) {
    this.searchLabelList = this.shared_functions.getSearchLabels(selected_domain);
  }

  private setNulllocationvalues(loc?) {
    this.locationholder = {
      name: loc.name || null,
      autoname: loc.autoname || null,
      lat: loc.lat || null,
      lon: loc.lon || null,
      typ: loc.typ || null,
      rank: loc.rank || null
    };
    this.location_data = undefined;
  }
  private setKeyword(kw) {
    // if (this.kw_autoname) {
    //   this.filterKeywords();
    // }
    if (kw.query && kw.query.match('sub_sector_displayname')) {
      // kw.typ = 'kwphrase';
      // kw.autoname = kw.displayname;
      this.kw_autoname = kw.displayname;
      this.keywordholder.name = kw.displayname;
      this.keywordholder.autoname = kw.displayname;
      this.keywordholder.domain = '';
      this.keywordholder.subdomain = '';
      this.keywordholder.typ = 'kwphrase';
      this.handleNormalSearchClick();
      return;
      // kw.autoname = kw.name;
    }
    if (kw.domain && kw.domain.match('sub_sector_displayname')) {
      kw.typ = 'kwphrase';
      // kw.autoname = kw.name;
    }
    if (kw.origin === 'popular') {
      this.filterKeywords();
    }
    let autoName;
    let query;
    let dom;
    let subdom;
    if (kw.autoname) {
      autoName = kw.autoname;
      dom = kw.domain;
      subdom = kw.subdomain;
    } else if (kw.displayname) {
      autoName = kw.displayname;
      query = kw.query.split('\'');
      dom = kw.query;
      subdom = query[3];
      kw.typ = 'label';
    }
    if (kw.name !== '') {
      this.kw_autoname = autoName;
      this.keywordholder = {
        autoname: autoName,
        name: kw.name,
        domain: dom,
        subdomain: subdom,
        typ: kw.typ
      };
    }
    if (kw.typ === 'label') {
      this.curlabel.typ = 'label';
      this.curlabel.query = dom;
      const passkw = { query: dom }; // kw.domain holds the hardcoded query for the search labels
      if (dom !== '') {
        this.searchlabels_clicked(passkw);
      }
    } else {
      this.curlabel.typ = '';
      this.curlabel.query = '';
    }
    if (kw.typ !== 'label') { // execute search when selected an option using mouse in keyword box
      this.do_search();
    }
  }
  private setNullKeyword(kw?) {
    this.keywordholder = {
      autoname: kw.displayname || '',
      name: kw.name || '',
      domain: kw.domain || '',
      subdomain: kw.subdomain || '',
      typ: kw.typ || ''
    };
  }
  kwtyping(ev, val) {
    const kCode = parseInt(ev.keyCode, 10);
    switch (kCode) {
      case 37: // left arrow key
      case 38: // top arrow key
      case 39: // right arrow key
      case 40: // bottom arrow key
        // do nothing for above keys
        break;
      case 13: // enter key
        this.provRef.closePanel();
        this.setKeyword(this.keywordholder);
        break;
      default: // if other than above keys, then by default set the type as "kwtitle"
        this.kw_autoname = val;
        this.keywordholder.name = val;
        this.keywordholder.autoname = val;
        this.keywordholder.domain = '';
        this.keywordholder.subdomain = '';
        this.keywordholder.typ = 'kwphrase';
        this.curlabel.typ = '';
        this.curlabel.query = '';
        break;
    }
  }
  selectedOption() {
  }
  do_search(labelqpassed?) {
    this.shared_functions.setitemonLocalStorage('ynw_srchb', 1);
    this.closeMoreoptions();
    // done to handle the case if something is typed in the last text box and nothing else is selected by consumer, but some text is there
    // in such as case the text will be used to search against the index "title"
    if (this.kw_autoname !== '' && this.kw_autoname !== undefined) {
      if (this.keywordholder.typ === '' || this.keywordholder.typ === undefined || this.keywordholder.typ === 'kwtitle') {
        this.keywordholder.name = this.kw_autoname;
        this.keywordholder.autoname = this.kw_autoname;
        this.keywordholder.domain = '';
        this.keywordholder.subdomain = '';
        this.keywordholder.typ = 'kwtitle';
      }
      if (this.keywordholder.typ === '' || this.keywordholder.typ === undefined || this.keywordholder.typ === 'onlineid') {
        this.keywordholder.name = this.kw_autoname;
        this.keywordholder.autoname = this.kw_autoname;
        this.keywordholder.domain = '';
        this.keywordholder.subdomain = '';
        this.keywordholder.typ = 'onlineid';
      }
    }
    let labelq = labelqpassed;
    if (labelq === '' || labelq === undefined) {
      if (this.curlabel.typ === 'label') {
        if (this.curlabel.query !== '') {
          labelq = this.curlabel.query;
        }
      }
    }
    const currenturl = this.routerobj.url.split(';');
    // Checking whether the location is blank, if yes, then set it to the default location mentioned in the constants file
    this.checktoSetLocationtoDefaultLocation();
    if (currenturl[0] === '/searchdetail') { // if clicked search button from the search result page itself
      this.onsearchclick(labelq);
    } else { // clicked search button from home page
      const passparam = {
        do: this.selected_domain || '',
        la: this.locationholder.lat || '',
        lo: this.locationholder.lon || '',
        lon: this.locationholder.name || '',
        lontyp: this.locationholder.typ || '',
        lonauto: this.locationholder.autoname || '',
        kw: this.keywordholder.name || '',
        kwauto: this.keywordholder.autoname || '',
        kwdomain: this.keywordholder.domain || '',
        kwsubdomain: this.keywordholder.subdomain || '',
        kwtyp: this.keywordholder.typ || '',
        srt: this.sortfield + ' ' + this.sortorder,
        lq: labelq || '',
        cfilter: this.commonfilters || ''
      };
      if (this.moreoptions_arr.length > 0) {
        for (let i = 0; i < this.moreoptions_arr.length; i++) {
          for (const field in this.moreoptions_arr[i]) {
            if (field) {
              let valstr = '';
              for (const fval of this.moreoptions_arr[i][field]) {
                if (valstr !== '') {
                  valstr += '~';
                }
                valstr += fval[0];
              }
              passparam['myref_' + field.toString()] = valstr;
            }
          }
        }
      }
      this.routerobj.navigate(['/searchdetail', passparam]);
    }
  }
  onsearchclick(labelq?) {
    this.searchfields.domain = this.selected_domain;
    if (this.locationholder.name === '') {
      this.locationholder.lat = undefined;
      this.locationholder.lon = undefined;
      this.locationholder.typ = '';
      this.searchfields.location = '';
      this.searchfields.locationautoname = '';
      this.searchfields.locationtype = '';
      this.searchfields.latitude = undefined;
      this.searchfields.longitude = undefined;
    } else {
      if (this.locRef.nativeElement) {
        this.locRef.nativeElement.value = this.locationholder.autoname;
      }
      this.searchfields.location = this.locationholder.name;
      this.searchfields.locationautoname = this.locationholder.autoname;
      this.searchfields.locationtype = this.locationholder.typ;
      this.searchfields.latitude = this.locationholder.lat;
      this.searchfields.longitude = this.locationholder.lon;
    }
    if (this.kw_autoname === '') {
      this.keywordholder.name = '';
      this.keywordholder.autoname = '';
      this.keywordholder.domain = '';
      this.keywordholder.subdomain = '';
      this.keywordholder.typ = '';
    }
    this.searchfields.kw = this.keywordholder.name;
    this.searchfields.kwautoname = this.keywordholder.autoname;
    this.searchfields.kwdomain = this.keywordholder.domain;
    this.searchfields.kwsubdomain = this.keywordholder.subdomain;
    this.searchfields.kwtyp = this.keywordholder.typ;
    this.searchfields.commonfilters = this.commonfilters;
    if (labelq !== '' && labelq !== undefined && labelq !== 'undefined') {
      if (this.keywordholder.typ === 'label') {
        this.searchfields.kwdomain = '';
        this.searchfields.kwtyp = '';
      }
    }
    if (labelq === '' || labelq === undefined || labelq === 'undefined') {
      this.searchfields.kwdomain = '';
    }
    this.searchfields.sortfield = this.sortfield;
    this.searchfields.sortorder = this.sortorder;
    this.searchfields.labelq = labelq || '';
    if (labelq !== '' && labelq !== undefined && labelq !== 'undefined') {
      const ret_arr = this.parsesearchLabelsQuerystring(this.searchfields.labelq);
      if (ret_arr['sector'] !== '') {
        this.searchfields.domain = ret_arr['sector'];
        this.selected_domain = this.searchfields.domain;
      }
      if (ret_arr['subsector'] !== '') {
        const ret = this.getdomainofaSubdomain(ret_arr['subsector']);
        ret_arr['subdom_dispname'] = ret['subdom_dispname'] || ret_arr['subsector'];
        if (ret_arr['sector'] === '') { // sector not mentioned in the search label condition
          if (ret['dom'] === '') {
            ret.dom = 'All';
          }
          ret_arr['dom'] = ret['dom'];
          this.searchfields.domain = ret['dom'];
        }
        this.searchfields.subsector = ret_arr['subsector'];
        this.searchfields.kw = ret_arr['subsector'];
        if (this.searchfields.kwautoname === '') {
          this.searchfields.kwautoname = ret_arr['subdom_dispname'];
        }
        this.searchfields.kwdomain = ret_arr['dom'];
        this.searchfields.kwsubdomain = '';
        this.searchfields.kwtyp = 'subdom';
        this.selected_domain = this.searchfields.domain;
        this.kw_autoname = ret_arr['subdom_dispname'];
      }
    }
    if (this.moreoptions_arr.length > 0) {
      this.searchfields.passrefinedfilters = this.moreoptions_arr;
    } else {
      this.searchfields.passrefinedfilters = [];
    }
    this.searchclick.emit(this.searchfields);
  }
  getdomainofaSubdomain(subdomname) {
    let retarr = { 'dom': '', 'subdom_dispname': '' };
    if (this.domainlist_data) {
      for (let i = 0; i < this.domainlist_data.length; i++) {
        for (const subdom of this.domainlist_data[i].subDomains) {
          if (subdom.subDomain === subdomname) {
            retarr = { 'dom': this.domainlist_data[i].domain, 'subdom_dispname': subdom.displayName };
            return retarr;
          }
        }
      }
    }
    return retarr;
  }
  getdomainofaSpecialization(specialization) {
    let retarr = { 'dom': '', 'special_dispname': '' };
    if (this.domainlist_data) {
      for (let i = 0; i < this.domainlist_data.length; i++) {
        for (const subdom of this.domainlist_data[i].subDomains) {
          for (const specilization of subdom.specializations) {
            if (specilization.name === specialization) {
              retarr = { 'dom': this.domainlist_data[i].domain, 'special_dispname': specilization.displayName };
              return retarr;
            }
          }
        }
      }
    }
    retarr = { 'dom': '', 'special_dispname': '' };
    return retarr;
  }
  // function which parse the querystring from search leabels
  parsesearchLabelsQuerystring(str = null) {
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
      }
      return retarr;
    }
  }
  handledomainchange(domain, avoidclear?) {
    // setting the domain in the selected_domain holder variable
    if (domain === 'All') {
    }
    this.selected_domain = domain;
    this.domainSuggestionPlaceholder = projectConstants.DOMAIN_SEARCH_SUGGESTIONS[domain.toLowerCase()];
    if (avoidclear === 1) {
    } else {
      this.kw_autoname = '';
      this.keywordholder = {
        autoname: '',
        name: '',
        domain: '',
        subdomain: '',
        typ: ''
      };
      this.curlabel = { typ: '', query: '' };
    }
    this.keyssearchcriteria = '';
    this.prov_name = '';
    this.getSearchLabels(domain);
    this.getSearchlabelsbydomain(domain);
    if (avoidclear === undefined) {
      this.handleNormalSearchClick();
      if (this.routerobj.url !== '/') {
        setTimeout(() => {
          this.seldomain.close();
          this.filterKeywords();
          document.getElementById('suggestSearch').focus();
        }, 500);
      }
    }
  }
  getSearchlabelsbydomain(domain) {
    if (domain == null || domain === '' || domain === 'All') {
      this.show_popularsrchlabellist = this.shared_functions.get_Popularsarchlabels('global', this.searchdataserviceobj.getAll());
      this.show_searchlabellist = this.shared_functions.get_Searchlabels('global', this.searchdataserviceobj.getAll());
    } else {
      this.show_popularsrchlabellist = this.shared_functions.get_Popularsarchlabels('domain', this.searchdataserviceobj.getAll(), { 'domain': domain });
      this.show_searchlabellist = this.shared_functions.get_Searchlabels('domain', this.searchdataserviceobj.getAll(), { 'domain': domain });
    }
    this.filterKeywords(domain);
  }
  searchlabels_clicked(obj) {
    this.setNulllocationvalues('');
    this.do_search(obj.query);
  }
  handleCustomfilter(val) {
    this.commonfilters = val;
    this.do_search();
  }
  handle_returntochild() {
  }
  setCurrentLocation(obj) {
    if (this.clearLocationCalled) {
      return false;
    }
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        const curLoc = {};
        curLoc['autoname'] = 'Current Location';
        curLoc['name'] = 'Current Location';
        curLoc['lat'] = +pos.coords.latitude;
        curLoc['lon'] = +pos.coords.longitude;
        curLoc['rank'] = 4;
        curLoc['typ'] = 'city';
        this.setLocation(curLoc);
        this.location_name = curLoc['autoname'];
        obj.value = this.location_name;
        this.isCurrentLocation = true;
      },
        error => {
          this.shared_functions.openSnackBar('You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.', { 'panelClass': 'snackbarerror' });
          // this.setDefaultLocation();
        });
    }
  }
  clearSearch(obj) {
    this.clearLocationCalled = true;
    this.isCurrentLocation = false;
    this.displaylocationList = [];
    obj.value = '';
  }
  blurSearch(obj) {
    if (obj.value === '') {
      obj.value = this.locationholder.autoname;
    }
    if (obj.value === 'Current Location') {
      this.isCurrentLocation = true;
    }
    this.clearLocationCalled = false;
  }
  deselect() {
    if (this.locRef.nativeElement) {
      this.locRef.nativeElement.value = this.locRef.nativeElement.value;
    }
  }
  showMoreItems(source) {
    // if (this.showmorepopularoptions) {
    //   this.showmorepopularoptions = false;
    //   this.showMorepopularOptionsOverlay = false;
    // } else {
    //   this.showmorepopularoptions = true;
    //   this.showMorepopularOptionsOverlay = true;
    // }
    this.showmoreSearch = false;
    if (source === 'more' && this.jsonlist) {
      for (let i = 0; i < this.jsonlist.length; i++) {
        if (i >= this.paginationLimit) {
          this.jsonlist[i].show = true;
        }
      }
      this.showmoreSearch = true;
    }
    if (source === 'less') {
      for (let i = 0; i < this.jsonlist.length; i++) {
        if (i >= this.paginationLimit) {
          this.jsonlist[i].show = false;
        }
      }
      this.showmoreSearch = false;
    }
  }
  closeMorepopularoptions() {
    this.showmorepopularoptions = false;
    this.showMorepopularOptionsOverlay = false;
  }
}
