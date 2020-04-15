import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html'
})
export class DashboardHomeComponent implements OnInit {

  breadcrumbs = [
    {
      title: 'Home'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
