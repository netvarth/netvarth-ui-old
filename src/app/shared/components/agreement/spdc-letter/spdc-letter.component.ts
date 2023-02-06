import { Component, Inject, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AgreementService } from '../agreement.service';

@Component({
  selector: 'app-spdc-letter',
  templateUrl: './spdc-letter.component.html',
  styleUrls: ['./spdc-letter.component.css']
})
export class SpdcLetterComponent implements OnInit {
  timetype: number = 1;
  from: any;
  type: any;
  user: any;
  reportData: any;
  currentDate = new Date();
  loanId: any;
  loanData: any;
  accountId: any;
  source: any;
  constructor(
    public dialogRef: MatDialogRef<SpdcLetterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupStorageService,
    private ActivatedRoute: ActivatedRoute,
    private location: Location,
    private agreementService: AgreementService
  ) {
    this.ActivatedRoute.params.subscribe((params) => {
      if (params) {
        if (params && params.account) {
          this.accountId = params.account;
        }
        if (params && params.type) {
          this.source = params.type;
        }
        if (params && params.id) {
          this.loanId = params.id;
          this.agreementService.getLoanFromOutside(params.id, this.accountId).subscribe((data: any) => {
            this.loanData = data;
          });
        }
      }
    })
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
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
