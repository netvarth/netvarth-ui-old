import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit,OnDestroy {

  breadcrumbs = [
    {
      title: 'My Jaldee',
      url: '/consumer'
    },
    {
      title: 'Payment'
    }
  ];
  infoParams;
  appointment: any = [];
  path = projectConstants.PATH;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  email;
  apiloading = false;
  provider_label;
  type = 'appt';
  private subs=new SubSink();
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public sharedFunctionobj: SharedFunctions,
    private wordProcessor: WordProcessor, private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor) {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.subs.sink=this.route.queryParams.subscribe(
      params => {
        this.infoParams = params;
        if (params.uuid && params.account_id) {
         this.subs.sink= this.shared_services.getAppointmentByConsumerUUID(params.uuid, params.account_id).subscribe(
            (appt: any) => {
              this.appointment = appt;
              this.apiloading = false;
            });
        }
        if (params.type) {
          this.type = params.type;
        }
      });
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  okClick() {
    this.lStorageService.setitemonLocalStorage('orderStat', false);
    if (this.appointment.service.livetrack && this.type !== 'reschedule') {
      this.router.navigate(['consumer', 'appointment', 'track', this.infoParams.uuid], { queryParams: { account_id: this.infoParams.account_id } });
    } else {
      this.router.navigate(['consumer']);
    }
  }
  getSingleTime(slot) {
    if (slot) {
      const slots = slot.split('-');
      return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
  }
  updateEmail() {
    console.log(this.email);
  }
}
