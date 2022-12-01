import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kyc-doc',
  templateUrl: './kyc-doc.component.html',
  styleUrls: ['./kyc-doc.component.css']
})
export class KycDocComponent implements OnInit {
  loanId: any;
  constructor(
    private activatedroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe((params) => {
      if (params && params.uid) {
        this.loanId = params.uid;
      }
    })
    window.print()
  }

}
