import { Component, OnInit, Inject, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, ISubscription } from 'rxjs/Subscription';

import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


/// import { LoginComponent } from '../../components/login/login.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { projectConstants } from '../../../shared/constants/project-constants';

import { ViewChild } from '@angular/core';

@Component({
    selector: 'app-kioskheader',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() headerTitle: string;
  @Input() includedfrom: string;
  bname;
  blogo;

  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public router: Router,
    public shared_service: SharedServices
  ) {}

    ngOnInit() {
      this.getBusinessdetFromLocalstorage();
    }

    ngOnDestroy() {

    }
    getBusinessdetFromLocalstorage() {
      const bdetails = this.shared_functions.getitemfromLocalStorage('ynwbp');
      if (bdetails) {
        this.bname = bdetails.bn || '';
        this.blogo = bdetails.logo || '';
       // console.log('logo', this.blogo);
      }
    }

}
