import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format/date-format.pipe';

@Component({
  selector: 'app-user-detail-report',
  templateUrl: './user-detail-report.component.html',
  styleUrls: ['./user-detail-report.component.css']
})
export class UserDetailReportComponent implements OnInit {
  params: any;
  filterCriteria: any;
  daterange: boolean;
  date: any;
  data: any;
  user_details_loading=true;

  fromDate: any;
  toDate: any;
  report: any;
  report_type: string;
  displayedColumns = ['date', 'assigned','time'];
  userStats: any=[];

  constructor(private router: Router,

    private activatedRoute: ActivatedRoute,
    public dateformat: DateFormatPipe,) {
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.data=JSON.parse(params.data);
        this.user_details_loading=false;
        this.userStats=this.data.userDto.statsPerDay;
      this.params=JSON.parse(params.params);
      if (this.params) {
        this.filterCriteria = this.params;
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
   
   }

  ngOnInit(): void {
  }
  redirecToReports(){
    const filterObj={};
    filterObj['reportType']='user';
    filterObj['filter']= this.filterCriteria;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        filter: JSON.stringify(filterObj)
    
      }
   
  }
  this.router.navigate(['provider', 'reports', 'user-report'],navigationExtras); 
}
getDateFormat(date) {
  return this.dateformat.transformToMonthlyDate(date);
}
}
