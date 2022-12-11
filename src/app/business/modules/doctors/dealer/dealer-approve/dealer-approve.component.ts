import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../../../../../src/app/shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ViewFileComponent } from './view-file/view-file.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../loans/confirm-box/confirm-box.component';
import { CdlService } from '../../cdl.service';

@Component({
  selector: 'app-dealer-approve',
  templateUrl: './dealer-approve.component.html',
  styleUrls: ['./dealer-approve.component.css']
})
export class DealerApproveComponent implements OnInit {
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
  dealerData: any;
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
    this.activated_route.queryParams.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.cdlservice.getDealerById(params.id).subscribe((data) => {
            this.dealerData = data;
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
  approveDealer(id) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "approveDealer",
        dealerId: id
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data) {
          this.cdlservice.approveDealer(id, data).subscribe(() => {
            this.snackbarService.openSnackBar("Dealer Approved Successfully");
            this.router.navigate(['provider', 'cdl', 'dealers', 'view', id]);
          },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
            })
        }
      });
  }
  suspendDealer(id) {
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
        if (data && data.type == 'remarks') {
          let dealerNote = {
            "note": data.remarks
          };
          this.cdlservice.suspendDealer(id, dealerNote).subscribe(() => {
            this.snackbarService.openSnackBar("Dealer Suspended Successfully");
            this.router.navigate(['provider', 'cdl', 'dealers']);
          },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
            })
        }
      });
  }

  rejectDealer(id) {
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
        if (data && data.type == 'remarks') {
          let dealerNote = {
            "note": data.remarks
          };
          this.cdlservice.rejectDealer(id, dealerNote).subscribe(() => {
            this.snackbarService.openSnackBar("Dealer Rejected Successfully");
            this.router.navigate(['provider', 'cdl', 'dealers']);
          },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
            })
        }
      });
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
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'action'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'create'], navigationExtras);
  }

}
