import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../services/provider-services.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { SchedulesComponent } from '../../../ivr/schedules/schedules.component';

@Component({
  selector: 'app-schedules-list',
  templateUrl: './schedules-list.component.html',
  styleUrls: ['./schedules-list.component.css']
})
export class SchedulesListComponent implements OnInit {
  loading: any = true;
  schedules: any;
  totalSchedulesCount: any;
  weekdays: any = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  scheduleDialogRef: any;
  constructor(
    private location: Location,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

  loadSchedules(event) {
    let api_filter = this.providerServices.setFiltersFromPrimeTable(event);
    if (api_filter) {
      // this.getTotalSchedulesCount();
      this.getSchedules(api_filter);
    }
  }

  getTotalSchedulesCount(filter = {}) {
    this.providerServices.getCountofSchedules(filter).subscribe((data: any) => {
      this.totalSchedulesCount = data;
      this.loading = false;
    }, (error) => {
      this.loading = false;
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    });
  }

  getSchedules(api_filter) {
    this.providerServices.getSchedules(api_filter).subscribe((data: any) => {
      this.schedules = data;
      this.totalSchedulesCount = data.length;
      this.loading = false;
    }, (error) => {
      this.loading = false;
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    });
  }

  getDaysFromIntervals(intervals) {
    let days = ""
    if (intervals && intervals.length > 0) {
      for (let i = 0; i < intervals.length; i++) {
        days = days + this.weekdays[intervals[i] - 1] + ',';
      }
    }
    return days;
  }


  scheduleStatusChange(id, event) {
    let status = event ? "ENABLED" : "DISABLED";
    this.providerServices.changeScheduleStatus(id, status).subscribe((data: any) => {
      this.getSchedules({});
      this.snackbarService.openSnackBar("Schedule Status Updated Successfully");
    }, error => {
      this.snackbarService.openSnackBar(error, { panelClass: "snackbarerror" });
    })
  }

  updateSchedule(id, action) {
    this.scheduleDialogRef = this.dialog.open(SchedulesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        action: action,
        id: id
      }
    });
    this.scheduleDialogRef.afterClosed().subscribe(data => {
      this.getSchedules({});
    });
  }

}
