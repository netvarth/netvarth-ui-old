import { Component, Input, Output, OnInit, Injectable, EventEmitter, OnChanges } from '@angular/core';
// import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

import { PagerService } from '../pager/pager.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    // moduleId: module.id,
    selector: 'app-pager',
    templateUrl: 'pager.component.html'
})

export class PagerComponent implements OnInit, OnChanges {
    constructor(private pagerService: PagerService) { }

    // array of all items to be paged
    // private allItems: any[];
    @Input() total_pages;
    @Input() pagesize;
    @Input() curpage;
    @Output() pagerclick = new EventEmitter<any>();
    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    ngOnInit() {
       this.setPage(this.curpage, false);
    }

    ngOnChanges() {
      this.setPage(this.curpage, false);
    }

    setPage(page: number, redirect: boolean = true) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.total_pages, page, this.pagesize);
        // console.log('pager', this.pager);
        // calling function to emit details to the parent
        // if(redirect) { this.onpagerclick(); }
    }
    onpagerclick(pg) {
        // this.pagerclick.emit(this.pager.currentPage);
        if (pg < 1 || pg > this.pager.totalPages) {
            return;
        }
        // this.pager.currentPage = pg;
        this.pagerclick.emit(pg);
    }
}
