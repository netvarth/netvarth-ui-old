import { Component, OnInit, Input } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';

@Component({
  selector: 'app-lookup-status',
  templateUrl: './lookup-status.component.html'
})

export class LookupStatusComponent implements OnInit {

  @Input() passedInData: any = [];
  api_error = null;
  api_success = null;

  no_checkins_exists = Messages.NO_CHECKINS_EXISTS_CAP;

  user_id = null;
  uuid = null;
  message = '';
  source = null;
  loc: any = [];
  locid;
  changeOccured = false;
  waitlist: any = [];

  constructor(
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions) {

  }

  ngOnInit() {
    this.waitlist = this.passedInData.waitlist;
  }

  getStatus(stat, mod) {
    const retval = { class: '', caption: '' };
    switch (stat.waitlistStatus) {
      case 'checkedIn':
        retval.class = 'checkedin-class';
        retval.caption = 'Your Approximate Wait Time is ' + stat.appxWaitingTime + ' Mins';
        break;
      case 'started':
        retval.class = 'started-class';
        retval.caption = 'Started';
        break;
      case 'arrived':
        retval.class = 'arrived-class';
        retval.caption = 'Arrived';
        break;
      case 'done':
        retval.class = 'done-class';
        retval.caption = 'Done';
        break;
      case 'cancelled':
        retval.class = 'cancelled-class';
        retval.caption = 'Cancelled';
        break;
      default:
        retval.class = stat;
        retval.caption = stat;
        break;
    }
    if (mod === 'class') {
      return retval.class;
    } else {
      return retval.caption;
    }
  }
}
