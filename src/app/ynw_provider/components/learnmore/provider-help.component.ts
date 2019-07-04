import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-help',
  templateUrl: './provider-help.component.html'
})
export class ProviderHelpComponent implements OnInit, OnDestroy {
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
    domain;
  // contentprofiles = 'public-search' ;
  // contentcheckins ='settings' ;
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
        const parent = group[0];
        let child;
        if (group.length > 1) {
          child = group[1];
        } else {
          child = parent;
        }
        console.log(parent);
        console.log(child);
        this.handleScroll(child, parent);
        // if (passid) {
        //   if (passid === 'mobile') {
        //     this.showheaderandfooter = false;
        //   } else {
        //     this.showheaderandfooter = true;
        //   }
        // } else {
        // }
      });
  }
  ngOnDestroy() {
    // window.removeEventListener('scroll', this.scroll, true);
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
    this.childContent = childContent;
    this.parentContent = parentContent;
    // if (this.target.moreOptions.scrollKey !== undefined) {
    // setTimeout(() => {
    //   this.triggerScrollTo(profile);
    // }, 200);
    // }
  }
  setActivePricing(item) {
    this.activePrice = item;
  }
  goBack() {
    this._location.back();
  }
}
