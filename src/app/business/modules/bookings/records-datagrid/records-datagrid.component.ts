import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProviderServices } from "../../../../business/services/provider-services.service";

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
  @Input() customerId;
  @Input() view;
  @Input() admin;
  @Output() actionPerformed = new EventEmitter<any>();
  @Input() no_data_cap;
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
  qParams;
  loading = true;
  paymentStatuses = projectConstantsLocal.BILL_PAYMENT_STATUS_WITH_DISPLAYNAME;
  small_device_display = false;
  constructor(private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor,
    private router: Router, private location: Location,
    private activateRoute: ActivatedRoute,
    private provider_services: ProviderServices) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.activateRoute.queryParams.subscribe(qparams => {
      this.qParams = qparams;
      if (qparams.heading) {
        this.heading = qparams.heading;
      }
      if (qparams.source) {
        this.source = qparams.source;
      }
      if (qparams.providerId) {
        this.providerId = qparams.providerId;
      }
      if (qparams.customerId) {
        this.customerId = qparams.customerId;
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  ngOnInit(): void {
    if (!this.view) {
      if (this.source == 'bill') {
        this.getBills();
      }
    } else {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
    this.onResize();
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
    if (this.source == 'waitlist' || this.source === 'appt') {
      const uid = (this.source === 'appt') ? record.uid : record.ynwUuid;
      const waitlisttype = (this.source === 'appt') ? 'appointment' : 'checkin';
      this.router.navigate(['provider', 'bookings', 'details'], { queryParams: { uid: uid, timetype: record.type, type: waitlisttype, waitlistMgrSettings: this.waitlistMgrSettings } });
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
    } else if (this.source == 'donation') {
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
    const navigationExtras: NavigationExtras = {
      queryParams: {
        source: this.source,
        heading: this.heading,
        providerId: this.providerId,
        customerId: this.customerId
      }
    };
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
      this.router.navigate(['provider', 'bookings', 'bills'], navigationExtras);
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
      const navigationExtras: NavigationExtras = {
        queryParams: {
          source: 'bookings',
          id: 'add'
        }
      };
      this.router.navigate(['/provider/customers/create'], navigationExtras);
    } else if (this.source == 'providers') {
      this.router.navigate(['provider/settings/general/users/add']);
    }
  }
  gotoPrev() {
    this.location.back();
  }
  getBills() {
    let filter = {};
    if (this.providerId) {
      filter = { 'provider-eq': this.providerId };
    }
    if (this.customerId) {
      filter = { 'providerConsumer-eq': this.customerId };
    }
    this.provider_services.getProviderBills(filter).subscribe(data => {
      this.records = data;
      this.loading = false;
    })
  }
  getPaymentClass(status) {
    if (status === 'NotPaid' || status === 'Refund') {
      return 'red';
    } else if (status === 'PartiallyPaid' || status === 'PartiallyRefunded') {
      return 'orange';
    } else if (status === 'FullyPaid' || status === 'FullyRefunded') {
      return 'greenc';
    }
  }
  getHeading() {
    return this.heading.replace('_', ' ');
  }
}