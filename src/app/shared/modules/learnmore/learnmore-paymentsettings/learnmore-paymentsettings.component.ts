import { Component, OnInit, Input } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SharedFunctions } from '../../../functions/shared-functions';

@Component({
  selector: 'app-learnmore-paymentsettings',
  templateUrl: './learnmore-paymentsettings.component.html'
})
export class LearnmorePaymentsettingsComponent implements OnInit {
  @Input() target: string;
  curtype = '';
  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
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

