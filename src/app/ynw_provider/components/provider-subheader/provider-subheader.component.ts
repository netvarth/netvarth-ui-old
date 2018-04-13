import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';




@Component({
    selector: 'app-provider-subheader',
    templateUrl: './provider-subheader.component.html',
    // styleUrls: ['./home.component.scss']
})



export class ProviderSubeaderComponent implements OnInit {

  @Input() activeTab: string;
  userdet: any = [];
  constructor() {}

  ngOnInit() {
  }
}
