import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../services/provider-services.service';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { OrderActionsComponent } from '../order-actions/order-actions.component';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { CommunicationComponent } from '../../../../shared/components/communication/communication.component';
import { Messages } from '../../../../shared/constants/project-messages';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  delivery_address: any;
  msgCount = 0;
  communication_history = [];
  uid;
  loading = false;
  orderDetails: any = [];
  orderItems: any = [];
  selectedType = 'list';
  customerLabel = '';
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_WITH_MONTH;
  no_history_found = Messages.CHECK_DET_NO_HISTORY_FOUND_CAP;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
  screenWidth;
  small_device_display = false;
  tooltipcls = projectConstantsLocal.TOOLTIP_CLS;
  image_list_popup: Image[];
  imagelist: any = [];
  orderlist_history: any = [];
  questionnaires: any = [];
  api_loading = true;
  customer_label = '';
  orderstatus: any = projectConstantsLocal.ORDER_STATUS_FILTER;
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
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(public activaterouter: ActivatedRoute,
    public providerservice: ProviderServices, private dialog: MatDialog,
    private provider_services: ProviderServices,
    public location: Location, public sharedFunctions: SharedFunctions,
    private wordProcessor: WordProcessor) {
    this.activaterouter.params
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(param => {
      this.uid = param.id;
      this.customerLabel = this.wordProcessor.getTerminologyTerm('customer');
      this.getOrderDetails(this.uid);
      this.getorderHistory(this.uid);
      this.getOrderCommunications();
    });
  }

  ngOnInit() {
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getOrderDetails(uid) {
    this.loading = true;
    this.orderItems = [];
    this.image_list_popup = [];
    this.providerservice.getProviderOrderById(uid)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(data => {
      this.orderDetails = data;
      if (this.orderDetails.questionnaires && this.orderDetails.questionnaires.length > 0) {
        this.questionnaires = this.orderDetails.questionnaires;
        console.log(this.questionnaires)
      }
      if (this.orderDetails.releasedQnr && this.orderDetails.releasedQnr.length > 0) {
        const releasedQnrs = this.orderDetails.releasedQnr.filter(qnr => qnr.status === 'released');
        if (releasedQnrs.length > 0) {
          this.getReleasedQnrs(releasedQnrs);
        }
      }
      if (this.orderDetails.homeDeliveryAddress) {
        this.delivery_address = this.orderDetails.homeDeliveryAddress;
      }
      if (this.orderDetails && this.orderDetails.orderItem) {
        for (const item of this.orderDetails.orderItem) {
          this.orderItems.push({ 'type': 'order-details-item', 'item': item });
        }
      }
      if (this.orderDetails && this.orderDetails.shoppingList) {
        this.imagelist = {
          files: [],
          base64: [],
          caption: []
        };
        this.imagelist = this.orderDetails.shoppingList;
        for (let i = 0; i < this.imagelist.length; i++) {
          const imgobj = new Image(
            i,
            { // modal
              img: this.imagelist[i].thumbPath,
              description: this.imagelist[i].caption || ''
            },this.imagelist[i].originalName);
          this.image_list_popup.push(imgobj);
          
        }
      }
      this.loading = false;
    });
  }
  getReleasedQnrs(releasedQnrs) {
    this.provider_services.getOrderQuestionnaireByUid(this.orderDetails.uid).subscribe((data: any) => {
      const qnrs = data.filter(function (o1) {
        return releasedQnrs.some(function (o2) {
          return o1.id === o2.id;
        });
      });
      this.questionnaires = this.questionnaires.concat(qnrs);
    });
  }
  getQuestionAnswers(event) {
    if (event === 'reload') {
      this.getOrderDetails(this.uid);
    }
  }
  goBack() {
    this.location.back();
  }
  selectViewType(type) {
    this.selectedType = type;
  }
  showOrderActions() {
    let timeType;
    if (this.uid.indexOf('h_') > -1){
      timeType = 3;
    }
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.orderDetails,
        source: 'details',
        type:timeType
      }
    });
    actiondialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(data => {
      this.getOrderDetails(this.uid);
      this.getorderHistory(this.uid);

    });
  }
  getItemImg(item) {
    if (item.itemImages) {
      const image = item.itemImages.filter(img => img.displayImage);
      if (image[0]) {
        return image[0].url;
      } else {
        return '../../../../assets/images/order/Items.svg';
      }
    } else {
      return '../../../../assets/images/order/Items.svg';
    }
  }
  showConsumerNote(item) {
    const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: item,
        type: 'order-details'
      }
    });
    notedialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  getOrderCommunications() {
    this.providerservice.getProviderInbox()
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          const history: any = data;
          this.communication_history = [];
          for (const his of history) {
            if (his.waitlistId === this.uid || his.waitlistId === this.uid.replace('h_', '')) {
              this.communication_history.push(his);
            }

          }
          this.msgCount = this.communication_history.length;
          this.sortMessages();
          this.sharedFunctions.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );

  }

  getorderHistory(uuid) {
    this.providerservice.getProviderorderlistHistroy(uuid)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.orderlist_history = data;
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }
  sortMessages() {
    this.communication_history.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return 1;
      } else if (message1.timeStamp > message2.timeStamp) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  getRandomClass(status) {
for (const stat of this.orderstatus) {
 if (stat.value === status) {
    return stat.clas;
    }
  }
}
  showCommunication() {
    const dialogRef = this.dialog.open(CommunicationComponent, {
      width: '40%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        message: this.communication_history,
        type: 'provider',
        id: this.uid,
        orderDetails: this.orderDetails
      }
    });
    dialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      if (result === 'reloadlist') {
        this.getOrderCommunications();
      }
    });
    
  }
  getformatedTime(time) {
    let timeDate;
    timeDate = time.replace(/\s/, 'T');
    return timeDate;
  }
  getQnrStatus(qnr) {
    const id = (qnr.questionnaireId) ? qnr.questionnaireId : qnr.id;
    const questr = this.orderDetails.releasedQnr.filter(questionnaire => questionnaire.id === id);
    if (questr[0]) {
      return questr[0].status;
    }
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
}
