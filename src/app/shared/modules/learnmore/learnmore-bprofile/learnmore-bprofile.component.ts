import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

import { SharedFunctions } from '../../../functions/shared-functions';
import { Messages } from '../../../constants/project-messages';


@Component({
  selector: 'app-bprofile-learnmore',
  templateUrl: './learnmore-bprofile.component.html',
  styleUrls: ['./learnmore-bprofile.component.css']
})
export class LearnmoreBprofileComponent implements OnInit {
  @Input() target: string;
    ngOnInit() {
      console.log('target', this.target);
    }
}
