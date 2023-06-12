import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UploadDigitalSignatureComponent } from '../upload-digital-signature/upload-digital-signature.component';
import { MedicalrecordService } from '../../medicalrecord.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { UploadSignatureComponent } from '../upload-digital-signature/uploadsignature/upload-signature.component';
import { ManualSignatureComponent } from '../upload-digital-signature/manualsignature/manual-signature.component';
import { ImagesviewComponent } from '../imagesview/imagesview.component';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.css']
})
export class DigitalSignatureComponent implements OnInit {
  providerUserId: any;
  imageDetails: any;
  signUrl: any;
  digitalSign: any;
  loading: any = true;
  signUploading: any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  ScreenHeight: any;
  screenWidth: any;
  businessLogo: any;
  constructor(
    private providerServices: ProviderServices,
    private sharedFunctions: SharedFunctions,
    private dialog: MatDialog,
    private medicalService: MedicalrecordService,
    public digitalSignRef: MatDialogRef<DigitalSignatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor
  ) {
    this.onReSize();
  }

  ngOnInit(): void {
    this.providerUserId = this.medicalService.getDoctorId();
    this.getDigitalSign();
  }

  @HostListener('window:resize', ['$event'])
  onReSize() {
    if (window && window.innerWidth) {
      if (window.innerWidth <= 768) {
        this.ScreenHeight = '90%';
        this.screenWidth = '80%';
      }
      else {
        //  this.ScreenHeight='85%';
        this.screenWidth = '50%'
      }
    }

  }

  getDigitalSign() {
    if (this.providerUserId) {
      this.providerServices.getDigitalSign(this.providerUserId)
        .subscribe((data: any) => {
          this.imageDetails = data;
          // console.log('imageDetails:::',this.imageDetails)
          this.signUrl = this.imageDetails.url;
          this.digitalSign = true;
          if (data && data !== null) {
            this.selectedMessage.files.push(data);
          }
        },
          error => {
            this.digitalSign = false;
          });
    }
  }

  close() {
    this.digitalSignRef.close();
  }
  signUrlFile(url) {
    // console.log('url',url)
    if (url) {
      let logourl = '';
      if (url) {
        logourl = url
      }
      return this.sharedFunctions.showlogoicon(logourl);
    }
  }
  uploadSign() {
    const uploadsignRef = this.dialog.open(UploadDigitalSignatureComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: this.data
    });
    uploadsignRef.afterClosed().subscribe(() => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.ngOnInit();
      }, 100);
    }
    );
  }
  filesSelected(event) {
    this.signUploading = true;
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.IMAGE_FORMATS.indexOf(file.type) === -1) {
          this.signUploading = false;
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstantsLocal.IMAGE_MAX_SIZE) {
          this.signUploading = false;
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
          this.saveDigitalSignImages();
        }
      }
    }
  }
  saveDigitalSignImages() {
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
    if (this.providerUserId) {
      this.uploadMrDigitalsign(this.providerUserId, submit_data);
    }
  }
  uploadMrDigitalsign(id, submit_data) {
    this.providerServices.uploadMrDigitalsign(id, submit_data)
      .subscribe((data: any) => {
        console.log('data', data);
        this.selectedMessage.files = []
        this.selectedMessage.files.push(data);
        this.signUploading = false;
        // this.snackbarService.openSnackBar('Digital sign uploaded successfully');
        const error: string = 'Digital sign uploaded successfully'
        this.snackbarService.openSnackBar((error));
        this.digitalSign = true;
        // this.selectedMessage.files.push(data)
        // this.dialog.closeAll()
        // this.uploadsignatureRef.close()
        // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  uploadSignature() {
    let data = this.data;
    data["providerid"] = this.providerUserId;
    const uploadsignatureRef = this.dialog.open(UploadSignatureComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: data
    });
    uploadsignatureRef.afterClosed().subscribe(() => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.ngOnInit();
      }, 100);
    }
    );
  }
  manualSignature() {
    let data = this.data;
    data["providerid"] = this.providerUserId;
    const height: any = this.ScreenHeight;
    const uploadmanualsignatureRef = this.dialog.open(ManualSignatureComponent, {
      width: this.screenWidth,
      height: height,//this.ScreenHeight,
      panelClass: ['popup-class'],
      disableClose: true,
      data: data
    });
    uploadmanualsignatureRef.afterClosed().subscribe((res) => {
      this.loading = true;
      // console.log(res)
      setTimeout(() => {
        this.loading = false;
        // this.getMrprescription();
        this.ngOnInit();
      }, 100);
    }
    );
  }
  showimgPopup(file) {
    file.title = 'Your digital signature';
    const signatureviewdialogRef = this.dialog.open(ImagesviewComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: file,
    });
    signatureviewdialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  deleteTempImagefrmdb(img, index) {
    const removedsigndialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to remove the digital signature?',
        'type': 'digitalSignature'
      }
    });
    removedsigndialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.providerServices.deleteUplodedsign(img.keyName, this.providerUserId)
          .subscribe((data) => {
            this.selectedMessage.files.splice(index, 1);
            this.imageDetails = null;
            this.signUrl = "";
            this.digitalSign = false;
            const error = 'Digital signature removed successfully'
            this.snackbarService.openSnackBar(error);
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }
    });
  }

  getProviderLogo() {
    this.providerServices.getProviderLogo()
      .subscribe(
        data => {
          this.businessLogo = data;
        },
        () => {
        }
      );
  }

  showdigitalsign(signUrl?) {
    if (signUrl) {
      let logourl = '';
      if (signUrl) {
        logourl = (signUrl) ? signUrl : '';
      }
      return this.sharedFunctions.showlogoicon(logourl);
    }
    let logourl = '';
    if (this.signUrl) {
      logourl = (this.signUrl) ? this.signUrl : '';
    }
    return this.sharedFunctions.showlogoicon(logourl);

  }
  showimg() {
    let logourl = '';
    if (this.businessLogo[0]) {
      logourl = (this.businessLogo[0].url) ? this.businessLogo[0].url : this.businessLogo;
    }
    return this.sharedFunctions.showlogoicon(logourl);
  }

}
