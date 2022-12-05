import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../../../cdl.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-loan-details-doc',
  templateUrl: './loan-details-doc.component.html',
  styleUrls: ['./loan-details-doc.component.css']
})
export class LoanDetailsDocComponent implements OnInit {

  loanId: any;
  accountId: any;
  phoneNumber: any;
  email: any;
  loanData: any;
  type: any = 'agreement';
  currentDate = new Date();
  constructor(
    private activatedroute: ActivatedRoute,
    private cdlService: CdlService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe((params) => {
      if (params && params.id) {
        this.loanId = params.id;
        if (this.loanId) {
          this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {
            console.log("LoanData", data);
            this.loanData = data;
          }, (error) => {
            console.log(error)
          })
        }
      }
    })


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
    WindowPrt.close();
  }

  goBack() {
    this.location.back();
  }


}
