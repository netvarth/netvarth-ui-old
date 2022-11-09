import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProviderServices } from '../../services/provider-services.service';


@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  user: any;
  headerName: string = ''
  filter_sidebar: any;
  statusList: FormGroup;
  selectedLabels: any;
  filterapplied = false;
  labelFilterData: any;
  branches: any
  filter = {
    firstName: '',
    id: '',
    lastName: '',
    date: ''
  };
  filters: any;
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  loading: any;
  config: any;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: 10
  };
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    // private location: Location,
    private providerServices: ProviderServices,
    private statusListFormBuilder: FormBuilder,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    this.statusList = this.statusListFormBuilder.group({
      status: [null]
    });


    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getBranches()

  }

  getBranches() {
    this.providerServices.getBranches().subscribe((data: any) => {
      this.branches = data;
      console.log("Branches",this.branches);
    });
  }


  statusChange(event) {
    if (event.value == 'All') {
      this.getBranches();
    }
    else {
      let api_filter = {}
      if (event.value == 'Rejected') {
        api_filter['applicationStatus-eq'] = event.value;
      }
      else {
        api_filter['spInternalStatus-eq'] = event.value;
      }
      this.getBranchesByFilter(api_filter);
    }
  }


  goBack() {
    this.router.navigate(['provider', 'cdl']);
    // this.location.back();
  }

  loanDetails(id) {
    this.router.navigate(['provider', 'cdl', 'loans', id]);
  }

  setFilterForApi() {
    const api_filter = {};
    if (this.filter.firstName !== '') {
      api_filter['customerFirstName-eq'] = this.filter.firstName;
    }
    if (this.filter.id !== '') {
      api_filter['id-eq'] = this.filter.id;
    }

    if (this.filter.date !== '') {
      api_filter['createdDate-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.date);
    }
    return api_filter;
  }


  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }

  resetFilter() {
    this.labelFilterData = '';
    this.selectedLabels = [];
    this.filters = {
      'firstName': false,
      'id': false,
      'lastName': false,
      'date': false
    };
    this.filter = {
      id: '',
      firstName: '',
      lastName: '',
      date: ''
    };
    this.getBranches()
  }



  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
  }


  keyPress() {
    if (this.filter.id || this.filter.firstName || this.filter.lastName || this.filter.date) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }



  doSearch() {
    let api_filter = this.setFilterForApi();
    this.getBranchesByFilter(api_filter);
  }


  getBranchesByFilter(filter) {
    this.providerServices.getBranchesByFilter(filter).subscribe((data: any) => {
      this.branches = data;
      console.log("this.branches", this.branches)
    })
  }

}