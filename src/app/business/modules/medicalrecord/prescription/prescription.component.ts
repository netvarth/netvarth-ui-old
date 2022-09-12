import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AddDrugComponent } from './add-drug/add-drug.component';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras } from '@angular/router';
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

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit ,OnChanges{
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
  downloadText:any;
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
  api_loading:boolean;
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
  innerWidth: any;
  ScreenHeight: any;
  addMedecineMobDeviceB: boolean=true;
  newlyCretedMrId: any;
  tempText: any='';
  tempIndex: any;
  afterEdit: string='';
  @Input() tempPrescription;
  addPrescription:boolean=true;
  tempTextDelete: string;
  screenWidth: string;
  manualSignInfo: any;
  signature_loading = true;
  src = '';
  isPdfLoaded = false;
  pdfSrc;
  tempList: any;
  newRowIndex = 0;
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
    this.onReSize()
  }
  @HostListener('window:resize', ['$event'])
  onReSize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.ScreenHeight= '85%';
      this.screenWidth='55%';
      if(this.drugList && this.drugList.length>0){
        this.addMedecineMobDeviceB=false;
      }
    }
    else {
       this.ScreenHeight='85%';
       this.screenWidth='75%'
       this.addMedecineMobDeviceB=true
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    // this. onReSize() 
  }
  ngOnInit() {
    // console.log('showHideActivityTYpe',this.showHideActivityTYpe);
    // console.log('tempPrescription',this.tempPrescription)
    // console.log('this.activatedRoute.parent.snapshot.params',this.activatedRoute.parent.snapshot.params)
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
    // console.log('viewVisitDetails1',this.viewVisitDetails);
    // this.onReSize()
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
          // console.log('this.uploadFiles',this.uploadFiles);
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
      // this.loading = true;
      // setTimeout(() => {
      //   this.loading = false;
      //   this.ngOnInit();
      //   this.getMrprescription(this.mrId);
      // }, 100);
      this.getMrprescription(this.mrId);
    }
    );
  }
  getDigitalSign() {

    this.provider_services.getDigitalSign(this.provider_user_Id)
      .subscribe((data:any) => {
        // console.log('digitalSign',data);
        this.manualSignInfo = data;
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

  uploadRx(data) {
    // console.log('data',data)
    this.disableFromControl()
    // this.disable = true;
    this.uploadprescriptionRef = this.dialog.open(UploadPrescriptionComponent, {
      width: '100%',
      panelClass: ['popup-class'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType
      }
    });
    this.uploadprescriptionRef.afterClosed().subscribe((res) => {
      // console.log('res',res)
      this.enableFormControl()
      if(res===true){
        this.uploadprescriptionRef.close();
        this.enableFormControl()
      }
      if(res=''){
        this.enableFormControl()
      }
      if(this.mrId){
        this.enableFormControl()
        this.getMrprescription(this.mrId);
      }
      // this.getMrprescription(this.mrId);
    }
    );
  }
  disableFromControl(){
    this.amForm.controls.medicine_name.disable();
    this.amForm.controls.duration.disable();
    this.amForm.controls.frequency.disable();
    this.amForm.controls.dosage.disable();
    this.amForm.controls.instructions.disable();
  }
  enableFormControl(){
    this.amForm.controls.medicine_name.enable();
    this.amForm.controls.duration.enable();
    this.amForm.controls.frequency.enable();
    this.amForm.controls.dosage.enable();
    this.amForm.controls.instructions.enable();
  }

  shareManualRx(type,bookingType,bookingId,file) {
    // console.log('file',file)
    const height:any=this.ScreenHeight;
    this.sharedialogRef = this.dialog.open(ShareRxComponent, {
      width: '100%',
      height: height,//this.ScreenHeight,
      panelClass: ['popup-class'],
      disableClose: true,
      data: {
        mrId: this.mrId,
        type: type,
        patientId: this.patientId,
        docname: this.doctorName,
        bookingType:bookingType,
        bookingId:bookingId,
        file:file
      }
    });
    this.sharedialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('result',result);

      }
    });
  }
  print(divName,signatureInfo){
    console.log('signatureInfo',signatureInfo)
    if(signatureInfo===undefined){
      const error='You have no digital Signature';
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      setTimeout(() => {
        const params = [
          'height=' + screen.height,
          'width=' + screen.width,
          'fullscreen=yes'
        ].join(',');
        const printWindow = window.open('', '', params);
        const _this=this;
        let checkin_html = '';
        checkin_html +='<div style="box-shadow: 0 0 10px rgb(0 0 0 / 5%);border-radius: 5px;padding:15px;background:#f9f9f9f;position:absolute;z-index:99999;height:100%;width:100%">'
        checkin_html +='<div style="display:flex;margin-bottom:10px;align-items:center;gap:5px"><div><img style="height:60px;width:60px;" src="/assets/images/medicalReportIcon/mr.webp" /></div><div style="font-size:14px;font-weight:bold">Prescription Invoice</div></div>'
        checkin_html += '<table width="100%" style="position:absolute;z-index:99999;padding-right:100px;">';
        checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3;">Medicine</td>';
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
        checkin_html +='</div>'
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
      }, 500);
      
    }
    else{
      let manualPresSignature:any;
      if(signatureInfo !== undefined && signatureInfo.url){
        manualPresSignature=signatureInfo.url;
      }
      const params = [
        'height=' + screen.height,
        'width=' + screen.width,
        'fullscreen=yes'
      ].join(',');
      const printWindow = window.open('', '', params);
      const _this=this;
      let checkin_html = '';
      checkin_html +='<div style="box-shadow: 0 0 10px rgb(0 0 0 / 5%);border-radius: 5px;padding:15px;background:#f9f9f9f;position:absolute;z-index:99999;height:100%;width:100%">'
      checkin_html +='<div style="display:flex;margin-bottom:10px;align-items:center;gap:5px"><div><img style="height:60px;width:60px;" src="/assets/images/medicalReportIcon/mr.webp" /></div><div style="font-size:14px;font-weight:bold">Prescription Invoice</div></div>'
      checkin_html +='<div style="text-align:end;width="100%";height:"100%;">'
      checkin_html +='<div style="font-size:14px;font-weight:bold;padding-right:90px;">Your Digital Signature</div>'
      checkin_html += '<img style="height:60px;width:60px;padding-right:90px;"  src="' + manualPresSignature + '" />'
      checkin_html +='</div>'
      checkin_html += '<table width="100%" style="position:absolute;z-index:99999;padding-right:100px;">';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3;">Medicine</td>';
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
      checkin_html +='</div>'
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
    
  }
  printPdf(url,html){
    let date:any=url.date;
    let originalName:any=url.originalName;
    let prefix:any=url.prefix;
    // console.log('html',html)
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);
    let checkin_html = '';
    checkin_html +='<div style="display:flex;margin-bottom:10px;align-items:center;gap:5px"><div><img style="height:60px;width:60px;" src="/assets/images/medicalReportIcon/mr.webp" /></div><div style="font-size:14px;font-weight:bold">Prescription Invoice</div></div>'
    checkin_html += '<table width="100%;height:100%" style="border: 1px solid #dbdbdb;background: rgba(29, 161, 146, 0.11);position:absolute;z-index:99999">';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">Date</td>';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">File Name</td>';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">Prefix</td>';
    checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">File Type</td>';
    checkin_html += '</thead>';
      checkin_html += '<tr style="line-height:20px;padding:10px;border-bottom: 1.02503px solid #E7E3E3">';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + date+'</td>';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + originalName + '</td>';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + prefix+ '</td>';
      checkin_html += '<td style="padding:10px;border-bottom: 1.02503px solid #E7E3E3">' + '<img style="height:20px;width:20px;" src="/assets/images/ImgeFileIcon/pdf.png" />'+ '</td>';
    checkin_html += '</table>';
    // checkin_html +='<div style="position:absolute;z-index:99999">'
    checkin_html += '<div>' + html+ '</div>';
    // checkin_html +='</div>'
    // checkin_html += '<div style="margin:10px">';
    // checkin_html += '</div>';
    // checkin_html +='<svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height:100%;width:100%; position: relative;"><path d="M0.00,92.27 C216.83,192.92 304.30,8.39 500.00,109.03 L500.00,0.00 L0.00,0.00 Z" style="stroke: none;fill: #e1efe3;"></path></svg>'
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('</head><body>');
    // console.log(checkin_html)
        printWindow.document.write(checkin_html);

    printWindow.document.write('</body></html>');
    printWindow.moveTo(0, 0);
    printWindow.print();
    printWindow.document.close();
    setTimeout(() => {
      printWindow.close();
    }, 500);
  }
  
  printSecond(url){
    // console.log(url);
    if(url.type==='.pdf'){
      if(document && document.getElementById('sharePdf')){
        let html = document.getElementById('sharePdf').innerHTML;
        if(html &&  url){
          this.printPdf(url,html)
        }
      }
      
    }
    else{
      if(url && url.url){
        const params = [
          'height=' + screen.height,
          'width=' + screen.width,
          'fullscreen=yes'
        ].join(',');
        const printWindow = window.open('', '', params);
        let checkin_html = '';
        checkin_html +='<div style="box-shadow: 0 0 10px rgb(0 0 0 / 5%);border-radius: 5px;padding:15px;background:#f9f9f9f;">'
        checkin_html += '<div style="display:flex;margin-bottom:10px;align-items:center;gap:5px"><div><img style="height:60px;width:60px;" src="/assets/images/medicalReportIcon/mr.webp" /></div><div style="font-size:14px;font-weight:bold">Prescription Invoice</div></div>'
        checkin_html += '<img style="width:100%;height:100%" src="' + url.url + '" />'
        checkin_html += '</div>'
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
    }
    
   
  }

  getMrprescription(mrId) {
    // console.log('mrId::::',mrId);
    // this.newlyCretedMrId= mrId;
    this.subscriptions.sink=this.provider_services.getMRprescription(mrId)
      .subscribe((data:any) => {
        this.api_loading=false;
        // console.log('datagetMRprescription',data);
        this.viewMrInfo= data;
        if(data){
          if (Object.keys(data).length === 0 && data.constructor === Object) {
            this.loading = false;
            // this.prescList = true;
            this.uploadFiles = data.mrVideoAudio;
            // console.log('this.uploadFiles',this.uploadFiles)
          } else {
            if (data['prescriptionsList'] && data['prescriptionsList'][0] && data['prescriptionsList'][0].keyName) {
              this.uploadlist = data['prescriptionsList'];
              // this.prescList = false;
              this.image_list_popup = [];
              if(this.uploadlist && this.uploadlist[0] && this.uploadlist[0].url){
                const imgobj = new Image(0,
                  { // modal
                    img: this.uploadlist[0].url,
                    description: this.uploadlist[0].caption || ''
                  });
                this.image_list_popup.push(imgobj);
                // console.log('this.uploadlist::',this.uploadlist)
                if(this.uploadlist[0].type==='.pdf'){
                  this.downloadText='Download';
                }
                else{
                  this.downloadText='View';
                }
              }
             
  
            } else {
              this.drugList = data['prescriptionsList'];
              // console.log('this.drugList:',this.drugList)
              // console.log(this.tempIndex);
              this.addPrescription= true;
              this.newRowIndex++;
              // if(this.tempIndex >=0){
              //     this.drugList.splice(this.tempIndex, 1);
              // }
              if (this.afterEdit === 'afterUpdate') {
                this.addPrescription= true;
                const qparams = { 'prescription': 'prescription' };
                const navigationExtras: NavigationExtras = {
                  queryParams: qparams
                };
                console.log('navigationExtras', navigationExtras);
              }
              else {
                this.drugList = data['prescriptionsList'];
              // console.log('this.drugList:',this.drugList);
              // console.log('this.tempTextDelete',this.tempTextDelete)
              if(this.tempTextDelete==='TempDelete'){
                // alert(this.tempTextDelete)
                if(this.drugList && this.drugList.length <2){
                  // alert('kkk')
                  // this.reloadComponent();
                  // this.location.back()
                }
                else{
                  // alert('reloadComponent')
                  this.reloadComponent();
                }                
              }
              else{
                // alert('jjjjj::::')
                // this.reloadComponent()
              }
              }
              
              // this.prescList = false;
              this.note = data['notes'];
              this.getDigitalSign();
            }
            this.loading = false;
          }
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
  updateEditPrescription(data){
    // console.log('data',data)
    this.viewVisitDetails=false;
    this.loading=false
    this.uploadlist && this.uploadlist.length===0;
    this.afterEdit='afterUpdate';
    this.drugList=(data);
    // console.log('this.drugList',this.drugList);
  }

  saveRx(result) {
    // console.log('result',result)
    this.loading = true;
    let passdata = {
      "prescriptionsList": result,
      "notes": this.note
    }
    // console.log('this.mrId',this.mrId);
    // console.log('newlyCretedMrId',this.newlyCretedMrId)
    if (this.mrId) {
      // alert('edit')
      this.api_loading=true;
      this.provider_services.updateMRprescription(passdata, this.mrId).
        subscribe(res => {
          // console.log('resupdateMRprescription',res)
          this.snackbarService.openSnackBar('Prescription update  Successfully');
          this.getMrprescription(this.mrId);
          if(this.afterEdit==='afterUpdate'){
            this.tempList=this.drugList
          }
        },
          error => {
            this.loading = false;
            this.api_loading=false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    } 
    else {
      // console.log('createMR',passdata);
      // alert('craete')
      this.api_loading=true;
      this.medicalrecord_service.createMR('prescriptions', passdata)
        .then((data: number) => {
          // console.log('datacreateMR',data)
          this.mrId = data;
          this.snackbarService.openSnackBar('Prescription Saved Successfully');
          this.getMrprescription(this.mrId);
          // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

        },
          error => {
            this.api_loading=false;
            this.loading = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
    // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
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
        // console.log(result1);
        // this.note = result1.message;
        this.loading = true;
        let passdata = {
          "prescriptionsList": this.drugList,
          "notes": result1.message
        }
        this.provider_services.updateMRprescription(passdata, this.mrId).
          subscribe(res => {
            this.snackbarService.openSnackBar('Prescription update Successfully');
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
  saveClose(){
    if(this.mrId !==0){
      // this.reloadComponent()
      // console.log('this.drugList',this.drugList)
      let passdata = {
        "prescriptionsList":  this.drugList,
        "notes": this.note
      }
      // console.log('this.mrId',this.mrId);
      this.provider_services.updateMRprescription(passdata, this.mrId).subscribe((res)=>{
        // alert('saveClose')
        // console.log('saveCloseREs',res)
        // console.log('this.mrId',this.mrId);
        if(this.mrId !==0){
          if(this.afterEdit === 'afterUpdate'){
            this.reloadComponent()
          }
          else{
            this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);  
                    // this.getMrprescription(this.mrId);
          }
          
        }
        else{
          // alert('elsesaveclose')
          this.location.back()
        }        
      })
    }
    else{
      this.api_error = 'Create your prescription';
      this.snackbarService.openSnackBar( this.api_error, { 'panelClass': 'snackbarerror' }); 
    }
  }
  addMedecineMobDevice(){
    this.tempText= undefined;
    this.addMedecineMobDeviceB=true;
    // console.log('this.tempText',this.tempText)
   
  }
  viewMedecineMobDevice(){
    this.addMedecineMobDeviceB=true;
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

  
  editDrugList(text,form_data,id){
    // console.log(text);
    // console.log('data', form_data);
    // console.log('id', id);
    // console.log(form_data);
    this.api_error = '';
    if (form_data && (form_data.medicine_name === '' && form_data.frequency === '' && form_data.dosage === '' && form_data.instructions === '' && form_data.duration === '')) {
      this.api_error = 'Atleast one field required';
      this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
    }
    else {
      this.drugList.push(form_data);
        // this.saveRx(this.drugDetail)
        if (this.afterEdit === 'afterUpdate') {
          delete this.drugList[this.tempIndex]
          this.drugList.slice(this.tempIndex,1)
          // console.log('this.drugDetail:::', this.drugDetail)
          // console.log('this.drugList', this.drugList);
          // console.log('this.drugListAfter', this.drugList);
          // console.log('this.tempIndex',this.tempIndex)
         
          // console.log('this.drugList22', this.drugList);
          let tempArr: any = [];
          tempArr = [...this.drugList];
          //  console.log('tempArr', tempArr)
           tempArr = tempArr.filter(function( element:any,i ) {
            return element !== undefined;
         });
        //  console.log('tempArr2', tempArr);
          this.saveRx(tempArr);
         
          // this.tempList= tempArr;
        }
      else{
        this.drugList.splice(this.tempIndex,1)
        this.saveRx(this.drugList);
        
      }
      // this.clearAll();
      this.tempText='';
    }

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
      // console.log('txt',txt);
      // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

      this.location.back();
    }
    gobackCancel(txt){
      // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      this.location.back();
    }
    onSubmit(form_data) {
      this.api_error = '';
      if(form_data && (form_data.medicine_name === '' && form_data.frequency === ''&& form_data.dosage === ''&& form_data.instructions === ''&& form_data.duration === '')){
        this.api_error = 'Atleast one field required';
      } else {
      this.drugDetail.push(form_data);
      }
    }
    clearError(event){
      this.api_error = '';
    }
    saveAndAddOther(form_data) {
      // this.api_loading=true;
      // console.log(form_data);
      this.api_error = '';
      if(form_data.medicine_name === '' && form_data.frequency === ''&& form_data.dosage === ''&& form_data.instructions === ''&& form_data.duration === ''){
        this.api_error = 'Atleast one field required';
        this.snackbarService.openSnackBar( this.api_error, { 'panelClass': 'snackbarerror' });
      } else {
      this.drugDetail.push(form_data);
      // this.saveRx(this.drugDetail);
      // console.log('this.afterEdit',this.afterEdit)
        if (this.afterEdit === 'afterUpdate') {
          // console.log('this.drugDetail:::', this.drugDetail)
          // console.log('this.drugList', this.drugList);
          
          var i = this.drugList.length;
          while (i--) {
            for (var j of this.drugDetail) {
              if (this.drugList[i] && this.drugList[i].medicine_name === j.medicine_name) {
                this.drugList.splice(i, 1);
              }
            }
          }
          // console.log('this.drugListAfter', this.drugList);
          let tempArr: any = [];
          tempArr = [...this.drugDetail, ...this.drugList];
          //  console.log('tempArr', tempArr)
          this.saveRx(tempArr);
        }
      else{
        this.saveRx(this.drugDetail);
      }
      this.clearAll();
      this.tempPrescription=false;
    }
    }
    autoGrowTextZone(e) {
      if (e) {
       
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight + 15) + "px";
      }
  
    }
    handleFormControl(data){
      this.addPrescription= false;
      // console.log(data);
    }
    clearAll() {
      this.amForm.get('medicine_name').setValue('');
      this.amForm.get('frequency').setValue('');
      this.amForm.get('instructions').setValue('');
      this.amForm.get('duration').setValue('');
      this.amForm.get('dosage').setValue('');
    }
    updateForm(drug,type,text,index,newlyCretedMrId) {
      this.tempText=type;
      this.tempIndex=index;
      if(drug){
        this.amForm.patchValue({
          'medicine_name': drug.medicine_name || '',
          'frequency': drug.frequency || '',
          'instructions': drug.instructions || '',
          'duration': drug.duration || '',
          'dosage': drug.dosage || ''
        })
      }
      this.addPrescription= false;
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
        else if(type==='.jpeg'){
          return './assets/images/ImgeFileIcon/jpeg.png'
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
      // console.log(fileDetails);
     this.deleteTempImagePrescription(fileDetails,index)
    }


    deleteTempImagePrescription(img, index) {
      // this.showSave = true;
      const removeprescriptiondialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Do you really want to remove the prescription?',
          'type': 'prescription'
        }
      });
      removeprescriptiondialogRef.afterClosed().subscribe(result => {
        // console.log('result',result);
        if (result) {
          // console.log('img',img)
            // console.log('img.keyName',img.keyName)
            this.provider_services.deleteUplodedprescription(img.keyName, this.mrId)
              .subscribe((data) => {
                // console.log('data',data)
                this.selectedMessage.files.splice(index, 1);
                const error='Prescription successfully delete';
                this.snackbarService.openSnackBar(error);
                this.reloadComponent();
                // this.getMrprescription(this.mrId);
              },
                error => {
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
        }
      });
    }

    deleteDrug(index,data) {
      // console.log('data',data)
      // console.log(index);
     
      // console.log(this.mrId);
      const removeprescriptiondialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Do you really want to remove the medicine ?',
          'type': 'deleteDrug'
        }
      });
      removeprescriptiondialogRef.afterClosed().subscribe((res)=>{
        if(res){
          this.drugList.splice(index, 1);
          // console.log(' this.drugList', this.drugList)
           let passdata = {
            "prescriptionsList": this.drugList,
            "notes": this.note
          }
          // console.log('this.mrId', this.mrId);
          // console.log('newlyCretedMrIdforUpdate',this.mrId)
          if (this.mrId) {
            // alert('edit')
            this.api_loading = true;
            // this.drugList.splice(index,1);
            this.provider_services.updateMRprescription(passdata,this.mrId).
              subscribe(res => {
                // console.log('resupdateMRprescription', res);
                this.tempTextDelete='TempDelete';
                this.snackbarService.openSnackBar('Prescription delete  Successfully');
                // alert('afterDelete')
                // console.log('this.mrId',this.mrId)
                if(this.mrId){
                  this.getMrprescription(this.mrId);
                }
                // this.getMrprescription(this.mrId);
                this.tempText='';
    
              },
                error => {
                  this.loading = false;
                  this.api_loading = false;
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
          }
        }
      })
      
    }











    dialogImgView(fileDetails:any){
      if(fileDetails){
        if(fileDetails &&  fileDetails.type && ((fileDetails.type !==('.pdf')))){
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
        else if(fileDetails &&  fileDetails.type && ((fileDetails.type ===('.pdf')))){
          const dialogRef= this.dialog.open(PreviewpdfComponent,{
            width:'100%',
            data:{
              requestType:'priviewFilePrescription',
              data:fileDetails,
              mrId:this.mrId
            }
          })
          dialogRef.afterClosed().subscribe((res)=>{
          })
          // this.downloadPdf(fileDetails.url)
        }
        else{
          if(fileDetails.url){
            window.open(fileDetails.url);
          }
        } 
      }
    }
    downloadPdf(pdfUrl: string ) {
      window.location.assign(pdfUrl);
    }
    originalFilename(fileName){
      // console.log('fileName1',fileName.length)
      let tempFileName:any;
      let tempFileNameSecondTYpe:any;
      if(fileName && fileName.length > 0 && fileName && fileName.length <30 ){
        // console.log(';tempFileName0')
         tempFileName= fileName.slice(0,fileName.indexOf('.'));
        //  console.log(';tempFileName',tempFileName)
        return tempFileName;
      }
      else if(fileName && fileName.length > 30){
        tempFileName= fileName.slice(0,fileName.indexOf('.')) ;
        // console.log('tempFileName',tempFileName.length)
        if(tempFileName && tempFileName.length>30){
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
