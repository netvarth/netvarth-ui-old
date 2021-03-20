import { Component, OnInit } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { Location } from '@angular/common';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-consumer-faq',
  templateUrl: './consumer-faq.component.html'
})
export class ConsumerFaqComponent implements  OnInit {
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
    private _location: Location,
  ) { }
  ngOnInit() {
    this.activeMenu = 'searchh';
 
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
