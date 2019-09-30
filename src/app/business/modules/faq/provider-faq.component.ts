import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-faq',
  templateUrl: './provider-faq.component.html'
})
export class ProviderFaqComponent implements  OnInit {

  childContent = 'public-search';
  parentContent = 'profile-search';
  profilesearch = true;
  checkinmanager = true;
  basiclink = false;
  basicpluslink = false;
  advancedlink = false;
  license = true;
  billing = true;
  activePrice = '';
  active_user;
  showprofile = false;
  showcheckinmanager = false;
  showlicense = false;
  showbill = false;
  parent;
  child;
  activeMenu;
  domain;
  value;
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  breadcrumbs = [
    {
      title: 'FAQ'
    }
  ];
  show = 'false';
  constructor(
    private activated_route: ActivatedRoute,
    private _scrollToService: ScrollToService,
    private _location: Location,
    private shared_functions: SharedFunctions
  ) { }
  ngOnInit() {
    this.activeMenu = 'profile';
  }
  scroll() {
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

  handleScroll(childContent, parentContent) {
    this.child = childContent;
    this.parent = parentContent;
  }
  setActivePricing(item) {
    this.activePrice = item;
  }
  goBack() {
    this._location.back();
  }
  menuclicked(value) {
    this.activeMenu = value;
    }
}
