import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../services/provider-services.service';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { Messages } from '../../../../shared/constants/project-messages';
import { Subject } from 'rxjs';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {
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
  catalog_id: any;
  catalog_details: any;
  isSubmission: boolean;
  channel: string;
  questionnaireList: any = [];
  showQuestionnaire: boolean;
  questionAnswers;
  api_loading_video;
  isClickedOnce = false;
  disableButton;
  disablebutton: boolean;
  account: any;
  constructor(public activaterouter: ActivatedRoute,
    private snackbarService: SnackbarService,
    public providerservice: ProviderServices,
    private provider_services: ProviderServices,
    public router: Router,
    private providerService: ProviderServices,
    private activateRoute: ActivatedRoute,
    private wordProcessor: WordProcessor,

    public location: Location, public sharedFunctions: SharedFunctions) {
    this.activateRoute.queryParams.subscribe(params => {

      if (params.uid) {
        this.uid = params.uid;
      }
      if (params.account) {
        this.account = params.account;
      }
    });
  }

  ngOnInit() {
    this.getOrderDetails(this.uid);

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
  getPaperQnr() {
    this.channel = 'WALKIN';
    this.provider_services.getPaperQnr(this.catalog_id, this.channel).subscribe((data: any) => {
      this.questionnaireList = data;
      if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
        this.showQuestionnaire = true;
      }
      this.showQuestionnaire = true;
    });
  }
  getQuestionAnswers(event) {
    this.questionAnswers = null;
    this.questionAnswers = event;
    console.log(this.questionAnswers)
  }

  getOrderDetails(uid) {

    this.loading = true;
    this.providerservice.getProviderOrderById(uid)
      .subscribe(data => {
        this.orderDetails = data;

        this.catalog_id = this.orderDetails.catalog.id;
        if (this.catalog_id) {
          this.getPaperQnr();
        }
        this.loading = false;
      });
  }


  goBack() {
    this.location.back();
  }
  selectViewType(type) {
    this.selectedType = type;
  }




  submitQuestionnaire() {
    const dataToSend: FormData = new FormData();

    const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    this.providerService.submitProviderOrderQuestionnaire(dataToSend, this.uid).subscribe((data: any) => {
      let postData = {
        urls: []
      };
      if (data.urls && data.urls.length > 0) {
        for (const url of data.urls) {
          this.api_loading_video = true;
          const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
          this.provider_services.videoaudioS3Upload(file, url.url)
            .subscribe(() => {
              postData['urls'].push({ uid: url.uid, labelName: url.labelName });
              if (data.urls.length === postData['urls'].length) {
                this.provider_services.providerOrderQnrUploadStatusUpdate(this.uid, postData)
                  .subscribe((data) => {
                    this.snackbarService.openSnackBar("Remarks Released Successfully");
                    this.router.navigate(['provider', 'orders']);
                  },
                    error => {
                      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                      this.api_loading = false;
                      this.api_loading_video = false;
                    });
              }
            },
              error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.api_loading_video = false;
              });
        }
      } else {
        this.snackbarService.openSnackBar("Remarks Released Successfully");
        this.router.navigate(['provider', 'orders']);
      }
    }, error => {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      this.api_loading = false;
      this.api_loading_video = false;
    });
  }

  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
}
