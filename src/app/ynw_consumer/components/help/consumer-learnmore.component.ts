import { Component, Input, OnInit } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { Location } from '@angular/common';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-consumer-learnmore',
  templateUrl: './consumer-learnmore.component.html'
})
export class ConsumerLearnmoreComponent implements  OnInit {

  @Input() target: string;
  searchh = true;
  childContent = 'searchh';
  parentContent = 'searchh';
  parent;
  child;
  value;
  activeMenu;
  domain;
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  constructor(
    private _scrollToService: ScrollToService,
    private _location: Location
  ) { }
  ngOnInit() {
    this.activeMenu = 'searchh';
    // this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    // this.domain = this.active_user.sector;
    // if (this.target) {
    //   // this.triggerScrollTo(this.target);
    // }
    // this.activated_route.paramMap
    //   .subscribe(params => {
    //     const group = params.get('parent').split('->');
    //     this.parent = group[0];
    //     if (group.length > 1) {
    //       this.child = group[1];
    //     } else {
    //       this.child = this.parent;
    //     }
    //     this.handleScroll(this.child, this.parent);
    //   });
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
  goBack() {
    this._location.back();
  }
  menuclicked(value) {
    this.activeMenu = value;
    }
  }
