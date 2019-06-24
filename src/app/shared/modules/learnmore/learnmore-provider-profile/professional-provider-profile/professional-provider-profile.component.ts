import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
@Component({
  selector: 'app-professional-provider-profile',
  templateUrl: './professional-provider-profile.component.html',
  // styleUrls: ['./professional-provider-profile.component.css']
})
export class ProfessionalProviderProfileComponent implements OnInit, OnDestroy  {
  @Input() target: string;
  constructor(
    private _scrollToService: ScrollToService
  ) { }

  ngOnInit() {
    if (this.target) { }
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
