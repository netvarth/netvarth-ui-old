import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../../app.component';
import { MatDialog } from '@angular/material/dialog';
import { CommunicationPopupComponent } from '../communication-popup/communication-popup.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-customer-booking-details',
  templateUrl: './customer-booking-details.component.html',
  styleUrls: ['./customer-booking-details.component.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class CustomerBookingDetailsComponent implements OnInit {
  @Input() waitlist_data;
  @Output() getHeight = new EventEmitter<any>();
  @Input() bookingType;
  customer_label;
  privateNote = '';
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  @ViewChild('details') elementView: ElementRef;
  addedHeight;
  provider_label;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  constructor(
    private provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    private wordProcessor: WordProcessor,
    private sharedFunctions: SharedFunctions,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.activated_route.queryParams.subscribe(params => {
      if (params.type) {
        this.bookingType = params.type;
      }
    });
  }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  }
  savePrivateNote() {
    if (this.privateNote.trim() === '') {
      this.snackbarService.openSnackBar('Please enter your note', { 'panelClass': 'snackbarerror' });
      return;
    }
    const dataToSend: FormData = new FormData();
    if (this.selectedMessage) {
      for (const pic of this.selectedMessage.files) {
        dataToSend.append('attachments', pic, pic['name']);
      }
    }
    dataToSend.append('message', this.privateNote.trim());
    if (this.bookingType === 'checkin') {
      this.provider_services.addProviderWaitlistNote(this.waitlist_data.ynwUuid,
        dataToSend)
        .subscribe(
          () => {
            this.privateNote = '';
            this.selectedMessage.files = [];
            this.selectedMessage.base64 = [];
            this.selectedMessage.caption = [];
            this.sharedFunctions.sendMessage({ type: 'addnote' });
            this.heightCalc();
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    } else {
      this.provider_services.addProviderAppointmentNotes(this.waitlist_data.uid,
        dataToSend)
        .subscribe(
          () => {
            this.privateNote = '';
            this.selectedMessage.files = [];
            this.selectedMessage.base64 = [];
            this.selectedMessage.caption = [];
            this.sharedFunctions.sendMessage({ type: 'addnote' });
            this.heightCalc();
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    }
  }
  editCustomer() {
    let customerId;
    if (this.bookingType === 'checkin') {
      customerId = this.waitlist_data.waitlistingFor[0].id;
    } else if (this.bookingType === 'checkin') {
      customerId = this.waitlist_data.appmtFor[0].id;
    } else {
      customerId = this.waitlist_data.consumer.id;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit', id: customerId }
    };
    this.router.navigate(['/provider/customers/create'], navigationExtras);
  }
  gotoPrescription() {
    let mrId = 0;
    if (this.waitlist_data.mrId) {
      mrId = this.waitlist_data.mrId;
    }
    let customerDetails;
    let bookingId;
    let bookingType;
    if (this.bookingType === 'checkin') {
      customerDetails = this.waitlist_data.waitlistingFor[0];
      bookingId = this.waitlist_data.ynwUuid;
      bookingType = 'TOKEN';
    } else {
      customerDetails = this.waitlist_data.appmtFor[0];
      bookingId = this.waitlist_data.uid;
      bookingType = 'APPT';
    }
    const customerId = customerDetails.id;
    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
  }
  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.wordProcessor.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.wordProcessor.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
    this.heightCalc();
  }
  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.heightCalc();
  }
  getImage(url, file) {
    if (file.type == 'application/pdf') {
      return 'assets/images/pdf.png';
    } else {
      return url;
    }
  }
  heightCalc() {
    setTimeout(() => {
      const height = this.elementView.nativeElement.offsetHeight;
      this.addedHeight = height - 340;
      this.getHeight.emit(this.addedHeight);
    }, 200);
  }
  getAge(age) {
    age = age.split(',');
    return age[0];
  }
  showCommunications() {
    this.dialog.open(CommunicationPopupComponent, {
      width: '50%',
      panelClass: ['newPopupClass'],
      disableClose: true,
      data: {
        waitlist: this.waitlist_data,
        type: this.bookingType
      }
    });
  }
}
