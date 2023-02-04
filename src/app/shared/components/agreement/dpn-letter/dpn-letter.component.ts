import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AgreementService } from '../agreement.service';
import { SignatureComponent } from '../signature/signature.component';
import { Location } from '@angular/common';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
@Component({
  selector: 'app-dpn-letter',
  templateUrl: './dpn-letter.component.html',
  styleUrls: ['./dpn-letter.component.css']
})
export class DpnLetterComponent implements OnInit {
  screenHeight: any;
  screenWidth: any;

  timetype: number = 1;
  from: any;
  type: any;
  user: any;
  reportData: any;
  currentDate = new Date();
  loanId: any;
  loanData: any;
  accountId: any;


  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DpnLetterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ActivatedRoute: ActivatedRoute,
    private location: Location,
    private agreementService: AgreementService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    this.ActivatedRoute.queryParams.subscribe((params) => {
      if (params) {
        if (params && params.uid) {
          this.loanId = params.uid;
          if (params && params.account) {
            this.accountId = params.account;
          }
          if (this.loanId && this.accountId) {
            this.agreementService.getLoanFromOutside(this.loanId, this.accountId).subscribe((data: any) => {
              this.loanData = data;
              if (this.loanData.spInternalStatus == 'kjkjk') {
                this.snackbarService.openSnackBar("Link Expired or Invalid");
                this.router.navigate(['/']);
              }
            });
          }
        }
      }
    })
  }

  ngOnInit(): void {
    // this.user = this.groupService.getitemFromGroupStorage('ynw-user');
  }

  @HostListener('window:resize', ['$event'])
  onReSize() {
    if (window && window.innerWidth) {
      if (window.innerWidth <= 768) {
        this.screenHeight = '90%';
      }
      else {
        //  this.ScreenHeight='85%';
        this.screenWidth = '50%'
      }
    }

  }

  manualSignature() {
    const height: any = this.screenHeight;
    const uploadmanualsignatureRef = this.dialog.open(SignatureComponent, {
      width: this.screenWidth,
      height: height,//this.ScreenHeight,
      panelClass: ['popup-class'],
      disableClose: true,
      data: {

      }
    });
    uploadmanualsignatureRef.afterClosed().subscribe((res) => {

    }
    );
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
