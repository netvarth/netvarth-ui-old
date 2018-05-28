import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    // styleUrls: ['./home.component.scss']
})



export class FooterComponent implements OnInit {
  curyear;
  ngOnInit() {
    this.curyear = new Date().getFullYear();

  }

  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public router: Router) {}

    showAuditlog() {
      
    }
}
