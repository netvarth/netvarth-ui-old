import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SearchDetailServices } from '../../../shared/components/search-detail/search-detail-services.service'; //  ../search-detail/search-detail-services.service';

@Component({
  selector: 'app-search-moreoptions',
  templateUrl: './search-moreoptions.component.html'
})
export class SearchMoreOptionsComponent implements OnInit {

  more_search_opt = Messages.MORE_SEARCH_OPT_CAP;
  other_filters_cap = Messages.OTHER_FILTERS_CAP;
  search_cap = Messages.SEARCH_CAP;

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  @Input() passedRefine: any = [];
  @Output() searchmoreclick = new EventEmitter<any>();
  @Output() closemoreclick = new EventEmitter<any>();

  searchrefineresult_arr: any = [];

  obtainedaddons = false;
  upgradableaddons: any = [];
  selected_addon = '';
  selected_addondesc = '';
  searchrefine_arr: any = [];
  file_error_msg = '';
  rating = 2.8;
  ratingpassVal = '';
  constructor(
    public fed_service: FormMessageDisplayService,
    public sharedfunctionObj: SharedFunctions,
    private searchdetailserviceobj: SearchDetailServices
  ) {
  }

  ngOnInit() {
    this.getCommonFilters();
  }
  getCommonFilters() {
    if (this.passedRefine && this.passedRefine.length > 0) {
      this.searchrefine_arr = this.passedRefine;
    }
    if (this.searchrefine_arr.length === 0) {
      this.searchdetailserviceobj.getRefinedSearch('', '')
        .subscribe(data => {
          if (data['commonFilters']) {
            for (let i = 0; i < data['commonFilters'].length; i++) {
              if (data['commonFilters'][i].name === 'opennow') {
                data['commonFilters'][i].cloudSearchIndex = 'opennow';
              }
            }
            this.searchrefine_arr = data['commonFilters'];
          }
        });
    }
  }
  handle_morebuttonclick() {
    this.searchmoreclick.emit(this.searchrefineresult_arr);
    this.searchrefine_arr = [];
    /// this.dialogRef.close(this.searchrefineresult_arr);
  }

  // method which is invoked on clicking the checkboxes or boolean fields
  handle_optionclick(fieldname, fieldtype, selval) {
    if (fieldtype === 'Rating') {
      selval = '[' + selval + ',5]';
    }
    if (this.searchrefineresult_arr.length) {
      const sec_indx = this.check_fieldexistsinArray(fieldname);
      if (sec_indx === -1) {
        const curi = this.searchrefineresult_arr.length;
        this.searchrefineresult_arr[curi] = new Array();
        this.searchrefineresult_arr[curi][fieldname] = new Array();
        this.searchrefineresult_arr[curi][fieldname][0] = new Array(selval, fieldtype);
      } else {
        if (fieldtype === 'Rating') {  // if current field type is rating, then remove the rating already there
          this.searchrefineresult_arr[sec_indx][fieldname].splice(0, 1);
        }
        const chk_fieldvalexist = this.check_fieldvalexistsinArray(fieldname, selval);
        if (chk_fieldvalexist[0]['indx'] !== -1) {
          this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']][chk_fieldvalexist[0]['field']].splice(chk_fieldvalexist[0]['key'], 1);
          if (this.searchrefineresult_arr[chk_fieldvalexist[0]['indx']].length === 0) {
            this.searchrefineresult_arr.splice(chk_fieldvalexist[0]['indx'], 1);
          }
        } else {
          const curindx = this.searchrefineresult_arr[sec_indx][fieldname].length;
          if (fieldtype === 'Rating') {
            if (selval !== '') {
              this.ratingpassVal = selval;
              this.searchrefineresult_arr[sec_indx][fieldname][curindx] = new Array(selval, fieldtype);
            } else {
              this.ratingpassVal = '';
              this.searchrefineresult_arr.splice(sec_indx, 1); // removing the rating array element if rating is blank
            }
          } else {
            this.searchrefineresult_arr[sec_indx][fieldname][curindx] = new Array(selval, fieldtype);
          }
        }
      }
    } else {
      const curi = this.searchrefineresult_arr.length;
      this.searchrefineresult_arr[curi] = new Array();
      this.searchrefineresult_arr[curi][fieldname] = new Array();
      this.searchrefineresult_arr[curi][fieldname][0] = new Array(selval, fieldtype);
    }
  }

  // method which checks whether a fieldname already exists in the refineresult array
  check_fieldexistsinArray(fieldname) {
    let exists_indx = -1;
    for (let i = 0; i < this.searchrefineresult_arr.length; i++) {
      Object.keys(this.searchrefineresult_arr[i]).forEach(key => {
        if (key === fieldname) {
          exists_indx = i;
        }
      });
    }
    return exists_indx;
  }

  // method which checks whether a particular field value is already there in the refineresult array, if yes then returns the details
  check_fieldvalexistsinArray(fieldname, selval) {
    let ret_arr = [{ 'indx': -1, 'field': '', 'key': '' }];
    for (let i = 0; i < this.searchrefineresult_arr.length; i++) {
      for (const key in this.searchrefineresult_arr[i][fieldname]) {
        if (this.searchrefineresult_arr[i][fieldname][key][0] === selval) {
          ret_arr = [{ 'indx': i, 'field': fieldname, 'key': key }];
        }
      }
    }
    return ret_arr;
  }
  // method which checks whether atleast one field value exists for the current field
  check_atleasetonfieldvalexistsinArray(fieldname) {
    for (let i = 0; i < this.searchrefineresult_arr.length; i++) {
      for (const key in this.searchrefineresult_arr[i][fieldname]) {
        if (this.searchrefineresult_arr[i][fieldname][key][0] !== '') {
          return true;
        }
      }
    }
    return false;
  }
  handleratingClick(obj) {
    this.handle_optionclick(obj.cloudindex, 'Rating', obj.selectedrating);
  }
  // clickedoutside(e: Event) {
  //   this.closemoreclick.emit(e);
  // }
}
