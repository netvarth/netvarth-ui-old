import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  statusDisplayName: any;
  statusLeadsList: any = [
    {
      'loanId': 48235,
      'CustomerName': 'Krishna',
      'phone': '5784589456',
      'email': 'krishna@gmail.com',
      'status': 'Willing'
    },
    {
      'loanId': 48236,
      'CustomerName': 'Aswin',
      'phone': '6987453214',
      'email': 'aswin@gmail.com',
      'status': 'Willing'
    },
    {
      'loanId': 48237,
      'CustomerName': 'Dheeraj',
      'phone': '8645784586',
      'email': 'dheeraj@gmail.com',
      'status': 'Not Willing'
    },
    {
      'loanId': 48238,
      'CustomerName': 'Narendra ',
      'phone': '9854762587',
      'email': 'narendra@gmail.com',
      'status': 'Willing'
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

  statusChange(event) {
    if (event.value.name == 'All') {
      // this.getLoans();
    }
    else {
      let api_filter = {}
      if (event.value.name == 'Rejected') {
        api_filter['applicationStatus-eq'] = event.value.name;
      }
      else {
        api_filter['spInternalStatus-eq'] = event.value.name;
      }
      // this.getLoansByFilter(api_filter);
    }
  }

  goBack() {
    this.location.back();
  }
  loanDetails(data) {
    console.log(data);
    // const status = data['status'];
    // const customerName = data['CustomerName']
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     type: 'loanDetails',
    //     status: status,
    //     customerName: customerName
    //   }
    // };
    this.router.navigate(['provider', 'dl', 'loans', 'loanapp_a907e477-76d0-4968-8613-165e12d1c330']);
  }


  continueApplication() {
    this.router.navigate(['provider', 'dl', 'loans', 'create']);
  }

}
