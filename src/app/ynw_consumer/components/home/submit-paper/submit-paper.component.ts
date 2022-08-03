import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms'  
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { SubSink } from '../../../../../../node_modules/subsink';
import { SharedServices } from '../../../../../../src/app/shared/services/shared-services';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-submit-paper',
  templateUrl: './submit-paper.component.html',
  styleUrls: ['./submit-paper.component.css']
})
export class SubmitPaperComponent implements OnInit {

  authorForm: FormGroup;  
  timetype: number = 1;
  questionnaireList: any = [];
  questionAnswers;
  questionnaireLoaded: boolean;
  private subs = new SubSink();
  qnr: boolean;
  catalogId: any;
  accountId: any;
  order: any;
  total_price: any;
  customId: any;
  catalog_loading: boolean;
  catalog_details: any;
  store_pickup: boolean;
  choose_type: string;
  sel_checkindate: any;
  nextAvailableTime: string;
  home_delivery: boolean;
  deliveryCharge: any;
  advance_amount: any;
  showfuturediv: boolean;
  server_date: any;
  today: any;
  dateTimeProcessor: any;
  minDate: any;
  todaydate: any;
  maxDate: any;
  isFuturedate: any;
  account_id: any;
  couponsList: any;
  constructor(
  public provider_services: ProviderServices,
  public _location: Location,
  private fb:FormBuilder,
  public activateroute: ActivatedRoute,
  private shared_services: SharedServices,
  private lStorageService: LocalStorageService,
  private router: Router

  ) { 
     this.authorForm = this.fb.group({  
      authors: this.fb.array([]),
    });  
    this.activateroute.queryParams.subscribe(params => {
      console.log("params",params);
      if(params.account_id && params.catalog_id)
      {
        this.catalogId = params.catalog_id;
        this.accountId = params.account_id;
      }
      this.customId = params.customId;
    });
  }

  ngOnInit(): void {
    this.getConsumerQuestionnaire();
    this.getProviderCatalogs();
    this.order =  this.lStorageService.getitemfromLocalStorage('order');
    console.log('this.order',this.order);
    this.total_price = this.order[0].item.price;
    this.confirmOrder()
  }

  previous()
  {
    this._location.back();
  }

  //   authors() : FormArray {
  //   return this.authorForm.get("authors") as FormArray  
  // }
  
  // newAuthor(): FormGroup {  
  //   return this.fb.group({  
  //     name: '',  
  //     email: '',
  //     designation: '',  
  //     institution: '',  
  //   })  
  // }  

  

  //  addAuthor() {  
  //   this.authors().push(this.newAuthor());  
  // }  

  // removeAuthor(i:number) {  
  // this.authors().removeAt(i);  
  // }  

  //  onSubmit() {  
  //   console.log(this.authorForm.value);  
  // }


  getCatalogDetails(accountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getConsumerCatalogs(accountId)
        .subscribe(
          (data: any) => {
            resolve(data[0]);
          },
          () => {
            reject();
          }
        );
    });
}

fetchCatalog() {
    this.getCatalogDetails(this.accountId).then(data => {
      this.catalog_loading = true;
      this.catalog_details = data;
      console.log(this.catalog_details);
      if (this.catalog_details) {
        if (this.catalog_details.pickUp) {
          if (this.catalog_details.pickUp.orderPickUp && this.catalog_details.nextAvailablePickUpDetails) {
            this.store_pickup = true;
            this.choose_type = 'store';
            this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
            this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
          }
        }
        if (this.catalog_details.homeDelivery) {
          if (this.catalog_details.homeDelivery.homeDelivery && this.catalog_details.nextAvailableDeliveryDetails) {
            this.home_delivery = true;

            if (!this.store_pickup) {
              this.choose_type = 'home';
              this.deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
              this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
              this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];

            }
          }
        }
        this.advance_amount = this.catalog_details.advanceAmount;
      }
      this.showfuturediv = false;
      this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
      this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
      this.today = new Date(this.today);
      this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
      this.minDate = new Date(this.minDate);
      const dd = this.today.getDate();
      const mm = this.today.getMonth() + 1; // January is 0!
      const yyyy = this.today.getFullYear();
      let cday = '';
      if (dd < 10) {
        cday = '0' + dd;
      } else {
        cday = '' + dd;
      }
      let cmon;
      if (mm < 10) {
        cmon = '0' + mm;
      } else {
        cmon = '' + mm;
      }
      const dtoday = yyyy + '-' + cmon + '-' + cday;
      this.todaydate = dtoday;
      this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
      if (this.todaydate === this.sel_checkindate) {
        this.isFuturedate = false;
      } else {
        this.isFuturedate = true;
      }

    });
  }


  confirmOrder() {
      this.lStorageService.setitemonLocalStorage('order', this.order);
    
      this.catalog_details = this.lStorageService.getitemfromLocalStorage('active_catalog');

      console.log("Active Catalog : ",this.lStorageService);

      const chosenDateTime = {
        delivery_type: "",
        catlog_id: this.catalog_details.id,
        nextAvailableTime: this.nextAvailableTime,
        order_date: this.sel_checkindate,
        advance_amount: this.catalog_details.advance_amount,
        account_id: this.accountId,
        couponsList: this.couponsList
      };

      let queryParam = {
        providerId: this.accountId,
      };
      if (this.customId) {
        queryParam['customId'] = this.customId;
      }
      
      if(this.catalogId ){
        queryParam['catalog_Id']= this.catalogId;
      }

      queryParam['source']= "paper";
     
      const navigationExtras: NavigationExtras = {
        queryParams: queryParam,
      };

      this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
      this.router.navigate(['order', 'shoppingcart', 'checkout'],navigationExtras);

  }



  getConsumerQuestionnaire() {
    this.subs.sink = this.shared_services.getConsumerOrderQuestionnaire(this.catalogId, this.accountId).subscribe(data => {
      this.questionnaireList = data;
      if (this.questionnaireList.questionnaireId) {
        this.qnr = true;
      }

      console.log(this.questionnaireList)
      this.questionnaireLoaded = true;
    });

  }


  getProviderCatalogs() {
    this.subs.sink = this.provider_services.getProviderCatalogs(this.catalogId).subscribe(data => {
      this.questionnaireList = data;
      console.log("catalog data",this.questionnaireList)
    });

  }

  getQuestionAnswers(event) 
  {
    this.questionAnswers = null;
    this.questionAnswers = event;
  }
  goNext()
  {
    this.timetype +=1
  }

  goBack()
  {
    if(this.timetype == 1)
    {
      this.previous();
    }
    else
    {
      this.timetype -=1;
    }
  }

}
