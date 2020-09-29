import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ReportDataService } from '../reports-data.service';
//






// import { ReportDataService } from '../reports-data.service';

@Component({
  selector: 'app-queue-selection',
  templateUrl: './queue-selection.component.html',
  styleUrls: ['./queue-selection.component.css']
})
export class QueueSelectionComponent implements OnInit, AfterViewInit {
  accountType: string;
  selected_data: any = [];
  selected_data_id: any;
  queues: any;
  queue_list_for_grid: any[];
  reportType: any;
  queue_loading$: boolean;
  queueCount: any;
  all_queue_selected: boolean;
  selection_type: any;
  queues_selected: any = [];
  queues_list: any = [];
  queue_cap = '';
  select_All = Messages.SELECT_ALL;
  public queue_dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel(true, []);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns = ['select', 'name', 'queue', 'status', 'userName'];
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private report_service: ReportDataService
  ) {

    this.activated_route.queryParams.subscribe(qparams => {

      const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
      this.accountType = user.accountType;
      if (this.accountType !== 'BRANCH') {
        this.displayedColumns = ['select', 'name', 'queue', 'status'];
      }

      this.reportType = qparams.report_type;
      this.selected_data_id = qparams.data;


      const queueData: any[] = qparams.data.split(',');
      for (let i = 0; i < queueData.length; i++) {
        this.selected_data.push(queueData[i]);
      }


      const _this = this;
      this.getAllQs().then(result => {
        if (_this.selected_data.length > 0) {
          _this.queue_dataSource.data.forEach(function (row) {
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
    this.queue_dataSource.filter = filterValue;

  }

  ngOnInit() {



  }
  // queue related method-------------------------------------------------------->
  setqueueDataSource(result) {
    const queue_list: any = [];
    result.forEach(queueObj => {
      let userName = '';
      if (queueObj.provider) {
        userName = queueObj.provider.firstName + '' + queueObj.provider.lastName;
      }
      queue_list.push({ 'id': queueObj.id, 'name': queueObj.name, 'user': userName });

    });
    return queue_list;

  }
  ngAfterViewInit() {

    this.paginator._intl.itemsPerPageLabel = 'queues per page';

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.queue_dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.queue_dataSource.data.forEach(row => this.selection.select(row));
  }



  getAllQs() {
    return new Promise((resolve) => {
      this.provider_services.getProviderQueues()
        .subscribe(
          (data: any) => {
            this.queues = data;
            this.queue_list_for_grid = [];
            let queue_list = [];
            for (let i = 0; i < this.queues.length; i++) {
              let queue_arr = [];
              if (this.queues[i].queueSchedule) {
                queue_arr = this.shared_functions.queueSheduleLoop(this.queues[i].queueSchedule);
              }
              queue_list = this.shared_functions.arrageScheduleforDisplay(queue_arr);
              this.queues[i].displayQ = queue_list[0];
              console.log(JSON.stringify(this.queues[i].displayQ));
              let userName = '';
              if (this.queues[i].provider) {
                userName = this.queues[i].provider.firstName + '' + this.queues[i].provider.lastName;

              }

              this.queue_list_for_grid.push(
                {
                  'id': this.queues[i].id,
                  'name': this.queues[i].name,
                  'location_id': this.queues[i].location.id,
                  'location_name': this.queues[i].location.name,
                  'duration': this.queues[i].timeDuration,
                  'queue_state': this.queues[i].queueState,
                  'queue_time': this.queues[i].displayQ.time,
                  'queue_weekdays': this.queues[i].displayQ.dstr,
                  'userName': userName
                }
              );
            }
            this.queue_dataSource.data = this.queue_list_for_grid;
            this.queueCount = this.queue_list_for_grid.length;

          });
      resolve();
    });
  }








  // common method got o previous page------------------------------------->
  passQueueSelectedToReports() {
    this.queues_selected = this.selection.selected;


      if (this.selection.selected.length === 0) {
        this.shared_functions.openSnackBar('Please select atleast one', { 'panelClass': 'snackbarerror' });

      } else {


        if (this.queue_dataSource.filteredData.length < this.selection.selected.length) {
          this.queues_selected = this.queue_dataSource.filteredData;

        } else if (this.queue_dataSource.filteredData.length > this.selection.selected.length) {
          this.queues_selected = this.selection.selected;
        }
        if (this.queues_selected.length === this.queueCount) {
          this.queues_selected = 'All';
        }
        if (this.queues_selected !== 'All') {
          let queue_id = '';
          this.queues_selected.forEach(function (queue) {
            queue_id = queue_id + queue.id +  ',';
          });

         this.queues_selected = queue_id;
        }


        console.log(this.queues_selected.length + '=' + this.queueCount);

        this.report_service.updatedQueueDataSelection(this.queues_selected);
        this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });

        //
        // }




    }
  }

  redirecToReports(){
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }

}
