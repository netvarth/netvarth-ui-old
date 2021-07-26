import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-questionnaire-list-popupl',
  templateUrl: './questionnaire-list-popup.component.html',
  styleUrls: ['./questionnaire-list-popup.component.css']
})
export class QuestionnaireListPopupComponent implements OnInit {
  questionnaires: any = [];
  loading = true;
  constructor(public dialogRef: MatDialogRef<QuestionnaireListPopupComponent>,
    private providerServices: ProviderServices,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.getQuestionnaires();
  }
  getQuestionnaires() {
    this.providerServices.getAllQuestionnaire().subscribe(data => {
      this.questionnaires = data;
      this.loading = false;
    });
  }
  changeReleaseStatus(id) {
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to ' + (this.getQnrStatus(id) === 'released') ? 'nnrelease' : 'release' + ' this questionnaire?',
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      const status = (this.getQnrStatus(id) === 'unReleased') ? 'released' : 'unReleased';
      this.providerServices.changeQnrReleaseStatus(status, this.data.waitlist.ynwUuid, id).subscribe(data => {
        this.questionnaires = data;
        this.loading = false;
      });
    });
  }
  getQnrStatus(id) {
    const qnrStatus = this.data.waitlist.releasedQnr.filter(qnr => qnr.id === id);
    if (qnrStatus[0]) {
      return qnrStatus[0].status;
    }
  }
  viewQnr() {

  }
}
