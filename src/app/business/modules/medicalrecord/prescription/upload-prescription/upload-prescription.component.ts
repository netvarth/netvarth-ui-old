import { Component, OnInit } from '@angular/core';
import { ShareRxComponent } from '../share-rx/share-rx.component';
import { projectConstants } from '../../../../../app.component';
import { MedicalrecordService } from '../../medicalrecord.service';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-upload-prescription',
  templateUrl: './upload-prescription.component.html',
  styleUrls: ['./upload-prescription.component.css']
})
export class UploadPrescriptionComponent implements OnInit {

  today = new Date();
  patientDetails;
  userId;
  drugtype;
  editedIndex;
  drugdet;
  mrId;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
showSave = true;
sharedialogRef;


  constructor( public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    public dialog: MatDialog,
    private medicalrecord_service: MedicalrecordService) {
      this.medicalrecord_service.patient_data.subscribe(data => {
        this.patientDetails = data;
        this.userId = this.patientDetails.id;
        console.log(this.userId);
      });
    }

  ngOnInit() {
    this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
    this.getMrprescription();
  }

  getMrprescription() {
    if (this.mrId) {
      this.provider_services.getMRprescription(this.mrId)
            .subscribe((data) => {
              console.log(data);
            },
                error => {
                    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });

    }
  }

  filesSelected(event) {
    const input = event.target.files;
    if (input) {
        for (const file of input) {
            if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
                this.sharedfunctionObj.apiErrorAutoHide(this, 'Selected image type not supported');
            } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
                this.sharedfunctionObj.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
            } else {
                this.selectedMessage.files.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.selectedMessage.base64.push(e.target['result']);
                };
                reader.readAsDataURL(file);
                this.showSave = true;
            }
        }
    }
}
    imageSize(val) {
    let imgsize;
        imgsize = Math.round((val / 1024));
        return imgsize;
    }

saveImages() {
    console.log(this.selectedMessage);
    this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for (const pic of this.selectedMessage.files) {
        submit_data.append('files', pic, pic['name']);
        const properties = {
            'caption': this.selectedMessage.caption[i] || ''
        };
        propertiesDetob[i] = properties;
        i++;
    }
    const propertiesDet = {
        'propertiesMap': propertiesDetob
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);
    if (this.mrId) {
      this.uploadMrPrescription(this.mrId, submit_data);
    } else {
      const passingdata = {
        'bookingType': 'NA',
        'consultationMode': 'EMAIL',
        'mrConsultationDate': this.today
      };
      this.provider_services.createMedicalRecord(passingdata, this.userId)
              .subscribe((data) => {
                console.log(data);
                this.sharedfunctionObj.setitemonLocalStorage('mrId', data );
                this.uploadMrPrescription(data, submit_data);
              },
                  error => {
                      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  });
    }
  }
  uploadMrPrescription(id, submit_data) {
    this.provider_services.uploadMRprescription(id, submit_data)
              .subscribe((data) => {
                this.showSave = false;
                this.sharedfunctionObj.openSnackBar('Prescription uploaded successfully');
              },
                  error => {
                      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  });
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
    this.showSave = true;
  }

  somethingChanged() {
    this.showSave = true;
  }
  shareRximage() {
    this.sharedialogRef = this.dialog.open(ShareRxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrId: this.mrId,
        userId: this.userId
      }
    });

    this.sharedialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);


      }


    });

  }

}
