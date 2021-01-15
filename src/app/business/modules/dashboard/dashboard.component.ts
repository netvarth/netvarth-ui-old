import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

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
    private router :Router,
    private groupService: GroupStorageService
  ) {
   
   }

  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
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
