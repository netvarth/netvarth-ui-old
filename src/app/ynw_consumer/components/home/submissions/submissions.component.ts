import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
panelOpenState: false;
@Input() user_details;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  viewPaper()
  {
    this.router.navigate(['consumer','paperdetails']);
  }

  uploadPaper()
  {
    this.router.navigate(['53a37k7']);
  }


}
