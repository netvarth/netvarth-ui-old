import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { IvrService } from '../ivr.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';

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
  usersDialogRef: any;
  users: any;
  confirmBoxRef: any;
  constructor(
    private router: Router,
    private ivrService: IvrService,
    private snackbarService: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupStorageService,
    private dialog: MatDialog
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

    this.getUsers();
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

    this.confirmBoxRef = this.dialog.open(ConfirmBoxComponent, {
      width: "30%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        message: "Do you really want to Unassign User for this call ? "
      }
    });
    this.confirmBoxRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 1) {
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
      }
    });


  }

  viewCall(uid) {
    this.router.navigate(['provider', 'ivr', 'call', uid]);
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

  getUsers() {
    this.ivrService.getUsers().subscribe((data: any) => {
      this.users = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  markAsComplete(uid) {
    this.ivrService.markAsComplete(uid).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Call Marked As Completed Successfully");
        this.ngOnInit();
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  openUsersPopup(uid) {
    this.usersDialogRef = this.dialog.open(PopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: 'users',
        users: this.users
      }
    });
    this.usersDialogRef.afterClosed().subscribe(userData => {
      if (userData) {
        let data = {
          "uid": uid,
          "userType": "PROVIDER"
        }
        let msg = "User Assigned to this Call Successfully";

        if (userData && userData.id) {
          data['userId'] = userData.id;
        }

        if (userData && userData.assignMyself) {
          data['userId'] = this.user.id;
          msg = "You are Assigned to this Call Successfully";
        }


        this.ivrService.assignToCall(data).subscribe((response: any) => {
          if (response) {
            this.snackbarService.openSnackBar(msg)
            this.ngOnInit();
          }
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
    });
  }

  getCallBack(uid) {
    this.ivrService.createCallBack(uid).subscribe((response: any) => {
      if (response) {
        this.snackbarService.openSnackBar("Callback Created Successfully")
        this.ngOnInit();
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }
}
