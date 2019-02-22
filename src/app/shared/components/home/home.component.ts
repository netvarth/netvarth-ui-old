import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { SignUpComponent } from '../../components/signup/signup.component';
import { LoginComponent } from '../../components/login/login.component';

import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import { SearchFields } from '../../modules/search/searchfields';

import { ViewChild } from '@angular/core';
import { projectConstants } from '../../constants/project-constants';
// import { } from '@types/googlemaps';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public domainlist_data: any = [];
  sector_info: any = [];
  special_info: any = [];
  public searchfields: SearchFields = new SearchFields();
  locationholder = { 'autoname': '', 'name': '', 'lat': '', 'lon': '', 'typ': '' };
  keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': ''};
  selected_domain = '';
  is_provider = 'true';
  domain_obtained = false;

  constructor(
        private shared_service: SharedServices,
        public shared_functions: SharedFunctions,
        private routerobj: Router,
        public dialog: MatDialog,
        private _ngZone: NgZone
      ) {}

    ngOnInit() {
      this.setSystemDate();
      // calling the method to get the list of domains
      this.getDomainList();

      // callling method to set the captions for sectors / subdomains or specializations in the home page
      this.setRequiredCaptions();

    }

    setRequiredCaptions() {
      // building array to hold the details related to the specialization
      this.special_info['healthCare'] = [
        { 'caption': 'Paediatrics <span class="itm-no">(100)</span>', 'kw': 'Paediatrics', 'kwautoname' : 'Paediatrics', 'kwtyp': 'special' },
        { 'caption': 'Ayurvedic Medicine <span class="itm-no">(250)', 'kw': 'AyurvedicMedicine', 'kwautoname' : 'Ayurvedic Medicine', 'kwtyp': 'special' },
        { 'caption': 'Dentists <span class="itm-no">(600)', 'kw': 'dentists', 'kwautoname' : 'Dentists', 'kwtyp': 'subdom' }
      ];

      this.special_info['personalCare'] = [
        { 'caption': 'Beauty Care for Men <span class="itm-no">(150)</span>', 'kw': 'BeautyCareForMen', 'kwautoname' : 'Beauty Care for Men', 'kwtyp': 'special' },
        { 'caption': 'Beauty Care for Women <span class="itm-no">(160)</span>', 'kw': 'BeautyCareForWomen', 'kwautoname' : 'Beauty Care for Women', 'kwtyp': 'special' },
        { 'caption': 'Personal Fitness <span class="itm-no">(310)</span>', 'kw': 'HairSalonForKids', 'kwautoname' : 'Personal Fitness', 'kwtyp': 'special' }
      ];

      this.special_info['foodJoints'] = [
        { 'caption': 'North Indian <span class="itm-no">(120)</span>', 'kw': 'NorthIndian', 'kwautoname' : 'North Indian', 'kwtyp': 'special' },
        { 'caption': 'South Indian <span class="itm-no">(110)</span>', 'kw': 'SouthIndian', 'kwautoname' : 'South Indian', 'kwtyp': 'special' },
        { 'caption': 'Multi Cuisine  <span class="itm-no">(300)</span>', 'kw': 'Breakfast', 'kwautoname' : 'Multi Cuisine', 'kwtyp': 'special' }
      ];

      this.special_info['professionalConsulting'] = [
        { 'caption': 'Lawyer <span class="itm-no">(210)', 'kw': 'lawyers', 'kwautoname' : 'Lawyer', 'kwtyp': 'subdom' },
        { 'caption': 'Tax Consultants <span class="itm-no">(150)</span>', 'kw': 'taxConsultants', 'kwautoname' : 'Tax Consultants', 'kwtyp': 'subdom' },
        { 'caption': 'Civil Architects <span class="itm-no">(170)</span>', 'kw': 'civilArchitects', 'kwautoname' : 'Civil Architects', 'kwtyp': 'subdom' },
        { 'caption': 'Chartered Accountants <span class="itm-no">(320)</span>', 'kw': 'charteredAccountants', 'kwautoname' : 'Chartered Accountants', 'kwtyp': 'subdom' }
      ];

      this.special_info['vastuAstrology'] = [
        { 'caption': 'Numerology <span class="itm-no">(100)</span>', 'kw': 'Numerology', 'kwautoname' : 'Numerology', 'kwtyp': 'special' },
        { 'caption': 'Vastu <span class="itm-no">(100)</span>', 'kw': 'Vaastu', 'kwautoname' : 'Vastu', 'kwtyp': 'special' },
        { 'caption': 'Vedic Astrology <span class="itm-no">(120)</span>', 'kw': 'VedicAstrology', 'kwautoname' : 'Vedic Astrology', 'kwtyp': 'special' }
      ];

      this.special_info['religiousPriests'] = [
        { 'caption': 'Church <span class="itm-no">(100)</span>', 'kw': 'Numerology', 'kwautoname' : 'Church', 'kwtyp': 'subdom' },
        { 'caption': 'Temple <span class="itm-no">(100)</span>', 'kw': 'temple', 'kwautoname' : 'Temple', 'kwtyp': 'subdom' },
        { 'caption': 'Mosque <span class="itm-no">(120)</span>', 'kw': 'church', 'kwautoname' : 'Mosque', 'kwtyp': 'subdom' }
      ];

      this.special_info['autoMobile'] = [
        { 'caption': 'Car services and repair <span class="itm-no">(250)</span>', 'kw': 'carServicesAndRepair', 'kwautoname' : 'Car services and repair', 'kwtyp': 'subdom' },
        { 'caption': 'Car Wash <span class="itm-no">(200)</span>', 'kw': 'carWash', 'kwautoname' : 'Car Wash', 'kwtyp': 'subdom' },
        { 'caption': 'Two Wheeler Services <span class="itm-no">(340)</span>', 'kw': 'twoWheelerServicesAndRepair', 'kwautoname' : 'Two Wheeler Services', 'kwtyp': 'subdom' }
      ];
      // building array to hold the details related to the domains
      this.sector_info['healthCare'] = { 'simg': 'assets/images/icon-big-healthcare.svg',
      'caption1': '1000s of Doctors', 'caption2': '', 'special': this.special_info['healthCare']};
      this.sector_info['personalCare'] = { 'simg': 'assets/images/icon-big-personalcare.svg',
      'caption1': '', 'caption2': '', 'special': this.special_info['personalCare']};
      this.sector_info['foodJoints'] = { 'simg': 'assets/images/icon-big-restaurants.svg',
      'caption1': '', 'caption2': '', 'special': this.special_info['foodJoints']};
      this.sector_info['professionalConsulting'] = { 'simg': 'assets/images/icon-big-professionalcare.svg',
      'caption1': '', 'caption2': '', 'special': this.special_info['professionalConsulting']};
      this.sector_info['vastuAstrology'] = { 'simg': 'assets/images/icon-big-vastu.svg',
      'caption1': '', 'caption2': '', 'special': this.special_info['vastuAstrology']};
      this.sector_info['religiousPriests'] = { 'simg': 'assets/images/icon-big-religious.svg',
      'caption1': '', 'caption2': '', 'special': this.special_info['religiousPriests']};
      this.sector_info['autoMobile'] = { 'simg': 'assets/images/icon-big-automobile.svg',
      'caption1': '', 'caption2': '', 'special': this.special_info['autoMobile']};
    }
    setSystemDate() {
      this.shared_service.getSystemDate()
      .subscribe (
        res => {
          this.shared_functions.setitemonLocalStorage('sysdate', res);
        });
    }
    getDomainList() {
      const bconfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
      let run_api = true;
      if (bconfig) { // case if data is there in local storage
        const bdate = bconfig.cdate;
        const bdata = bconfig.bdata;
        const saveddate = new Date(bdate);
        if (bconfig.bdata) {
          const diff = this.shared_functions.getdaysdifffromDates('now', saveddate);
          // console.log('diff hours', diff['hours']);
          if (diff['hours'] < projectConstants.DOMAINLIST_APIFETCH_HOURS) {
            run_api = false;
            this.domainlist_data = bdata;
            // this.domainlist_data = ddata.bdata;
            // console.log('domainlilst_saved', this.domainlist_data);
            this.domain_obtained = true;
          }
        }
      }
      if (run_api) { // case if data is not there in data
        this.shared_service.bussinessDomains()
        .subscribe (
          res => {
            this.domainlist_data = res;
            // console.log('domainlilst_fetched', this.domainlist_data);
            this.domain_obtained = true;
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
    handle_home_domain_click(obj) {
      this.keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': ''};
      this.selected_domain = obj.domain;
      this.handle_search();
    }
    handle_homelinks_click(kw, kwautoname, kwdomain, kwsubdomain, kwtyp) {
      this.selected_domain = kwdomain;
      this.keywordholder.autoname = kwautoname;
      this.keywordholder.name = kw;
      this.keywordholder.domain = kwdomain || '';
      this.keywordholder.subdomain = kwsubdomain || '';
      this.keywordholder.typ = kwtyp;

      this.selected_domain = kwdomain;

      this.handle_search();
    }
    handle_search() {
      const localloc = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
      if (localloc.autoname !== '' && localloc.autoname !== undefined && localloc.autoname !== null) {
          this.locationholder = localloc;
      }
      const passparam = {
        do: this.selected_domain || '',
        la: this.locationholder.lat || '',
        lo: this.locationholder.lon || '',
        lon: this.locationholder.name || '',
        lonauto: this.locationholder.autoname || '',
        kw: this.keywordholder.name || '',
        kwauto: this.keywordholder.autoname || '',
        kwdomain: this.keywordholder.domain || '',
        kwsubdomain: this.keywordholder.subdomain || '',
        kwtyp: this.keywordholder.typ || '',
        // srt: 'title' + ' ' + 'asc',
        srt: ' ',
        lq: '',
        cfilter: ''
       };
       this.routerobj.navigate(['/searchdetail', passparam]);
    }
    doSignup(origin?) {
      const cClass = 'consumerpopupmainclass';
      if (origin === 'provider') {
        // cClass = 'commonpopupmainclass';
      }
      const dialogRef = this.dialog.open(SignUpComponent, {
        width: '50%',
        panelClass: ['signupmainclass', cClass],
        disableClose: true,
        data: {
          is_provider : this.checkProvider(origin)
        }
      });

      dialogRef.afterClosed().subscribe(result => {
      });

    }

    doLogin(origin?) {
      const cClass = 'consumerpopupmainclass';
      if (origin === 'provider') {
       // cClass = 'commonpopupmainclass';
      }
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '50%',
        panelClass: ['loginmainclass', cClass],
        disableClose: true,
        data: {
          type : origin,
          is_provider : this.checkProvider(origin)
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        // this.animal = result;
      });

    }

    doWatchVideo() {
     alert('Clicked watch video');
    }
    doLearnMore() {
      alert('Clicked learn more');
    }

    checkProvider(type) {
      return (type === 'consumer') ? 'false' : 'true';
    }
}
