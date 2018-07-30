import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'rxjs/add/operator/filter';

import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { LearnmoreComponent } from '../learnmore/learnmore.component';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})


export class BreadCrumbComponent implements OnInit {

    @Input () breadcrumbs;
    @Input () moreOptions: any = [];
    constructor(
        public router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        // console.log('options', this.moreOptions);
    }

    goNavigate(breadcrumb) {
        if (breadcrumb.url) {
            this.router.navigateByUrl(breadcrumb.url);
        }
    }
    learnmore_clicked() {
      const dialogRef = this.dialog.open(LearnmoreComponent, {
            width: '50%',
            panelClass: 'commonpopupmainclass',
            autoFocus: true,
            data: {
                moreOptions : this.moreOptions
            }
          });
          dialogRef.afterClosed().subscribe(result => {
          });
    }

}
