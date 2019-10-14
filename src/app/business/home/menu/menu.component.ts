import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  inboxUnreadCnt;
  inboxCntFetched;
  alertCnt;
  domain;
  bname;
  bsector = '';
  bsubsector = '';
  blogo = '';
  qAvailability;
  selectedMenu;
  constructor(
    private shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    private router: Router
  ) {
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'messageCount':
          this.inboxUnreadCnt = message.unreadCount;
          this.inboxCntFetched = message.messageFetched;
          break;
        case 'alertCount':
          this.alertCnt = message.alertCnt;
          break;
        case 'updateuserdetails':
          // this.getUserdetails();
          // this.handleHeaderclassbasedonURL();
          break;
        case 'upgradelicence':
          // this.setLicense();
          // this.getUpgradablePackages();
          break;
        case 'main_loading':
          // this.main_loading = message.action || false;
          break;
        // case 'load_unread_count':
        //   if (!message.action) {
        //   } else if (message.action === 'setzero') {
        //     this.inboxUnreadCnt = 0;
        //     this.inboxCntFetched = true;
        //   }
        //   break;
        // case 'learn_more':
        // this.showLearnMore = true;
        // this.scrollhideclass.emit(false);
        // this.passedDet = { 'mainKey': message.target.scrollKey, 'subKey': message.target.subKey };
        // this.router.navigate(['/provider/learnmore/' + message.target.scrollKey]);
        // break;
        // case 'faq':
        // this.showLearnMore = true;
        // this.scrollhideclass.emit(false);
        // this.passedDet = { 'mainKey': message.target.scrollKey, 'subKey': message.target.subKey };
        // this.router.navigate(['/provider/faq/' + message.target.scrollKey]);
        // break;
        case 'instant_q':
          this.qAvailability = message.qAvailability;
          break;
        // case 'popularList':
        //   this.jsonlist = message.target;
        //   if (this.jsonlist) {
        //     this.popular_search(this.jsonlist);
        //   }
        //   break;
        // case 'popularSearchList':
        //   this.jsonlist = message.target;
        //   this.popular_search(this.jsonlist);
        //   break;
        case 'menuChanged':
          this.menuClick(message.value);
      }
      this.getBusinessdetFromLocalstorage();
    });
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      this.blogo = bdetails.logo || 'img-null.svg';
    }
  }
  gotoHelp() {
    this.router.navigate(['/provider/' + this.domain + '/help']);
  }
  btnAvailableClicked() {
    this.router.navigate(['provider/settings/waitlist-manager/queues']);
  }
  holidaybtnClicked() {
    this.router.navigate(['provider/settings/miscellaneous/holidays']);
  }
  ngOnInit() {
    const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.domain = user.sector;
    this.getBusinessdetFromLocalstorage();
    this.isAvailableNow();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  isAvailableNow() {
    this.shared_service.isAvailableNow()
      .subscribe(data => {
        this.qAvailability = data;
        console.log(data);
      },
        () => {
        });
  }
  menuClick(menu) {
    switch (menu) {
      case 'check-ins':
        this.router.navigate(['/provider/dashboard/check-ins']);
        this.selectedMenu = 'check-ins';
        break;
      case 'settings':
        this.router.navigate(['/provider/settings']);
        this.selectedMenu = 'settings';
        break;
      case 'customers':
        this.router.navigate(['/provider/customers']);
        this.selectedMenu = 'customers';
        break;
      case 'license':
        this.router.navigate(['/provider/license']);
        this.selectedMenu = 'license';
        break;
      case 'inbox':
        this.router.navigate(['/provider/inbox']);
        this.selectedMenu = 'inbox';
        break;
      case 'alerts':
        this.router.navigate(['/provider/alerts']);
        this.selectedMenu = 'alerts';
        break;
      case 'auditlog':
        this.router.navigate(['/provider/auditlog']);
        this.selectedMenu = 'auditlog';
        break;
      case 'kiosk':
        this.router.navigate(['/kiosk']);
        this.selectedMenu = 'kiosk';
        break;
      case 'faq':
        this.router.navigate(['/provider/faq']);
        this.selectedMenu = 'faq';
        break;
    }
  }
}

