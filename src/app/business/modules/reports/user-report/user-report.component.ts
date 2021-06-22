import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportDataService } from '../reports-data.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {

  hide_criteria_save = false;
  report: any;
  report_type: any;
  customer_label: any;

  filterCriteria: any;
  daterange = true;
  params: any;
  showReport=true;
  userDetails:any=[];
  public user_dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['id', 'name', 'user', 'status'];
  user_data_loading=true;
  fromDate: any;
  toDate: any;
  date: any;
  constructor(private router: Router,
    private report_data_service: ReportDataService,
    private activatedRoute: ActivatedRoute,
    private provider_services:ProviderServices,
    private snackbarService:SnackbarService,
    public dateformat: DateFormatPipe,
  ) {
   
    this.activatedRoute.queryParams.subscribe(
      params => {
      this.params=JSON.parse(params.filter);
      if (this.params.filter) {
        this.filterCriteria = this.params.filter;
        console.log(JSON.stringify(this.filterCriteria['date-ge']));
        if (this.filterCriteria['date-eq']) {
          this.daterange = false;
          this.date=this.getDateFormat(new Date(this.filterCriteria['date-eq']));
        }
          if(this.filterCriteria['date-ge']){
            this.daterange = true;
            this.fromDate=this.getDateFormat(new Date(this.filterCriteria['date-ge']));
            this.toDate=this.getDateFormat(new Date(this.filterCriteria['date-le']));
          }
          
        
      }
    });
    this.report = this.report_data_service.getReport();
    this.report_type='user';
    console.log(this.report);


  }

  ngOnInit(): void {
    this.provider_services.generateUserInfoReport(this.params.filter)
    .subscribe((data:any) => {
       this.user_dataSource=data;
       this.user_data_loading=false;
      },
      error => {
       
        this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  redirecToReports() {
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.report_type } });
    
  }
  getDateFormat(date) {
    return this.dateformat.transformToMonthlyDate(date);
  }
  userDetailsReport(row) {
   const rowDetails=JSON.stringify(row);
   const filterparams=JSON.stringify(this.filterCriteria);
   console.log(rowDetails);
   console.log(filterparams);
    this.router.navigate(['provider', 'reports', 'user-details'], { queryParams: {data: rowDetails,params:filterparams} });

  }
}
