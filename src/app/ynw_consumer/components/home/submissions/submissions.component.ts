import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
panelOpenState: false;
@Input() user_details;
@Input() orders;
@Input() custom_id;
  ongoing_papers: any;
  completed_papers: any;
  cancelled_papers: any;

  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void {
    console.log("Orders",this.orders);
    this.ongoing_papers = this.orders.filter(p => p.orderStatus=="Order Confirmed");
    this.completed_papers = this.orders.filter(p => p.orderStatus=="Completed");
    this.cancelled_papers = this.orders.filter(p => p.orderStatus=="Cancelled");
  }

  viewPaper(accountid,uid,providerid)
  {
    let queryParams = {};
    queryParams['accountId'] = accountid;
    if (this.custom_id) {
      queryParams['customId'] = this.custom_id;
    }
    queryParams['uuid'] = uid;
    queryParams['providerId'] = providerid;
    queryParams['source'] = 'paper';

    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    if(this.custom_id)
    {
      this.router.navigate(['consumer','orderdetails'],navigationExtras);
    }
  }

  uploadPaper()
  {
    let cartUrl = "hawks2/catalog/291/item/1514"
    this.router.navigateByUrl(cartUrl);
  }

}
