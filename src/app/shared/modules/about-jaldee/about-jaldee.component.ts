import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-jaldee',
  templateUrl: './about-jaldee.component.html'
})
export class AboutJaldeeComponent implements OnInit, OnDestroy {
  @Input() target: string;
  kwdet: any = [];
  api_error = null;
  domain;
  unq_id = null;
  showheaderandfooter = false;
  constructor(
    private activaterouterobj: ActivatedRoute,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private router: ActivatedRoute,
    private _scrollToService: ScrollToService
  ) { }

  ngOnInit() {
    {
      // if (this.target) {

      // }
      // window.addEventListener('scroll', this.scroll, true); // third parameter
    }
    this.activaterouterobj.paramMap
      .subscribe(params => {
        const passid = params.get('id');
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
    this.router.params
      .subscribe(params => {
        this.unq_id = params.id;
      });
  }

  ngOnDestroy() {
    // window.removeEventListener('scroll', this.scroll, true);
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
