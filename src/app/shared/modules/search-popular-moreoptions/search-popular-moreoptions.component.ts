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
  @Output() searchpopularmoreclick = new EventEmitter<any>();

  constructor(public sharedfunctionObj: SharedFunctions) { }
  ngOnInit() {

    //  Sub Domains
    // for (let i = 0; i < this.passedPSearches.label.length; i++) {
    //   const query = this.passedPSearches.label[i].domain;
    //   this.sector = query.split('\'');  // Spliting the query to get sector only
    //   this.domain_list = this.sharedfunctionObj.getitemfromLocalStorage('ynw-bconf');
    //   for (let j = 0; j < this.domain_list.bdata.length; j++) {
    //     const dom = this.domain_list.bdata[j].domain
    //     if (dom === this.sector[1]) {
    //       this.passedPSearches.label[i].domain = this.passedPSearches.label[i].domain.replace(this.passedPSearches.label[i].domain, this.domain_list.bdata[j].displayName); // Replacing the domain name to it's display name
    //     }
    //   }
    // }

    // Specializations
    // for (let i = 0; i < this.passedPSearches.special.length; i++) {
    //   const query = this.passedPSearches.special[i].domain;
    //   this.sector = query.split('\'');
    //   this.domain_list = this.sharedfunctionObj.getitemfromLocalStorage('ynw-bconf');
    //   for (let j = 0; j < this.domain_list.bdata.length; j++) {
    //     const dom = this.domain_list.bdata[j].domain
    //     if (dom === this.sector[1]) {
    //       this.passedPSearches.special[i].domain = this.passedPSearches.special[i].domain.replace(this.passedPSearches.special[i].domain, this.domain_list.bdata[j].displayName);
    //     }
    //   }
    // }

    // Grouping the array by domain
    // var groupBy = function (xs, key) {
    //   return xs.reduce(function (rv, x) {
    //     (rv[x[key]] = rv[x[key]] || []).push(x);
    //     return rv;
    //   }, {});
    // };
    // this.jsonlist = [];
    // this.groubedByTeam1 = [];
    // this.groubedByTeam2 = [];
    // this.groubedByTeam1 = groupBy(this.passedPSearches.label, 'domain');
    // this.groubedByTeam2 = groupBy(this.passedPSearches.special, 'domain');

    // Merging the two arrays (sub domain and specialization) to one
    // function extend(obj, src) {
    //   for (var key in src) {
    //     if (src.hasOwnProperty(key)) {
    //       obj[key] = obj[key].concat(src[key]);
    //     }
    //   }
    //   return obj;
    // }
    // this.jsonlist = extend(this.groubedByTeam1, this.groubedByTeam2);




    const searchlabel = this.sharedfunctionObj.getitemfromLocalStorage('srchLabels');
    this.jsonlist = searchlabel.globalSearchLabels;
  }

  popularClicked(kw) {
    this.searchpopularmoreclick.emit(kw);
  }
  
}
