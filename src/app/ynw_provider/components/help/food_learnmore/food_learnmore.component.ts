import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-foodjoint-learnmore',
  templateUrl: './food_learnmore.component.html'
})
export class FoodjointsLearnmoreComponent implements OnInit, OnDestroy {
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
  // contentprofiles = 'public-search' ;
  // contentcheckins ='settings' ;
  constructor(
    private activated_route: ActivatedRoute,
    private _scrollToService: ScrollToService
  ) { }

  ngOnInit() {
    if (this.target) {
      // this.triggerScrollTo(this.target);
    }
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
  basic() {
    if (this.basiclink === true) {
      this.basiclink = false;
    } else {
      this.basiclink = true;
    }

  }
  basicplus() {
    if (this.basicpluslink === true) {
      this.basicpluslink = false;
    } else {
      this.basicpluslink = true;
    }

  }
  advanced() {
    if (this.advancedlink === true) {
      this.advancedlink = false;
    } else {
      this.advancedlink = true;
    }

  }
  setActivePricing(item) {
    this.activePrice = item;
  }
}
