import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-customer-booking-details',
  templateUrl: './customer-booking-details.component.html',
  styleUrls: ['./customer-booking-details.component.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class CustomerBookingDetailsComponent implements OnInit {
  @Input() waitlist_data;

  customerid;
  bookingType;
  customerdetails: any = [];
  customer_label;
  privateNote = '';
  constructor(
    private provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    private wordProcessor: WordProcessor,
    private sharedFunctions: SharedFunctions
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
    });
  }

  ngOnInit(): void {
    if (this.bookingType === 'checkin') {
      this.customerid = this.waitlist_data.waitlistingFor[0].id;
      this.getCustomerdetails(this.customerid);
    } else if (this.bookingType === 'appointment') {
      this.customerid = this.waitlist_data.appmtFor[0].id;
      this.getCustomerdetails(this.customerid);
    }
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  getCustomerdetails(customerId) {
    const filter = { 'id-eq': customerId };
    this.provider_services.getProviderCustomers(filter)
      .subscribe(
        data => {
          this.customerdetails = data;
          console.log(this.customerdetails)
        },
        () => {
        }
      );
  }
  savePrivateNote() {
    console.log(this.privateNote);
    const dataToSend: FormData = new FormData();
    dataToSend.append('message', this.privateNote.trim() || '');
    // let i = 0;
    // if (this.selectedMessage) {
    //   for (const pic of this.selectedMessage.files) {
    //     dataToSend.append('attachments', pic, pic['name']);
    //     captions[i] = 'caption';
    //     i++;
    //   }
    // }
    if (this.bookingType === 'checkin') {
      this.provider_services.addProviderWaitlistNote(this.waitlist_data.ynwUuid,
        dataToSend)
        .subscribe(
          () => {
            this.sharedFunctions.sendMessage({ type: 'addnote' });
          },
          error => {
            this.wordProcessor.apiErrorAutoHide(this, error);
          }
        );
    } else {
      this.provider_services.addProviderAppointmentNotes(this.waitlist_data.uid,
        dataToSend)
        .subscribe(
          () => {
            this.sharedFunctions.sendMessage({ type: 'addnote' });
          },
          error => {
            this.wordProcessor.apiErrorAutoHide(this, error);
          }
        );
    }
  }
}
