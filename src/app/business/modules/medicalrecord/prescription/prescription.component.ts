import { Component, Input, OnInit } from '@angular/core';
import { AddDrugComponent } from './add-drug/add-drug.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MedicalrecordService } from '../medicalrecord.service';
import { InstructionsComponent } from './instructions/instructions.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ImagesviewComponent } from './imagesview/imagesview.component';
import { ShareRxComponent } from './share-rx/share-rx.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { AddNoteComponent } from './add-note/add-note.component';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { UploadPrescriptionComponent } from './upload-prescription/upload-prescription.component';
import { DrugListComponent } from './drug-list/drug-list.component';
import { UploadDigitalSignatureComponent } from './upload-digital-signature/upload-digital-signature.component';

import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { ConfirmBoxComponent } from '../../../shared/confirm-box/confirm-box.component';
// import { FileService } from '../../../../shared/services/file-service';
import { PreviewpdfComponent } from '../../crm/leads/view-lead-qnr/previewpdf/previewpdf.component';
import { SubSink } from 'subsink';

// import { C } from '@angular/cdk/keycodes';




@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {
  bookingId: any;
  bookingType: any;
  patientId: any;
  prescriptionSharedTimestamp: any;
  prescriptionShared = false;
  instructiondialogRef: any;
  addDrugdialogRef;
  drugList: any = [];
  today = new Date();
  patientDetails;
  userId;
  drugtype;
  editedIndex;
  drugdet;
  mrId = 0;
  optionsForRx = true;
  uploadRxstat = false;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  uploadlist: any = [];
  loading = true;
  dateFormatSp = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  disable = false;
  imagesviewdialogRef: any;
  providerId;
  digitalSign = false;
  sharedialogRef;
  navigations: any;
  provider_user_Id: any;
  image_list_popup: Image[];
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
  addnotedialogRef: any;
  note = '';
  prescList = true;
  doctorName;
  customer_label: any
  uploadprescriptionRef: any;
  someSubscription: any;
  uploaddrugRef: any;
  uploadsignRef: any;

  //add prescription  variable
  amForm: FormGroup;
  api_error = '';
  formMode: any;
  rupee_symbol = '₹';
  item_hi_cap = Messages.ITEM_HI_CAP;
  item_name_cap = Messages.ITEM_NAME_CAP;
  short_desc_cap = Messages.SHORT_DESC_CAP;
  detailed_dec_cap = Messages.DETAIL_DESC_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  api_success = null;
  parent_id;
  selitem_pic = '';
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  item_pic = {
    files: [],
    base64: null
  };
  taxpercentage = 0;
  price = 0;
  holdtaxable = false;
  file_error_msg = '';
  img_exists = false;
  maxChars = projectConstantsLocal.VALIDATOR_MAX100;
  maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
  maxNumbers = projectConstantsLocal.VALIDATOR_MAX10;
  max_num_limit = projectConstantsLocal.VALIDATOR_MAX_LAKH;
  api_loading = true;
  api_loading1 = true;
  disableButton = false;
  drugType;
  drugDetail: any =  [];
  listOfDrugs;
  fromWhr;
  drugData;
  addAnother = false;
  customerDetails: any;
  serviceName = 'Consultation';
  display_PatientId: any;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  taxDetails: any = [];
  uploadFiles: any = [];
  @Input() viewVisitDetails;
  @Input() showHideActivityTYpe;
  viewMrInfo:any;
  private subscriptions = new SubSink();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private medicalrecord_service: MedicalrecordService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private location: Location,
      private fb: FormBuilder,
      public fed_service: FormMessageDisplayService,
      // private fileService: FileService,
     
      // private medicalService: MedicalrecordService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.someSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Here is the dashing line comes in the picture.
        // You need to tell the router that, you didn't visit or load the page previously, so mark the navigated flag to false as below.
        this.router.navigated = false;
      }
    });
  }
  ngOnInit() {
    console.log('showHideActivityTYpe',this.showHideActivityTYpe)
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    this.provider_user_Id = this.medicalrecord_service.getDoctorId();
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    if (!this.provider_user_Id) {
      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
      this.provider_user_Id = user.id;
    }
    if (this.mrId === 0) {
      this.loading = false;
    } else {
      this.getMrprescription(this.mrId);
      this.getMedicalRecord(this.mrId);
    }
    this.createForm();
    console.log('viewVisitDetails1',this.viewVisitDetails)
  }

  getMedicalRecord(mrId) {
   this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          if (data.provider && data.provider.id) {
            this.doctorName = data.provider.firstName + ' ' + data.provider.lastName;
          }
          this.prescriptionShared = data.prescShared;
          this.prescriptionSharedTimestamp = data.lastSharedTime;
          this.uploadFiles = data.mrVideoAudio;
          console.log('this.uploadFiles',this.uploadFiles);
        }
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
  }

  ngOnDestroy() {
    if (this.someSubscription) {
      this.someSubscription.unsubscribe();
    }
  }

  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.wordProcessor.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
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
  }
  uploadSign() {
    this.uploadsignRef = this.dialog.open(UploadDigitalSignatureComponent, {
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
    this.uploadsignRef.afterClosed().subscribe(() => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.ngOnInit();
      }, 100);
    }
    );
  }
  getDigitalSign() {

    this.provider_services.getDigitalSign(this.provider_user_Id)
      .subscribe((data) => {
        this.digitalSign = true;
      },
        error => {
          this.digitalSign = false;

        });

  }


  // uploadRx() {
  //   this.ngOnInit();
  //   this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'uploadRx']);
  // }

  uploadRx() {
    // this.disable = true;
    this.uploadprescriptionRef = this.dialog.open(UploadPrescriptionComponent, {
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
    this.uploadprescriptionRef.afterClosed().subscribe(() => {
      // this.prescList = false;
      // this.ngOnInit();
      this.getMrprescription(this.mrId);
    }
    );
  }

  shareManualRx(type,bookingType,bookingId) {
    this.sharedialogRef = this.dialog.open(ShareRxComponent, {
      width: '100%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrId: this.mrId,
        type: type,
        patientId: this.patientId,
        docname: this.doctorName,
        bookingType:bookingType,
        bookingId:bookingId
      }
    });
    this.sharedialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  print(divName){
    // app-instructions
    // var printContents = document.getElementById(divName).innerHTML;
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);
    const _this=this;
    let checkin_html = '';
    checkin_html +='<div style="display:flex;margin-bottom:10px;align-items:center;gap:5px"><div><img style="height:60px;width:60px;" src="/assets/images/medicalReportIcon/mr.webp" /></div><div style="font-size:14px;font-weight:bold">Prescription Invoice</div></div>'
    checkin_html += '<table width="100%" style="border: 1px solid #dbdbdb;background: rgba(29, 161, 146, 0.11);position:absolute;z-index:99999">';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3;">Medecine</td>';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">Duration(days)</td>';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">Dosage</td>';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">Frequency</td>';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">Instruction</td>';
    checkin_html += '</thead>';
    for (let i = 0; i < _this.drugList.length; i++) {
      checkin_html += '<tr style="line-height:20px;padding:10px;border-bottom: 1.02503px solid #E7E3E3">';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + _this.drugList[i].medicine_name+ '</td>';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + _this.drugList[i].duration+'</td>';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' +  _this.drugList[i].dosage + '</td>';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + _this.drugList[i].frequency+ '</td>';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + _this.drugList[i].instructions+ '</td>';
    }
    checkin_html += '</table>';
    checkin_html += '<div style="margin:10px">';
    checkin_html += '</div>';
    checkin_html +='<svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height:100%;width:100%; position: absolute;"><path d="M0.00,92.27 C216.83,192.92 304.30,8.39 500.00,109.03 L500.00,0.00 L0.00,0.00 Z" style="stroke: none;fill: #e1efe3;"></path></svg>'
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(checkin_html);
    printWindow.document.write('</body></html>');
    printWindow.moveTo(0, 0);
    printWindow.print();
    printWindow.document.close();
    setTimeout(() => {
      printWindow.close();
    }, 500);
  }

  getMrprescription(mrId) {
    this.subscriptions.sink=this.provider_services.getMRprescription(mrId)
      .subscribe((data:any) => {
        console.log('datagetMRprescription',data);
        this.viewMrInfo= data;
        if (Object.keys(data).length === 0 && data.constructor === Object) {
          this.loading = false;
          // this.prescList = true;
          this.uploadFiles = data.mrVideoAudio;
          console.log('this.uploadFiles',this.uploadFiles)
        } else {
          if (data['prescriptionsList'] && data['prescriptionsList'][0].keyName) {
            this.uploadlist = data['prescriptionsList'];
            // this.prescList = false;
            this.image_list_popup = [];
            const imgobj = new Image(0,
              { // modal
                img: this.uploadlist[0].url,
                description: this.uploadlist[0].caption || ''
              });
            this.image_list_popup.push(imgobj);
            console.log('this.uploadlist::',this.uploadlist)

          } else {
            this.drugList = data['prescriptionsList'];
            // this.prescList = false;
            this.note = data['notes'];
            this.getDigitalSign();
          }
          this.loading = false;
        }
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }

  addDrug() {
    // this.saveRx(FormData)
    // this.router.navigate(['provider', 'customers','add-drug' ]);

    // this.addDrugdialogRef = this.dialog.open(AddDrugComponent, {
    //   width: '50%',
    //   panelClass: ['popup-class', 'commonpopupmainclass'],
    //   disableClose: true,
    //   data: {
    //     type: 'add',
    //     isFrom: 'manualAddrx'
    //   }
    // });

    // this.addDrugdialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.saveRx(result);
    //   }
    // });
  }

  saveRx(result) {
    this.loading = true;
    let passdata = {
      "prescriptionsList": result,
      "notes": this.note
    }
    console.log('this.mrId',this.mrId)
    if (this.mrId) {
      // let tempresult=
      //   [{
      //     'medicine_name': this.amForm.controls.medicine_name.value,
      //     'frequency': this.amForm.controls.frequency.value,
      //     'instructions':this.amForm.controls.instructions.value,
      //     'duration':this.amForm.controls.duration.value,
      //     'dosage':this.amForm.controls.dosage.value,
      //   }]
      // console.log('updateMRprescription',tempresult);
      // let passdata = {
      //   "prescriptionsList": tempresult,
      //   "notes": this.note
      // }
      this.provider_services.updateMRprescription(passdata, this.mrId).
        subscribe(res => {
          console.log('resupdateMRprescription',res)
          this.snackbarService.openSnackBar('Prescription Saved Successfully');
          this.getMrprescription(this.mrId);
          // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

        },
          error => {
            this.loading = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    } else {
      console.log('createMR',passdata)
      this.medicalrecord_service.createMR('prescriptions', passdata)
        .then((data: number) => {
          console.log('datacreateMR',data)
          this.mrId = data;
          this.snackbarService.openSnackBar('Prescription Saved Successfully');
          this.getMrprescription(this.mrId);
          // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

        },
          error => {
            this.loading = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
    // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
  }
  addNote() {
    const addnotedialogRef = this.dialog.open(AddNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        message: ''
      }
    });
    addnotedialogRef.afterClosed().subscribe(result1 => {
      if (result1) {
        console.log(result1);
        // this.note = result1.message;
        this.loading = true;
        let passdata = {
          "prescriptionsList": this.drugList,
          "notes": result1.message
        }
        this.provider_services.updateMRprescription(passdata, this.mrId).
          subscribe(res => {
            this.snackbarService.openSnackBar('Prescription updated Successfully');
            this.getMrprescription(this.mrId);

          },
            error => {
              this.loading = false;
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }

    });
  }
  updatePrescription() {
    this.disable = true;
    this.uploaddrugRef = this.dialog.open(DrugListComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType,
        mode: 'view'
      }
    });
    this.uploaddrugRef.afterClosed().subscribe(() => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.ngOnInit();
      }, 100);
    }
    );


  }
  updatePaperPrescription() {
    this.disable = true;
    this.uploadprescriptionRef = this.dialog.open(UploadPrescriptionComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType,
        mode: 'view'
      }
    });
    this.uploadprescriptionRef.afterClosed().subscribe(() => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.ngOnInit();
      }, 100);
    }
    );
  }
  imageSize(val) {
    let imgsize;
    imgsize = Math.round((val / 1024));
    return imgsize;
  }

  deleteDrug(index) {
    this.drugList.splice(index, 1);
    // delete this.drugList[index];
  }
  editDrug(drug, index) {
    this.editedIndex = index;
    this.addDrugdialogRef = this.dialog.open(AddDrugComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'edit',
        drugDetails: drug
      }
    });

    this.addDrugdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.drugList.splice(index, 1);
        this.drugList.push(result);
      }

    });
  }
  instrutionType(val) {
    const detail = val.length;
    let len;
    if (detail > 25) {
      len = 0;
    } else {
      len = 1;
    }
    return len;
  }

  truncateInst(val) {
    const inst = val.substr(0, 25);
    return inst;
  }
  showimgPopup(file) {
    file.title = 'Uploaded Prescription';
    this.imagesviewdialogRef = this.dialog.open(ImagesviewComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: file,
    });
    this.imagesviewdialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  instructPopUp(drug) {

    this.instructiondialogRef = this.dialog.open(InstructionsComponent, {
      data: {
        requestType: 'craetePrescription',
        width: '100%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: drug,
      }
      
    });
    this.instructiondialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  createForm() {

    this.amForm = this.fb.group({
      medicine_name: ['', Validators.compose([ Validators.maxLength(this.maxChars)])],
      frequency: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
      instructions: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
      duration: [''],
      dosage: ['']
    });

  // if (this.formMode === 'edit') {
  //   this.updateForm();
  // }
  }
    goback(txt){
      console.log('txt',txt);
      // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

      this.location.back();
    }
    gobackCancel(txt){
      this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      // this.location.back();
    }
    onSubmit(form_data) {
      this.api_error = '';
      if(form_data.medicine_name === '' && form_data.frequency === ''&& form_data.dosage === ''&& form_data.instructions === ''&& form_data.duration === ''){
        this.api_error = 'Atleast one field required';
      } else {
      this.drugDetail.push(form_data);
      }
    }
    clearError(event){
      this.api_error = '';
    }
    saveAndAddOther(form_data) {
      console.log(form_data);
      this.api_error = '';
      if(form_data.medicine_name === '' && form_data.frequency === ''&& form_data.dosage === ''&& form_data.instructions === ''&& form_data.duration === ''){
        this.api_error = 'Atleast one field required';
      } else {
      this.drugDetail.push(form_data);
      // this.addAnother = true;
      this.saveRx(this.drugDetail)
      this.clearAll();
    }
    }
    // updateForm(drug){

    // }
    autoGrowTextZone(e) {
      if (e) {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight + 15) + "px";
      }
  
    }
    clearAll() {
      this.amForm.get('medicine_name').setValue('');
      this.amForm.get('frequency').setValue('');
      this.amForm.get('instructions').setValue('');
      this.amForm.get('duration').setValue('');
      this.amForm.get('dosage').setValue('');
    }
    updateForm(drug) {
      console.log('this.drugData',this.drugData);
      console.log('drug:::',drug);
      this.amForm.patchValue({
        'medicine_name': drug.medicine_name || '',
        'frequency': drug.frequency || '',
        'instructions': drug.instructions || '',
        'duration': drug.duration || '',
        'dosage': drug.dosage || ''
      })
    }

    getFileType(type){
      // console.log('type',type)
      if(type){
        if(type==='.png'){
          return './assets/images/ImgeFileIcon/png.png'
        }
        else if(type==='.pdf'){
          return './assets/images/ImgeFileIcon/pdf.png'
        }
        else if(type==='.bmp'){
          return './assets/images/ImgeFileIcon/bmp.png'
        }
        else if(type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
          return './assets/images/ImgeFileIcon/docsWord.png'
        }
        else if(type==='video/mp4'){
          return './assets/images/ImgeFileIcon/video.png'
        }
        else if(type==='.jpg'){
          return './assets/images/ImgeFileIcon/jpg.png'
        }
        else{
          return './assets/images/ImgeFileIcon/othersFile.png'
        }
  
      }
    }
    bytesToSize(sizeInBytes:any) {
      var sizeInMB:any = (sizeInBytes / (1024)).toFixed(2);
      var totalSizeMb :any =sizeInMB + 'KB' ;
      return totalSizeMb;
    }
    deletePrescriptionFile(fileDetails,index){
      // this.deleteFile(fileDetails)
  
    }
    dialogImgView(fileDetails:any){
      if(fileDetails){
        if(fileDetails &&  fileDetails.type && ((fileDetails.type===('.png') || fileDetails.type===('.bmp') || fileDetails.type===('.jpg')))){
          const dialogRef= this.dialog.open(PreviewpdfComponent,{
            width:'100%',
            data:{
              requestType:'priviewFilePrescription',
              data:fileDetails,
            }
          })
          dialogRef.afterClosed().subscribe((res)=>{
          })
        }
        else{
          if(fileDetails.url){
            window.open(fileDetails.url);
          }
        } 
      }
    }
    originalFilename(fileName){
      console.log('fileName1',fileName.length)
      let tempFileName:any;
      let tempFileNameSecondTYpe:any;
      if(fileName.length > 0 && fileName.length <30 ){
        console.log(';tempFileName0')
         tempFileName= fileName.slice(0,fileName.indexOf('.'));
         console.log(';tempFileName',tempFileName)
        return tempFileName;
      }
      else if(fileName.length > 30){
        tempFileName= fileName.slice(0,fileName.indexOf('.')) ;
        console.log('tempFileName',tempFileName.length)
        if(tempFileName.length>30){
         tempFileNameSecondTYpe= tempFileName.slice(0,30) + ' ...'
         return tempFileNameSecondTYpe;
        }
        else{
          tempFileNameSecondTYpe= tempFileName.slice(0,30);
          return tempFileNameSecondTYpe;
        }
        // return tempFileName;
      }
    }
    deleteFile(file) {
     const dialogRef= this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Do you really want to delete this file?'
        }
      });
      this.subscriptions.sink = dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.sink = this.provider_services.deleteMRFile(this.mrId, file.uid)
            .subscribe((data) => {
              // this.getMedicalRecordUsingId(this.mrId);
              this.getMrprescription(this.mrId);
              // this.getMedicalRecord(this.mrId);
            },
              error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              });
        }
  
      });
    }
}
