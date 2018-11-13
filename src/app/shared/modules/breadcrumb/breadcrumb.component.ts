import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { LearnmoreComponent } from '../learnmore/learnmore.component';
import { Messages } from '../../constants/project-messages';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})


export class BreadCrumbComponent implements OnInit {

    lear_more_cap = Messages.LEARN_MORE_CAP;

    @Input () breadcrumbs;
    @Input () moreOptions: any = [];
    constructor(
        public router: Router,
        private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions
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
        const pdata = { 'ttype': 'learn_more', 'target': this.moreOptions };
        this.sharedfunctionObj.sendMessage(pdata);
      /* const dialogRef = this.dialog.open(LearnmoreComponent, {
            width: '50%',
            panelClass: 'commonpopupmainclass',
            autoFocus: true,
            data: {
                moreOptions : this.moreOptions
            }
          });
          dialogRef.afterClosed().subscribe(result => {
          });*/
    }

}
