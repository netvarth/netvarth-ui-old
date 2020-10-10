import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../../app.component';

@Component({
  selector: 'app-upload-rx',
  templateUrl: './upload-rx.component.html',
  styleUrls: ['./upload-rx.component.css']
})
export class UploadRxComponent implements OnInit {

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


  constructor( public sharedfunction: SharedFunctions,
    public provider_services: ProviderServices) { }

  ngOnInit() {
  }

  filesSelected(event) {

    const input = event.target.files;
    if (input) {
        for (const file of input) {
            if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
                this.sharedfunction.apiErrorAutoHide(this, 'Selected image type not supported');
            } else if (file.size > projectConstants.FILE_MAX_SIZE) {
                this.sharedfunction.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
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

saveImages() {
    console.log(this.selectedMessage);
    this.mrId = this.sharedfunction.getitemfromLocalStorage('mrId');
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
    //   const passingdata = {
    //     'bookingType': 'NA',
    //     'consultationMode': 'EMAIL',
    //     'mrConsultationDate': this.today
    //   };

    //   this.provider_services.createMedicalRecord(passingdata, this.userId)
    //           .subscribe((data) => {
    //             console.log(data);
    //             this.sharedfunctionObj.setitemonLocalStorage('mrId', data );
    //             this.uploadMrPrescription(data, submit_data);
    //           },
    //               error => {
    //                   this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    //               });

    }
  }
  uploadMrPrescription(id, submit_data) {
    this.provider_services.uploadMRprescription(id, submit_data)
              .subscribe((data) => {
                this.sharedfunction.openSnackBar('Prescription created successfully');
              },
                  error => {
                      this.sharedfunction.openSnackBar(this.sharedfunction.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  });
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
  }

}
