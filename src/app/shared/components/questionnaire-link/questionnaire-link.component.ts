import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { SharedFunctions } from '../../functions/shared-functions';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-questionnaire-link',
  templateUrl: './questionnaire-link.component.html',
  styleUrls: ['./questionnaire-link.component.css']
})
export class QuestionnaireLinkComponent implements OnInit {
  loading = true;
  questionnaire: any = [];
  waitlist: any = [];
  qParams;
  source;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  qnrStatus;
  constructor(public sharedFunctionobj: SharedFunctions,
    private sharedServices: SharedServices,
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private dateTimeProcessor: DateTimeProcessor) {
    this.activated_route.params.subscribe(
      (qParams) => {
        console.log(this.sharedFunctionobj.checkLogin())
        this.qParams = qParams;
        if (!this.qParams.type) {
          if (this.sharedFunctionobj.checkLogin()) {
            this.getDetails();
          } else {
            this.doLogin();
          }
        }
      });
  }
  ngOnInit(): void {
  }
  getDetails() {
    console.log(this.qParams);
    console.log(this.source);
    if (this.qParams.uid.split('_')[1] === 'appt') {
      this.source = 'consAppt';
      this.getApptDetails();
    } else {
      this.source = 'consCheckin';
      this.getCheckinDetails();
    }
  }
  doLogin() {
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: 'consumer',
        is_provider: false,
        test_account: true,
        moreparams: { source: 'qnrlink', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result === 'success') {
        this.getDetails();
      } else {
        this.doLogin();
      }
    });
  }
  getCheckinDetails() {
    this.sharedServices.getCheckinByConsumerUUID(this.qParams.uid, this.qParams.accountId).subscribe(
      (data) => {
        this.waitlist = data;
        this.getWaitlistReleasedQnrs();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  getApptDetails() {
    this.sharedServices.getAppointmentByConsumerUUID(this.qParams.uid, this.qParams.accountId).subscribe(
      (data) => {
        this.waitlist = data;
        this.getApptReleasedQnrs();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  getWaitlistReleasedQnrs() {
    this.sharedServices.getWaitlistQuestionnaireByUid(this.qParams.uid, this.qParams.accountId)
      .subscribe(
        (data: any) => {
          this.questionnaire = data.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
          const qnrWithStatus = this.waitlist.releasedQnr.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
          console.log('this.questionnaire', this.questionnaire);
          console.log(qnrWithStatus);
          this.qnrStatus = qnrWithStatus[0].status;
          this.loading = false;
        },
        error => {
          alert('error')
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getApptReleasedQnrs() {
    this.sharedServices.getApptQuestionnaireByUid(this.qParams.uid, this.qParams.accountId)
      .subscribe(
        (data: any) => {
          this.questionnaire = data.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
          const qnrWithStatus = this.waitlist.releasedQnr.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
          console.log('this.questionnaire', this.questionnaire);
          console.log(qnrWithStatus);
          this.qnrStatus = qnrWithStatus[0].status;
          this.loading = false;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getQuestionAnswers(event) {
    console.log(event);
    if (event === 'reload') {
      this.router.navigate(['questionnaire', this.qParams.uid, this.qParams.id, this.qParams.accountId, 'success']);
    }
  }
  getSingleTime(slot) {
    if (slot) {
      const slots = slot.split('-');
      return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
  }
}
