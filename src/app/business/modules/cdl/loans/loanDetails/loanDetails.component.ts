import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../../../../../src/app/shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ViewFileComponent } from './view-file/view-file.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-loanDetails',
  templateUrl: './loanDetails.component.html',
  styleUrls: ['./loanDetails.component.css']
})
export class loanDetailsComponent implements OnInit {
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
  state: string;
  pincode: string;
  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private groupService: GroupStorageService,
    private dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.activated_route.queryParams.subscribe((params) => {
      console.log('params', params);
      if (params) {
        this.paramsValue = params;
        if (params && params.type && params.type === 'loanDetails') {
          let tempHeaderName: string = ''
          tempHeaderName = params.type.substring(0, 4) + " " + params.type.substring(4);
          if (tempHeaderName) {
            this.headerName = tempHeaderName;
          }

          if (params.status) {
            this.status = params.status;
          }
          this.personalDetails()

        }
      }
    })
  }
  personalDetails() {
    if (this.paramsValue && this.paramsValue.customerName) {
      this.customerName = this.paramsValue.customerName
    }
    this.employeephNo = '+919633360166';
    this.employeeEmail = this.customerName.toLowerCase() + '@gmail.com';
    this.employeeMartialStatus = 'Married';
    this.employeeEmployeeTYpe = 'Salaried';
    this.employeeSalary = 440000;
    this.address1 = "Vellara Building,1st Floor";
    this.address2 = "Museum Crosslane";
    this.city = "Thrissur";
    this.state = "Kerala";
    this.pincode = "680020";
    this.employeeOffAdd = 'Thrissur';
    this.employeeCityWork = 'Thrissur';
    this.employeeREsidence = 'Thrissur';
    this.employeeHomeAdd = 'Thrissur';
    this.adharNumber = 5454545545454544;
    this.panCardNumber = '545454554gasd';
    this.accountNumber = '5454545545454544';
    this.IFSCCode = 'KOTAKSDA12F';
    this.bankName = 'KODAK';
    this.emiPaidNo = 2;
    this.cibilScore = 250;
    this.mafilScore = 200;
    this.totalScore = 440;
    this.perfiosScore = 120;
    if (this.paramsValue && this.paramsValue.status) {
      this.loanStatus = this.paramsValue.status;
    }


  }
  goBack() {
    this.location.back();
  }
  sanctionLoan() {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     timetype: 1,
    //     from: "creditofficer"
    //   }
    // };
    this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
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
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'rejected'
      }
    };
    this.snackbarService.openSnackBar("Loan Rejected Successfully");
    this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  }



  viewFile(file) {
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: file
      }
    });
    dialogRef.afterClosed();
  }

  takeAction() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

}
