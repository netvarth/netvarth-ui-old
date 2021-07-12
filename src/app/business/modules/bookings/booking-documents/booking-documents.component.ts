import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../shared/constants/project-messages';
import { GalleryService } from '../../../../shared/modules/gallery/galery-service';
import { GalleryImportComponent } from '../../../../shared/modules/gallery/import/gallery-import.component';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-booking-documents',
  templateUrl: './booking-documents.component.html',
  styleUrls: ['./booking-documents.component.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/style.bundle.css']
})
export class BookingDocumentsComponent implements OnInit {
  @Input() bookingType;
  @Input() waitlist_data;
  subscription: Subscription;
  widget = false;
  constructor(private galleryService: GalleryService,
    private shared_services: SharedServices,
    private snackbarService: SnackbarService,
    private dialog: MatDialog, private location: Location,
    private router: Router) {
    this.subscription = this.galleryService.getMessage().subscribe(input => {
      if (input && input.uuid) {
        if (this.bookingType === 'checkin') {
          this.shared_services.addProviderWaitlistAttachment(input.uuid, input.value)
            .subscribe(
              () => {
                this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
              },
              error => {
                this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
              }
            );
        } else {
          this.shared_services.addProviderAppointmentAttachment(input.uuid, input.value)
            .subscribe(
              () => {
                this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
              },
              error => {
                this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
              }
            );
        }
      }
    });
  }
  ngOnInit(): void {
    if (this.bookingType) {
      this.widget = true;
    } else {
      this.widget = false;
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  sendimages() {
    const galleryDialog = this.dialog.open(GalleryImportComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        source_id: 'attachment',
        uid: (this.bookingType === 'checkin') ? this.waitlist_data.ynwUuid : this.waitlist_data.uid
      }
    });
    galleryDialog.afterClosed().subscribe(result => {
    })
  }
  gotoDocuments() {
    this.router.navigate(['provider/bookings/documents']);
  }  
  goBack() {
    this.location.back();
  }
}
