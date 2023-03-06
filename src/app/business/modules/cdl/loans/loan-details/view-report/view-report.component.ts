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

  equifaxSample: any = {
    "RetailAccountsSummary": {
      "TotalSanctionAmount": "62007.00",
      "NoOfPastDueAccounts": "0",
      "TotalCreditLimit": "0.0",
      "RecentAccount": "Consumer Loan on 17-03-2022",
      "TotalHighCredit": "0.00",
      "NoOfActiveAccounts": "2",
      "MostSevereStatusWithIn24Months": "Non-Delnqt",
      "OldestAccount": "Consumer Loan on 07-03-2021",
      "SingleHighestSanctionAmount": "33990.00",
      "NoOfAccounts": "7",
      "NoOfWriteOffs": "0",
      "SingleHighestCredit": "0.00",
      "AverageOpenBalance": "18130.00",
      "TotalPastDue": "0.00",
      "NoOfZeroBalanceAccounts": "0",
      "TotalMonthlyPaymentAmount": "0.00",
      "TotalBalanceAmount": "36260.00",
      "SingleHighestBalance": "27767.00"
    },
    "RetailAccountDetails": [
      {
        "OwnershipType": "Individual",
        "DateOpened": "2022-03-17",
        "DateReported": "2022-12-31",
        "TermFrequency": "Monthly",
        "LastPaymentDate": "2022-11-02",
        "PastDueAmount": "0",
        "source": "INDIVIDUAL",
        "Institution": "FINANCE",
        "AccountType": "Consumer Loan",
        "Open": "Yes",
        "AccountNumber": "**********",
        "AccountStatus": "Current Account",
        "SanctionAmount": "33990",
        "Balance": "8493",
        "seq": "1"
      },
      {
        "OwnershipType": "Individual",
        "DateOpened": "2022-02-11",
        "DateReported": "2022-11-30",
        "TermFrequency": "Monthly",
        "LastPaymentDate": "2022-11-30",
        "PastDueAmount": "0",
        "source": "INDIVIDUAL",
        "Institution": "FINANCE",
        "AccountType": "Consumer Loan",
        "Open": "Yes",
        "AccountNumber": "**********",
        "AccountStatus": "Current Account",
        "SanctionAmount": "28017",
        "Balance": "27767",
        "seq": "2"
      },
      {
        "OwnershipType": "Individual",
        "DateOpened": "2021-03-31",
        "DateReported": "2022-05-31",
        "TermFrequency": "Monthly",
        "LastPaymentDate": "2022-04-02",
        "RepaymentTenure": "18",
        "InstallmentAmount": "2500",
        "PastDueAmount": "0",
        "source": "INDIVIDUAL",
        "Institution": "FINANCE",
        "AccountType": "Consumer Loan",
        "Reason": "Closed Account",
        "Open": "No",
        "AccountNumber": "**********",
        "AccountStatus": "Closed Account",
        "DateClosed": "2022-04-10",
        "SanctionAmount": "45000",
        "Balance": "0",
        "seq": "5"
      },
      {
        "OwnershipType": "Individual",
        "DateOpened": "2022-02-13",
        "LastPayment": "1241",
        "DateReported": "2022-05-31",
        "TermFrequency": "Monthly",
        "LastPaymentDate": "2022-05-03",
        "RepaymentTenure": "3",
        "InstallmentAmount": "416",
        "PastDueAmount": "0",
        "source": "INDIVIDUAL",
        "Institution": "FINANCE",
        "AccountType": "Consumer Loan",
        "Reason": "Closed Account",
        "Open": "No",
        "AccountNumber": "**********",
        "AccountStatus": "Closed Account",
        "DateClosed": "2022-05-03",
        "SanctionAmount": "1199",
        "AssetClassification": "Standard",
        "InterestRate": "24",
        "Balance": "0",
        "seq": "6"
      },
      {
        "OwnershipType": "Individual",
        "DateOpened": "2021-09-02",
        "DateReported": "2022-04-30",
        "TermFrequency": "Monthly",
        "LastPaymentDate": "2022-02-02",
        "PastDueAmount": "0",
        "source": "INDIVIDUAL",
        "Institution": "FINANCE",
        "AccountType": "Consumer Loan",
        "Reason": "Closed Account",
        "Open": "No",
        "AccountNumber": "**********",
        "AccountStatus": "Closed Account",
        "DateClosed": "2022-03-09",
        "SanctionAmount": "18198",
        "Balance": "0",
        "seq": "7"
      }
    ],
    "IDAndContactInfo": {
      "IdentityInfo": {
        "PANId": [
          {
            "seq": "1",
            "IdNumber": "LZYPS1368D",
            "ReportedDate": "2022-09-30"
          }
        ],
        "NationalIDCard": [
          {
            "seq": "1",
            "IdNumber": "XXXXXXXXXXXX",
            "ReportedDate": "2022-08-31"
          }
        ]
      },
      "PhoneInfo": [
        {
          "ReportedDate": "2022-09-30",
          "Number": "9745355216",
          "seq": "1",
          "typeCode": "M"
        },
        {
          "ReportedDate": "2022-08-31",
          "Number": "919745355216",
          "seq": "2",
          "typeCode": "M"
        }
      ],
      "EmailAddressInfo": [
        {
          "seq": "1",
          "EmailAddress": "KRISHNADAS.0810@GMAIL.COM",
          "ReportedDate": "2022-04-30"
        }
      ],
      "PersonalInfo": {
        " AliasName": {},
        "DateOfBirth": "1996-04-15",
        "PlaceOfBirthInfo": {},
        "Gender": "Male",
        "TotalIncome": "25000",
        "Age": {
          "Age": "26"
        },
        "Name": {
          "FirstName": "KRISHNADAS ",
          "FullName": "KRISHNADAS PS ",
          "LastName": "PS "
        }
      },
      "AddressInfo": [
        {
          "Type": "Permanent",
          "ReportedDate": "2022-09-30",
          "Address": "POZHANGODATH HOUSEKAROORNEAR TEMPLEKAROOR THRISSUR 680684",
          "Seq": "1",
          "State": "KL",
          "Postal": "680684"
        },
        {
          "Type": "Primary",
          "ReportedDate": "2022-08-31",
          "Address": "POZHANGODTH HOUSE MANKULANKARA PO  KAROOR KODAKARA THRISSUR",
          "Seq": "2",
          "State": "KL",
          "Postal": "680684"
        },
        {
          "Type": "Rents",
          "ReportedDate": "2022-05-31",
          "Address": "POZHANGODTH HOUSE MANKULANKARA PO  KAROOR KODAKARA KODAKARA THRISSUR",
          "Seq": "3",
          "State": "KL",
          "Postal": "680684"
        },
        {
          "Type": "Permanent",
          "ReportedDate": "2022-04-30",
          "Address": "POZHANGODATH HOUSEKAROORNEAR TEMPLEKAROO R THRISSUR 680684",
          "Seq": "4",
          "State": "KL",
          "Postal": "680684"
        },
        {
          "Type": "Primary",
          "ReportedDate": "2022-03-31",
          "Address": "SO SREEDHARAN P POZHANGODATH SO SREEDHARAN P POZHANGODATH THRISSUR KERALA 680684",
          "Seq": "5",
          "State": "KL",
          "Postal": "680684"
        }
      ]
    },
    "InquiryRequestInfo": {
      "DOB": "1991-11-04",
      "Gender": "M",
      "LastName": "K M",
      "FirstName": "kiran kumar",
      "IDDetails": [
        {
          "seq": "1",
          "IDType": "M",
          "Source": "Inquiry",
          "IDValue": "XXXXXXXXXXXX"
        },
        {
          "seq": "2",
          "IDType": "T",
          "Source": "Inquiry",
          "IDValue": "dnkpm0652l"
        }
      ],
      "InquiryPhones": [
        {
          "seq": "1",
          "Number": "8943621001",
          "PhoneType": [
            "M"
          ]
        }
      ],
      "InquiryPurpose": "00",
      "InquiryAddresses": [
        {
          "seq": "1",
          "City": "Thrissur",
          "State": "KL",
          "Postal": "680732",
          "AddressType": [
            "H"
          ],
          "AddressLine1": "S/O Mohanan,Kuruppamparambil House,P O Malapallipuram,Pallippuram,Thrissur,Kerala,680732"
        }
      ],
      "TransactionAmount": "0"
    },
  }
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
    // if (this.data && this.data.type) {
    //   this.type = this.data.type
    // }
    // if (this.data && this.data.data) {
    //   this.reportData = this.data.data
    // }
    this.equiFaxData = this.equifaxSample;
    if (this.type == 'equifax') {
      let Ids = this.equiFaxData && this.equiFaxData.InquiryRequestInfo && this.equiFaxData.InquiryRequestInfo.IDDetails;
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
  }

  getequiFaxReport(id) {
    this.cdlService.getEquifaxReport(id).subscribe((data: any) => {
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
