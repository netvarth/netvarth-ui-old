import { Component, Inject, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CdlService } from '../../../cdl.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
  timetype: number = 1;
  from: any;
  type: any;
  user: any;
  reportData: any;
  equiFaxData: any;
  enquiryIds: any = {};
  equifaxReportData: any = {};
  equifaxScore: any;
  constructor(
    public dialogRef: MatDialogRef<ViewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupStorageService,
    private ActivatedRoute: ActivatedRoute,
    private location: Location,
    private cdlService: CdlService,
    private snackbarService: SnackbarService
  ) {
    this.ActivatedRoute.queryParams.subscribe((params) => {
      if (params) {
        if (params && params.type) {
          this.type = params.type;
        }
        if (params && params.data && this.type != 'equifax') {
          this.reportData = JSON.parse(params.data);
        }
        if (params && params.data && this.type == 'equifax') {
          this.equiFaxData = JSON.parse(params.data);
          console.log("this.equiFaxData", this.equiFaxData)
          if (this.equiFaxData && this.equiFaxData.equifaxId) {
            this.getequiFaxReport(this.equiFaxData.equifaxId);
          }
          if (this.equiFaxData && this.equiFaxData.equifaxScore) {
            this.equifaxScore = this.equiFaxData.equifaxScore;
          }
        }
      }
    })
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');


  }

  getequiFaxReport(id) {
    this.cdlService.getEquifaxReport(id).subscribe((data: any) => {
      if (this.type == 'equifax') {
        let Ids = data && data.responseDataDetails.InquiryRequestInfo && data.responseDataDetails.InquiryRequestInfo.IDDetails;
        if (Ids && Ids.length > 0)
          for (let i = 0; i < Ids.length; i++) {
            if (Ids[i].IDType == 'M') {
              this.enquiryIds["aadhaar"] = Ids[i].IDValue;
            }
            else if (Ids[i].IDType == 'T') {
              this.enquiryIds["pan"] = Ids[i].IDValue;
            }
            else if (Ids[i].IDType == 'V') {
              this.enquiryIds["voterId"] = Ids[i].IDValue;
            }
            else if (Ids[i].IDType == 'P') {
              this.enquiryIds["passport"] = Ids[i].IDValue;
            }
            else if (Ids[i].IDType == 'R') {
              this.enquiryIds["ration"] = Ids[i].IDValue;
            }
            else if (Ids[i].IDType == 'D') {
              this.enquiryIds["licence"] = Ids[i].IDValue;
            }
            else if (Ids[i].IDType == 'O') {
              this.enquiryIds["other"] = Ids[i].IDValue;
            }
          }
      }

      console.log("this.enquiryIds", this.enquiryIds)
      if (data && data.responseDataDetails && data.responseDataDetails.CCRResponse) {
        if (data.responseDataDetails.InquiryRequestInfo) {
          this.equifaxReportData['InquiryRequestInfo'] = data.responseDataDetails.InquiryRequestInfo;
        }
        if (data.responseDataDetails.CCRResponse.CIRReportDataLst && data.responseDataDetails.CCRResponse.CIRReportDataLst[0]) {

          if (data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData && data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData.IDAndContactInfo) {
            this.equifaxReportData['IDAndContactInfo'] = data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData.IDAndContactInfo;
          }

          if (data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData && data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData.RetailAccountDetails) {
            this.equifaxReportData['RetailAccountDetails'] = data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData.RetailAccountDetails;
          }

          if (data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData && data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData.RetailAccountsSummary) {
            this.equifaxReportData['RetailAccountsSummary'] = data.responseDataDetails.CCRResponse.CIRReportDataLst[0].CIRReportData.RetailAccountsSummary;
          }
        }
      }
      console.log("this.equifaxReportData", this.equifaxReportData)
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  onPrint() {
    const printContent = document.getElementById("printMe");
    var htmlToPrint = '' +
      '<style type="text/css">' +
      'table th, table td {' +
      'border:1px solid #000;' +
      'padding:0.5em;' +
      '}' +
      'table {' +
      'border-collapse: collapse;' +
      '}' +
      '.text-center {' +
      'text-align: center;' +
      '}' +
      '</style>';
    htmlToPrint += printContent.outerHTML;
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(htmlToPrint);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    // WindowPrt.close();
  }


  goHome() {

  }

  goBack() {
    this.location.back()
  }

}
