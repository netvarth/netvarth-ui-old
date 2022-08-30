import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ConsumerServices } from '../../../services/consumer-services.service';


@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit, OnChanges {
  panelOpenState: any = false;
  @Input() user_details;
  @Input() orders;
  @Input() custom_id;
  ongoing_papers: any = [];
  completed_papers: any = [];
  cancelled_papers: any = [];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  history: any;

  constructor(
    private consumer_services: ConsumerServices,
    private router: Router,
    private lStorageService: LocalStorageService,

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.initOrder();
  }
  initOrder() {
    if (this.orders && this.orders.length > 0) {
      console.log('this.orders', this.orders)
      this.ongoing_papers = this.orders.filter(p => p.orderStatus == "Order Confirmed" || p.orderStatus == "Paper Submitted" || p.orderStatus == "In review");
      console.log('this.ongoing_papers', this.ongoing_papers)
      this.completed_papers = this.orders.filter(p => p.orderStatus == "Completed");
      this.cancelled_papers = this.orders.filter(p => p.orderStatus == "Cancelled");
    }

  }

  ngOnInit(): void {
    this.initOrder();
    console.log('this.user_details', this.user_details)
    this.consumer_services.getConsumerOrders().subscribe(
      (data) => {
        this.history = data;
        console.log("this.history", this.history.filter(p => p.catalog.catalogType == "submission"))
      });
  }

  viewPaper(accountid, uid, providerid) {
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
    if (this.custom_id) {
      this.router.navigate(['consumer', 'orderdetails'], navigationExtras);
    }
  }

  uploadPaper() {
    const source = this.lStorageService.getitemfromLocalStorage('source');
    console.log(source);
    if (source) {
      window.location.href = source;
      this.lStorageService.removeitemfromLocalStorage('reqFrom');
      this.lStorageService.removeitemfromLocalStorage('source');
    }
    let url = '/53a2k52/catalog/289/item/1505'
    this.router.navigateByUrl(url);
  }

}
