import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
// import { ReportDataService } from '../reports-data.service';
import { ActivatedRoute } from '@angular/router';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { MatDialog } from '@angular/material/dialog';
import { CriteriaDialogComponent } from './criteria-dialog/criteria-dialog.component';
import { ExportReportService } from '../export-report.service';
// import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { Location } from '@angular/common';
export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-generated-report',
  templateUrl: './generated-report.component.html',
  styleUrls: ['./generated-report.component.css']
})
export class GeneratedReportComponent implements OnInit {
  groupByColumns: string[];
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
  new_report;
  reducedGroups = [];
  public report_dataSource = new MatTableDataSource<any>([]);
  reprtdialogRef: any;
  hide_criteria_save = false;
  groupingColumn;
  customer_label: any;
  token;
  report_view: any = [];
  constructor(
    // private report_data_service: ReportDataService,
    // private router: Router,
    private locationobj: Location,
    public dateformat: DateFormatPipe,
    private provider_services: ProviderServices,
    private dialog: MatDialog,
    private wordProcessor: WordProcessor,
    private activated_route: ActivatedRoute,
    private exportReportService: ExportReportService
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams.token) {
        this.token = qparams.token;
      }
    });
    // this.report = this.report_data_service.getReport();
    // this.report_type = this.report.reportType.toLowerCase();
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  
  }
  ngOnInit() {
    
    console.log("report_dataSource",this.report_dataSource)
    
      this.provider_services.getReportListbyId(this.token)
        .subscribe(
          data => {
            this.new_report = data;

            console.log(this.new_report.status)
            console.log("new_report.reportContent",this.new_report.reportContent.data)
            this.report_view = this.new_report.reportContent.data;
            console.log("report_view",this.report_view)
           this.tableColums = this.new_report.reportContent.columns;
        console.log("tableColums",this.tableColums)
         this.objectKeys = Object.keys;
        this.reportCriteriaHeader = this.new_report.reportContent.reportHeader;
        if (this.new_report.reportContent && this.new_report.reportContent.dataHeader) {
          this.reportConsolidatedInfo = this.new_report.reportContent.dataHeader;
        }
          this.reportHeader = this.new_report.reportContent;
        Object.entries(this.tableColums).forEach(
          ([key, value]) => this.table_header.push({ 'order': key, 'name': value })
        );
        this.displayedColumns = this.table_header.map(column => column.order);
        console.log("Logggggg :",this.table_header)
        this.activated_route.queryParams.subscribe(qparams => {
          if (qparams.reportRecreate) {
            this.hide_criteria_save = true;
          }
        });
          this.report_dataSource = this.report_view;
             if (this.report_view.length === 0) {
          this.showReport = false;
        } else {
          this.showReport = true;
        }
        this.buildDataSource();
          },
          () => { }
        );
       
       
        
        
        // this.report_dataSource = this.fo;
        // alert(this.fo.length + 'this.fo')
        // if (this.fo.length === 0) {
        //   alert('1')
        //   this.showReport = false;
        // } else {
        //   alert('13')
        //   this.showReport = true;
        // }
        // this.buildDataSource();
       
   
  }
  replacewithTerminologies(columnname) {
    const column = columnname;
    const replaceString = this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1);
    return column.replace('Customer', replaceString);
  }
  getDateFormat(date) {
    return this.dateformat.transformToMonthlyDate(date);
  }
  buildDataSource() {
    this.report_dataSource = this.groupBy(this.groupingColumn, this.report_view, this.reducedGroups);
  }
  groupBy(column: string, data: any[], reducedGroups?: any[]) {
    if (!column) { return data; }
    let collapsedGroups = reducedGroups;
    if (!reducedGroups) { collapsedGroups = []; }
    const customReducer = (accumulator, currentValue) => {
      const currentGroup = currentValue[column];
      if (!accumulator[currentGroup]) {
        accumulator[currentGroup] = [{
          groupName: `${currentValue[column]}`,
          value: currentValue[column],
          isGroup: true,
          reduced: collapsedGroups.some((group) => group.value === currentValue[column])
        }];
      }
      accumulator[currentGroup].push(currentValue);
      return accumulator;
    };
    const groups = data.reduce(customReducer, {});
    const groupArray = Object.keys(groups).map(key => groups[key]);
    const flatList = groupArray.reduce((a, c) => a.concat(c), []);

    return flatList.filter((rawLine) => {
      return rawLine.isGroup ||
        collapsedGroups.every((group) => rawLine[column] !== group.value);
    });
  }

  /**
   * Since groups are on the same level as the data,
   * this function is used by @input(matRowDefWhen)
   */
  isGroup(index, item): boolean {
    return item.isGroup;
  }

  /**
   * Used in the view to collapse a group
   * Effectively removing it from the displayed datasource
   */
  reduceGroup(row) {
    row.reduced = !row.reduced;
    if (row.reduced) {
      this.reducedGroups.push(row);
    } else {
      this.reducedGroups = this.reducedGroups.filter((el) => el.value !== row.value);
    }
    this.buildDataSource();
  }
  redirecToReports() {
    this.locationobj.back();
    // if (this.hide_criteria_save) {
    //   this.router.navigate(['provider', 'reports']);
    // } else {
    //   this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.report_type } });
    // }
  }
  saveCriteria() {
    this.reprtdialogRef = this.dialog.open(CriteriaDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        purpose: 'save',
        token : this.token
      }
    });
    this.reprtdialogRef.afterClosed().subscribe(result => {
    });
  }
  exportReport() {
      this.report_type = this.new_report.reportType.toLowerCase();
    const reportData = this.new_report.reportContent.data;
    const tableHeader = this.tableColums;
    const _this = this;
    const reportResult = [];
    reportData.forEach(function (object) {
      const newSet = {};
      Object.keys(tableHeader).forEach(function (key) {
        const newKey = _this.replacewithTerminologies(tableHeader[key]);
        const newValue = object[key];
        newSet[newKey] = newValue;
      });
      reportResult.push(newSet);
    });
    this.exportReportService.exportExcel(reportResult, this.report_type + '_report');
  }
}
