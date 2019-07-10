import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-learnmore',
  templateUrl: './provider-learnmore.component.html'
})
export class ProviderLearnmoreComponent implements  OnInit {

  @Input() target: string;
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
  domain;
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  show ='false';
  constructor(
    private activated_route: ActivatedRoute,
    private _scrollToService: ScrollToService,
    private _location: Location,
    private shared_functions: SharedFunctions
  ) { }
  ngOnInit() {
    this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.domain = this.active_user.sector;
    if (this.target) {
      // this.triggerScrollTo(this.target);
    }
    this.activated_route.paramMap
      .subscribe(params => {
        const group = params.get('parent').split('->');
        this.parent = group[0];
        if (group.length > 1) {
          this.child = group[1];
        } else {
          this.child = this.parent;
        }
        this.handleScroll(this.child, this.parent);
      });
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
    this.menu(parentContent);
  }
  setActivePricing(item) {
    this.activePrice = item;
  }
  goBack() {
    this._location.back();
  }
  menu(parentContent){
    if(parentContent === 'profile-search'){
      this.showprofile = true;
      this.showcheckinmanager = false;
      this.showlicense = false;
      this.showbill = false;
    }
    if(parentContent === 'checkinmanager'){
      this.showprofile = false;
      this.showcheckinmanager = true;
      this.showlicense = false;
      this.showbill = false;
    }
    if(parentContent === 'license'){
      this.showlicense = true;
      this.showprofile = false;
      this.showcheckinmanager = false;
      this.showbill = false;
    }
    if(parentContent === 'billing'){
      this.showbill = true;
      this.showlicense = false;
      this.showprofile = false;
      this.showcheckinmanager = false;
    }




    }
 
 
}
