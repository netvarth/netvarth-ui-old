import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { IvrService } from '../ivr.service';
import { PopupComponent } from '../popup/popup.component';
// import { Location } from '@angular/common';
import { RemarksComponent } from '../remarks/remarks.component';
import * as moment from 'moment';
@Component({
  selector: 'app-details-collect',
  templateUrl: './details-collect.component.html',
  styleUrls: ['./details-collect.component.css']
})
export class DetailsCollectComponent implements OnInit {
  callUid: any;
  callData: any;
  callHistories: any;
  customerDetails: any;
  usersDialogRef: any;
  user: any;
  users: any;
  confirmBoxRef: any;
  customerDetailsPanel: any;
  callHistoryPanel: any;
  remarksPanel: any;
  customerCallHistory: any;
  type: any;
  ivrQuestionnaire: any;
  questionAnswers: any;
  qnr: any;
  showEditQnr: any = false;
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private ivrService: IvrService,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private groupService: GroupStorageService,
    // private location: Location
  ) {

  }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.callUid = params.id;
          this.ivrService.getAllIvrCallsByUid(params.id).subscribe((data) => {
            this.callData = data;
            if (this.callData && this.callData.questionnaires && this.callData.questionnaires[0] && this.callData.questionnaires[0].questionAnswers) {
              this.questionAnswers = this.callData.questionnaires[0].questionAnswers;
              this.qnr = this.callData.questionnaires[0];
              console.log("this.qnr", this.qnr)
            }
            if (this.callData && this.callData.userCallHistories) {
              this.callHistories = this.callData.userCallHistories;
            }
            if (this.callData && this.callData.consumerId) {
              this.getCustomerDetails(this.callData.consumerId);
              this.getCustomerCallHistory(this.callData.consumerId);
            }
          });
        }
      }
    })

    this.getQuestionnaire();

    this.ActivatedRoute.queryParams.subscribe((params) => {
      if (params) {
        if (params && params.type) {
          this.type = params.type;
        }
      }
    })

    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getUsers();
  }

  getQuestionnaire() {
    this.ivrService.getIvrQuestionnaire().subscribe((data) => {
      this.ivrQuestionnaire = data;
      console.log("this.ivrQuestionnaire", this.ivrQuestionnaire)
    });
  }

  getCustomerCallHistory(id) {
    let api_filter = {};
    api_filter['consumerId-eq'] = id;
    api_filter['callStatus-eq'] = "callCompleted";

    this.ivrService.getAllIvrCallsbyFilter(api_filter).subscribe((data) => {
      this.customerCallHistory = data;
    });

  }

  getQuestionAnswers(event) {
    this.questionAnswers = event;
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

  resetErrors() {

  }

  goBack() {
    // this.location.back()
    this.router.navigate(['provider','ivr'])
  }

  saveCustomerDetails() {
    this.snackbarService.openSnackBar("Details Saved Successfully");
    this.customerDetailsPanel = false;
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
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'details'
      }
    };
    this.router.navigate(['provider', 'ivr']).then(()=>{
    this.router.navigate(['provider', 'ivr', 'details', uid], navigationExtras)
    })
  }



  callDetails(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'details'
      }
    };
    this.router.navigate(['provider', 'ivr', 'details', id], navigationExtras)
  }



  getCustomerDetails(id) {
    this.ivrService.getCustomerById(id).subscribe((data) => {
      this.customerDetails = data;
    })
  }

  getUsers() {
    this.ivrService.getUsers().subscribe((data: any) => {
      this.users = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  editCustomer(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: "edit",
        id: id
      }
    };
    this.router.navigate(['provider', 'customers', 'create'], navigationExtras);
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


  validateQuestionnaire(src?) {
    if (!this.questionAnswers) {
      this.questionAnswers = {
        answers: {
          answerLine: [],
          questionnaireId: this.ivrQuestionnaire.id
        }
      }
    }
    if (this.questionAnswers.answers) {
      this.ivrService.validateProviderQuestionnaire(this.questionAnswers.answers).subscribe((data: any) => {
        if (data.length === 0) {
          this.submitQuestionnaire(this.questionAnswers.answers, src);
        }
        else {
          this.snackbarService.openSnackBar("Please Fill All Required Fields", { 'panelClass': 'snackbarerror' });
        }
        // this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    }
  }

  submitQuestionnaire(data, src?) {
    this.ivrService.submitQuestionnaire(this.callUid, this.questionAnswers.answers).subscribe((data: any) => {
      this.snackbarService.openSnackBar("Details Saved Successfully");
      if (!src) {
        this.callDetails(this.callUid);
      }
      else if (src && src == 'details') {
        this.ngOnInit();
        this.showEditQnr = !this.showEditQnr;
      }
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    });
  }

  editQnr() {
    this.showEditQnr = !this.showEditQnr
  }



  addRemarks() {
    const dialogRef = this.dialog.open(RemarksComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks,
            attachments: null
          }
          console.log("notes", notes);
          this.ivrService.addIvrCallRemarks(this.callUid, notes).subscribe((data: any) => {
            this.snackbarService.openSnackBar("Remarks Saved Successfully");
            this.ngOnInit();
          }, (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
        }
      });
  }


  formatDate(date) {
    let newDate = new Date(date);
    return moment(newDate).format('MMMM Do YYYY, h:mm:ss a');
  }
}
