import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { projectConstants } from '../../../../app.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records-datagrid',
  templateUrl: './records-datagrid.component.html',
  styleUrls: ['./records-datagrid.component.css']
})
export class RecordsDatagridComponent implements OnInit {
  @Input() records;
  @Input() heading;
  @Input() source;
  @Input() timeType;
  @Input() showMore;
  @Input() showToken;
  @Output() actionPerformed = new EventEmitter<any>();
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  waitlistModes = {
    WALK_IN_CHECKIN: 'Walk in Check-in',
    PHONE_CHECKIN: 'Phone in Check-in',
    ONLINE_CHECKIN: 'Online Check-in',
    WALK_IN_APPOINTMENT: 'Walk in Appointment',
    PHONE_IN_APPOINTMENT: 'Phone in Appointment',
    ONLINE_APPOINTMENT: 'Online Appointment'
  };
  tokenWaitlistModes = {
    WALK_IN_CHECKIN: 'Walk in Token',
    PHONE_CHECKIN: 'Phone in Token',
    ONLINE_CHECKIN: 'Online Token'
  };
  check_in_statuses = projectConstants.CHECK_IN_STATUSES;
  providerId;
  customer_label;
  provider_label;
  constructor(private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor,
    private router: Router,
    private activated_route: ActivatedRoute) {
    this.activated_route.params.subscribe(params => {
      this.providerId = params.userid;
    });
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  }

  ngOnInit(): void {
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  getStatusLabel(status) {
    const label_status = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm(status));
    return label_status;
  }
  actionClick(type, record?) {
    if (this.source == 'waitlist' || this.source === 'appt' || this.source === 'appt-dashboard' || this.source === 'waitlist-dashboard') {
      const uid = (this.source === 'appt' || this.source === 'appt-dashboard') ? record.uid : record.ynwUuid;
      const waitlisttype = (this.source === 'appt' || this.source === 'appt-dashboard') ? 'appointment' : 'checkin';
      this.router.navigate(['provider', 'bookings', 'details'], { queryParams: { uid: uid, timetype: 1, type: waitlisttype, showToken: this.showToken } });
    } else if (this.source == 'bill') {
      let source;
      if (record.type === 'Appointment') {
        source = 'appt';
      } else if (record.type === 'Order') {
        source = 'order';
      }
      this.router.navigate(['provider', 'bill', record.uuid], { queryParams: { source: source } });
    } else if (this.source == 'providers') {
      this.router.navigate(['provider', 'bookings', record.id]);
    } else if (this.source == 'customers') {
      this.router.navigate(['provider', 'customers', record.id]);
    } else {
      this.actionPerformed.emit({ record: record, type: type, timeType: this.timeType, source: this.source, heading: this.heading });
    }
  }
  getViewImg(record) {
    if (this.source === 'providers' && record.profilePicture) {
      return record.profilePicture.url;
    }
    return 'assets/images/Asset1@300x(1).png';
  }
  gotoFullView() {
    if (this.source == 'appt') {
      this.router.navigate(['provider', 'bookings', 'appointments'], { queryParams: { providerId: this.providerId } });
    } else if (this.source == 'waitlist') {
      this.router.navigate(['provider', 'bookings', 'checkins'], { queryParams: { providerId: this.providerId } });
    } else if (this.source == 'providers') {
      this.router.navigate(['provider', 'settings', 'general', 'users']);
    } else if (this.source == 'customers') {
      this.router.navigate(['provider', 'customers']);
    }
  }
  getUserShort(record) {
    let nameShort = '';
    if (record.firstName) {
      nameShort = record.firstName.charAt(0);
    }
    if (record.lastName) {
      nameShort = nameShort + record.lastName.charAt(0);
    }
    if (nameShort === '') {
      nameShort = this.customer_label.charAt(0);
    }
    return nameShort.toUpperCase();
  }
  gotoAdd() {
    if (this.source == 'customers') {
      this.router.navigate(['provider/customers/find'], { queryParams: { source: 'bookings' } });
    } else if (this.source == 'providers') {
      this.router.navigate(['provider/settings/general/users/add']);
    }
  }
}