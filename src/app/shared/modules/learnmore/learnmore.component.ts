import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';


@Component({
  selector: 'app-learnmore',
  templateUrl: './learnmore.component.html'
})
export class LearnmoreComponent implements OnInit {
    topicmaxCnt = 10;
    topicContentArr = [
      {'key': 'bprofile1', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile2', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile3', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile4', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile5', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile6', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile7', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'waitlistmanager', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile10', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile11', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile12', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile13', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile14', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'},
      {'key': 'bprofile15', 'content': 'this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content this is my content'}

    ];
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _scrollToService: ScrollToService
    ) {}

    ngOnInit() {
      console.log('passed in data', this.data, this.data.moreOptions.scrollKey);
      if (this.data.moreOptions.scrollKey !== undefined) {
        setTimeout(() => {
          this.triggerScrollTo(this.data.moreOptions.scrollKey);
          }, 200);
      }
    }

    public triggerScrollTo(destination) {
      const config: ScrollToConfigOptions = {
        target: destination
      };
      // console.log('destination', destination, 'config', config);
      this._scrollToService.scrollTo(config);
    }

}
