import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { projectConstants } from '../../../../app.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { interval as observableInterval, Subscription } from 'rxjs';

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
  @Input() count;
  @Input() showMore;
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
  loading = false;
  cronHandle: Subscription;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  constructor(private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor,
    private provider_services: ProviderServices,
    private router: Router) { }

  ngOnInit(): void {
    console.log(this.source, this.records);
    if (this.source == 'waitlist') {
      this.getTodayWatilists();
    }
    if (this.source == 'appt') {
      this.getTodayAppts();
    }
    this.cronHandle = observableInterval(this.refreshTime * 500).subscribe(() => {
      this.refresh();
    });
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
  }
  refresh() {
    if (this.source == 'waitlist') {
      this.getTodayWatilists();
    }
    if (this.source == 'appt') {
      this.getTodayAppts();
    }
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  stopprop(event) {
    event.stopPropagation();
  }
  getStatusLabel(status) {
    const label_status = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm(status));
    return label_status;
  }
  getTodayWatilists() {
    this.loading = true;
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived',
      'from': 0,
      'count': 10
    };
    this.provider_services.getTodayWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.records = data;
          console.log(this.records);
          this.loading = false;
        });
  }
  getTodayAppts() {
    this.loading = true;
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived',
      'from': 0,
      'count': 10
    };
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          this.records = data;
          console.log(this.records);
          this.loading = false;
        });
  }
  actionClick(type, record?) {
    if (this.source == 'waitlist' || this.source === 'appt') {
      const uid = (this.source === 'appt') ? record.uid : record.ynwUuid;
      const type = (this.source === 'appt') ? 'appointment' : 'checkin';
      this.router.navigate(['provider', 'bookings', uid], { queryParams: { timetype: 1, type: type } });
    } else if (this.source == 'bill') {
      let source;
      if (record.type === 'Appointment') {
        source = 'appt';
      } else if (record.type === 'Order') {
        source = 'order';
      }
      this.router.navigate(['provider', 'bill', record.uuid], { queryParams: { source: source } });
    } else if (this.source == 'views') {

    } else {
      this.actionPerformed.emit({ record: record, type: type, timeType: this.timeType, source: this.source, heading: this.heading });
    }
  }
  getViewImg(record) {
    if (record.userType && record.profilePicture) {
      return record.profilePicture.url;
    }
    return 'assets/images/Asset1@300x(1).png';
  }
  gotoFullView() {
    if (this.source == 'appt') {
      this.router.navigate(['provider', 'bookings', 'appointments']);
    } else if (this.source == 'waitlist') {
      this.router.navigate(['provider', 'bookings', 'checkins']);
    } else if (this.source == 'providers') {
      this.router.navigate(['provider', 'settings', 'general', 'users']);
    }
  }
}