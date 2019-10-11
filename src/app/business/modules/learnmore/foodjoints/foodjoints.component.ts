import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
@Component({
  selector: 'app-foodjoints-learnmore',
  templateUrl: './foodjoints.component.html'
})
export class FoodJointComponent implements OnChanges {
  @Input() target: string;
  breadcrumbs = [
    {
      title: 'Help'
    }
  ];
  // here..
  activePrice = '';
  // here code
  active_user;
  parent;
  child;
  profilesearch = true;
  checkinmanager = true;
  license = true;
  billing = true;
  miscellaneous = true;
  showpublic = false;

  showverified = false;

  showprofilesearch = false;
  showbasicinfrmtion = false;
  showadword = false;
  showspecialization = false;
  showlanguagesknown = false;
  showprivacysettings = false;
  showadditionalinfo = false;
  showsocialmedia = false;
  showgallery = false;

  domain;
  show = 'false';
  constructor(
    private activated_route: ActivatedRoute,
    private shared_functions: SharedFunctions,
    private _location: Location,
    private _scrollToService: ScrollToService,
  ) { }
  ngOnChanges() {
  }
  setActivePricing(item) {
    this.activePrice = item;
  }

  ngOnInit() {
   this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.domain = this.active_user.sector;
    console.log(this.domain);
    if (this.target) {
      // this.triggerScrollTo(this.target);
    }
    this.activated_route.paramMap
      .subscribe(params => {
        console.log(params);
        if (params.get('parent')) {
          const group = params.get('parent').split('->');
          console.log(group);
          this.parent = group[0];
          console.log(this.parent);
          if (group.length > 1) {
            this.child = group[1];
          } else {
            this.child = this.parent;
            console.log(this.parent);
          }
        } else {
          this.child = 'public-search';
          this.parent = 'profile-search';
        }
        this.handleScroll(this.child, this.parent);
      });
  }
  goBack() {
    this._location.back();
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
    // console.log('child...........'+childContent);
    // console.log('parent......'+parentContent);
    this.child = childContent;
    this.parent = parentContent;
    this.menu(parentContent, childContent);
  }
  menu(parentContent, childContent) {
    console.log(parentContent);
    console.log(childContent);
    if (parentContent === 'profile-search') {
      this.showprofilesearch = true;
      if (childContent === 'public-search') {
        this.showpublic = true;
      }
      if (childContent === 'verified-levels') {
        this.showverified = true;
      }
      if (childContent === 'basic-information') {
        this.showbasicinfrmtion = true;
      }
      if (childContent === 'specializations') {
        this.showspecialization = true;
      }
      if (childContent === 'languages-known') {
        this.showlanguagesknown = true;
      }
      if (childContent === 'privacy-settings') {
        this.showprivacysettings = true;
      }
      if (childContent === 'additional-info') {
        this.showadditionalinfo = true;
      }
      if (childContent === 'your-social-media') {
        this.showsocialmedia = true;
      }
      if (childContent === 'photo-gallery') {
        this.showgallery = true;
      }
    }
  }
}