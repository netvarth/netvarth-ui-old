import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-records-datagrid',
  templateUrl: './records-datagrid.component.html',
  styleUrls: ['./records-datagrid.component.css']
})
export class RecordsDatagridComponent implements OnInit {
  @Input() records;
  @Input() heading;
  @Input() source;
  @Input() showMore;
  @Input() waitlistMgrSettings;
  @Input() timeType;
  @Input() providerId;
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
  check_in_statuses = projectConstantsLocal.CHECK_IN_STATUSES;
  customer_label;
  provider_label;
  constructor(private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor,
    private router: Router) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  }

  ngOnInit(): void {
    console.log(this.records);
    console.log(this.source);
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
    console.log(this.waitlistMgrSettings);
    console.log(this.source);
    if (this.source == 'waitlist' || this.source === 'appt' || this.source === 'appt-dashboard' || this.source === 'waitlist-dashboard') {
      const uid = (this.source === 'appt' || this.source === 'appt-dashboard') ? record.uid : record.ynwUuid;
      const waitlisttype = (this.source === 'appt' || this.source === 'appt-dashboard') ? 'appointment' : 'checkin';
      this.router.navigate(['provider', 'bookings', 'details'], { queryParams: { uid: uid, timetype: record.type, type: waitlisttype, waitlistMgrSettings: this.waitlistMgrSettings } });
    } else if (this.source == 'bill' ||this.source == 'customer-bill') {
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
    } else if (this.source == 'donation' || this.source == 'donation-dashboard') {
      this.router.navigate(['provider', 'donations', record.uid]);
    } else if (this.source == 'order') {
      this.router.navigate(['provider', 'orders', record.uid]);
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
    if (this.source === 'appt') {
      this.router.navigate(['provider', 'bookings', 'appointments'], { queryParams: { providerId: this.providerId } });
    } else if (this.source === 'waitlist') {
      this.router.navigate(['provider', 'bookings', 'checkins'], { queryParams: { providerId: this.providerId } });
    } else if (this.source === 'providers') {
      this.router.navigate(['provider', 'settings', 'general', 'users']);
    } else if (this.source === 'customers') {
      this.router.navigate(['provider', 'customers']);
    } else if (this.source === 'donation') {
      this.router.navigate(['provider', 'donations']);
    } else if (this.source === 'order') {
      this.router.navigate(['provider', 'orders']);
    } else if (this.source === 'bill') {
      this.router.navigate(['provider', 'bookings', 'bills']);
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