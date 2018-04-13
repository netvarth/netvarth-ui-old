import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/filter';

import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})


export class BreadCrumbComponent implements OnInit {

    @Input () breadcrumbs;
    @Input () moreOptions: any = [];
    constructor(public router: Router) {}

    ngOnInit() {
    }

    goNavigate(breadcrumb) {
        if (breadcrumb.url) {
            this.router.navigateByUrl(breadcrumb.url);
        }
    }
    learnmore_clicked() {
        alert('Learn more clicked');
      }
}
