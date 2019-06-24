import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-personalcare-customer-learnmore',
  templateUrl: './personalcare-customer.component.html'
})
export class PersonalcareCustomerComponent implements OnInit, OnDestroy {
  @Input() target: string;
  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private _scrollToService: ScrollToService
  ) { }

  ngOnInit() {
    if (this.target) {
      // this.triggerScrollTo(this.target);
    }
    // window.addEventListener('scroll', this.scroll, true); // third parameter
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
