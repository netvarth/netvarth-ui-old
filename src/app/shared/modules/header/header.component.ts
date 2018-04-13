import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { SignUpComponent } from '../../components/signup/signup.component';
import { LoginComponent } from '../../components/login/login.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    // styleUrls: ['./home.component.scss']
})



export class HeaderComponent implements OnInit, OnDestroy {

  @Input() headerTitle: string;
  userdet: any = [];
  headercls = '';
  provider_loggedin = false;
  consumer_loggedin = false;
  curPgurl = '';
  evnt;
  subscription: Subscription;
  bname;
  bsector;
  blogo;
  urls_class = [
    {url: '\/provider\/bwizard' , class: 'itl-steps'},
    {url: '\/provider\/settings\/.+' , class: 'dashb'},
    {url: null , class: 'dashb'},
  ];


  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public router: Router,
    public shared_service: SharedServices
  ) {
     /*router.events.subscribe((val) => {
        console.log('routerval', val['url']);
        if (val['url']) {
          this.curPgurl = val['url'];
          this.handleHeaderclassbasedonURL();
        }
     }
    });*/
    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleHeaderclassbasedonURL();
      }
    });
    // subscribe to home component messages
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      // console.log('message', message);
      this.getBusinessdetFromLocalstorage();
    });

  }

  ngOnInit() {
    this.getUserdetails();
    this.getBusinessdetFromLocalstorage();
    // this.handleHeaderclassbasedonURL();
  }

  ngOnDestroy() {
    this.evnt.unsubscribe();
     // unsubscribe to ensure no memory leaks
     this.subscription.unsubscribe();
  }

  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.blogo = bdetails.logo || '';
     // console.log('logo', this.blogo);
    }
  }
  getUserdetails() {
    this.userdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    if (this.userdet)  {
      // console.log(this.userdet);
      if (this.shared_functions.checkLogin()) {
        if (this.userdet.isProvider === true) {
          this.provider_loggedin = true;
          this.consumer_loggedin = false;
        } else {
          this.consumer_loggedin = true;
          this.provider_loggedin = false;
        }
      }
    }
  }

  handleHeaderclassbasedonURL() {
    this.headercls = '';
    const currenturl = this.router.url.split(';');
    const checkUrl = currenturl[0]; // this.curPgurl;
   // console.log('subst', checkUrl);
   /* if (checkUrl.substr(-17) === '/provider/bwizard') {
      this.headercls = 'itl-steps';
      // this.headercls = 'dashb';
    } else if (checkUrl.substr(-34) === '/provider/settings/bprofile-search') {
      this.headercls = 'dashb';
    }*/
   // return this.headercls;
   for (const url of this.urls_class) {
     if (url.url != null) {
        const match = checkUrl.match(url.url) ;
        if (match instanceof Array && match.length === 1) {
          this.headercls = url.class;
          console.log('reached here', url.class);
        }

     }

   }
   if (this.headercls === '') {
        this.headercls = 'dashb';
   }

  }
  doSignup(origin?) {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: 'signupmainclass',
      data: {
        is_provider : this.checkProvider(origin)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  doLogin(origin?) {
    const dialogRef = this.dialog.open(LoginComponent, {
       width: '50%',
       panelClass: 'loginmainclass',
      data: {
        type : origin,
        is_provider : this.checkProvider(origin)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });

  }

  checkProvider(type) {
    return  (type === 'consumer') ? 'false' : 'true';
  }

  doLogout() {
    // console.log('here');
    this.router.navigate(['logout']);
  }
  upgradeMembership() {
    alert('Upgrade Membership');
  }
  inboxiconClick() {
    alert('Inbox');
  }


}
