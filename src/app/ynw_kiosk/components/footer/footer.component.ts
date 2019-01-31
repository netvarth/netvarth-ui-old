import { Component, OnInit, Inject, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { projectConstants } from '../../../shared/constants/project-constants';

import { ViewChild } from '@angular/core';

@Component({
    selector: 'app-kioskfooter',
    templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit, OnDestroy {

  provider_loggedin = false;

  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public router: Router,
    public shared_service: SharedServices
  ) {}

    ngOnInit() {

    }

    ngOnDestroy() {

    }

}
