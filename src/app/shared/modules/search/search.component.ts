/* tslint:disable:forin */
import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from '../../services/shared-services';
import { SearchDataStorageService } from '../../services/search-datastorage.services';
import { SharedFunctions } from '../../functions/shared-functions';
// import { SearchMoreOptionsComponent } from '../../components/search-moreoptions/search-moreoptions.component';

import { SearchFields } from './searchfields';
import { base_url } from '../../constants/urls';

// Importing the locations json file so that we can make use of it
import * as locationjson from '../../../../assets/json/locations.json';


import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { projectConstants } from '../../constants/project-constants';

export class Locscls {
  constructor(public autoname: string, public name: string, public lat: string, public lon: string, public typ: string) { }
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

  @Input() searchfields: SearchFields;
  @Input() showopennow: number;
  @Input() domainpassedfromrefined: string;
  @Input() subdomainpassedfromrefined: any;
  @Input() domainlistpassed: any = [];
  @Input() includedfrom: any;
  @Input() passedDomain: string;
  @Input() passedkwdet: any =  [];
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

  public kw_autoname;

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
  public show_searchlabellist;
  public commonfilters;
  public insidelocloop;
  curlabel = {typ: '', query: ''};

  moreoptions_arr: any = [];
  location_arr: any = [];
  state_arr: any = [];
  statename_arr: any = [];
  city_arr: any = [];
  cityname_arr: any = [];
  area_arr: any = [];
  areaname_arr: any = [];

  locationList: Locscls[] = [] ;
  displaylocationList: Locscls[] = [] ;
  locsearchcriteria = '';

  keywordList: Keywordscls[] = [] ;
  displaykeywordList: Keywordscls[] = [] ;
  keyssearchcriteria = '';

  subdomainList: Keywordscls[] = [];
  holdisplaylist: Keywordscls[] = [];
  specilizationList: Keywordscls[] = [] ;
  titleobj: Keywordscls[] = [] ;

  keywordgroupList: Keywordsgroupcls[] = [];

  locationholder: Locscls;
  keywordholder: Keywordscls;
  showmoreoptionsSec = false;

  constructor (
    private shared_service: SharedServices,
    private shared_functions: SharedFunctions,
    private searchdataserviceobj: SearchDataStorageService,
    private dialog: MatDialog,
    private routerobj: Router) {

      this.myControl_prov.valueChanges.subscribe(val => {
        this.filterKeywords(val);
      });
      this.myControl_loc.valueChanges.subscribe(val => {
        this.filterLocation(val);
      });
    }

  ngOnInit() {
    // console.log('srch pass kw', this.passedkwdet);
    if (this.passedkwdet.kwtyp === 'label') {
      if (this.passedkwdet.kwdomain !== '' && this.passedkwdet.kwdomain !== undefined) {
        this.curlabel.typ = 'label';
        this.curlabel.query = this.passedkwdet.kwdomain;
      }
    }
    // console.log('included from', this.includedfrom);
    this.selected_domain = 'All';
    if (this.domainlistpassed.length > 0) {
       this.domainlist_data = this.domainlistpassed;
       this.loadkeywordAPIreponsetoArray();
    } else {
       // console.log('reached here');
        this.getDomainList();
    }
    this.getAllsearchlabels();
    this.setNulllocationvalues('');
    this.setNullKeyword('');
    this.hide_location_div = false;
    this.initialize_fields();
    this.loadLocationjsontoArray();
    // Checking whether the location is blank, if yes, then set it to the default location mentioned in the constants file
    this.checktoSetLocationtoDefaultLocation();

  }
  checktoSetLocationtoDefaultLocation() {
    // console.log('loccheck', this.locationholder.autoname);
    if (this.locationholder.autoname === '' || this.locationholder.autoname === undefined || this.locationholder.autoname === null) {
      /* if the location details are saved in the local storage, fetch them and set it as the location */

      const localloc = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
      if (localloc) {
        if (localloc.autoname !== '' && localloc.autoname !== undefined && localloc.autoname !== null) {
            this.locationholder = localloc;
            this.location_name = localloc.autoname;
        } else { // case if details are not there in the local storage
            this.location_name = projectConstants.SEARCH_DEFAULT_LOCATION.autoname;
            this.locationholder.autoname = this.location_name;
            this.locationholder.name = projectConstants.SEARCH_DEFAULT_LOCATION.name;
            this.locationholder.lat = projectConstants.SEARCH_DEFAULT_LOCATION.lat;
            this.locationholder.lon = projectConstants.SEARCH_DEFAULT_LOCATION.lon;
            this.shared_functions.setitemonLocalStorage('ynw-locdet', this.locationholder);
        }
      } else {
            this.location_name = projectConstants.SEARCH_DEFAULT_LOCATION.autoname;
            this.locationholder.autoname = this.location_name;
            this.locationholder.name = projectConstants.SEARCH_DEFAULT_LOCATION.name;
            this.locationholder.lat = projectConstants.SEARCH_DEFAULT_LOCATION.lat;
            this.locationholder.lon = projectConstants.SEARCH_DEFAULT_LOCATION.lon;
            this.shared_functions.setitemonLocalStorage('ynw-locdet', this.locationholder);
      }

    }
  }
  ngDoCheck() {
    // console.log('ondocheck');
    // this.initialize_fields();
    /*if (this.searchfields.domain !== this.selected_domain) {
      this.selected_domain = this.searchfields.domain;
    }
    if (this.searchfields.kw !== this.keywordholder.name) {
      this.kw_autoname = this.searchfields.kwautoname;
      this.keywordholder.autoname = this.searchfields.kwautoname;
      this.keywordholder.name = this.searchfields.kw;
      this.keywordholder.domain = this.searchfields.kwdomain;
      this.keywordholder.subdomain = this.searchfields.kwsubdomain;
      this.keywordholder.typ = this.searchfields.kwtyp;
    }
    if (this.searchfields.sortfield) {
      this.sortfield = this.searchfields.sortfield;
    }
    if (this.searchfields.sortorder) {
      this.sortorder = this.searchfields.sortorder;
    }*/
  }
  ngOnChanges() {
    if (this.domainpassedfromrefined) {
      this.selected_domain = this.domainpassedfromrefined;
    }
    if (this.subdomainpassedfromrefined) {
      // console.log(this.subdomainpassedfromrefined);
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
 /* clickedoutsider(e) {
    console.log('clicked outside', e);
    const targetid = e.target.id;
    if (targetid !== undefined) {
      if (targetid !== 'morefiltericon') {
       // this.closeMoreoptions();
      }
    }
  }*/
  closeMoreoptions() {
    this.showmoreoptionsSec = false;
  }
  showMoreOptions() {
    if (this.showmoreoptionsSec) {
      this.showmoreoptionsSec = false;
    } else {
      this.showmoreoptionsSec = true;
    }

    /*const dialogRef = this.dialog.open(SearchMoreOptionsComponent, {
      width: '50%',
      panelClass: 'moreoptionsmainclass',
      data: {
        type : 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.length > 0) { // custom filter selected from more options page
          this.moreoptions_arr = result;
          // console.log('moreoption returned', this.moreoptions_arr);
          this.do_search('');
        }
    }
    });*/
  }
  handleSearchmoreSearchClick(result) {
    // console.log('more returned', result);
    this.moreoptions_arr = result;
    this.showmoreoptionsSec = false;
    // console.log('moreoption returned', this.moreoptions_arr);
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
        const objstate = {autoname: 'All of ' + state.name + ', India', name: state.name, lat: state.latitude, lon: state.longitude, typ: 'state' };
        this.locationList.push(objstate);
        for (const city of state.cities) {
          const objcity = {autoname: 'All of ' + city.name + ', ' + state.name, name: city.name, lat: city.latitude, lon: city.longitude, typ: 'city' };
          this.locationList.push(objcity);
          for (const area of city.locations) {
            const objarea = {autoname: area.name + ', ' + city.name + ', ' + state.name, name: area.name, lat: area.latitude, lon: area.longitude, typ: 'area' };
            this.locationList.push(objarea);
          }
        }
    }
    // console.log('loclist', this.locationList);
 }
 private filterLocation(criteria: string= '') {
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
              if (holdlocname.includes(hold_criteria)) {
                if (curcnt <= maxcnt) {
                  this.displaylocationList.push(locs);
                }
                curcnt++;
              }
          }
        }
      }
 }
 // loads the keyword details to the respective arrays
 private loadkeywordAPIreponsetoArray() {
   this.displaykeywordList = [];
    this.keywordList = [];
   // Initialize the arrays
   this.subdomainList = [];
   this.specilizationList = [];
   this.keyssearchcriteria = '';

   if (!this.domainlist_data) {
    return;
   }
   // get the list of subdomains and specializations to the respective arrays
   const domain = this.selected_domain || '';
   for (const dom of this.domainlist_data) {
     let getsubdomainandspec = true;
     if (domain !== '' && domain !== 'All') {
       if (domain !== dom.domain) {
        getsubdomainandspec = false;
       }
     }
     if (getsubdomainandspec === true) {
        for (const subdom of dom.subDomains) {
            const keywordsub = {autoname: subdom.displayName, name: subdom.subDomain, subdomain: '', domain: dom.domain, typ: 'subdom' };
            this.subdomainList.push(keywordsub);
            for (const special of subdom.specializations) {
              const keywordspec = {autoname: special.displayName, name: special.name, subdomain: subdom.subDomain, domain: dom.domain, typ: 'special' };
              this.specilizationList.push(keywordspec);
            }
        }
      }
   }
   this.keywordList = [];
   // Call method to merge the subdomain details to the keyword array
   this.addheadandMergearray('subdom');
   // Call method to merge the specialization details to the keyword array
   this.addheadandMergearray('special');
 }
 private addheadandMergearray(typ) {
   switch (typ) {
    case 'subdom':
        if (this.subdomainList.length > 0) {
          const holderarr = this.keywordList.concat(this.subdomainList);
          this.keywordList = holderarr;
        }
    break;
    case 'special':
        if (this.specilizationList.length > 0) {
          const holderarr = this.keywordList.concat(this.specilizationList);
          this.keywordList = holderarr;
        }
    break;
   }
 }
 filterKeywords(criteria: string= '') {
  this.keyssearchcriteria = criteria;
    this.displaykeywordList = [];
    this.keywordgroupList = [];
    this.holdisplaylist = [];
     if (criteria === '') {
      //  this.displaykeywordList = [];
       this.setNullKeyword('');

       this.searchfields.kw = '';
       this.searchfields.kwautoname = '';
       this.searchfields.kwdomain = '';
       this.searchfields.kwsubdomain = '';
       this.searchfields.kwtyp = '';

     } else {

       if (criteria.length >= projectConstants.AUTOSUGGEST_MIN_CHAR) {
        const hold_criteria = criteria.toLowerCase();
        let curcnt = 1;
        this.displaykeywordList.push({autoname: criteria, name: criteria, domain: '', subdomain: '', typ: 'kwtitle'});
        for (const kw of this.keywordList) {
          const holdkeyword = kw.autoname.toLowerCase();
           if (holdkeyword.includes(hold_criteria)) {
            // if (curcnt <= projectConstants.AUTOSUGGEST_LOC_MAX_CNT) {
              this.displaykeywordList.push(kw);
              curcnt++;
            // }
          }
        }

        this.holdisplaylist['subdom'] = new Array();
        this.holdisplaylist['special'] = new Array();
        this.holdisplaylist['kwtitle'] = new Array();

        for (const kw of this.displaykeywordList) {

          if (kw.typ === 'kwtitle') {
            this.holdisplaylist['kwtitle'].push(kw);
          }
          // case of subdomain header row
          if (kw.typ === 'subdom') {
            this.holdisplaylist['subdom'].push(kw);
          }

           // case of specialization header row
          if (kw.typ === 'special') {
            this.holdisplaylist['special'].push(kw);
          }
        }
       }
    }

     // Defining the types of details that will be displayed for keywords autocomplete
    const keywordgroup_val = [];

    // Check whether the title is to be displayed
    if (this.holdisplaylist['kwtitle']) {
      if (this.holdisplaylist['kwtitle'].length > 0) {
        const groupdomainobj = {displayname: 'Business Name as', name: 'kwtitle'};
        keywordgroup_val.push(groupdomainobj);
      }
    }
    // Check whether the subdomain heading is to be displayed
    if (this.holdisplaylist['subdom']) {
      if (this.holdisplaylist['subdom'].length > 0) {
        const groupdomainobj = {displayname: 'Sub Domains', name: 'subdom'};
        keywordgroup_val.push(groupdomainobj);
      }
    }
    // Check whether the specialization heading is to be displayed
    if (this.holdisplaylist['special']) {
      if (this.holdisplaylist['special'].length > 0) {
        const groupspecialobj = {displayname: 'Specializations', name: 'special'};
        keywordgroup_val.push(groupspecialobj);
      }
    }
    // Check whether search labels exists
    if (this.show_searchlabellist) {
      this.holdisplaylist['label'] = [];
      for (const label of this.show_searchlabellist) {
        const holdkeyword = label.displayname.toLowerCase();
        if (label.displayname !== '') {
          if (holdkeyword.includes(this.keyssearchcriteria)) {
            const lbl = label.query.split('&');
            const labelspec = {autoname: label.displayname , name: label.name, subdomain: '', domain: this.shared_functions.Lbase64Encode(lbl[0]), typ: 'label' };
            this.holdisplaylist['label'].push(labelspec);
          }
        }
      }
      // Check whether search labels heading is to be displayed
      if (this.holdisplaylist['label'].length > 0 ) {
        const grouplabelsobj = {displayname: 'Suggested Searches', name: 'label'};
        keywordgroup_val.push(grouplabelsobj);
      }
    }
    this.keywordgroupList = keywordgroup_val;
    // assiging the details to the displayed in the autosuggestion for keywords box
    this.displaykeywordList = this.holdisplaylist;
 }
 // this method decides how the items are shown in the autosuggestion list
 highlightSelText(curtext, classname, mod?, typ?) {
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
        const index = l_curtext.indexOf( l_criteria );
        const foundstr = curtext.substr(index, criteria.length);
        return curtext.replace(regexp, '<span class="' + classname + '">' + foundstr + '</span>');
      } else {
        return curtext;
      }
 }

 private initialize_fields() {
   //  console.log('initialize', this.searchfields);
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
  /*private getDomainList() {
    this.shared_service.bussinessDomains()
    .subscribe (
      res => {
         this.domainlist_data = res;
         this.loadkeywordAPIreponsetoArray();
      }
    );
  }*/

  getDomainList() {
    const bconfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
    let run_api = true;
    if (bconfig) { // case if data is there in local storage
      const bdate = bconfig.cdate;
      const bdata = bconfig.bdata;
      const saveddate = new Date(bdate);
      const diff = this.shared_functions.getdaysdifffromDates('now', saveddate);
      // console.log('diff hours search', diff['hours']);
      if (diff['hours'] < projectConstants.DOMAINLIST_APIFETCH_HOURS) {
        run_api = false;
        this.domainlist_data = bdata;
        this.loadkeywordAPIreponsetoArray();
      }
    }
    if (run_api) { // case if data is not there in data
      this.shared_service.bussinessDomains()
      .subscribe (
        res => {
          this.domainlist_data = res;
          this.loadkeywordAPIreponsetoArray();
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
    this.shared_service.getAllSearchlabels()
    .subscribe (
      res => {
        this.searchlabels_data = res || [];
        this.searchdataserviceobj.set(this.searchlabels_data);
        this.handledomainchange(this.selected_domain, 1);
      }
    );
  }
 /*private do_domain_sel(domainname) {
    this.selected_domain = domainname;
  }
  /*private getLocation(criteria) {
    this.location_exists = false;
    this.nocriteria = true;
    this.loading = true;
    this.location_latitude = undefined;
    this.location_longitude = undefined;
    this.hide_location_div = false;
      if (criteria !== '') {
        if ( this.subscription ) {
            this.subscription.unsubscribe();
          }

        // Creating criteria to be passed via get
        const pass_criteria = {
          'criteria': criteria
        };
        this.subscription = this.shared_service.GetsearchLocation(pass_criteria)
          .subscribe(res => {
            this.location_data = res;
            if (!res[0]) { this.setNulllocationvalues(res); } this.loading = false;
          });
        } else {
        if ( this.subscription ) {
          this.subscription.unsubscribe();
        }
        this.loading = false;
        this.location_data = undefined;
      }
  }*/
  private setLocation(loc) {
   this.locationholder =  {
                            name: loc.name,
                            autoname: loc.autoname,
                            lat: loc.lat,
                            lon: loc.lon,
                            typ: loc.typ
                          };
   this.shared_functions.setitemonLocalStorage('ynw-locdet', this.locationholder);
   this.location_data = undefined;
  }
  private setNulllocationvalues(loc?) {
    this.locationholder =  {
                        name: loc.name || null,
                        autoname: loc.autoname || null,
                        lat: loc.lat || null,
                        lon: loc.lon || null,
                        typ: loc.typ || null
    };
    this.location_data = undefined;
  }
  private hideLocation() {
    this.hide_location_div = true;
  }

 /* private getProvider(criteria) {
    this.prolocation_exists = false;
    this.prov_nocriteria = true;
    this.prov_loading = true;
    this.hide_prov_div = false;
    if (criteria !== '') {
       if ( this.prov_subscription ) {
          this.prov_subscription.unsubscribe();
        }
        // Creating criteria to be passed via get
        const pass_data = {
          'suggester': 'title',
          'q': criteria
        };
        this.shared_functions.getCloudUrl()
        .then (url => {
            this.prov_subscription = this.shared_service.GetProviders(url, pass_data)
            .subscribe(res => {
              this.provider_data = res;
              this.suggestions = this.provider_data.suggest.suggestions || [];
              if (this.provider_data.found === 0) { this.setNulllprovidervalues(res); } this.prov_loading = false;
            });
        });
        this.prov_loading = false;
        this.provider_data = undefined;
      }
  }*/
 /*private setProvider(prov) {
      this.prov_id = prov.id;
      this.prov_name = prov.suggestion;
      this.provider_data = undefined;
      this.searchfields.provider = prov.suggestion;
 }*/

 private setKeyword(kw) {
  if (kw.name !== '') {
    this.kw_autoname = kw.autoname;
    this.keywordholder = {
                              autoname: kw.autoname,
                              name: kw.name,
                              domain: kw.domain,
                              subdomain: kw.subdomain,
                              typ: kw.typ
                            };
  }
   // console.log('kwholder', this.keywordholder);
   if (kw.typ === 'label') {
    this.curlabel.typ = 'label';
    this.curlabel.query = kw.domain;
    const passkw = {query: kw.domain}; // kw.domain holds the hardcoded query for the search labels
    if (kw.domain !== '') {
      this.searchlabels_clicked(passkw);
    }
   } else {
    this.curlabel.typ = '';
    this.curlabel.query = '';
   }

 }
 private setNullKeyword(kw?) {
    this.keywordholder = {
       autoname: kw.autoname || '',
       name: kw.name || '',
       domain: kw.domain || '',
       subdomain: kw.subdomain || '',
       typ: kw.typ || ''
    };
 }
 kwtyping(val) {
  this.keywordholder.name = val;
  this.keywordholder.autoname = val;
  this.keywordholder.domain = '';
  this.keywordholder.subdomain = '';
  this.keywordholder.typ = 'kwtitle';
 }
 do_search(labelqpassed?) {
   this.closeMoreoptions();
   // // console.log('search clicked');

   // done to handle the case if something is typed in the last text box and nothing else is selected by consumer, but some text is there
   // in such as case the text will be used to search against the index "title"
   // console.log('kwauto', this.kw_autoname);
   if (this.kw_autoname !== '' && this.kw_autoname !== undefined) {
    if (this.keywordholder.typ === '' || this.keywordholder.typ === undefined || this.keywordholder.typ === 'kwtitle') {
        this.keywordholder.name = this.kw_autoname;
        this.keywordholder.autoname = this.kw_autoname;
        this.keywordholder.domain = '';
        this.keywordholder.subdomain = '';
        this.keywordholder.typ = 'kwtitle';
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

   /* if (!this.location_latitude) {
      this.location_name = '';
    }*/

    // Checking whether the location is blank, if yes, then set it to the default location mentioned in the constants file
    this.checktoSetLocationtoDefaultLocation();

    if (currenturl[0] === '/searchdetail') { // if clicked search button from the search result page itself
        this.onsearchclick(labelq);
       // window.location.reload();
    } else { // clicked search button from home page

      /*this.routerobj.navigate(['/searchdetail'], { queryParams: { do: this.selected_domain, la: this.location_latitude,
          lo: this.location_longitude, prov: this.prov_name, lon: this.location_name,
          srt: this.sortfield + ' ' + this.sortorder, ps: this.searchlabel_search, on: this.opennow_search,
        lq: labelq }}); */

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
                 // console.log('field', field, this.moreoptions_arr[i][field]);
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
        // console.log('params', passparam);
         this.routerobj.navigate(['/searchdetail', passparam]);
     }
  }
  private opennow_searchhandle () {
    this.opennow_search = 1;
    this.do_search();

  }
  onsearchclick(labelq?)  {

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
      this.searchfields.location = this.locationholder.name;
      this.searchfields.locationautoname = this.locationholder.autoname;
      this.searchfields.locationtype = this.locationholder.typ;
      this.searchfields.latitude = this.locationholder.lat;
      this.searchfields.longitude = this.locationholder.lon;
    }

    if (this.kw_autoname === '') {
      // console.log('reset here');
      this.keywordholder.name = '';
      this.keywordholder.autoname = '';
      this.keywordholder.domain = '';
      this.keywordholder.subdomain = '';
      this.keywordholder.typ = '';
    }
    // console.log('holder', this.keywordholder);
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
     // console.log('holder', this.keywordholder);
      this.searchfields.kwdomain = '';
      // this.searchfields.kwtyp = this.keywordholder.typ;
    }

    // this.searchfields.provider = this.prov_name;
    this.searchfields.sortfield = this.sortfield;
    this.searchfields.sortorder = this.sortorder;
    this.searchfields.labelq = labelq || '';
    // if (this.searchfields.labelq != '') {
    if (labelq !== '' && labelq !== undefined && labelq !== 'undefined') {
      const ret_arr =  this.parsesearchLabelsQuerystring (this.searchfields.labelq);
     // console.log('label return', ret_arr);
      if (ret_arr['sector'] !== '') {
        this.searchfields.domain = ret_arr['sector'];
        this.selected_domain = this.searchfields.domain;
      }
      if (ret_arr['subsector'] !== '') {
        const ret = this.getdomainofaSubdomain(ret_arr['subsector']);
        ret_arr['subdom_dispname'] = ret['subdom_dispname'] || ret_arr['subsector'];
        if (ret_arr['sector'] === '') { // sector not mentioned in the search label condition
          if (ret['dom'] === '') {
            ret['dom'] = 'All';
          }
          ret_arr['dom'] = ret['dom'];
          this.searchfields.domain = ret['dom'];
           // console.log('retdom', ret);
        }
        this.searchfields.subsector = ret_arr['subsector'];
        this.searchfields.kw = ret_arr['subsector'];
        this.searchfields.kwautoname = ret_arr['subdom_dispname'];
        this.searchfields.kwdomain = ret_arr['dom'];
        this.searchfields.kwsubdomain = '';
        this.searchfields.kwtyp = 'subdom';
        this.selected_domain = this.searchfields.domain;
        // this.kw_autoname = this.searchfields.kw;
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
    let retarr = { 'dom': '', 'subdom_dispname': ''};
    if (this.domainlist_data) {
      for (let i = 0; i < this.domainlist_data.length; i++) {
        for (const subdom of this.domainlist_data[i].subDomains) {
          if (subdom.subDomain === subdomname) {
            retarr = { 'dom': this.domainlist_data[i].domain, 'subdom_dispname': subdom.displayName};
            return retarr;
          }
        }
      }
    } // else {
      // retarr = { 'dom': '', 'subdom_dispname': ''};
      return retarr;
    // }
  }
  getdomainofaSpecialization(specialization) {
    //  console.log('domain list', this.domainlist_data);
    let retarr = { 'dom': '', 'special_dispname': ''};
    if (this.domainlist_data) {
      for (let i = 0; i < this.domainlist_data.length; i++) {
        for (const subdom of this.domainlist_data[i].subDomains) {
          for (const specilization of subdom.specializations) {
            if (specilization.name === specialization) {
              retarr = { 'dom': this.domainlist_data[i].domain, 'special_dispname': specilization.displayName};
              return retarr;
            }
          }
        }
      }
    } // else {
      retarr = { 'dom': '', 'special_dispname': ''};
      return retarr;
    // }
  }
  // function which parse the querystring from search leabels
  parsesearchLabelsQuerystring (str = null) {
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
      }
      return retarr;
    }
  }

  handledomainchange(domain, avoidclear?) {
    // setting the domain in the selected_domain holder variable
    if (domain === 'All') {
     // domain = '';
    }
    this.selected_domain = domain;

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
      this.curlabel = {typ: '', query: ''};
    }
    this.keyssearchcriteria = '';
    this.prov_name = '';
   // console.log('seldomain', this.selected_domain);
    this.getSearchlabelsbydomain(domain);
    this.loadkeywordAPIreponsetoArray();
  }
  getSearchlabelsbydomain(domain) {
    if ( domain == null || domain === '' || domain === 'All') {
      this.show_searchlabellist = this.shared_functions.get_Searchlabels('global', this.searchdataserviceobj.getAll());
    } else {
      this.show_searchlabellist = this.shared_functions.get_Searchlabels('domain', this.searchdataserviceobj.getAll(), {'domain': domain});
    }
  }
  searchlabels_clicked(obj) {
   this.setNulllocationvalues('');
   // this.setNullKeyword('');
      this.do_search(obj.query);
  }
  handleCustomfilter(val) {
    this.commonfilters = val;
    this.do_search();
  }
  handle_returntochild(obj) {
   // console.log('reached back');
  }
}
