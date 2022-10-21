import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../../cdl.service';

@Component({
  selector: 'app-consumer-agreement',
  templateUrl: './consumer-agreement.component.html',
  styleUrls: ['./consumer-agreement.component.css']
})
export class ConsumerAgreementComponent implements OnInit {
  loanId: any;
  constructor(
    private activatedroute: ActivatedRoute,
    private cdlservice: CdlService
  ) { }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe((params) => {
      if (params && params.uid) {
        this.loanId = params.uid;
      }
    })

    this.cdlservice.getLoanById(this.loanId).subscribe((data) => {
      console.log("LoanData", data);
    })
  }

}
