import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit {
  timetype: number = 1;
  from: any;
  verification = false;
  constructor(
    private location: Location,
    private router: Router,
    private activated_route: ActivatedRoute,

  ) { }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  ngOnInit(): void {
    this.activated_route.queryParams.subscribe((params) => {
      if (params && params.timetype) {
        this.timetype = params.timetype;
      }
      if (params && params.from) {
        this.from = params.from;
      }
    });
  }

  resetErrors() {

  }

  goNext() {
    if (this.timetype >= 1) {
      this.timetype = this.timetype + 1;
      console.log("this.timetype", this.timetype);
    }
  }
  goBack() {
    if (this.timetype > 1 && (this.from && this.from != 'creditofficer')) {
      this.timetype = this.timetype - 1;
    }
    else {
      this.location.back();
    }
  }

  goHome() {
    this.router.navigate(['provider', 'cdl'])
  }




}
