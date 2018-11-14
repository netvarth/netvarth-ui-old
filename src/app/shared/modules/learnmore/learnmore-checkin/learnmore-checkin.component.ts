import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

import { SharedFunctions } from '../../../functions/shared-functions';
import { Messages } from '../../../constants/project-messages';


@Component({
  selector: 'app-checkin-learnmore',
  templateUrl: './learnmore-checkin.component.html'
})
export class LearnmoreCheckinComponent implements OnInit {

  checkin_cap = Messages.CHECK_IN_CAP;
  
  @Input() target: string;
  constructor(
   // @Inject(MAT_DIALOG_DATA) public data: any,
    private _scrollToService: ScrollToService
  ) {}

  ngOnInit() {
      // console.log('target', this.target);
  }

  public triggerScrollTo(destination) {
    const config: ScrollToConfigOptions = {
      target: destination
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
