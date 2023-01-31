import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ViewFileComponent } from './view-file/view-file.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { CdlService } from '../../cdl.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
// import { ViewReportComponent } from './view-report/view-report.component';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  status: any;
  user: any;
  headerName: string = ''
  customerName: string = ''
  customerphNo: string = ''
  employeeEmail: string = '';
  employeeMartialStatus: string = '';
  employeephNo: string = '';
  employeeEmployeeTYpe: string = '';
  employeeSalary: number;
  employeeOffAdd: string = '';
  employeeCityWork: string = '';
  employeeREsidence: string = '';
  employeeHomeAdd: string = '';
  adharNumber: number;
  panCardNumber: string = '';
  accountNumber: string = '';
  IFSCCode: string = '';
  bankName: string = '';
  emiPaidNo: number;
  cibilScore: number;
  mafilScore: number;
  perfiosScore: number;
  totalScore: number;
  loanStatus = projectConstantsLocal.TIMELINE_STATUS; perfiosData: any;
  equifaxScore: any = 0;
  equifaxScoreData: any;
  paramsValue: any;
  address1: string;
  address2: string;
  city: string;
  bankData: any;
  loanId: any;
  state: string;
  pincode: string;
  loanData: any;
  loanApplicationStatus: any;
  statusIndex: any;
  capabilities: any;
  mafilScoreData: any;
  loanEmiDetailsData: any;
  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private groupService: GroupStorageService,
    private dialog: MatDialog,
    private cdlservice: CdlService
  ) { }
  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.user) {
      this.capabilities = this.cdlservice.getCapabilitiesConfig(this.user);
    }
    this.activated_route.params.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.loanId = params.id;
          this.cdlservice.getLoanById(params.id).subscribe((data) => {
            this.loanData = data;
            this.checkMafilScore();
            this.checkEquifaxScore();
            this.checkPerfiosScore();
            if (this.loanData && this.loanData.spInternalStatus && this.loanData.spInternalStatus == 'Sanctioned' || this.loanData.spInternalStatus == 'OperationsVerified') {
              this.getLoanEmiDetails(this.loanId);
            }
            console.log("LoanData", this.loanData)
            if (this.loanData && this.loanData.spInternalStatus) {
              this.loanApplicationStatus = this.loanData.spInternalStatus;
            }
            this.cdlservice.getBankDetailsById(params.id).subscribe((data) => {
              this.bankData = data;
              console.log("BankData", this.bankData)
            });
            if (this.loanApplicationStatus) {
              this.checkTimeline();
            }
          });

        }
      }
    })
  }

  checkMafilScore() {
    let data =
    {
      "loanApplicationUid": this.loanId,
      "loanApplicationKycId": this.loanData.loanApplicationKycList[0].id
    }
    this.cdlservice.getMafilScore(data).subscribe((data: any) => {
      console.log("Mafil Score Data : ", data);
      this.mafilScoreData = data
      if (data && data.creditScore) {
        this.mafilScore = data.creditScore;
      }
    });
  }


  checkEquifaxScore() {
    let data =
    {
      "loanApplicationUid": this.loanId,
      "customerPhone": this.loanData.customer.phoneNo,
      "id": this.loanData.loanApplicationKycList[0].id
    }
    this.cdlservice.getEquifaxScore(data).subscribe((data: any) => {
      this.equifaxScoreData = data;
      console.log("Equifax Score Data : ", data);
      if (data && data.equifaxScore) {
        this.equifaxScore = data.equifaxScore;
      }
    });
  }




  viewReport(type, data) {
    // const dialogRef = this.dialog.open(ViewReportComponent, {
    //   width: '50%',
    //   panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
    //   disableClose: true,
    //   data: {
    //     type: type,
    //     data: data
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //   }
    // })

    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: type,
        data: JSON.stringify(data)
      }
    };
    this.router.navigate(['provider', 'cdl', 'report'], navigationExtras);
  }

  viewDpnLetter() {
    this.router.navigate(['provider', 'cdl', 'dpn-letter', this.loanId]);
  }

  viewSdcLetter() {
    this.router.navigate(['provider', 'cdl', 'spdc-letter', this.loanId]);
  }
  viewconsumerAgreementLetter() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uid: this.loanId,
        account: this.loanData.accountId,
        type: 'provider'
      }
    };
    this.router.navigate(['mafil', 'agreement'], navigationExtras);
  }


  checkPerfiosScore() {
    // let data =
    // {
    //   "loanApplicationUid": this.loanId,
    //   "loanApplicationKycId": this.loanData.loanApplicationKycList[0].id
    // }
    this.cdlservice.getPerfiosScore().subscribe((data: any) => {
      console.log("Perfios Score Data : ", data);
      if (data) {
        this.perfiosData = data;
      }
    });
  }

  checkTimeline() {
    this.statusIndex = this.loanStatus.filter((data) => data.name == this.loanApplicationStatus)[0].index
    console.log("this.statusIndex", this.statusIndex)
  }

  goBack() {
    this.location.back();
  }
  sanctionLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        loanId: this.loanId,
        type: "sanction",
        from: "creditofficer"
      }
    });
    dialogRef.afterClosed().subscribe(
      (id) => {
        if (id) {
          this.snackbarService.openSnackBar("Loan Verified Successfully");
          this.router.navigate(['provider', 'cdl', 'loans', id]);
        }
      });
  }


  approveLoan() {
    this.cdlservice.ApprovalRequest(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Loan Approved Successfully");
        this.router.navigate(['provider', 'cdl', 'loans']);
      }
    });
  }

  approveLoanByBranchManager() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          if (this.loanData && this.loanData.spInternalStatus && this.loanData.spInternalStatus == "SchemeConfirmed") {
            this.cdlservice.approveLoanByBranchManager(this.loanId, notes).subscribe((data: any) => {
              if (true) {
                this.snackbarService.openSnackBar("Loan Approved Successfully");
                this.router.navigate(['provider', 'cdl', 'loans']);
              }
            });
          }
        }
      });
  }

  analyze() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: 'analyzebank'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "eligible") {

        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
  }

  redirectLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          if (this.loanData && this.loanData.spInternalStatus) {
            this.cdlservice.redirectLoan(this.loanId, notes, this.loanData.spInternalStatus).subscribe((data: any) => {
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  type: 'redirected'
                }
              };
              this.snackbarService.openSnackBar("Loan Redirected Successfully");
              this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
            });
          }
        }
      });


  }

  completeLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          if (this.loanData && this.loanData.spInternalStatus) {
            this.cdlservice.completeLoan(this.loanId, notes).subscribe((data: any) => {
              this.snackbarService.openSnackBar("Loan Action Completed Successfully");
              this.router.navigate(['provider', 'cdl', 'loans']);
            });
          }
        }
      });
  }


  rejectLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          this.cdlservice.rejectLoan(this.loanId, notes).subscribe((data: any) => {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                type: 'rejected'
              }
            };
            this.snackbarService.openSnackBar("Loan Rejected Successfully");
            this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
          });
        }
      });


  }

  showKycDoc() {
    this.router.navigate(['provider', 'cdl', 'kycdoc', this.loanId]);
  }


  showLoanDetailsDoc() {
    this.router.navigate(['provider', 'cdl', 'loandetailsdoc', this.loanId]);
  }


  verifyLoanByOps() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          this.cdlservice.verifyLoanByOps(this.loanId, notes).subscribe((data: any) => {
            if (data) {
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  type: 'Sanctioned'
                }
              };
              this.snackbarService.openSnackBar("Loan Verified Successfully");
              this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
            }
          },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
            });
        }
      });
  }

  redirectLoanByOps() {

  }


  getLoanEmiDetails(id) {
    this.cdlservice.getLoanEmiDetails(id).subscribe((data: any) => {
      if (data) {
        this.loanEmiDetailsData = data
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }



  viewFile(file, s3path?) {
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: file,
        url: s3path
      }
    });
    dialogRef.afterClosed();
  }

  takeAction() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'action'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'create'], navigationExtras);
  }

}
