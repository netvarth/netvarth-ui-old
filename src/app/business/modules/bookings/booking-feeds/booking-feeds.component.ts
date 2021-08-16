import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedServices } from '../../../../shared/services/shared-services';

@Component({
  selector: 'app-booking-feeds',
  templateUrl: './booking-feeds.component.html',
  styleUrls: ['./booking-feeds.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class BookingFeedsComponent implements OnInit {
  auditlog_details: any = [];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  loading = true;
  small_device_display = false;
  constructor(private shared_services: SharedServices,
    private router: Router) { }

  ngOnInit(): void {
    this.onResize();
    this.getAuditList();
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
  getAuditList() {
    this.shared_services.getAuditLogs('', '', '', '', '', '')
      .subscribe(data => {
        this.auditlog_details = data;
        this.loading = false;
      },
        error => {
          this.auditlog_details = [];
          this.loading = false;
        });
  }
  gotoAuditLogs() {
    this.router.navigate(['provider/auditlog']);
  }
}
