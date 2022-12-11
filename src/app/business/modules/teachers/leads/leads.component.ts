import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

  user: any;
  statusLeadsList: any = [
    {
      'loanId': 48235,
      'CustomerName': 'David',
      'phone': '5784589456',
      'email': 'david@gmail.com'
    },
    {
      'loanId': 48236,
      'CustomerName': 'Aswin',
      'phone': '6987453214',
      'email': 'aswin@gmail.com'
    },
    {
      'loanId': 48237,
      'CustomerName': 'Atul',
      'phone': '8645784586',
      'email': 'atul@gmail.com'
    },
    {
      'loanId': 48238,
      'CustomerName': 'Davika',
      'phone': '9854762587',
      'email': 'davika@gmail.com'
    }
  ]
  headerName: string = ''
  loans: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.activated_route.queryParams.subscribe((params) => {
      if (params) {
        this.headerName = "All Leads";
      }


      if (params.type && params.type != 'all') {
        this.loans = this.statusLeadsList.filter(i => i.status == params.type)
      }
      else {
        this.loans = this.statusLeadsList;
      }

    });

  }
  goBack() {
    this.location.back();
  }
  loanDetails(data) {
    console.log(data);
    const status = data['status'];
    const customerName = data['CustomerName']
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'loanDetails',
        status: status,
        customerName: customerName
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'loanDetails'], navigationExtras);
  }


  continueApplication() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

}
