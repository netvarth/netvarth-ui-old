import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ReportDataService } from '../reports-data.service';

@Component({
  selector: 'app-schedule-selection',
  templateUrl: './schedule-selection.component.html',
  styleUrls: ['./schedule-selection.component.css']
})
export class ScheduleSelectionComponent implements OnInit, AfterViewInit {

  accountType: any;
  selected_data: any = [];
  selected_data_id: any;
  schedule_list_for_grid: any[];
  reportType: any;
  schedule_loading$: boolean;
  scheduleCount: any;
  all_schedule_selected: boolean;
  selection_type: any;
  schedules_selected: any = [];
  schedules_list: any = [];
  schedule_cap = '';
  select_All = Messages.SELECT_ALL;
  public schedule_dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel(true, []);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = ['select', 'name', 'schedule', 'status', 'userName'];
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private report_service: ReportDataService) {

    this.activated_route.queryParams.subscribe(qparams => {

      this.reportType = qparams.report_type;
      this.selected_data_id = qparams.data;

      const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
      this.accountType = user.accountType;
      if (this.accountType !== 'BRANCH') {
        this.displayedColumns = ['select', 'name', 'schedule', 'status'];
      }



      const scheduleData: any[] = qparams.data.split(',');
      for (let i = 0; i < scheduleData.length; i++) {
        this.selected_data.push(scheduleData[i]);
      }


      const _this = this;
      this.getSchedules().then(result => {
        if (parseInt(qparams.data, 0) === 0) {
        this.masterToggle();
        }
        if (_this.selected_data.length > 0) {
          _this.schedule_dataSource.data.forEach(function (row) {
            if (_this.selected_data && _this.selected_data.length > 0) {
              _this.selected_data.forEach(data => {
                // tslint:disable-next-line:radix
                if (parseInt(data) === row.id) {
                  _this.selection.select(row);
                }
              });
            }
          });
        }

      });

    });
  }

  applyFilter(filterValue: string) {

    this.selection.clear();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.schedule_dataSource.filter = filterValue;

  }

  ngOnInit() {



  }
  // schedule related method-------------------------------------------------------->
  setscheduleDataSource(result) {
    const schedule_list: any = [];
    result.forEach(scheduleObj => {
      let userName = '';
      if (scheduleObj.provider) {
        userName = scheduleObj.provider.firstName + ' ' + scheduleObj.provider.lastName;
      }
      schedule_list.push({ 'id': scheduleObj.id, 'name': scheduleObj.name, 'user': userName });

    });
    return schedule_list;

  }
  ngAfterViewInit() {

    this.paginator._intl.itemsPerPageLabel = 'schedules per page';

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.schedule_dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.schedule_dataSource.data.forEach(row => this.selection.select(row));
  }





  // schedule related method------------------------------------------------->
  getSchedules(date?) {
    const filterEnum = {};
    return new Promise((resolve) => {
      this.provider_services.getProviderSchedules(filterEnum).subscribe(
        (schedules: any) => {
          this.schedule_list_for_grid = [];
          for (let i = 0; i < schedules.length; i++) {
            let schedule_arr = [];
            // extracting the schedule intervals
            if (schedules[i].apptSchedule) {
              schedule_arr = this.shared_functions.queueSheduleLoop(schedules[i].apptSchedule);
            }
            let display_schedule = [];
            display_schedule = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
            schedules[i]['displayschedule'] = display_schedule;
            console.log('schdeule..' + JSON.stringify(schedules));
            let userName = '';
            if (schedules[i].provider) {
              userName = schedules[i].provider.firstName + '' + schedules[i].provider.lastName;

            }
            this.schedule_list_for_grid.push(
              {
                'id': schedules[i].id,
                'name': schedules[i].name,
                'location_id': schedules[i].location.id,
                'location_name': schedules[i].location.name,
                'duration': schedules[i].timeDuration,
                'appt_state': schedules[i].apptState,
                'schedule_time': schedules[i].displayschedule[0].time,
                'schedule_weekdays': schedules[i].displayschedule[0].dstr,
                'userName': userName
              }
            );
          }
          this.schedule_dataSource.data = this.schedule_list_for_grid;
          this.scheduleCount = this.schedule_list_for_grid.length;

          resolve();
        });

    });
  }





  redirecToReports() {
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }


  // common method got o previous page------------------------------------->
  passScheduleSelectedToReports() {
    this.schedules_selected = this.selection.selected;

    if (this.selection.selected.length === 0) {
      this.shared_functions.openSnackBar('Please select atleast one', { 'panelClass': 'snackbarerror' });

    } else {


      if (this.schedule_dataSource.filteredData.length < this.selection.selected.length) {
        this.schedules_selected = this.schedule_dataSource.filteredData;

      } else if (this.schedule_dataSource.filteredData.length > this.selection.selected.length) {
        this.schedules_selected = this.selection.selected;
      }
      if (this.schedules_selected.length === this.scheduleCount) {
        this.schedules_selected = 'All';
      }
      if (this.schedules_selected !== 'All') {
        let schedule_id = '';
        this.schedules_selected.forEach(function (schedule) {
          schedule_id = schedule_id + schedule.id + ',';
        });

        this.schedules_selected = schedule_id;
      }

      console.log(this.schedules_selected.length + '=' + this.scheduleCount);

      this.report_service.updatedScheduleDataSelection(this.schedules_selected);
      this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });

      //
      // }




    }
  }

}
