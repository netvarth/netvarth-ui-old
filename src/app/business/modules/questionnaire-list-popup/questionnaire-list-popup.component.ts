import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-questionnaire-list-popupl',
  templateUrl: './questionnaire-list-popup.component.html',
  styleUrls: ['./questionnaire-list-popup.component.css']
})
export class QuestionnaireListPopupComponent implements OnInit {
  questionnaires: any = [];
  loading = true;
  selectedQnr;
  constructor(public dialogRef: MatDialogRef<QuestionnaireListPopupComponent>,
    private providerServices: ProviderServices,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    console.log(this.selectedQnr);
    this.getQuestionnaires();
  }
  getQuestionnaires() {
    this.providerServices.getAllQuestionnaire().subscribe(data => {
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
        const uid = (this.data.source === 'appt') ? this.data.waitlist.uid : this.data.waitlist.ynwUuid;
        this.providerServices.changeQnrReleaseStatus(status, uid, id).subscribe(data => {
          this.questionnaires = data;
          this.loading = false;
          this.snackbarService.openSnackBar('questionnaire ' + statusmsg + 'd', { 'panelclass': 'snackbarerror' });
          this.closeDialog();
        }, error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
      }
    });
  }
  getQnrStatus(id) {
    const qnrStatus = this.data.waitlist.releasedQnr.filter(qnr => qnr.id === id);
    if (qnrStatus[0] && qnrStatus[0].status && qnrStatus[0].status !== 'submitted') {
      return qnrStatus[0].status;
    }
  }
  viewQnr(qnr?) {
    this.selectedQnr = qnr;
    console.log(this.selectedQnr);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
