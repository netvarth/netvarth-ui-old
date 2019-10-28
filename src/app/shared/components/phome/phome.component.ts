import { Component, OnInit } from '@angular/core';
import { SignUpComponent } from '../signup/signup.component';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
@Component({
  selector: 'app-phome',
  templateUrl: './phome.component.html'
})
export class PhomeComponent implements OnInit {
  show_jaldeegrow = true;
  carouselOne;
  carouselDomain;
  activeFeature = 'jaldee_online';
  carouselPricing;
  activePrice = '';
  showMoreList: any = {};
  images = {
    special_offers: 'assets/images/special offer-01-01.png',
    jaldee_online: 'assets/images/home/jaldee_online.svg',
    jaldee_token: 'assets/images/home/jaldee_token.svg',
    jaldee_checkin: 'assets/images/home/jaldee_checkin.svg',
    jaldee_appt: 'assets/images/home/jaldee_appointment.svg',
    jaldee_comm: 'assets/images/home/jaldee_comm.svg',
    jaldee_pos: 'assets/images/home/jaldee_pos.svg',
    jaldee_pay: 'assets/images/home/jaldee_pay.svg',
    jaldee_coupon: 'assets/images/home/jaldee_coupons.svg',
    jaldee_pet: 'assets/images/home/pet-01.svg',
    jaldee_bank: 'assets/images/home/bank-01.svg',
    jaldee_religious: 'assets/images/home/religoues presets-01.svg',
    jaldee_vastu: 'assets/images/home/vasthu-01.svg',
    jaldee_food: 'assets/images/home/foodand beverages-01.svg',
    jaldee_prof: 'assets/images/home/Proffesional.jpg',
    jaldee_personal: 'assets/images/home/personal-care.jpg',
    jaldee_health: 'assets/images/home/HealthCare.jpg',
    jaldee_kiosk: 'assets/images/home/jaldee_kiosk.svg'

  };

  constructor(
    private shared_service: SharedServices,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    public dialog: MatDialog,
    private _scrollToService: ScrollToService
  ) { }
  ngOnInit() {
    this.handleScroll('pro_home');
    this.carouselOne = {
      dots: false,
      autoplay: true,
      autoplayTimeout: 6000,
      autoplaySpeed: 1000,
      autoplayHoverPause: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      loop: true,
      responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 3 }, 1200: { items: 3 } }
    };
    this.carouselPricing = {
      dots: false,
      autoplay: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      loop: false,
      nav: true,
      responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 2 }, 1200: { items: 2 } }
    };
    this.carouselDomain = {
      items: 1,
      dots: false,
      nav: true,
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      ],
      navContainer: '.p-domain-info .custom-nav',
      autoplayTimeout: 15000,
      autoplayHoverPause: true,
      loop: true,
      autoplay: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true
    };
  }
  handleScroll(target) {
    this.triggerScrollTo(target);
  }
  public triggerScrollTo(destination) {
    const config: ScrollToConfigOptions = {
      target: destination,
      duration: 150,
      easing: 'easeOutElastic',
      offset: 0
    };
    this._scrollToService.scrollTo(config);
  }
  setActiveFeature(item) {
    this.activeFeature = item;
  }
  setActivePricing(item) {
    this.activePrice = item;
  }
  openCity(evt, cityName) {
    this.show_jaldeegrow = false;
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(cityName).style.display = 'block';
    evt.target.className += ' active';
  }

  doSignup(origin?) {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'true'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
    });

  }
  showMore(name) {
    switch (name) {
      case 'public_search': {
        if (this.showMore['public_search']) {
          this.showMore['public_search'] = ! this.showMore['public_search'];
        } else {
          this.showMore['public_search'] = ! this.showMore['public_search'];
        }

      }
    }
  }
  doLogin(origin?) {
    if (origin === 'provider') {
      // cClass = 'commonpopupmainclass';
    }
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '50%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: 'true',
        moreparams: {
          source: 'businesshome_page'
        }
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // this.animal = result;
    });

  }

}
