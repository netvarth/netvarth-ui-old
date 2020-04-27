import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html'
})
export class DashboardHomeComponent implements OnInit {
  breadcrumb_moreoptions: any = [];
  domain: any;
  breadcrumbs = [
    {
      title: 'Home'
    }
  ];
  constructor(
    public shared_functions: SharedFunctions,
    private router:Router
  ) { }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'dashboard-home', 
      'actions': [ { 'title': 'Help', 'type': 'learnmore' }]
  };
  }
  performActions(action) {
   if (action === 'learnmore') {
        this.router.navigate(['/provider/' + this.domain + '/dashboard-home']);
    }
}

}
