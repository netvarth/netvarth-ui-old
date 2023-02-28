import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../shared/confirm-box/confirm-box.component';
import { ProviderServices } from '../../services/provider-services.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ReleaseQuestionnaireComponent } from './release-questionnaire/release-questionnaire.component';

@Component({
  selector: 'app-questionnaire-list-popup',
  templateUrl: './questionnaire-list-popup.component.html',
  styleUrls: ['./questionnaire-list-popup.component.css']
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
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.activateRoute.queryParams.subscribe(params => {
      if (params.source) {
        this.source = params.source;
      }
      if (params.uid) {
        this.uid = params.uid;
      }
      if (params.source === 'appt') {
        this.getApptDetails();
      } else if (params.source === 'checkin') {
        this.getWaitlistDetail();
      }
      else if (params.source === 'order') {
        this.getOrderDetail();
      }
    });
  }

  ngOnInit() {
    if (this.source === 'appt') {
      this.getApptQuestionnaires();
    } else if (this.source === 'checkin') {
      this.getWaitlistQuestionnaires();
    }
    else if (this.source === 'order') {
      this.getOrderQuestionnaires();
    }
    // this.selectedQnr = this.data.selectedQnr;
    
  }
  getWaitlistDetail() {
    this.providerServices.getProviderWaitlistDetailById(this.uid)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.releasedQnrs = this.waitlist_data.releasedQnr;
          this.loading = false;
        });
  }
  getOrderDetail() {
    this.providerServices.getProviderOrderDetailById(this.uid)
      .subscribe(
        data => {
          this.waitlist_data = data;
          console.log('waitlist_data' ,  this.waitlist_data)
          this.releasedQnrs = this.waitlist_data.releasedQnr;
          this.loading = false;
        });
  }
  getApptDetails() {
    this.providerServices.getAppointmentById(this.uid)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.releasedQnrs = this.waitlist_data.releasedQnr;
          this.loading = false;
        });
  }
  getWaitlistQuestionnaires() {
    this.providerServices.getWaitlistQuestionnaireByUid(this.uid).subscribe(data => {
      this.setQuestionaireList(data);
      // this.questionnaires = data;
      // this.loading = false;
    });
  }
  getOrderQuestionnaires() {
    this.providerServices.getOrderQuestionnaireByUid(this.uid).subscribe(data => {
      this.setQuestionaireList(data);
      // this.questionnaires = data;
      // this.loading = false;
    });
  }
  getApptQuestionnaires() {
    this.providerServices.getApptQuestionnaireByUid(this.uid).subscribe(data => {
      this.setQuestionaireList(data);
      // this.questionnaires = data;
      // this.loading = false;
    });
  }
  setQuestionaireList(questionaireGeneral: any) {
    
    let questionaires = [];
    console.log("questionaireGeneral", questionaireGeneral);
    for(let  i=0; i< questionaireGeneral.length; i++) {      
      const questionnaire = this.waitlist_data.questionnaires.filter(quest => quest.questionnaireId === questionaireGeneral[i].id);
      console.log(questionnaire);
      if (questionnaire[0]) {
        questionaires.push(questionnaire[0]);
      } else {
        questionaires.push(questionaireGeneral[i]);
      }
    }
    this.questionnaires = questionaires;
    console.log("Questionaries", this.questionnaires);
    this.loading = false;
  }
  changeMode(qnr) {
    qnr['edit'] = !qnr['edit'];
  }
  changeReleaseStatus(id, event) {
    event.preventDefault();
    let isEmail;
    let isPhone;
    if (this.source === 'appt') {
      isEmail = (this.waitlist_data.providerConsumer.email) ? true : false;
      isPhone = (this.waitlist_data.providerConsumer.phoneNo && this.waitlist_data.providerConsumer.phoneNo.trim() !== '') ? true : false;
    } else if(this.source === 'checkin') {
      isEmail = (this.waitlist_data.waitlistingFor[0].email) ? true : false;
      isPhone = (this.waitlist_data.consumer.phoneNo) ? true : false;
    }
    else if(this.source === 'order'){
      isEmail = (this.waitlist_data.email) ? true : false;
      isPhone = (this.waitlist_data.phoneNumber) ? true : false;
    }
    const statusmsg = (this.getQnrStatus(id) === 'released') ? 'unrelease' : 'release';
    if (this.getQnrStatus(id) === 'released' || (!isEmail && !isPhone)) {
      const confirmdialogref = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Do you want to ' + statusmsg + ' this questionnaire?',
          'type': 'yes/no'
        }
      });
      confirmdialogref.afterClosed().subscribe(result => {
        if (result) {
          this.changeQnrReleaseStatus(id, statusmsg);
        }
      });
    } else {
      const dialogrefd = this.dialog.open(ReleaseQuestionnaireComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          waitlist_data: this.waitlist_data,
          source: this.source,
          qnrId: id,
          isEmail: isEmail,
          isPhone: isPhone
        }
      });
      dialogrefd.afterClosed().subscribe(result => {
        if (result === 'reload') {
          this.loading = true;
          if (this.source === 'checkin') {
            this.getWaitlistDetail();
          } else if (this.source === 'appt') {
            this.getApptDetails();
          }
          else if (this.source === 'order') {
            this.getOrderDetail();
          }
        }
      });
    }
  }
  changeQnrReleaseStatus(id, statusmsg) {
    const status = (this.getQnrStatus(id) === 'unReleased') ? 'released' : 'unReleased';
    if (this.source === 'checkin') {
      this.providerServices.changeWaitlistQnrReleaseStatus(status, this.uid, id).subscribe(data => {
        this.loading = true;
        this.getWaitlistDetail();
        this.snackbarService.openSnackBar('questionnaire ' + statusmsg + 'd', { 'panelclass': 'snackbarerror' });
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    } else if(this.source === 'appt'){
      this.providerServices.changeApptQnrReleaseStatus(status, this.uid, id).subscribe(data => {
        this.loading = true;
        this.getApptDetails();
        this.snackbarService.openSnackBar('questionnaire ' + statusmsg + 'd', { 'panelclass': 'snackbarerror' });
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    }
    else if(this.source === 'order'){
      this.providerServices.changeOrderQnrReleaseStatus(status, this.uid, id).subscribe(data => {
        this.loading = true;
        this.getOrderDetail();
        this.snackbarService.openSnackBar('questionnaire ' + statusmsg + 'd', { 'panelclass': 'snackbarerror' });
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    }
  }
  getQnrStatus(id) {
    console.log("Released Qnr", this.releasedQnrs)
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
      if (result === 'reload') {
        this.loading = true;
        if (this.source === 'appt') {
          this.getApptDetails();
        } else if (this.source === 'checkin') {
          this.getWaitlistDetail();
        }
        else if (this.source === 'order') {
          this.getOrderDetail();
        }
      }
    });
  }
  closeDialog(type?) {
    this.dialogRef.close(type);
  }
  gotoPrev() {
    this.location.back();
  }
  reload() {
    if (this.source === 'appt') {
      this.getApptDetails();
    } else if (this.source === 'checkin') {
      this.getWaitlistDetail();
    }
    else if (this.source === 'order') {
      this.getOrderDetail();
    }
  }
  getQuestionAnswers(event) {
    alert(event);
    this.reload();
    // if (event === 'reload') {
    //   this.closeDialog('reload');
    // }
  }
}
