import { Component, OnInit,Input } from '@angular/core';
import { SharedFunctions } from '../../../functions/shared-functions';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';


@Component({
  selector: 'app-learnmore-dashboard',
  templateUrl: './learnmore-dashboard.component.html'
  //styleUrls: ['./learnmore-dashboard.component.css']
})
export class LearnmoreDashboardComponent implements OnInit {
  @Input() target: string;
  curtype = '';
  constructor(
   // @Inject(MAT_DIALOG_DATA) public data: any,
    private _scrollToService: ScrollToService,
    public shared_function: SharedFunctions
  ) {}

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
    // console.log('destination', destination, 'config', config);
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
