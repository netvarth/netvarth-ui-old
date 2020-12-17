import { Component, OnInit, Input } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import {  ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-static',
  templateUrl: './terms-static.component.html'
})
export class TermsStaticComponent implements OnInit {
  @Input() includedfrom: any;
  kwdet: any = [];
  api_error = null;
  domain;
  phomepath;
showheaderandfooter = false;
  constructor(
    private activaterouterobj: ActivatedRoute,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private router: Router,
    private _scrollToService: ScrollToService,
    ) {}

  ngOnInit() {
    this.phomepath = this.router.url;
  this.activaterouterobj.paramMap
    .subscribe(params => {
    //  if (passid) {
    //   if (passid === 'mobile') {
    //     this.showheaderandfooter = false;
    //   }  else {
    //     this.showheaderandfooter = true;
    //   }
    // } else {
      // this.showheaderandfooter = true;
    // }
    this.showheaderandfooter = false;
    });
    this.activaterouterobj.paramMap
      .subscribe(params => {
        const passid = params.get('terms');
        this.triggerScrollTo(passid);
        // if (passid) {
        //   if (passid === 'mobile') {
        //     this.showheaderandfooter = false;
        //   } else {
        //     this.showheaderandfooter = true;
        //   }
        // } else {
        this.showheaderandfooter = true;
        // }
      });
  }
  scroll() {
    // const st = window.pageYOffset || document.documentElement.scrollTop;
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

  handleScroll(target) {
    // if (this.target.moreOptions.scrollKey !== undefined) {
    setTimeout(() => {
      this.triggerScrollTo(target);
    }, 200);
    // }
  }
}
