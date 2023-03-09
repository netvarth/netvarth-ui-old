import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {
  displayText: string = "You May Close This Window";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log("params", params)
      if (params) {
        if (params.type) {
          if (params.type == 'aag') {
            this.displayText = "Account Aggregated Successfully.You May Close This Window";
          }
        }
      }
    })
  }

  ngOnInit(): void {
  }

  goHome() {
    this.router.navigate(['/'])
  }
}
