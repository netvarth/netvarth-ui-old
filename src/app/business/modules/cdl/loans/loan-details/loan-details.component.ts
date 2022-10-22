import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../../../../../src/app/shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ViewFileComponent } from './view-file/view-file.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { CdlService } from '../../cdl.service';

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
  loanStatus: string = '';
  paramsValue: any;
  address1: string;
  address2: string;
  city: string;
  bankData: any;
  loanId: any;
  state: string;
  pincode: string;
  loanData: any;
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
    this.activated_route.params.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.loanId = params.id;
          this.cdlservice.getLoanById(params.id).subscribe((data) => {
            this.loanData = data;
            this.cdlservice.getBankDetailsById(params.id).subscribe((data) => {
              this.bankData = data;
              console.log("BankData", this.bankData)
            });
          });

        }
      }
    })
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
      (data) => {
        if (data) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              type: 'sanctioned'
            }
          };
          this.snackbarService.openSnackBar("Loan Sanctioned Successfully");
          this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
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
        if (data) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              type: 'redirected'
            }
          };
          this.snackbarService.openSnackBar("Loan Redirected Successfully");
          this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
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
        if (data) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              type: 'rejected'
            }
          };
          this.snackbarService.openSnackBar("Loan Rejected Successfully");
          this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
        }
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
