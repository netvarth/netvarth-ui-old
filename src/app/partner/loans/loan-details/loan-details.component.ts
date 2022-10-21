import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
// import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ViewFileComponent } from './view-file/view-file.component';
import { MatDialog } from '@angular/material/dialog';
import { PartnerService } from '../../partner.service';

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
  state: string;
  pincode: string;
  loanData: any;
  constructor(
    // private snackbarService: SnackbarService,
    // private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private groupService: GroupStorageService,
    private dialog: MatDialog,
    private partnerservice: PartnerService
  ) { }
  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.activated_route.params.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.partnerservice.getLoanById(params.id).subscribe((data) => {
            this.loanData = data;
          });
          this.personalDetails()

        }
      }
    })
  }
  personalDetails() {

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

  // takeAction() {
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       type: 'action'
  //     }
  //   };
  //   this.router.navigate(['provider', 'cdl', 'loans', 'create'], navigationExtras);
  // }

}
