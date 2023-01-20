import { Component, Inject, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CdlService } from '../../../cdl.service';

@Component({
  selector: 'app-dpn-letter',
  templateUrl: './dpn-letter.component.html',
  styleUrls: ['./dpn-letter.component.css']
})
export class DpnLetterComponent implements OnInit {
  timetype: number = 1;
  from: any;
  type: any;
  user: any;
  reportData: any;
  currentDate = new Date();
  loanId: any;
  loanData: any;
  constructor(
    public dialogRef: MatDialogRef<DpnLetterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupStorageService,
    private ActivatedRoute: ActivatedRoute,
    private location: Location,
    private cdlservice: CdlService
  ) {
    this.ActivatedRoute.params.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.loanId = params.id;
          this.cdlservice.getLoanById(params.id).subscribe((data: any) => {
            this.loanData = data;
          });
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

