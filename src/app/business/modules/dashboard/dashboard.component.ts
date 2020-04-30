import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  breadcrumb_moreOptions: any = [];
  domain:any;
  breadcrumbs = [
    {
      title: 'Dashboard'
    }
  ];
  constructor(
    private shared_functions:SharedFunctions,
    private router :Router
  ) {
   
   }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreOptions = { 
      'show_learnmore': true, 'scrollkey': 'dashboard-home',
      'actions': [{'title': 'Help', 'type': 'learnmore'}]
    };
  }
  performActions(action) 
  {
    if(action==='learnmore')
    {
      this.router.navigate(['/provider/' + this.domain + '/dashboard-home']);
    }
  }

}
