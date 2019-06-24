import { Component, OnInit, Input } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SharedFunctions } from '../../../functions/shared-functions';
@Component({
  selector: 'app-learnmore-downpanel-options',
  templateUrl: './learnmore-downpanel-options.component.html'
})
export class LearnmoreDownpanelOptionsComponent implements OnInit {
  @Input() target: string;
  curtype = '';
  constructor(
    private _scrollToService: ScrollToService,
    public shared_function: SharedFunctions
  ) { }

  ngOnInit() {
    const userdet = this.shared_function.getitemfromLocalStorage('ynw-user');
    this.curtype = userdet.sector;
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
    // if (this.data.moreOptions.scrollKey !== undefined) {
    setTimeout(() => {
      this.triggerScrollTo(target);
    }, 200);
    // }
  }

}
