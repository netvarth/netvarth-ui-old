import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { IvrService } from '../ivr.service';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.css']
})
export class CallsComponent implements OnInit {
  loading: any = false;
  calls: any;
  statusDropdownClicked: any = false;
  statusDisplayName: any;
  ivrCallsCount: any;
  loanGlobalSearchActive: any = false;
  globalSearchValue: any;
  ivrCallsStatus = projectConstantsLocal.IVR_CALL_STATUS;
  statusType: any;
  user: any;

  constructor(
    private router: Router,
    private ivrService: IvrService,
    private snackbarService: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupStorageService
  ) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params && params.type) {
        this.statusType = params.type;
        this.statusDisplayName = { name: params.type, displayName: params.type + 'Calls' };
        this.statusChange({ value: { name: params.type } })
      }
    })
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (!this.statusType) {
      this.getIvrCalls();
    }
  }

  loadCalls(event) {
    this.getIvrCallsCount()
    let api_filter = this.ivrService.setFiltersFromPrimeTable(event);
    if (this.statusDropdownClicked) {
      if (this.statusDisplayName && this.statusDisplayName.name) {
        if (this.statusDisplayName.name != 'All' || this.statusType) {
          api_filter['callStatus-eq'] = this.statusDisplayName.name;
        }
      }
    }
    if (api_filter) {
      this.getIvrCallsCount(api_filter)
      this.ivrService.getAllIvrCallsbyFilter(api_filter).subscribe((data: any) => {
        this.calls = data;
      })
    }
  }


  loanGlobalSearch(globalSearchValue) {
    if (globalSearchValue != '') {
      this.loanGlobalSearchActive = true;
      let api_filter = {}
      api_filter['or=referenceNo-like'] = globalSearchValue + ',customerFirstName-like=' + globalSearchValue + ',partnerName-like=' + globalSearchValue;
      this.getIvrCallsbyFilter(api_filter);
      this.getIvrCallsCount(api_filter);
    }
  }

  statusChange(event) {
    let api_filter = {}
    this.statusDropdownClicked = true;
    if (event.value.name == 'All') {
      this.getIvrCallsbyFilter(api_filter);
    }
    else {
      if (event.value.name) {
        api_filter['callStatus-eq'] = event.value.name;
      }
      this.getIvrCallsbyFilter(api_filter);
    }
    this.getIvrCallsCount(api_filter);

  }


  getIvrCallsCount(filter = {}) {
    this.ivrService.getIvrCallsCount(filter).subscribe((data: any) => {
      this.ivrCallsCount = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  getIvrCalls() {
    this.ivrService.getAllIvrCalls().subscribe((data: any) => {
      this.calls = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  assignToCall(uid) {
    let data = {
      "uid": uid,
      "userType": "PROVIDER",
      "userId": this.user.id
    }

    this.ivrService.assignToCall(data).subscribe((response: any) => {
      if (response) {
        this.snackbarService.openSnackBar("You are Assigned to this Call Successfully")
        this.ngOnInit();
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }


  unassignToCall(uid) {
    let data = {
      "uid": uid,
      "userType": "PROVIDER",
      "userId": this.user.id
    }

    this.ivrService.unassignToCall(data).subscribe((response: any) => {
      if (response) {
        this.ngOnInit();
        this.snackbarService.openSnackBar("You are Unassigned to this Call Successfully")
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }

  gotoCustomersPage(id, uid) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        src: 'ivr',
        uid: uid
      }
    };
    this.router.navigate(['provider', 'customers', id], navigationExtras)
  }

  getIvrCallsbyFilter(filter) {
    this.ivrService.getAllIvrCallsbyFilter(filter).subscribe((data: any) => {
      this.calls = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  goBack() {
    this.router.navigate(['provider', 'ivr']);
  }

}
