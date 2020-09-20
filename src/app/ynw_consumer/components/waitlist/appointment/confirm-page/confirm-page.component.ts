import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit {
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
  email;
  apiloading = false;
  provider_label;
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public sharedFunctionobj: SharedFunctions) {
    this.provider_label = this.sharedFunctionobj.getTerminologyTerm('provider');
    this.route.queryParams.subscribe(
      params => {
        this.infoParams = params;
        if (params.uuid && params.account_id) {
          this.shared_services.getAppointmentByConsumerUUID(params.uuid, params.account_id).subscribe(
            (appt: any) => {
              this.appointment = appt;
              this.apiloading = false;
            });
        }
      });
  }

  ngOnInit() {
  }
  okClick() {
    if (this.appointment.service.livetrack) {
      this.router.navigate(['consumer', 'appointment', 'track', this.infoParams.uuid], { queryParams: { account_id: this.infoParams.account_id } });
    } else {
      this.router.navigate(['consumer']);
    }
  }
  getSingleTime(slot) {
    if (slot) {
      const slots = slot.split('-');
      return this.sharedFunctionobj.convert24HourtoAmPm(slots[0]);
    }
  }
  updateEmail() {
    console.log(this.email);
  }
}
