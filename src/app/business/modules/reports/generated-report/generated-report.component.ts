import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ReportDataService } from '../reports-data.service';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';


@Component({
  selector: 'app-generated-report',
  templateUrl: './generated-report.component.html',
  styleUrls: ['./generated-report.component.css']
})
export class GeneratedReportComponent implements OnInit {


  showReport: boolean;
    report_type: any;
  reportConsolidatedInfo: any;
  objectKeys: (o: {}) => string[];
  reportCriteriaHeader: any;
  reportDataHeader: any;
  reportHeader: any;
  displayedColumns: any;
  table_header: any = [];
  tableColums: any;
  table_header_columns: any;
  report: any = {};


  public report_dataSource = new MatTableDataSource<any>([]);


  constructor(

    private report_data_service: ReportDataService,
    private router: Router,
    public dateformat: DateFormatPipe,

  ) {
    this.report = this.report_data_service.getReport();
    console.log(JSON.stringify(this.report));
    this.report_type = this.report.reportType.toLowerCase();
    this.tableColums = this.report.reportContent.columns;
    this.objectKeys = Object.keys;
    this.reportCriteriaHeader = this.report.reportContent.reportHeader;
    if (this.report.reportContent.dataHeader) {
      this.reportConsolidatedInfo = this.report.reportContent.dataHeader;
    }
    this.reportHeader = this.report.reportContent;
    console.log(this.tableColums);
    Object.entries(this.tableColums).forEach(
      ([key, value]) => this.table_header.push({ 'order': key, 'name': value })
    );
    this.displayedColumns = this.table_header.map(column => column.order);

  }



  ngOnInit() {

    // console.log(this.table_header);
    this.report_dataSource = this.report.reportContent.data;
    if (this.report.reportContent.data.length === 0) {
      this.showReport = false;
    } else {
     this.showReport = true;
    }

  }
  getDateFormat(date) {
    return this.dateformat.transformToMonthlyDate(date);
  }

  redirecToReports() {
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.report_type } });
  }
  printReport() {
    const printContent = document.getElementById('reportGenerated');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }














}
