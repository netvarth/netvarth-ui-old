import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Messages } from '../../constants/project-messages';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
  selector: 'app-popularsearch-moreoptions',
  templateUrl: './search-popular-moreoptions.component.html'
})
export class SearchPopularMoreOptionsComponent implements OnInit {

  more_search_opt = Messages.MORE_SEARCH_OPT_CAP;
  other_filters_cap = Messages.OTHER_FILTERS_CAP;
  search_cap = Messages.SEARCH_CAP;
  domain_list;
  sector;
  jsonlist;
  groubedByTeam1;
  groubedByTeam2;
  @Input() passedPSearches: any = [];
  @Input() origin;
  @Output() searchpopularmoreclick = new EventEmitter<any>();

  constructor(public sharedfunctionObj: SharedFunctions) { }

  ngOnInit() {
    console.log(this.passedPSearches);
    console.log()
    if (this.origin === 'header') {
      this.jsonlist = this.passedPSearches;
    } else {
      const searchlabel = this.sharedfunctionObj.getitemfromLocalStorage('srchLabels');
      this.jsonlist = searchlabel.all.labels;
    }
    console.log(this.jsonlist);
  }

  popularClicked(kw) {
    this.searchpopularmoreclick.emit(kw);
  }
}
