import { Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'rxjs/add/operator/filter';

import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SearchDetailServices } from '../search-detail/search-detail-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { ProviderDetailService } from '../provider-detail/provider-detail.service';
import { LoginComponent } from '../../components/login/login.component';

import { SearchFields } from '../../modules/search/searchfields';
import { Messages } from '../../../shared/constants/project-messages';


import { projectConstants } from '../../../shared/constants/project-constants';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { CheckInComponent } from '../../modules/check-in/check-in.component';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})

@HostListener('window:resize', ['$event'])

export class SearchDetailComponent implements OnInit {

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
  sortfieldsels;
  public nosearch_results;
  public startpageval;
  public labelq;
  public subsector;
  public specialization;
  public rating;
  public searchrefine_arr: any = [];
  public searchrefineresult_arr: any = [];
  public refined_querystr = '';
  public searchrefinetextresult_arr: any = [];
  public refined_textquerystr = '';
  public refined_options_url_str = '';
  public querystringrefineretain_arr: any = [];
  public showsearchsection = false;
  public arraycreatedfromquerystring = false;
  public commonfilters;
  public passrefinedfilters;
  public showopnow = 0;
  public subdomainleft;
  changedate_req = false;
  specialization_exists = false;
  location_cnt = 0;
  showrefinedsection = true;
  current_provider;
  result_provid: any = [];
  result_providdet: any = [];
  waitlisttime_arr: any = [];
  sidebarheight = '';
  waitlistestimatetimetooltip  = Messages.SEARCH_ESTIMATE_TOOPTIP;
  searchfields: SearchFields = new SearchFields();
  screenHeight;
  screenWidth;
  kwdet: any = [];
  refined_domain = '';
  refined_subdomain = '';
  specialization_hide = false;
  showmore_defaultcnt = projectConstants.REFINE_ENUMLIST_DEFAULT_SHOW_CNT;
  holdprovidforCommunicate = 0;
  constructor(private routerobj: Router,
              private location: Location,
              private activaterouterobj: ActivatedRoute,
              private shared_service: SharedServices,
              private shared_functions: SharedFunctions,
              private searchdetailserviceobj: SearchDetailServices,
              private dialog: MatDialog ) {
                this.onResize();
               }

  ngOnInit() {
    // this.activaterouterobj.queryParams
    this.activaterouterobj.params
          .subscribe(paramsv => {
            this.setSearchfields (paramsv, 1);
            this.getDomainList(false);
            // this.do_search();
    });
    this.sortfieldsels = 'titleasc';
    this.nosearch_results = false;

  }
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.showrefinedsection = false;
    }
   // console.log('here', this.screenWidth, this.screenHeight);
}
 /*private getDomainList() {
    this.shared_service.bussinessDomains()
    .subscribe (
      res => {
        this.domainlist_data = res;
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
              }
           }
           if (fetchsubdom) {
            this.getlistofSubdomains(this.domain);
           }
        }
        this.showsearchsection = true;
        this.setfields();
        this.getRefinedSearch(true);
      }
    );
 }*/

  getDomainList(bypassotherfunction?) {
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
            this.getlistofSubdomains(this.domain);
           }
        }
        this.showsearchsection = true;
        if (!bypassotherfunction) {
          this.setfields();
          this.getRefinedSearch(true);
        }
      }
    }
    if (run_api) { // case if data is not there in data
      this.shared_service.bussinessDomains()
      .subscribe (
        res => {
          this.domainlist_data = res;
          const today = new Date();
          const postdata = {
            cdate: today,
            bdata: this.domainlist_data
          };
          this.shared_functions.setitemonLocalStorage('ynw-bconf', postdata);
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
                this.getlistofSubdomains(this.domain);
              }
            }
            this.showsearchsection = true;
            if (!bypassotherfunction) {
              this.setfields();
              this.getRefinedSearch(true);
            }
        }
      );
    }
  }

  setSearchfields(obj, src) {
   // console.log('src', src, 'details', obj);
    if (src === 1) { // case from ngoninit
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

      this.kwdet = {
        kw: this.kw,
        kwautoname: this.kwautoname,
        kwdomain: this.kwdomain,
        kwsubdomain: this.kwsubdomain,
        kwtyp : this.kwtyp
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
      // console.log('ref_query', this.refined_querystr);
      this.startpageval = 1;
      /* console.log('domain', this.domain, 'locname', this.locname, 'locautoname',
         this.locautoname, 'lat', this.latitude, 'lon', this.longitude, 'kw', this.kw, 'kwauto', this.kwautoname, 'kwdomain', this.kwdomain, 'kwsubdom', this.kwsubdomain, 'kwtyp', this.kwtyp);*/
      if (obj.srt) {
        const sr = obj.srt.split(' ');
        this.sortfield = sr[0];
        this.sortorder = sr[1];
      } else {
        this.sortfield = '';
        this.sortorder = '';
      }
      if (this.labelq !== '') { // if came to details page by clicking the search labels
        // console.log('case1');
          this.parsesearchLabelsQuerystring(this.labelq); // function which parse and set the respective public variable
      } else { // to handle the case of splitting the query string in case of refresh from search result page
       // console.log('case2', obj.lq, this.labelq);
          this.parsesearchLabelsQuerystring(obj.q);
      }
    } else if (src === 2) { // case of setting values in response to call from the searchdetails page
      // console.log('details obj', obj);
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
      this.getlistofSubdomains(this.domain);
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
        this.getlistofSubdomains(this.domain);
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

        const  passparam1 = {};
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
        this.parsesearchLabelsQuerystring(this.labelq); // function which parse and set the respective public variable
      }
    }
  }
  // function to parse and fetch the details related to dynamic refine filters fields
  parseRefinedfiltersQueryString(obj) {
    this.arraycreatedfromquerystring = false;
    this.querystringrefineretain_arr = [];
    for (const ufield in obj) {
      if (ufield) {
        const sufield = ufield.substr(0, 6);
        if (sufield === 'myref_') {
          const orgfield = ufield.substr(6); // getting the original name by eleminating the prefix
           // console.log('splitfield', orgfield);
          if (this.check_QuerystrinfieldexistsinArray(sufield) === -1) {
             // console.log('iamhere');
            this.querystringrefineretain_arr[orgfield] = obj[ufield].split('~'); // split values based on delimiter to an array
          }
        }
      }
    }
   // console.log('qrystr', this.querystringrefineretain_arr);
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

  returnRefineCheckboxRetainValue(fieldheader, fieldname, fieldtype ) {
    // console.log('nowhere', fieldheader, fieldtype);
    if (fieldtype === 'EnumList' || fieldtype === 'Enum') { // case of multiple selection of checkbox
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
  parsesearchLabelsQuerystring(str = null) {
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
      this.setvariablesbasedonSearchlabel(retarr);
    }
  }
  setvariablesbasedonSearchlabel(obj) {
      this.domain = obj.sector || '';
      this.subsector = obj.subsector || '';
      this.specialization = obj.specialization || '';
      //  console.log('subsec', this.subsector);
      if (this.subsector !== '' && this.subsector !== undefined && this.subsector !== 'undefined') {
        const domainobtain = this.getdomainofaSubdomain(this.subsector);
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
      this.getRefinedSearch(false);
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
   // console.log('from details', obj);
    this.resetRefineVariables(); // calling method to reset the refine variables

    this.setSearchfields(obj, 2);

    this.buildQuery(true); // calling build query to rebuild the query

    // changing the url of the search result page based on the selected criteria
    this.change_url_on_criteria_change();

    // Calling api to get the search refine filters
    this.getRefinedSearch(true);

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
    // case if refine search checkbox ticked
    if (this.refined_options_url_str !== '') {
      urlstr += this.refined_options_url_str;
    }
    if (this.sortfield === '') {
      this.sortfield = 'title';
      this.sortorder = 'asc';
    }
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
       projectConstants.searchpass_criteria.distance = 'haversin(' + retcoordinates['lowerRightLat'] + ',' + retcoordinates['lowerRightLon'] + ',location1.latitude,location1.longitude)';
       locstr = 'location1:' + coordinates;
       q_str = q_str + locstr;
     }

     if (this.kwtyp === 'kwtitle') {
        q_str = q_str + ' title:\'' + this.kw.replace('/', '') + '\'';
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
        time_qstr =  time_qstr + ' ' + this.commonfilters + ':1 ';
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
        if (this.latitude || this.domain || this.labelq || time_qstr) {
          // if location or domain is selected, then the criteria should include following syntax
          // q_str = '(and ' + time_qstr + q_str + this.refined_querystr + ')';
          q_str = '(and ' + time_qstr + q_str + ')';
        }
    }
    // Creating criteria to be passed via get
    // console.log('refined query', this.refined_querystr);
   // console.log('search query', q_str);
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
    // this.search_string = base_url + q_str + suffix_url;
    if ( this.search_return ) {
      this.search_return.unsubscribe();
    }
    this.search_result_count = 0;
    if (q_str === '') {
        // console.log('no criteria');
    } else {
      this.shared_functions.getCloudUrl()
      .then (url => {
          this.search_return = this.shared_service.DocloudSearch(url, projectConstants.searchpass_criteria)
          .subscribe(res => {
            this.search_data = res;
            this.result_provid = [];
            this.result_providdet = [];
            // console.log('search', this.search_data.hits.hit);
            let schedule_arr = [];
            let locationcnt = 0;
            for (let i = 0 ; i < this.search_data.hits.hit.length ; i++) {
              locationcnt = 0;
              const providarr = this.search_data.hits.hit[i].id.split('-');
              // this.result_provid[i] = this.search_data.hits.hit[i].id;
              if (this.search_data.hits.hit[i].fields.claimable !== '1') {
                // this.result_provid[i] = providarr[0]; // this.search_data.hits.hit[i].id;
                this.result_providdet.push({'provid': providarr[0], 'searchindx': i});
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
      .subscribe (data => {
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
        for (let i = 0; i < this.waitlisttime_arr.length; i++) {
          srchindx = provids[i].searchindx;
          this.search_data.hits.hit[srchindx].fields['waitingtime_res'] = this.waitlisttime_arr[i];
          this.search_data.hits.hit[srchindx].fields['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
          this.search_data.hits.hit[srchindx].fields['estimatedtime_det'] = [];

          if (this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
            this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = 'Next Available Time ';
            this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['isFuture'] = 1;
            if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                 + ', ' + this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
            } else {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
              + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
            }
          } else {
            this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['caption'] = 'Estimated Waiting Time';
            this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['isFuture'] = 2;
            if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
            } else {
              this.search_data.hits.hit[srchindx].fields['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
            }
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
      case 'titleasc':
        selfield = 'title';
        selorder = 'asc';
      break;
      case 'titledesc':
        selfield = 'title';
        selorder = 'desc';
      break;
      case 'sectorasc':
       selfield = 'sector';
       selorder = 'asc';
      break;
      case 'sectordesc':
        selfield = 'sector';
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
  private selected_sortorder (sel) {
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
    this.do_search();
  }

  // method which get the refined filters
  getRefinedSearch(call_dosearch?, fromrefine?) {
    let subdom = '';
    this.searchrefine_arr = '';
    if (this.kw !== '') {
       if (this.kwtyp === 'subdom') {
         subdom = this.kw;
       } else if (this.kwtyp === 'special') {
         subdom = this.kwsubdomain;
       }
    }
    if (this.kwtyp === 'label') {
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
      pasdomain = '';
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
        pasdomain = '';
      }
    }
    this.searchdetailserviceobj.getRefinedSearch(pasdomain, subdom)
      .subscribe( data => {
         // console.log(this.domain, this.kw);
          if (pasdomain && subdom) { // case if domain and subdomain are available
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
         // console.log('refined', this.searchrefine_arr);
          // console.log('qrystr', this.querystringrefineretain_arr);

          // section which populates the respective arrays with criteria based on query string
          Object.keys(this.querystringrefineretain_arr).forEach(key => {
            const obtainedobj = this.getSearchrefineFieldDetails(key, this.querystringrefineretain_arr[key]);
            // console.log('obtained', obtainedobj);
            if (obtainedobj) {
              if (obtainedobj.dataType === 'TEXT' || obtainedobj.dataType === 'TEXT_MED') {
                this.handleTextrefineblur(obtainedobj.cloudSearchIndex	, this.querystringrefineretain_arr[key], obtainedobj.dataType, true);
              } else if (obtainedobj.dataType === 'EnumList' || obtainedobj.dataType === 'Enum' || obtainedobj.dataType === 'Boolean' || obtainedobj.dataType === 'Rating') {
                Object.keys(this.querystringrefineretain_arr[key]).forEach(qkey => {
                  this.handle_optionclick(obtainedobj.cloudSearchIndex	, obtainedobj.dataType, this.querystringrefineretain_arr[key][qkey], true);
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
    if (this.domainlist_data) {
      for (let i = 0; i < this.domainlist_data.length; i++) {
        for (const subdom of this.domainlist_data[i].subDomains) {
          if (subdom.subDomain === subdomname) {
            const retarr = { 'dom': this.domainlist_data[i].domain, 'subdom_dispname': subdom.displayName};
            return retarr;
          }
        }
      }
    } else {
      const retarr = { 'dom': '', 'subdom_dispname': ''};
      return retarr;
    }
  }
  getSubdomainofaSpecialization(special, domain) {
    let retarr = { 'dom': '', 'subdom_name': '', 'subdom_dispname': ''};
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
                  retarr = { 'dom': this.domainlist_data[i].domain, 'subdom_name': subdom.subDomain, 'subdom_dispname': subdom.displayName};
                  return retarr;
                }
              }
            }
          }
        }
      }
    }//  else {
      retarr = { 'dom': '', 'subdom_name': '', 'subdom_dispname': ''};
      return retarr;
    // }
  }
  // method which is invoked on clicking the checkboxes or boolean fields
  handle_optionclick(fieldname, fieldtype, selval, bypassbuildquery?) {
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
          this.searchrefineresult_arr[sec_indx][fieldname][curindx] = new Array(selval, fieldtype);
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
    for (let i = 0; i < this.searchrefineresult_arr.length; i++ ) {
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
    let ret_arr = [{'indx': -1, 'field': '', 'key': ''}];
    for (let i = 0; i < this.searchrefineresult_arr.length; i++ ) {
      // console.log('inside', this.searchrefineresult_arr[i], fieldname);
      for (const key in this.searchrefineresult_arr[i][fieldname]) {
       // console.log('inner', this.searchrefineresult_arr[i][fieldname][key]);
        if (this.searchrefineresult_arr[i][fieldname][key][0] === selval) {
          ret_arr = [{'indx': i, 'field': fieldname, 'key': key}];
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
    for (let i = 0; i < this.searchrefineresult_arr.length; i++ ) {
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
    for (const field in this.searchrefinetextresult_arr) {
      if (field) {
        if (this.searchrefinetextresult_arr[field] !== '') {
          // textstr += ' ' + field + '_cust:' + '\'' + this.searchrefinetextresult_arr[field] + '\'' + ' ';
          textstr += ' ' + field + ':' + '\'' + this.searchrefinetextresult_arr[field] + '\'' + ' ';
          this.refined_options_url_str += ';myref_' + field + '=' + this.searchrefinetextresult_arr[field];
        }
      }
    }
    if (textstr !== '') {
        textstr = ' ' + textstr;
    }
    // this.refined_querystr = ' and (' + this.refined_querystr + textstr + ')';
    // this.refined_querystr = this.refined_querystr + textstr;
    if (this.refined_querystr !== '' || textstr !== '') {
      this.refined_querystr = '(and ' + this.refined_querystr + textstr + ')';
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
    const retdet = {'retstr': retstr, 'retcnt': curcnt};
    return retdet;
  }

  // method which will be called onblur on textbox fields of refined filters
  handleTextrefineblur (fieldname, fieldvalue, fieldtype, bypassbuildquery?) {
    // check whether fieldname already exists
    this.searchrefinetextresult_arr[fieldname] = fieldvalue;
    if (fieldvalue === '') {
      delete this.searchrefinetextresult_arr[fieldname];
    }
    if (bypassbuildquery === false) {
      // calling method to rebuild the query with the details selected from the refine search aswell
      this.buildQuery(false);
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
  getlistofSubdomains(curdomain) {
    // const curdomain = this.refined_domain;
   // console.log('psubdomain', curdomain, this.domainlist_data);
    this.subdomainlist_data = [];
    if (curdomain !== '' && curdomain !== 'All') {
      for (const domains of this.domainlist_data) {
        if (domains.domain === curdomain) {
          this.subdomainlist_data = domains.subDomains;
        }
      }
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
    this.handle_optionclick(obj.cloudindex, 'Rating', obj.selectedrating, false);
  }

  togger_refinesection() {
    this.showrefinedsection = !this.showrefinedsection;
  }
  claimBusiness() {
    alert('Claim Business');
  }

  checkinClicked(obj, chdatereq) {
    this.current_provider = obj;
    this.changedate_req = chdatereq;
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    if (usertype === 'consumer') {
      this.showCheckin('consumer');
    } else if (usertype === '') {
      const passParam = {callback: ''};
      this.doLogin('consumer', passParam);
    }
  }

  doLogin(origin?, passParam?) {
    // this.shared_functions.openSnackBar('You need to login to check in');
    const dialogRef = this.dialog.open(LoginComponent, {
       width: '50%',
       panelClass: 'loginmainclass',
      data: {
        type : origin,
        is_provider : this.checkProvider(origin),
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('login return ', result);
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
        if (passParam['callback'] === 'communicate') {
            this.showCommunicate(passParam['providerId']);
        } if (passParam['callback'] === 'providerdetail') {
            this.showProviderDetails(passParam['providerId']);
        } else {
            this.showCheckin('consumer');
        }
      }
    });

  }
  showCheckin(origin?) {
    const dialogRef = this.dialog.open(CheckInComponent, {
       width: '50%',
       panelClass: 'consumerpopupmainclass',
      data: {
        type : origin,
        is_provider : this.checkProvider(origin),
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 },
        srchprovider: this.current_provider,
        datechangereq: this.changedate_req
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  checkProvider(type) {
    return  (type === 'consumer') ? 'false' : 'true';
  }

  providerDetClicked(obj) {
    if (obj) {
      // const arr = obj.id.split('-');
      const providforDetails = obj.fields.unique_id;
      // check whether logged in as consumer
      if (this.shared_functions.checkLogin()) {
        const ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (ctype === 'consumer') {
         this.showProviderDetails(providforDetails);
        }
      } else { // show consumer login
        const passParam = {callback: 'providerdetail', providerId: providforDetails };
        this.doLogin('consumer', passParam);
      }
    }
  }
  showProviderDetails(provid) {
    this.routerobj.navigate(['searchdetail', provid]);
  }

  handlerefineddomainchange(val) {
   // console.log('refineddomain', val);
    this.refined_domain = val;
    this.refined_subdomain = '';
    this.getlistofSubdomains(val);
    this.getRefinedSearch(true, 1);
  }

  handlerefinedsubdomainchange(val) {
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
  communicateHandler(obj) {
    if (obj) {
      const arr = obj.split('-');
      const providforCommunicate = arr[0];
      // check whether logged in as consumer
      if (this.shared_functions.checkLogin()) {
        const ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (ctype === 'consumer') {
          console.log('communicate provid ', providforCommunicate);
          this.showCommunicate(providforCommunicate);
        }
      } else { // show consumer login
        const passParam = {callback: 'communicate', providerId: providforCommunicate };
        this.doLogin('consumer', passParam);
      }
    }
  }
  showCommunicate(provid) {
    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: 'consumerpopupmainclass',
     data: {
       providerid : provid
     }
   });

   dialogRef.afterClosed().subscribe(result => {

   });
  }
}
