import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../../../cdl.service';

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
    private cdlService: CdlService
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


}
