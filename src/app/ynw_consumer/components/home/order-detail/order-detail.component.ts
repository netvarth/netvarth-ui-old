import { Component, Inject, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
// import { ConsumerServices } from '../../../services/consumer-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { DOCUMENT, Location } from '@angular/common';
import { projectConstants } from '../../../../app.component';
import { ActionPopupComponent } from '../action-popup/action-popup.component';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ConsumerServices } from '../../../services/consumer-services.service';
import { CommunicationComponent } from '../../../../shared/components/communication/communication.component';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from '../../../../../../node_modules/subsink';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit,OnDestroy {

  msgCount: number;
  communication_history: any[];
  titlename = 'Order Details';
  ynwUuid: any;
  providerId: any;
  customer_label: any;
  provider_label: any;
  cust_notes_cap: any;
  checkin_label: string;
  waitlist;
  api_loading = false;
  fav_providers;
  fav_providers_id_list: any[];
  qr_value: string;
  path = projectConstantsLocal.PATH;
  view_more = false;
  actiondialogRef: any;
  elementType = 'url';
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  display_dateFormat = projectConstants.DATE_FORMAT_WITH_MONTH;
  screenWidth: number;
  no_of_grids: any;
  showView = 'grid';
  showSide = false;
  storeContact: any;
  showNteSection = false;
  noteIndex: any;
  image_list_popup: Image[];
  imagelist: any = [];
customPlainGalleryRowConfig: PlainGalleryConfig = {
  strategy: PlainGalleryStrategy.CUSTOM,
  layout: new AdvancedLayout(-1, true)
};
customButtonsFontAwesomeConfig: ButtonsConfig = {
visible: true,
strategy: ButtonsStrategy.CUSTOM,
buttons: [
    {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
    }
]
};
  retval: Promise<void>;
  s3url;
  terminologiesjson: ArrayBuffer;
  provider_id;
  delivery_address: any;
  private subs=new SubSink();
  questionnaires: any = [];
  history: boolean = false;
  constructor(
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public locationobj: Location,
    public shared_functions: SharedFunctions,
    private router: Router,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    @Inject(DOCUMENT) public document,
    private consumer_services: ConsumerServices,
    private sharedServices: SharedServices,
    private s3Processor: S3UrlProcessor
  ) {
    this.subs.sink=this.activated_route.queryParams.subscribe(
      (qParams) => {
        this.ynwUuid = qParams.uuid;
        if (this.ynwUuid.startsWith('h_')) {
          this.history = true;
        }
        this.providerId = qParams.providerId;
      });
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
    this.checkin_label = 'order';
    this.cust_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
    const divident = this.screenWidth / 37.8;
    if (this.screenWidth > 1000) {
       divider = divident / 6;
    } else if (this.screenWidth > 500 && this.screenWidth < 1000) {
      divider = divident / 4;
    } else if (this.screenWidth > 375 && this.screenWidth < 500) {
      divider = divident / 3;
    } else if (this.screenWidth < 375) {
      divider = divident / 2;
    }
    this.no_of_grids = Math.round(divident / divider);
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit() {
    this.getCommunicationHistory();
    this.getOrderDetails();
    this.getStoreContact();
    this.getFavouriteProvider();
  }
  getOrderDetails(){
    this.subs.sink=this.sharedServices.getOrderByConsumerUUID(this.ynwUuid, this.providerId).subscribe(
      (data) => {
        this.waitlist = data;
        console.log(this.waitlist);
        if (this.waitlist.homeDeliveryAddress) {
          this.delivery_address = this.waitlist.homeDeliveryAddress;
        }
        this.provider_id = this.waitlist.providerAccount.uniqueId;
        this.gets3curl();
        this.image_list_popup = [];
        if (this.waitlist && this.waitlist.shoppingList) {
          this.imagelist = this.waitlist.shoppingList;
          console.log(this.imagelist);
          for (let i = 0; i < this.imagelist.length; i++) {
            const imgobj = new Image(
              i,
              { // modal
                  img: this.imagelist[i].s3path,
                  description: this.imagelist[i].caption || ''
              });
              console.log(imgobj);
          this.image_list_popup.push(imgobj);
          }
        }
        if (this.waitlist.questionnaires && this.waitlist.questionnaires.length > 0) {
          this.questionnaires = this.waitlist.questionnaires;
        }
        if (this.waitlist.releasedQnr && this.waitlist.releasedQnr.length > 0 && this.waitlist.orderStatus !== 'Cancelled') {
          const releasedQnrs = this.waitlist.releasedQnr.filter(qnr => qnr.status === 'released');
          if (releasedQnrs.length > 0) {
            this.getReleasedQnrs(releasedQnrs);
          }
        }
        this.generateQR();
      },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  gets3curl() {
    this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,null, 'terminologies').subscribe(
      (accountS3s) => {   
        if (accountS3s['terminologies']){
          this.terminologiesjson = this.s3Processor.getJson(accountS3s['terminologies']);
        }
      });
  }
  getTerminologyTerm(term) {
    const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
    if (this.terminologiesjson) {
      return this.wordProcessor.firstToUpper((this.terminologiesjson[term_only]) ? this.terminologiesjson[term_only] : ((term === term_only) ? term_only : term));
    } else {
      return this.wordProcessor.firstToUpper((term === term_only) ? term_only : term);
    }
  }
  generateQR() {
    console.log(this.waitlist);
    console.log(this.waitlist.orderNumber);
    this.qr_value = this.path + 'status/' + this.waitlist.orderNumber;
    console.log(this.qr_value);
  }

  getCommunicationHistory() {
    this.subs.sink=this.consumer_services.getConsumerCommunications(this.providerId)
      .subscribe(
        data => {
          console.log(JSON.stringify(data));
          const history: any = data;
          this.communication_history = [];
          for (const his of history) {
            if (his.waitlistId === this.ynwUuid) {
              this.communication_history.push(his);
            }
          }
          this.msgCount = this.communication_history.length;
          this.sortMessages();
          this.api_loading = true;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  sortMessages() {
    this.communication_history.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return 11;
      } else if (message1.timeStamp > message2.timeStamp) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  gotoPrev() {
    // this.locationobj.back();
    this.router.navigate(['consumer'] ,{ queryParams: { 'source': 'order'}});

  }
  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }
  checkIfFav(id) {
    let fav = false;
    console.log(this.fav_providers_id_list);
    if (this.fav_providers_id_list) {
      this.fav_providers_id_list.map((e) => {
        if (e === id) {
          fav = true;
        }
      });
      return fav;
    }
  }
  getFavouriteProvider() {
   this.subs.sink= this.sharedServices.getFavProvider()
      .subscribe(
        data => {
          this.fav_providers = data;
          console.log('favorite proividerasa'+ this.fav_providers);
          this.fav_providers_id_list = [];
          this.setWaitlistTimeDetails();
        },
        error => {
        }
      );
  }
  setWaitlistTimeDetails() {
    for (const x of this.fav_providers) {
      this.fav_providers_id_list.push(x.id);
    }
  }
  doDeleteFavProvider(fav, event) {
    event.stopPropagation();
    if (!fav.id) {
      return false;
    }
    this.shared_functions.doDeleteFavProvider(fav, this)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.getFavouriteProvider();
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  addFavProvider(id, event) {
    event.stopPropagation();
    if (!id) {
      return false;
    }
    this.subs.sink=this.sharedServices.addProvidertoFavourite(id)
      .subscribe(
        data => {
          this.getFavouriteProvider();
        },
        error => {
        }
      );
  }
  viewMore() {
    this.view_more = !this.view_more;
  }
  gotoActions(booking) {
    console.log("Notes : ",booking);
    this.actiondialogRef = this.dialog.open(ActionPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: { booking }
    });
    this.actiondialogRef.afterClosed().subscribe(data => {
    });
  }
  getValue(data) {
    this.showView = data;
  }
  sidebar() {
    this.showSide = true;
  }
  closeNav() {
    this.showSide = false;
  }
  getStoreContact() {
    console.log('store');
    this.subs.sink=this.sharedServices.getStoreContact(this.providerId)
      .subscribe((data: any) => {
        console.log(data);
        this.storeContact = data;
      });
  }
  showNote(index) {
    console.log(index);
    this.noteIndex = [];
    this.noteIndex = index;
    this.showNteSection = !this.showNteSection;
  }
  openImageModalRow(image: Image) {
    console.log(image);
    console.log(this.image_list_popup);
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }



  showCommunication() {
    const dialogRef = this.dialog.open(CommunicationComponent, {
      width: '45%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        message: this.communication_history,
        type: 'consumer',
        id: this.waitlist.uid,
        orderDetails: this.waitlist
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result === 'reloadlist') {
        console.log('iisde');
        this.getCommunicationHistory();
      }
    });
  }
  getReleasedQnrs(releasedQnrs) {
    this.sharedServices.getOrderQuestionnaireByUid(this.ynwUuid, this.providerId)
      .subscribe(
        (data: any) => {
          const qnrs = data.filter(function (o1) {
            return releasedQnrs.some(function (o2) {
              return o1.id === o2.id;
            });
          });
          this.questionnaires = this.questionnaires.concat(qnrs);
          console.log(this.questionnaires + 'this.questionnaires') 
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getQuestionAnswers(event) {
    if (event === 'reload') {
      this.getOrderDetails();
    }
  }
  getQnrStatus(qnr) {
    const id = (qnr.questionnaireId) ? qnr.questionnaireId : qnr.id;
    const questr = this.waitlist.releasedQnr.filter(questionnaire => questionnaire.id === id);
    if (questr[0]) {
      return questr[0].status;
    }
  }
}

