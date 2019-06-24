import { Component, OnInit, Input } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-consumer-learnmore',
  templateUrl: './consumer-learnmore.component.html'
})
export class ConsumerLearnmoreComponent implements OnInit {
  @Input() target: string;
  constructor(
    private _scrollToService: ScrollToService
  ) { }

  ngOnInit() {
    if (this.target) {
      //  this.triggerScrollTo(this.target);
    }
    // window.addEventListener('scroll', this.scroll, true); // third parameter
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
