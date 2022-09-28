import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent implements OnInit {
  user: any;
  dealers: any = [];
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
      this.dealers = [
        {
          'dealerId': 104,
          'dealer': 'krishna',
          'status': 'requested',
          'issuedDate': '19/08/2022'
        },
      ]
    } else {
      this.dealers = [
        {
          'dealerId': 101,
          'dealer': 'david',
          'status': 'approved',
          'issuedDate': '19/08/2022'
        },
        {
          'dealerId': 102,
          'dealer': 'aswin',
          'status': 'approved',
          'issuedDate': '19/08/2022'
        },
        {
          'dealerId': 103,
          'dealer': 'mani',
          'status': 'approved',
          'issuedDate': '19/08/2022'
        },
        {
          'dealerId': 104,
          'dealer': 'krishna',
          'status': 'requested',
          'issuedDate': '19/08/2022'
        },
      ]
    }

  }
  goBack() {
    this.location.back();
  }

  showDealer(dealer) {
    if (this.type == 'requested') {
      this.router.navigate(['provider', 'cdl', 'dealers', 'create']);
    }
    else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          dealer: dealer.dealer,
          status: dealer.status
        }
      }
      this.router.navigate(['provider', 'cdl', 'dealers', 'view'], navigationExtras);
    }

  }

}
