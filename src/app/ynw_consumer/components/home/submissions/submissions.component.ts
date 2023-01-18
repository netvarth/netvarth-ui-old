import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ConsumerServices } from '../../../services/consumer-services.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit, OnChanges {
  panelOpenState: any = false;
  @Input() user_details;
  @Input() orders;
  @Input() accountId;
  @Input() custom_id;
  private subs = new SubSink();
  ongoing_papers: any = [];
  completed_papers: any = [];
  cancelled_papers: any = [];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  history: any;
  entire_history: any=[];
  paperSubmitLink: string;

  constructor(
    // private consumer_services: ConsumerServices,
    private router: Router,
    private lStorageService: LocalStorageService,
    private consumer_services: ConsumerServices


  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("New ORder:", this.orders);
    this.initOrder();
  }
  initOrder() {
    const _this = this;
    // if (_this.orders && _this.orders.length > 0) 
    // this.orders = this.orders.concat(this.entire_history);

    if (_this.orders && _this.orders.length > 0) {
      _this.orders = _this.orders.filter(p => p.account == _this.accountId);
    }
    if (_this.entire_history.length > 0) {
      _this.orders = _this.orders.concat(_this.entire_history);
    }
    if (_this.orders && _this.orders.length > 0) {
      _this.ongoing_papers = _this.orders.filter(p => p.orderStatus == "Order Confirmed" || p.orderStatus == "Paper Submitted" || p.orderStatus == "In review");
      _this.completed_papers = _this.orders.filter(p => p.orderStatus == "Completed");
      _this.cancelled_papers = _this.orders.filter(p => p.orderStatus == "Cancelled");
    }
  // }
  // }
}

getOrderHistory() {
  const _this = this;
  return new Promise(function (resolve) {
    const api_filter = {};
    if (_this.accountId) {
      api_filter['account-eq'] = _this.accountId;
    }
    _this.subs.sink = _this.consumer_services.getOrderHistory(api_filter)
      .subscribe(
        data => {
          resolve(data);
        }, (error) => {
          resolve([]);
        }
      );
  });
}

ngOnInit(): void {
  const _this = this;
  _this.getOrderHistory().then(
    (history: any) => {
      _this.entire_history = history;
      _this.initOrder();
    }
  );
  _this.consumer_services.GetConsumerCatalogs(_this.accountId).subscribe((catalogs) => {
    _this.paperSubmitLink = '/' + _this.custom_id + '/catalog/' + catalogs[0].id + '/item/' + catalogs[0].catalogItem[0].id;
  })
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
  if (source) {
    window.location.href = source;
    this.lStorageService.removeitemfromLocalStorage('reqFrom');
    this.lStorageService.removeitemfromLocalStorage('source');
  }
  // let url = '/53a2k52/catalog/289/item/1505'
  // let url = 'Authordemy/catalog/226/item/1354';
  this.router.navigateByUrl(this.paperSubmitLink);
}
}
