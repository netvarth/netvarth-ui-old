import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { IvrService } from '../ivr.service';

@Component({
  selector: 'app-view-call',
  templateUrl: './view-call.component.html',
  styleUrls: ['./view-call.component.css']
})
export class ViewCallComponent implements OnInit {
  callUid: any;
  callData: any;
  callHistories: any;
  customerDetails: any;
  tokens: any;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ivrService: IvrService,
  ) {
    this.ActivatedRoute.params.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.callUid = params.id;
          this.ivrService.getAllIvrCallsByUid(params.id).subscribe((data) => {
            this.callData = data;
            console.log("this.callData", this.callData)
            if (this.callData && this.callData.userCallHistories) {
              this.callHistories = this.callData.userCallHistories;
            }
            if (this.callData && this.callData.consumerId) {
              this.getCustomerDetails(this.callData.consumerId);
              // this.getCustomerTokens(this.callData.consumerId);
              this.getCustomerTokens(34609);
            }
          });

        }
      }
    })
  }



  ngOnInit(): void {
  }

  getCustomerTokens(id) {
    this.ivrService.getCustomerTodayVisit(id).subscribe((todayData: any) => {
      this.ivrService.getCustomerFutureVisit(id).subscribe((futureData: any) => {
        this.ivrService.getCustomerHistoryVisit(id).subscribe((historyData: any) => {
          this.tokens = [...todayData, ...futureData, ...historyData]
          console.log("this.tokens", this.tokens)
        })
      })
    })
  }

  viewCustomer(id) {
    this.router.navigate(['provider', 'customers', id]);
  }

  editCustomer(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: "edit",
        id: id
      }
    };
    this.router.navigate(['provider', 'customers', 'create'], navigationExtras);
  }

  viewToken(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        timetype: 2
      }
    };
    this.router.navigate(['provider', 'check-ins', id], navigationExtras);
  }

  getCustomerDetails(id) {
    this.ivrService.getCustomerById(id).subscribe((data) => {
      this.customerDetails = data;
    })
  }

  goBack() {
    this.router.navigate(['provider', 'ivr']);
  }

}
