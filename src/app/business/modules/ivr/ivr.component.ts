import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { IvrService } from './ivr.service';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { ConfirmBoxComponent } from '../../shared/confirm-box/confirm-box.component';

@Component({
  selector: 'app-ivr',
  templateUrl: './ivr.component.html',
  styleUrls: ['./ivr.component.css']
})
export class IvrComponent implements OnInit {
  user: any;
  capabilities: any;
  lineChartOptions: any;
  lineChartData: any;
  doughnutChartData: any;
  doughnutChartOptions: any;
  calls: any;
  totalCallsCount: any = 0;
  statusDisplayName: any;
  ivrCallsStatus = projectConstantsLocal.IVR_CALL_STATUS;
  customers: any;
  customerMoreActionMenuItems: MenuItem[];
  customer_label: any;
  connectedCallsCount: any = 0;
  missedCallsCount: any = 0;
  graphData: any;
  onGoingCall: any;
  statusDropdownClicked: any = false;
  usersDialogRef: any;
  users: any;
  confirmBoxRef: any;
  constructor(
    private groupService: GroupStorageService,
    private ivrService: IvrService,
    private snackbarService: SnackbarService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private wordProcessor: WordProcessor,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.getIvrCalls();
    this.getCustomers();
    this.getIvrCallsCount();
    this.getIvrMissedCallsCount();
    this.getIvrConnectedCallsCount();
    this.getGraphDetails('WEEKLY').then((data) => {
      if (data) {
        this.getAnalyticsChartOptions();
      }
    });
    this.getOngoingCall();
    this.getUsers();
    this.primengConfig.ripple = true;
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

  loadCalls(event) {
    this.getIvrCallsCount()
    let api_filter = this.ivrService.setFiltersFromPrimeTable(event);
    if (api_filter) {
      this.getIvrCallsCount(api_filter)
      this.ivrService.getAllIvrCallsbyFilter(api_filter).subscribe((data: any) => {
        this.calls = data;
      })
    }
  }

  getUsers() {
    this.ivrService.getUsers().subscribe((data: any) => {
      this.users = data;
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


  getOngoingCall() {
    let api_filter = {};
    api_filter['callStatus-eq'] = "inCall";
    this.ivrService.getAllIvrCallsbyFilter(api_filter).subscribe((data: any) => {
      this.onGoingCall = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  getGraphDetails(category) {
    return new Promise((resolve, reject) => {
      let data = {
        category: category
      }
      this.ivrService.getChartData(data).subscribe((data: any) => {
        this.graphData = data;
        resolve(this.graphData);
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        });
    })

  }

  viewCustomer(id) {
    this.router.navigate(['provider', 'customers', id])
  }

  editCustomer(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'edit',
        id: id
      }
    };
    this.router.navigate(['provider', 'customers', 'create'], navigationExtras)
  }

  createToken() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        checkin_type: 'WALK_IN_CHECKIN',
        calmode: "NoCalc",
        showtoken: true,
        source: 'ivr'
      }
    };
    this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras)
  }

  createPatient() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        source: 'clist',
        id: 'add',
        selectedGroup: 'all'
      }
    };
    this.router.navigate(['provider', 'customers', 'create'], navigationExtras)
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


  viewCall(uid) {
    this.router.navigate(['provider', 'ivr', 'call', uid]);
  }

  gotoMissedCalls() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'missed'
      }
    };
    this.router.navigate(['provider', 'ivr', 'calls'], navigationExtras)
  }

  gotoConnectedCalls() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'connected'
      }
    };
    this.router.navigate(['provider', 'ivr', 'calls'], navigationExtras)
  }


  gotoMyCalls() {
    this.router.navigate(['provider', 'ivr', 'calls'])
  }

  viewAllCustomers() {
    this.router.navigate(['provider', 'customers'])
  }

  getAnalyticsChartOptions() {
    this.lineChartData = {
      labels: this.graphData && this.graphData.labels,
      datasets: this.graphData && this.graphData.datasets
    }


    this.lineChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#1E4079'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#1E4079'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            precision: 0,
            color: '#1E4079'
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
    };
  }

  getIvrCalls() {
    this.ivrService.getAllIvrCalls().subscribe((data: any) => {
      this.calls = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  getIvrCallsbyFilter(filter) {
    this.ivrService.getAllIvrCallsbyFilter(filter).subscribe((data: any) => {
      this.calls = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  getIvrCallsCount(filter = {}) {
    this.ivrService.getIvrCallsCount(filter).subscribe((data: any) => {
      this.totalCallsCount = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  getIvrMissedCallsCount() {
    let filter = {
      "callStatus-eq": 'missed'
    }
    this.ivrService.getIvrCallsCount(filter).subscribe((data: any) => {
      this.missedCallsCount = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  getIvrConnectedCallsCount() {
    let filter = {
      "callStatus-eq": 'connected'
    }
    this.ivrService.getIvrCallsCount(filter).subscribe((data: any) => {
      this.connectedCallsCount = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  statusChange(event) {
    let api_filter = {}
    if (event.value.name == 'All') {
      this.getIvrCallsbyFilter(api_filter);
    }
    else {
      if (event.value.name) {
        api_filter['callStatus-eq'] = event.value.name;
      }
      this.getIvrCallsbyFilter(api_filter);
    }
  }


  getCustomers() {
    this.ivrService.getCustomers().subscribe((data: any) => {
      this.customers = data;
    });
  }



}
