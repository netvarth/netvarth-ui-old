import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-records-datagrid',
  templateUrl: './records-datagrid.component.html',
  styleUrls: ['./records-datagrid.component.css', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
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
  constructor(private dateTimeProcessor: DateTimeProcessor) { }

  ngOnInit(): void {
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  stopprop(event) {
    event.stopPropagation();
  }
  actionClick(type, record?) {
    this.actionPerformed.emit({ record: record, type: type, timeType: this.timeType, source: this.source, heading: this.heading });
  }
}