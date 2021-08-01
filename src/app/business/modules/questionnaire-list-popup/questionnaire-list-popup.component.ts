import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-questionnaire-list-popup',
  templateUrl: './questionnaire-list-popup.component.html',
  styleUrls: ['./questionnaire-list-popup.component.css', '../../../../assets/css/style.bundle.css']
})
export class QuestionnaireListPopupComponent implements OnInit {
  @Input() source;
  @Input() uid;
  @Input() type;
  @Input() waitlist_data;
  releasedQnrs: any = [];
  questionnaires: any = [];
  loading = true;
  selectedQnr;
  qnrStatuses = {
    released: 'Released',
    submitted: 'Submitted',
    unReleased: 'Unreleased'
  }
  constructor(public dialogRef: MatDialogRef<QuestionnaireListPopupComponent>,
    private providerServices: ProviderServices,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private sharedFunctions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.activateRoute.queryParams.subscribe(params => {
      console.log('params', params);
      if (params.source) {
        this.source = params.source;
      }
      if (params.uid) {
        this.uid = params.uid;
      }
      if (params.releasedQnr) {
        this.releasedQnrs = JSON.parse(params.releasedQnr);
      }
      if (params.source === 'appt') {
        this.getApptDetails();
      } else if (params.source === 'checkin') {
        this.getWaitlistDetail();
      }
    });
  }

  ngOnInit() {
    console.log('this.source', this.source)
    if (this.source === 'appt') {
      this.getApptQuestionnaires();
    } else if (this.source === 'checkin') {
      this.getWaitlistQuestionnaires();
    }
    this.selectedQnr = this.data.selectedQnr;
    if (this.waitlist_data && this.waitlist_data.releasedQnr) {
      this.releasedQnrs = this.waitlist_data.releasedQnr;
    }
  }
  getWaitlistDetail() {
    this.providerServices.getProviderWaitlistDetailById(this.uid)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.releasedQnrs = this.waitlist_data.releasedQnr;
        });
  }

  getApptDetails() {
    this.providerServices.getAppointmentById(this.uid)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.releasedQnrs = this.waitlist_data.releasedQnr;
        });
  }
  getWaitlistQuestionnaires() {
    this.providerServices.getWaitlistQuestionnaireByUid(this.uid).subscribe(data => {
      this.questionnaires = data;
      console.log('this.questionnaires', this.questionnaires);
      this.loading = false;
    });
  }
  getApptQuestionnaires() {
    this.providerServices.getApptQuestionnaireByUid(this.uid).subscribe(data => {
      this.questionnaires = data;
      console.log('this.questionnaires', this.questionnaires);
      this.loading = false;
    });
  }
  changeReleaseStatus(id) {
    const statusmsg = (this.getQnrStatus(id) === 'released') ? 'unrelease' : 'release';
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to ' + statusmsg + ' this questionnaire?',
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        const status = (this.getQnrStatus(id) === 'unReleased') ? 'released' : 'unReleased';
        this.providerServices.changeQnrReleaseStatus(status, this.uid, id).subscribe(data => {
          this.loading = true;
          this.sharedFunctions.sendMessage({ type: 'reload' });
          this.snackbarService.openSnackBar('questionnaire ' + statusmsg + 'd', { 'panelclass': 'snackbarerror' });
        }, error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
      }
    });
  }
  getQnrStatus(id) {
    const qnrStatus = this.releasedQnrs.filter(qnr => qnr.id === id);
    if (qnrStatus[0] && qnrStatus[0].status) {
      return qnrStatus[0].status;
    }
  }
  viewQnr(qnr, status) {
    if (status === 'submitted') {
      const questionnaire = this.waitlist_data.questionnaires.filter(quest => quest.questionnaireId === qnr.id);
      if (questionnaire[0]) {
        qnr = questionnaire[0];
      }
    }
    const dialogrefd = this.dialog.open(QuestionnaireListPopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'telegramPopupClass'],
      disableClose: true,
      data: {
        selectedQnr: qnr,
        status: status,
        waitlistStatus: (this.waitlist_data.waitlistStatus) ? this.waitlist_data.waitlistStatus : this.waitlist_data.apptStatus
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      this.loading = true;
      if (result === 'reload') {
        this.sharedFunctions.sendMessage({ type: 'reload' });
      }
    });
  }
  closeDialog(type?) {
    this.dialogRef.close(type);
  }
  gotoPrev() {
    this.location.back();
  }
  getQuestionAnswers(event) {
    if (event === 'reload') {
      this.closeDialog('reload');
    }
  }
}
