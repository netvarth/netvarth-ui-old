import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { projectConstants } from '../../../../app.component';
import { ProviderServices } from '../../../services/provider-services.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ApplyLabelComponent } from '../apply-label/apply-label.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-actions-popup',
  templateUrl: './booking-actions-popup.component.html',
  styleUrls: ['./booking-actions-popup.component.css']
})
export class BookingActionsPopupComponent implements OnInit {


  isAppointment: any;
  bookingData: any;
  source: any;
  type: any;
  bookingUid: any;
  privateNotesForm: any;
  disableButton = false;
  apiError: any;
  apiSuccess: any;
  addProviderNotesCap = Messages.ADD_PROVIDER_NOTE_CAP;
  notesPlaceholder = Messages.NOTE_PLACEHOLDER;
  cancelButton = Messages.CANCEL_BTN;
  saveButton = Messages.SAVE_BTN;
  showApply = false;
  labelsforRemove: any = [];

  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  showCaptionBox: any = {};
  activeImageCaption: any = [];
  checkinsByLabel: any = [];
  providerLabels: any;
  labelMap = {};

  constructor(
    public dialogRef: MatDialogRef<BookingActionsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private providerServices: ProviderServices,
    private wordProcessor: WordProcessor,
    public formMessageDisplayService: FormMessageDisplayService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    if (this.data && this.data.source) {
      this.source = this.data.source;
    }
    if (this.data && this.data.type) {
      this.type = this.data.type;
    }
    if (this.data && this.data.bookingUid) {
      this.bookingUid = this.data.bookingUid;
    }
  }

  ngOnInit(): void {
    // let customerId = this.isAppointment ? this.bookingData.appmtFor[0].id : this.bookingData.waitlistingFor[0].id;
    this.createPrivateNotesForm();
  }

  createPrivateNotesForm() {
    this.privateNotesForm = this.formBuilder.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }

  onPrivateNotesSubmit(formData) {
    this.disableButton = true;
    if (formData.message === '') {
      this.apiError = 'Please enter your note';
      setTimeout(() => {
        this.apiError = null;
      }, projectConstants.TIMEOUT_DELAY);
      this.disableButton = false;
      return;
    }

    const dataToSend: FormData = new FormData();
    dataToSend.append('message', formData.message.trim() || '');
    const captions = {};
    let i = 0;
    if (this.selectedMessage) {
      for (const pic of this.selectedMessage.files) {
        dataToSend.append('attachments', pic, pic['name']);
        captions[i] = 'caption';
        i++;
      }
    }
    const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
    dataToSend.append('captions', blobPropdata);

    this.providerServices.addProviderBookingNotes(this.bookingUid, dataToSend, this.source)
      .subscribe(
        () => {
          this.apiSuccess = this.wordProcessor.getProjectMesssages('PROVIDER_NOTE_ADD');
          // this.providerServices.getProviderBookingNotes(this.bookingUid, this.source)
          setTimeout(() => {
            this.providerServices.getProviderBookingNotes(this.bookingUid, this.source)
            this.dialogRef.close();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
          this.disableButton = false;
        }
      );
  }


  resetApiErrors() {
    this.apiError = null;
    this.apiSuccess = null;
  }

  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.wordProcessor.apiErrorAutoHide(this, 'Selected file type not supported');
        } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
          this.wordProcessor.apiErrorAutoHide(this, 'Please upload files with size < 10mb');
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
  }

  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
    if (this.showCaptionBox && this.showCaptionBox[index]) {
      delete this.showCaptionBox[index];
      delete this.activeImageCaption[index];
    }
  }



  getLabel() {
    this.providerLabels = [];
    this.providerServices.getLabelList().subscribe((data: any) => {
      this.providerLabels = data.filter(label => label.status === "ENABLED");
      if (!this.data.multiSelection) {
        this.labelselection();
      } else {
        this.multipleLabelselection();
      }
    });
  }

  labelselection() {
    const values = [];
    if (this.bookingData.label && Object.keys(this.bookingData.label).length > 0) {
      Object.keys(this.bookingData.label).forEach(key => {
        values.push(key);
      });
      for (let i = 0; i < this.providerLabels.length; i++) {
        for (let k = 0; k < values.length; k++) {
          if (this.providerLabels[i].label === values[k]) {
            this.providerLabels[i].selected = true;
          }
        }
      }
    }
  }
  multipleLabelselection() {
    let values = [];
    this.checkinsByLabel = [];
    for (let i = 0; i < this.bookingData.length; i++) {
      if (this.bookingData[i].label) {
        Object.keys(this.bookingData[i].label).forEach(key => {
          values.push(key);
          if (!this.checkinsByLabel[key]) {
            this.checkinsByLabel[key] = [];
          }
          this.checkinsByLabel[key].push(this.bookingData[i].uid);
        });
      }
    }
    for (let i = 0; i < this.providerLabels.length; i++) {
      for (let k = 0; k < values.length; k++) {
        const filteredArr = values.filter(
          value => value === this.providerLabels[i].label
        );
        if (filteredArr.length === this.bookingData.length) {
          this.providerLabels[i].selected = true;
        }
      }
    }
  }


  addLabeltoAppt(label, event) {
    this.showApply = false;
    let labelArr = this.providerLabels.filter(lab => lab.label === label);
    if (this.labelMap[label]) {
      delete this.labelMap[label];
    }
    if (this.labelsforRemove.indexOf(label) !== -1) {
      this.labelsforRemove.splice(this.labelsforRemove.indexOf(label), 1);
    }
    if (event.checked) {
      if (labelArr[0] && labelArr[0].selected) {
      } else {
        this.labelMap[label] = true;
      }
    } else {
      if (labelArr[0] && labelArr[0].selected) {
        this.labelsforRemove.push(label);
      }
    }
    if (
      Object.keys(this.labelMap).length > 0 ||
      (this.labelsforRemove && this.labelsforRemove.length > 0)
    ) {
      this.showApply = true;
    }
  }

  gotoLabel() {
    this.router.navigate(["provider", "settings", "general", "labels"], {
      queryParams: { source: "appt" }
    });
    this.dialogRef.close();
  }

  addLabelvalue(source, label?) {
    const labeldialogRef = this.dialog.open(ApplyLabelComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "privacyoutermainclass"
      ],
      disableClose: true,
      autoFocus: true,
      data: {
        checkin: this.bookingData,
        source: source,
        label: label
      }
    });
    labeldialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.labelMap = new Object();
        this.labelMap[data.label] = data.value;
        this.addLabel();
        this.getDisplayname(data.label);
      }
      this.getLabel();
    });
  }

  getDisplayname(label) {
    if (this.providerLabels) {
      for (let i = 0; i < this.providerLabels.length; i++) {
        if (this.providerLabels[i].label === label) {
          return this.providerLabels[i].displayName;
        }
      }
    }
  }

  applyLabel() {
    if (Object.keys(this.labelMap).length > 0) {
      this.addLabel();
    }
    if (this.labelsforRemove && this.labelsforRemove.length > 0) {
      this.deleteLabel();
    }
  }

  addLabel() {
    const ids = [];
    if (this.data.multiSelection) {
      for (const checkin of this.bookingData) {
        ids.push(checkin.uid);
      }
    } else {
      ids.push(this.bookingUid);
    }
    const postData = {
      labels: this.labelMap,
      uuid: ids
    };
    this.providerServices.addLabeltoMultipleAppt(postData).subscribe(
      data => {
        this.snackbarService.openSnackBar("Label applied successfully", {
          panelclass: "snackbarerror"
        });
        this.dialogRef.close("reload");
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }


  deleteLabel() {
    let ids = [];
    if (this.data.multiSelection) {
      for (let label of this.labelsforRemove) {
        ids = ids.concat(this.checkinsByLabel[label]);
      }
    } else {
      ids.push(this.bookingUid);
    }
    const postData = {
      labelNames: this.labelsforRemove,
      uuid: ids
    };
    this.providerServices.deleteLabelFromMultipleAppt(postData).subscribe(
      data => {
        if (Object.keys(this.labelMap).length === 0) {
          this.snackbarService.openSnackBar("Label removed", {
            panelclass: "snackbarerror"
          });
        }
        this.dialogRef.close("reload");
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }

}
