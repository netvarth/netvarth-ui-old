import { Component, OnInit, Input } from '@angular/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../constants/project-constants';
import { Messages } from '../../constants/project-messages';


@Component({
  selector: 'app-learnmore',
  templateUrl: './learnmore.component.html'
})
export class LearnmoreComponent implements OnInit {
  destination = '';
  subKey = '';
  helpSub = '';
  isprovider = false;
  ctype;
  curtype = '';
  breadcrumbs_init = [
    {
      title: Messages.DASHBOARD_TITLE,
      url: '/' + this.shared_function.isBusinessOwner('returntyp')
    }
  ];
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  @Input() passedDet;
  constructor(
    public shared_function: SharedFunctions
  ) { }

  ngOnInit() {
    // this.destination = this.data.moreOptions.scrollKey;
    const userdet = this.shared_function.getitemfromLocalStorage('ynw-user');
    this.curtype = userdet.sector;
    this.destination = this.passedDet.mainKey;
    this.subKey = this.passedDet.subKey;
    this.isprovider = this.shared_function.isBusinessOwner();
    this.ctype = this.shared_function.isBusinessOwner('returntyp');
    /*if (this.data.moreOptions.scrollKey !== undefined) {
      setTimeout(() => {
        this.triggerScrollTo(this.data.moreOptions.scrollKey);
        }, 200);
    }*/
  }
  sethelpSub(mod) {
    this.helpSub = mod;
  }
}



