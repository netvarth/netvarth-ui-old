import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';


@Component({
  selector: 'app-learnmore',
  templateUrl: './learnmore.component.html',
  styleUrls: ['./learnmore.component.css']
})
export class LearnmoreComponent implements OnInit {
    destination = '';
    @Input ()  passedDet;
    constructor(
      // @Inject(MAT_DIALOG_DATA) public data: any,
      private _scrollToService: ScrollToService
    ) {}

    ngOnInit() {
      // console.log('passed in data', this.passedDet, this.data, this.data.moreOptions.scrollKey);
      // this.destination = this.data.moreOptions.scrollKey;
      // console.log('passedin', this.passedDet);
      this.destination = this.passedDet;
      /*if (this.data.moreOptions.scrollKey !== undefined) {
        setTimeout(() => {
          this.triggerScrollTo(this.data.moreOptions.scrollKey);
          }, 200);
      }*/
    }

    /*public triggerScrollTo(destination) {
      const config: ScrollToConfigOptions = {
        target: destination
      };
      // console.log('destination', destination, 'config', config);
      this._scrollToService.scrollTo(config);
    }*/

}
