import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { SearchFields } from '../../modules/search/searchfields';
import { SharedFunctions } from '../../functions/shared-functions';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit, OnDestroy {
    @Input() headerTitle: string;
    @Input() includedfrom: string;
    @Input() passedDomain: string;
    @Input() passedkwdet: any = [];
    @Input() passedRefine: any = [];
    @Output() searchclick = new EventEmitter<any>();
    @Output() scrollhideclass = new EventEmitter<any>();
    @Input() source;
    @Input() moreOptions: any = [];
    public searchfields: SearchFields = new SearchFields();
    locationholder = { 'autoname': '', 'name': '', 'lat': '', 'lon': '', 'typ': '' };
    keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': '' };
    selected_domain = '';
    popSearches: any = [];
    public popular_searches: any = [];
    passedDet = {};
    showmorepopularoptions = false;
    showMorepopularOptionsOverlay = false;
    showmoreSearch = false;
    maxCount = 5;
    searchLength = 0;
    jsonlist: any = [];
    subscription: Subscription;
    constructor(
        public shared_functions: SharedFunctions
    ) {
        this.subscription = this.shared_functions.getMessage().subscribe(message => {
            switch (message.ttype) {
                case 'popularList':
                    this.jsonlist = message.target;
                    if (this.jsonlist) {
                        this.popular_search(this.jsonlist);
                    }
                    break;
                case 'popularSearchList':
                    this.jsonlist = message.target;
                    this.popular_search(this.jsonlist);
                    break;
            }
        });
    }
    ngOnInit() {
        if (this.jsonlist) {
            this.popular_search(this.jsonlist);
        }
    }
    ngOnDestroy () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    handlesearchClick(ob) {
        this.searchclick.emit(ob);
    }

    popularClicked(kw) {
        this.showmorepopularoptions = false;
        this.popular_searches = kw;
        const pdata = { 'ttype': 'popular', 'target': this.popular_searches };
        this.shared_functions.sendMessage(pdata);
    }
    popular_search(jsonlist) {
        this.popSearches = [];
        this.showmoreSearch = false;
        if (jsonlist && jsonlist.length === 0) {
            this.popSearches = this.shared_functions.getitemfromLocalStorage('popularSearch');
        } else {
            this.popSearches = jsonlist;
        }
        if (this.popSearches) {
            this.searchLength = this.popSearches.length;
            for (let i = 0; i < this.popSearches.length; i++) {
                if (i < this.maxCount) {
                    this.popSearches[i].show = true;
                }
            }
        }
    }
    showMoreItems() {
        if (this.showmorepopularoptions) {
            this.showmorepopularoptions = false;
            this.showMorepopularOptionsOverlay = false;
        } else {
            this.showmorepopularoptions = true;
            this.showMorepopularOptionsOverlay = true;
        }
    }
    closeMorepopularoptions() {
        this.showmorepopularoptions = false;
        this.showMorepopularOptionsOverlay = false;
    }
    showpopularSerach(origin) {
        this.showmoreSearch = false;
        if (origin === 'more' && this.popSearches) {
            for (let i = 0; i < this.popSearches.length; i++) {
                if (i >= this.maxCount) {
                    this.popSearches[i].show = true;
                }
            }
            this.showmoreSearch = true;
        }
        if (origin === 'less') {
            for (let i = 0; i < this.popSearches.length; i++) {
                if (i >= this.maxCount) {
                    this.popSearches[i].show = false;
                }
            }
            this.showmoreSearch = false;
        }
    }
}
