import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent implements OnInit {
  user: any;
  approvedLoans: any = [];
  headerName: string = ''
  type: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      // console.log('qparams',qparams)
      if (qparams && qparams.type) {
        this.type = qparams.type;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);
    console.log(this.router);
    if (this.type) {
      this.approvedLoans = [
        {
          'dealerId': 104,
          'dealer': 'Krishna',
          'status': 'Requested',
          'issuedDate': '19/08/2022'
        },
      ]
    } else {
      this.approvedLoans = [
        {
          'dealerId': 101,
          'dealer': 'David',
          'status': 'Approved',
          'issuedDate': '19/08/2022'
        },
        {
          'dealerId': 102,
          'dealer': 'Aswin',
          'status': 'Approved',
          'issuedDate': '19/08/2022'
        },
        {
          'dealerId': 103,
          'dealer': 'Mani',
          'status': 'Approved',
          'issuedDate': '19/08/2022'
        },
        {
          'dealerId': 104,
          'dealer': 'Krishna',
          'status': 'Requested',
          'issuedDate': '19/08/2022'
        },
      ]
    }

  }
  goBack() {
    this.location.back();
  }

}
