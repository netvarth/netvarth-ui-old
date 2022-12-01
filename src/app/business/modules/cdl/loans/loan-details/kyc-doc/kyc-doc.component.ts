import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../../../cdl.service';

@Component({
  selector: 'app-kyc-doc',
  templateUrl: './kyc-doc.component.html',
  styleUrls: ['./kyc-doc.component.css']
})
export class KycDocComponent implements OnInit {
  loanId: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private cdlService: CdlService
  ) { }
  loanData: any;
  ngOnInit(): void {
    this.activatedroute.params.subscribe((params) => {
      if (params && params.id) {
        this.loanId = params.id;
        console.log("LoanId", this.loanId);
        if (this.loanId) {
          this.getLaonData()
        }
      }
    })
  }

  docPrint() {
    const printWindow = window.open('', '');
    printWindow.print();
  }

  getLaonData() {
    this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {
      console.log("LoanData", data);
      this.loanData = data;
    })
  }


}
