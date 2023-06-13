import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from '../../components/signup/signup.component';
import { LoginComponent } from '../../components/login/login.component';
import { SearchFields } from '../../modules/search/searchfields';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from '../../services/local-storage.service';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../services/i18n-service';
import { projectConstantsLocal } from '../../constants/project-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  languages = projectConstantsLocal.SUPPORTEDLANGUAGES;
  langselected = 'English';
  public domainlist_data: any = [];
  // sector_info: any = [];
  // special_info: any = [];
  public searchfields: SearchFields = new SearchFields();
  locationholder = { 'autoname': '', 'name': '', 'lat': '', 'lon': '', 'typ': '' };
  keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': '' };
  selected_domain = '';
  is_provider = 'true';
  domain_obtained = false;
  playvideo = false;
  evnt;
  loading = false;
  appliedDate: string = '31st January 2022.'
  constructor(
    private shared_service: SharedServices,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    public dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    private titleService: Title,
    private i18nService: I18nService,
    private metaService: Meta,
    public translate: TranslateService,
  ) {
    this.evnt = routerobj.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (routerobj.url === '\/') {
          if (this.shared_functions.isBusinessOwner('returntyp') === 'consumer') {
            routerobj.navigate(['consumer']);
          }
        }
      }
    });
  }
  ngOnDestroy() {
    const a = document.getElementById("fb-root");
    if (a) {
      a.classList.remove('visible_chat');
    }
  }
  ngAfterViewInit() {
    this.translate.use(JSON.parse(localStorage.getItem('translatevariable')))
    for (let i = 0; i < this.languages.length; i++) {
      if (this.languages[i].value == JSON.parse(localStorage.getItem('translatevariable'))) {
        this.langselected = this.languages[i].viewValue;
        break;
      }
    }
  }
  changeLocale(locale: string, languagename) {
    this.langselected = languagename;
    console.log('lang', this.langselected)

    this.translate.use(locale);

    this.i18nService.changeLocale(locale);

  }
  ngOnInit() {
    this.i18nService.changeLocale('en');
    const a = document.getElementById("fb-root");
    if (a) {
      a.classList.add('visible_chat');
    }
    this.titleService.setTitle('Jaldee - Avoid Waiting in Line');
    this.metaService.addTags([
      { name: 'description', content: 'www.jaldee.com is a web portal connecting service providers with customers. Jaldee is an all India platform listing thousands of doctors/professionals/technicians and all service areas including healthcare, homecare, personal care and legal/financial care. The motto of Jaldee is \"seamless connectivity of service providers/business enterprises with potential customers.\" Elimination of queues, wiping out unproductive & boring waiting times, is the motivation & aim of Jaldee.' }
    ]);
    this.setSystemDate().then(
      () => {
        // calling the method to get the list of domains
        this.getDomainList();
      }
    );
  }
  playvideoClicked() {
    document.getElementById('video-box').innerHTML = '<iframe width="100%"  src="https://www.youtube-nocookie.com/embed/qF4gLhQW2CE?controls=1&rel=0&autoplay=1" height= "514px" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  }
  setSystemDate() {
    const self = this;
    return new Promise(function (resolve, reject) {
      self.shared_service.getSystemDate()
        .subscribe(
          res => {
            console.log("Here");
            self.lStorageService.setitemonLocalStorage('sysdate', res);
            resolve(true);
          },
        );
    })
  }
  getDomainList() {
    const bconfig = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
    let run_api = true;
    if (bconfig && bconfig.cdate && bconfig.bdata) { // case if data is there in local storage
      const bdate = bconfig.cdate;
      const bdata = bconfig.bdata;
      const saveddate = new Date(bdate);
      if (bconfig.bdata) {
        const diff = this.dateTimeProcessor.getdaysdifffromDates('now', saveddate);
        if (diff['hours'] < projectConstantsLocal.DOMAINLIST_APIFETCH_HOURS) {
          run_api = false;
          this.domainlist_data = bdata;
          this.domain_obtained = true;
        }
      }
    }
    if (run_api) { // case if data is not there in data
      this.shared_service.bussinessDomains()
        .subscribe(
          res => {
            this.domainlist_data = res;
            this.domain_obtained = true;
            const today = new Date();
            const postdata = {
              cdate: today,
              bdata: this.domainlist_data
            };
            this.lStorageService.setitemonLocalStorage('ynw-bconf', postdata);
          }
        );
    }
  }
  domainClicked(type) {
    this.handle_home_domain_click({ 'domain': type });
  }
  handle_home_domain_click(obj) {
    this.keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': '' };
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
    const localloc = this.lStorageService.getitemfromLocalStorage('ynw-locdet');
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
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: this.checkProvider(origin)
      }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }
  doLogin(origin?) {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '50%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: this.checkProvider(origin)
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
      }
    });
  }
  doSignuppage() {
    // this.routerobj.navigate(['/business']);
    // window.open('https://scale.jaldee.com/business/signup');

    window.open(projectConstantsLocal.PATH + 'business/signup',"_self");
  }
  checkProvider(type) {
    return (type === 'consumer') ? 'false' : 'true';
  }
  knowCheckinStatus() {
    this.routerobj.navigate(['status/new']);
  }
  providerLinkClicked() {
    // this.routerobj.navigate(['/business/login']);
    window.open(projectConstantsLocal.PATH + 'business/login', "_self");
    // window.open('https://scale.jaldee.com/business/login');
  }
  openVivoCampPage() {
    // console.log('Click')
    window.open('https://vivocampaign.jaldee.com/')

  }
  knowmore() {
    window.open('https://offer.jaldee.com')
  }
}
