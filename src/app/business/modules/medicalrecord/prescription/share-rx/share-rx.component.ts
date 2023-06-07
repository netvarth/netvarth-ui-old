import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../services/provider-services.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { MedicalrecordService } from '../../medicalrecord.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { AddproviderAddonComponent } from '../../../add-provider-addons/add-provider-addons.component';
import { UploadDigitalSignatureComponent } from '../upload-digital-signature/upload-digital-signature.component';
import { UploadSignatureComponent } from '../upload-digital-signature/uploadsignature/upload-signature.component';
import { ManualSignatureComponent } from '../upload-digital-signature/manualsignature/manual-signature.component';
import { ImagesviewComponent } from '../imagesview/imagesview.component';
import { ConfirmBoxComponent } from '../../../../shared/confirm-box/confirm-box.component';
// import { Router } from '@angular/router';



@Component({
  selector: 'app-share-rx',
  templateUrl: './share-rx.component.html',
  styleUrls: ['./share-rx.component.css']
})
export class ShareRxComponent implements OnInit {
  patientId: any;
  email_id = '';
  msgreceivers: any = [];
  spId: any;
  mrId;
  amForm: UntypedFormGroup;
  deptName;
  bname;
  location;
  customer_label: any;
  qname: any;
  qstarttime: any;
  qendtime: any;
  schedulename: any;
  appttime: any;
  appmtDate: any;
  spfname: any;
  splname: any;
  Schedulestime: any;
  Scheduleetime: any;
  sms = false;
  email = false;
  chekintype: any;
  consumer_fname: any;
  consumer_lname: any;
  serv_name: any;
  date: string;
  time: any;
  consumer_email: any;
  api_loading = false;
  phone = '';
  phon = '';
  SEND_MESSAGE = '';
  settings: any = [];
  showToken = false;
  pushnotify = false;
  telegram = false;
  whatsApp = false;
  disableButton;
  sharewith;
  showcustomId = false;
  iconClass: string;
  customid = '';
  api_error = null;
  api_success = null;
  customerDetail: any;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  drugList: any = [];
  blogo: any = [];
  profimg_exists = false;
  cacheavoider = '';
  signurl = '';
  imagedetails: any;
  provider_user_Id: any;
  userdata: any;
  bdata: any;
  address: any;
  mobile: any;
  type;
  disable = false;
  curDate = new Date();
  accountType: any;
  userbname: any;
  loading = true;
  signature_loading = true;
  showthirdparty = false;
  thirdpartyphone = '';
  thirdpartyemail = '';
  sharebtnloading = false;
  smsCredits;
  is_smsLow = false;
  smsWarnMsg: string;
  corpSettings: any;
  addondialogRef: any;
  is_noSMS = false;
  note = '';
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  doctorName;
  countryCode;
  countryCod;
  chatId: any;
  IsTelegramDisable = true;
  mrPrescriptionDetails: any;
  ThemePalette;
  digitalSign = false;
  bookingId: any;
  bookingType: any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  fileName: any;
  src: any;
  ScreenHeight: any;
  innerWidth: any;
  screenWidth: string;
  digitalSignType: boolean = true;
  signUploading: any = false;
  constructor(
    public dialogRef: MatDialogRef<ShareRxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public fed_service: FormMessageDisplayService,
    private shared_functions: SharedFunctions,
    private fb: UntypedFormBuilder,
    public provider_services: ProviderServices,
    private provider_servicesobj: ProviderServices,
    private medicalService: MedicalrecordService,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    public shared_services: SharedServices,
    private wordProcessor: WordProcessor,
    // private router: Router,
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_user_Id = this.medicalService.getDoctorId();
    console.log('this.data', this.data)
    this.mrId = this.data.mrId;
    this.type = this.data.type;
    this.patientId = this.data.patientId;
    if (this.data.docname) {
      this.doctorName = this.data.docname;
    }
    // console.log(this.data.docname);
    this.getPatientDetails(this.patientId);
    this.ThemePalette = '#06c706';
    console.log('data:;', this.data)
    if (this.data && this.data.file && this.data.file.url) {
      this.fileName = this.data.file.url;
    }
    if (this.data && this.data.file && (this.data.file.type === '.pdf' || this.data.file.type === '.jpeg' || this.data.file.type === '.bmp' ||
      this.data.file.type === '.png' || this.data.file.type === '.jpg')) {
      this.digitalSignType = false;
    }
    else {
      this.digitalSignType = true;
    }
    // if(this.data.file.url)
    this.onReSize()

  }

  ngOnInit() {
    const cnow = new Date();
    const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
    this.cacheavoider = dd;
    this.sharewith = 0;
    this.msgreceivers = [{ 'id': 0, 'name': 'Patient' }, { 'id': 1, 'name': 'Thirdparty' }];
    this.createForm();
    this.getMrprescription();
    this.getBussinessProfileApi();
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    if (this.accountType === 'BRANCH') {
      this.getBusinessProfile();
    }
    this.getSMSCredits();
    // window.oncontextmenu = function() {return false;} // for disable right click
  }

  @HostListener('window:resize', ['$event'])
  onReSize() {
    if (window && window.innerWidth) {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 768) {
        this.ScreenHeight = '90%';
        this.screenWidth = '80%';
      }
      else {
        //  this.ScreenHeight='85%';
        this.screenWidth = '50%'
      }
    }

  }
  createForm() {
    this.sharewith = 0;
    this.amForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });

  }
  back() {
    this.dialogRef.close();
  }
  getPatientDetails(uid) {
    const filter = { 'id-eq': uid };
    this.provider_services.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          // console.log(response);
          this.customerDetail = response[0];
          console.log('this.customerDetail',this.customerDetail)
          // console.log(this.customerDetail)
          if (this.customerDetail.email) {
            this.email_id = this.customerDetail.email;
          }
          if (this.customerDetail.phoneNo) {
            this.countryCode = this.customerDetail.countryCode;
            this.phone = this.customerDetail.phoneNo;
            this.phon = this.phone.replace(/\s/g, "");
            if (this.countryCode.startsWith('+')) {
              this.countryCod = this.countryCode.substring(1);
            }
            if (this.phon) {
              this.provider_services.telegramChat(this.countryCod, this.phone)
                .subscribe(
                  data => {
                    this.chatId = data;
                    if (this.chatId === null) {
                      this.IsTelegramDisable = true;
                    }
                    else {
                      this.IsTelegramDisable = false;
                    }

                  },
                  (error) => {

                  }
                );
            }

          }

        });
  }
  onSubmit(formdata?) {
    this.disable = true;
    this.sharebtnloading = true;
    this.resetApiErrors();
    let vwofrx;
    if (document && document.getElementById('sharerxview')) {
      vwofrx = document.getElementById('sharerxview');
    }
    // let sahrePdfVia;
    // if (document && document.getElementById('sharePdf')) {
    //   sahrePdfVia = document.getElementById('sharePdf');
    // }
    let thirdPartyHtml;
    if (document.getElementById('thirdParty')) {
      thirdPartyHtml = document.getElementById('thirdParty')
    }
    console.log('thirdPartyHtml', thirdPartyHtml)
    // console.log('sahrePdfVia',sahrePdfVia.innerHTML)
    console.log('vwofrx', vwofrx)
    console.log('this.sharewith', this.sharewith)
    if (this.sharewith !== 0) {
      // if (this.thirdpartyphone === '' && this.thirdpartyemail === '') {
      if (this.thirdpartyemail === '') {
        this.api_error = 'Please enter  email';
        this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' })
        this.disable = false;
        this.sharebtnloading = false;
        return false;
      }
      // if(this.thirdpartyphone === ''){
      //   this.api_error = 'Please enter  phone number';
      //   this.snackbarService.openSnackBar(this.api_error,{ 'panelClass': 'snackbarerror' })
      //   this.disable = false;
      //   this.sharebtnloading = false;
      //   return false;
      // }
      if (this.thirdpartyphone !== '') {
        const curphone = this.thirdpartyphone;
        const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const result = pattern.test(curphone);
        if (!result) {
          this.api_error = this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID');
          // 'Please enter a valid mobile phone number';
          this.disable = false;
          this.sharebtnloading = false;
          return;
        }
        const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
        const result1 = pattern1.test(curphone);
        if (!result1) {
          this.api_error = this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS');
          // 'Mobile number should have 10 digits';
          this.disable = false;
          this.sharebtnloading = false;
          return;
        }
      }
      if (this.thirdpartyemail !== '') {
        const curemail = this.thirdpartyemail.trim();
        const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
        const result2 = pattern2.test(curemail);
        if (!result2) {
          this.api_error = this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID');
          this.disable = false;
          this.sharebtnloading = false;
          return;
        }
      }
    }
    if (this.sharewith === 0) {
      if (!this.sms && !this.email && !this.pushnotify && !this.telegram && !this.whatsApp) {
        console.log(this.phon);
        console.log(this.email_id);
        console.log(this.IsTelegramDisable);
        if (this.phon === '' && this.email_id === '' && this.IsTelegramDisable === true) {
          this.api_error = 'Update the patient details in the patient record to use share options.';
          this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' })
        }
        else {
          this.api_error = 'share via options are not selected';
          this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' })
        }

        // setTimeout(() => {
        //   this.api_error = '';
        // }, 3000)
        this.disable = false;
        this.sharebtnloading = false;
        return;
      }
    }
    if (this.type === 'adddrug') {
      if (this.sharewith !== 0) {
        const passData = {
          'message': this.amForm.controls.message.value,
          // 'html': vwofrx.innerHTML,
          'shareThirdParty': {
            'phone': this.thirdpartyphone,
            'email': this.thirdpartyemail
          }
        };
        if (this.thirdpartyphone !== '') {
          passData['shareThirdParty']['countryCode'] = '+91';
        }
        this.provider_services.shareRxforThirdparty(this.mrId, passData)
          .subscribe((data) => {
            this.snackbarService.openSnackBar('Prescription shared successfully');
            this.sharebtnloading = false;
            this.dialogRef.close();
          }, error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
            this.sharebtnloading = false;
          });

      } else if (this.sharewith === 0) {
        const passData = {
          'message': this.amForm.controls.message.value,
          // 'html': vwofrx.innerHTML,
          'medium': {
            'email': this.email,
            'sms': this.sms,
            'pushNotification': this.pushnotify,
            'telegram': this.telegram,
            'whatsApp': this.whatsApp
          }
        };
        this.provider_services.shareRx(this.mrId, passData)
          .subscribe((data) => {
            this.snackbarService.openSnackBar('Prescription shared successfully');
            this.sharebtnloading = false;
            this.dialogRef.close();
          }, error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
            this.sharebtnloading = false;
          });
      }
    }
    else {
      if (this.sharewith !== 0) {
        let passData;
        if (this.data && this.data.file && (this.data.file.type === '.jpeg' || this.data.file.type === '.bmp' ||
          this.data.file.type === '.png' || this.data.file.type === '.jpg')) {
          passData = {
            'message': this.amForm.controls.message.value,
            // 'html': vwofrx.innerHTML,
            'shareThirdParty': {
              'phone': this.thirdpartyphone,
              'email': this.thirdpartyemail
            }
          };
        }
        else {
          passData = {
            'message': this.amForm.controls.message.value,
            // 'html': vwofrx.innerHTML,
            'shareThirdParty': {
              'phone': this.thirdpartyphone,
              'email': this.thirdpartyemail
            }
          };
        }
        if (this.thirdpartyphone !== '') {
          passData['shareThirdParty']['countryCode'] = '+91';
        }
        this.provider_services.shareRxforThirdparty(this.mrId, passData)
          .subscribe((data) => {
            this.snackbarService.openSnackBar('Prescription shared successfully');
            this.sharebtnloading = false;
            this.dialogRef.close();
          }, error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
            this.sharebtnloading = false;
          });

      } else if (this.sharewith === 0) {
        let passData: any;
        if (this.data.file.type === '.pdf') {
          passData = {
            'message': this.amForm.controls.message.value,
            // 'html': sahrePdfVia.innerHTML, 
            'medium': {
              'email': this.email,
              'sms': this.sms,
              'pushNotification': this.pushnotify,
              'telegram': this.telegram,
              'whatsApp': this.whatsApp
            }
          };
        }
        else {
          passData = {
            'message': this.amForm.controls.message.value,
            // 'html': vwofrx.innerHTML,
            'medium': {
              'email': this.email,
              'sms': this.sms,
              'pushNotification': this.pushnotify,
              'telegram': this.telegram,
              'whatsApp': this.whatsApp
            }
          }
        }
        this.provider_services.shareRx(this.mrId, passData)
          .subscribe((data) => {
            this.snackbarService.openSnackBar('Prescription shared successfully');
            this.dialogRef.close();
            this.sharebtnloading = false;
          }, error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
            this.sharebtnloading = false;
          });
      }
    }
  }
  onUserSelect(event) {
  console.log(event)
    this.resetApiErrors();
    this.customid = '';
    if (event.value !== 0) {
      this.showthirdparty = true;
    } else {
      this.showthirdparty = false;
    }

  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  getMrprescription() {
    if (this.mrId) {
      this.provider_services.getMRprescription(this.mrId)
        .subscribe((data) => {
          console.log('datagetMRprescription',data)
          if(data['prescriptionAttachements'][0]){
            this.mrPrescriptionDetails = data['prescriptionAttachements'];
            this.signature_loading = false;
              this.getDigitalSign();
          }
          else if(data['prescriptionsList']){
            this.mrPrescriptionDetails = data['prescriptionsList'];
            if (Object.keys(data).length !== 0 && data.constructor === Object) {
              if (data['prescriptionsList'] && data['prescriptionsList'][0].keyName) {
                this.signature_loading = false;
                this.getDigitalSign();
              } else {
                // if(this.data.length=== data['prescriptionsList'].length){
                //   this.drugList = data['prescriptionsList'];
                // }
                // else{
                //   this.drugList = this.data
                // }
                this.drugList = data['prescriptionsList'];
                this.note = data['notes'];
                this.signature_loading = false;
                this.getDigitalSign();
              }
              this.getProviderLogo();
            }
          }
         
        },
          error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  getProviderLogo() {
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          this.blogo = data;
        },
        () => {
        }
      );
  }
  getDigitalSign() {
    if (this.provider_user_Id) {
      this.provider_services.getDigitalSign(this.provider_user_Id)
        .subscribe((data: any) => {
          this.imagedetails = data;
          // console.log('imagedetails:::',this.imagedetails)
          this.signurl = this.imagedetails.url;
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
  signurlFile(url) {
    // console.log('url',url)
    if (url) {
      let logourl = '';
      if (url) {
        logourl = url
      }
      return this.shared_functions.showlogoicon(logourl);
    }
  }
  uploadSign() {
    const uploadsignRef = this.dialog.open(UploadDigitalSignatureComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType
      }
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
    if (this.provider_user_Id) {
      this.uploadMrDigitalsign(this.provider_user_Id, submit_data);
    }
  }
  uploadMrDigitalsign(id, submit_data) {
    this.provider_services.uploadMrDigitalsign(id, submit_data)
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
    const uploadsignatureRef = this.dialog.open(UploadSignatureComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType,
        providerid: this.provider_user_Id
      }
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
    const height: any = this.ScreenHeight;
    const uploadmanualsignatureRef = this.dialog.open(ManualSignatureComponent, {
      width: this.screenWidth,
      height: height,//this.ScreenHeight,
      panelClass: ['popup-class'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType,
        providerid: this.provider_user_Id
      }
    });
    uploadmanualsignatureRef.afterClosed().subscribe((res) => {
      this.loading = true;
      // console.log(res)
      setTimeout(() => {
        this.loading = false;
        this.getMrprescription();
        // this.ngOnInit();
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
        this.provider_services.deleteUplodedsign(img.keyName, this.provider_user_Id)
          .subscribe((data) => {
            this.selectedMessage.files.splice(index, 1);
            this.getDigitalSign();
            const error = 'Digital signature removed successfully'
            this.snackbarService.openSnackBar(error);
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }
    });
  }
  showdigitalsign(signurl?) {
    if (signurl) {
      let logourl = '';
      if (signurl) {
        logourl = (signurl) ? signurl : '';
      }
      return this.shared_functions.showlogoicon(logourl);
    }
    let logourl = '';
    if (this.signurl) {
      logourl = (this.signurl) ? this.signurl : '';
    }
    return this.shared_functions.showlogoicon(logourl);

  }
  showimg() {
    let logourl = '';
    this.profimg_exists = false;
    if (this.blogo[0]) {
      this.profimg_exists = true;
      logourl = (this.blogo[0].url) ? this.blogo[0].url : '';
    }
    return this.shared_functions.showlogoicon(logourl);
  }
  getBusinessProfile() {
    if (this.provider_user_Id) {
      this.provider_services.getUserBussinessProfile(this.provider_user_Id)
        .subscribe((data: any) => {
          this.userdata = data;
          this.userbname = this.userdata.businessName;
        },
        );
    }
  }
  getBussinessProfileApi() {
    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bdata = data;
          this.loading = false;
          this.bname = this.bdata.businessName;
          this.address = this.bdata.baseLocation.address;
          this.mobile = this.bdata.accountLinkedPhNo;
        });
  }
  getSMSCredits() {
    this.provider_services.getSMSCredits().subscribe(data => {
      this.smsCredits = data;
      if (this.smsCredits < 5 && this.smsCredits > 0) {
        this.is_smsLow = true;
        this.smsWarnMsg = Messages.LOW_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else if (this.smsCredits === 0) {

        this.is_smsLow = true;
        this.is_noSMS = true;
        this.smsWarnMsg = Messages.NO_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else {
        this.is_smsLow = false;
        this.is_noSMS = false;
      }
    });
  }
  getLicenseCorpSettings() {
    this.provider_servicesobj.getLicenseCorpSettings().subscribe(
      (data: any) => {
        this.corpSettings = data;
      }
    );
  }
  gotoSmsAddon() {
    this.dialogRef.close();
    if (this.corpSettings && this.corpSettings.isCentralised) {
      this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
    } else {
      this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
        width: '50%',
        data: {
          type: 'addons'
        },
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true
      });
      this.addondialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getSMSCredits();
        }
      });
    }
  }
  autoGrowTextZone(e) {
    if (e) {
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight + 15) + "px";
    }

  }
  closeDialog() {
    this.dialogRef.close()
  }
  shareBtn(data) {
    let shareInfo = {
      'shareWith': this.sharewith,
      'message': this.amForm.controls.message.value,
      'thirdpartyemail': this.thirdpartyemail,
      'sms': this.sms,
      'email': this.email,
      'telegram': this.telegram,
      'whatsApp': this.whatsApp,
      'mrId': this.mrId
    }
    this.onSubmit()
    if (this.thirdpartyemail === '' || this.thirdpartyphone === '') {
      this.dialogRef.disableClose = false;
    }
    else {
      this.dialogRef.close(shareInfo);
    }
  }
  messageBoxhandle(data) {
    // console.log(data)
    if (data) { }
    else {
      const msg = this.fed_service.isFieldValid(this.amForm, 'message');
      console.log(msg);
      const error = 'Please enter a message'
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    }
  }
}
