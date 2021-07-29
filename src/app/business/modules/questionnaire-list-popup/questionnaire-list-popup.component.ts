import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-questionnaire-list-popupl',
  templateUrl: './questionnaire-list-popup.component.html',
  styleUrls: ['./questionnaire-list-popup.component.css', '../../../../assets/css/style.bundle.css']
})
export class QuestionnaireListPopupComponent implements OnInit {
  questionnaires: any = [];
  loading = true;
  selectedQnr;
  qParams;
  qnrStatuses = {
    released: 'Released',
    submitted: 'Submitted',
    unreleased: 'Unreleased'
  }
  releasedQnrs: any = [];
  constructor(public dialogRef: MatDialogRef<QuestionnaireListPopupComponent>,
    private providerServices: ProviderServices,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private activateRoute: ActivatedRoute,
    private location: Location,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.activateRoute.queryParams.subscribe(params => {
      this.qParams = params;
      if (this.qParams.releasedQnr) {
        this.releasedQnrs = JSON.parse(this.qParams.releasedQnr);
      }
      if (this.qParams.source === 'appt') {
        this.getApptQuestionnaires();
      } else if (this.qParams.source === 'checkin') {
        this.getWaitlistQuestionnaires();
      }
    });
  }

  ngOnInit() {
    this.selectedQnr = this.data.selectedQnr;
  }
  getWaitlistQuestionnaires() {
    this.providerServices.getWaitlistQuestionnaireByUid(this.qParams.uid).subscribe(data => {
      this.questionnaires = data;
      this.loading = false;
    });
  }
  getApptQuestionnaires() {
    this.providerServices.getApptQuestionnaireByUid(this.qParams.uid).subscribe(data => {
      this.questionnaires = data;
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
        this.providerServices.changeQnrReleaseStatus(status, this.qParams.uid, id).subscribe(data => {
          if (this.qParams.source === 'appt') {
            this.getApptQuestionnaires();
          } else if (this.qParams.source === 'checkin') {
            this.getWaitlistQuestionnaires();
          }
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
  viewQnr(qnr?) {
    const dialogrefd = this.dialog.open(QuestionnaireListPopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        selectedQnr: qnr
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  gotoPrev() {
    this.location.back();
  }
}
