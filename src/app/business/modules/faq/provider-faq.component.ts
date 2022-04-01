import { Component, OnInit } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { Location } from '@angular/common';
import { Messages } from '../../../shared/constants/project-messages';
import { WordProcessor } from '../../../shared/services/word-processor.service';

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
  customer_label:any;
  constructor(
    private _scrollToService: ScrollToService,
    private _location: Location,
    private wordProcessor: WordProcessor,
  ) { }
  ngOnInit() {
    this.activeMenu = 'profile';
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
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
