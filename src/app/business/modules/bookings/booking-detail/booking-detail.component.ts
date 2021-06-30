import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/style.bundle.css']
})

export class BookingDetailComponent implements OnInit {

  waitlist_data;
  waitlist_id = null;
  userDet;
  api_loading = true;
  bookingType;
  source = '';
  uuid;
  customer;
  provider = 0;
  customerId;
  domain;
  subdomain;
  pos;
  height;
  subscription: Subscription;
  customer_label;
  constructor(private locationobj: Location,
    private groupService: GroupStorageService,
    private provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private sharedFunctions: SharedFunctions,
    private wordProcessor: WordProcessor
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
      this.waitlist_id = params.uid;
    });

    this.subscription = this.sharedFunctions.getMessage().subscribe((message) => {
      console.log(message.type);
      switch (message.type) {
        case 'statuschange':
          this.api_loading = true;
          if (this.bookingType === 'checkin') {
            this.getWaitlistDetail();
          } else {
            this.getApptDetails();
          }
          break;
      }
    });
  }

  ngOnInit(): void {
    this.api_loading = true;
    this.getPos();
    if (this.bookingType === 'checkin') {
      this.source = 'proCheckin';
      this.getWaitlistDetail();
    } else {
      this.source = 'proAppt';
      this.getApptDetails();
    }
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = this.userDet.sector;
    this.subdomain = this.userDet.subSector;
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getWaitlistDetail() {
    this.provider_services.getProviderWaitlistDetailById(this.waitlist_id)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.uuid = this.waitlist_data.ynwUuid;
          this.customerId = this.waitlist_data.waitlistingFor[0].id;
          if (this.waitlist_data.jaldeeConsumer) {
            this.customer = this.waitlist_data.jaldeeConsumer.id;
          }
          if (this.userDet.accountType === 'BRANCH') {
            if (this.waitlist_data.provider) {
              this.provider = this.waitlist_data.provider.id;
            }
          }
          console.log(this.waitlist_data)
          this.api_loading = false;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        }
      );
  }

  getApptDetails() {
    this.provider_services.getAppointmentById(this.waitlist_id)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.uuid = this.waitlist_data.uid;
          this.customerId = this.waitlist_data.appmtFor[0].id;
          if (this.waitlist_data.consumer) {
            this.customer = this.waitlist_data.consumer.id;
          }
          if (this.userDet.accountType === 'BRANCH') {
            if (this.waitlist_data.provider) {
              this.provider = this.waitlist_data.provider.id;
            }
          }
          this.api_loading = false;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        }
      );
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    },
      error => {
      });
  }
  getHeight(event) {
    this.height = event;
  }
  goBack() {
    this.locationobj.back();
  }
}
