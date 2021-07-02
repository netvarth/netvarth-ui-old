import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { SharedServices } from '../../../../../shared/services/shared-services';

@Component({
  selector: 'app-booking-feeds',
  templateUrl: './booking-feeds.component.html',
  styleUrls: ['./booking-feeds.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class BookingFeedsComponent implements OnInit {
  auditlog_details: any = [];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  classes = [
    'bg-light-warning',
    'bg-light-success',
    'bg-light-danger',
    'bg-light-info'
  ];
  classIndex = 0;
  constructor(private shared_services: SharedServices) { }

  ngOnInit(): void {
    this.getAuditList();
  }
  getAuditList() {
    this.shared_services.getAuditLogs('', '', '', '', '', '')
      .subscribe(data => {
        this.auditlog_details = data;
      },
        error => {
          this.auditlog_details = [];
        });
  }
  getClass() {
    if (this.classes && this.classIndex === this.classes.length) {
      this.classIndex = 0;
    }
    const auditclass = this.classes[this.classIndex];
    this.classIndex++;
    return auditclass;
  }
}
