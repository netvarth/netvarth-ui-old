import { Component, ElementRef, EventEmitter, Input, OnInit, Output,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileService } from '../../../../../../shared/services/file-service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { CrmService } from '../../../crm.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { TeleBookingService } from '../../../../../../shared/services/tele-bookings-service';
import { MatDialog } from '@angular/material/dialog';
import { PreviewpdfComponent } from '../previewpdf/previewpdf.component';
@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.css']
})
export class ApplicantComponent implements OnInit {
  applicantForm: FormGroup;
  errorMessage;
  customerName;
  phoneNumber;
  kycList = projectConstantsLocal.KYC_LIST;
  telePhoneTypeList = projectConstantsLocal.PHONE_TYPES;
  stateList = projectConstantsLocal.INDIAN_STATES;
  relations = projectConstantsLocal.RELATIONSHIPS;
  selectedFiles = {
    "kyc1": { files: [], base64: [], caption: [] },
    "kyc2": { files: [], base64: [], caption: [] },
    "kyc3": { files: [], base64: [], caption: [] },
    "pan": { files: [], base64: [], caption: [] }
  }
  filesToUpload: any = [];

  @Input() parentId;
  @Input() applicant; // For view
  @Input() applicantId;
  @Input() activeUser;
  @Output() removeApplicant = new EventEmitter<any>();
  @Output() addApplicant = new EventEmitter<any>();
  failedStatusId: any;
  crifStatusId: any;
  availableDates: any = [];
  phNumber:any;
  @Input() leadInfo;
  showCrifSection = false;
  crifScore: any;
  showPdfIcon: boolean;
  crifHTML: any;
  crifDetails: any;
  api_loading: boolean=false;
  bCrifBtnDisable:boolean;
  fileOpener: any;
  

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private crmService: CrmService,
    private snackbarService: SnackbarService,
    private datePipe:DatePipe,
    private teleService:TeleBookingService,
    private el: ElementRef, private renderer: Renderer2,
    private dialog: MatDialog, 
     ) { }

  ngOnInit(): void {
    console.log("Applicant Init");
    console.log(this.applicant);
    console.log('this.leadInfo',this.leadInfo)
    if (this.applicant && this.applicant['name']) {
      this.customerName = this.applicant['name'];
    } else {
      this.customerName = this.applicant['customerName'];
    }
    if (this.applicant && this.applicant.parent && this.applicant['phone']) {
      this.phoneNumber =  this.teleService.getTeleNumber(this.applicant['phone']);
    } else {
      this.phoneNumber =  this.teleService.getTeleNumber(this.applicant['permanentPhone']);
    }
    this.applicantForm = this.formBuilder.group({
      customerName: [null],
      permanentPhoneNumber: [null],
      idTypes: [null],
      idTypes1: [null],
      idValue: [null],
      idValue1: [null],
      idTypes2:[null],
      idValue2:[null],
      panNumber: [null],
      telephoneType: ['Residence'],
      telephoneNumber: [null],
      address: [null],
      addressType: ['Residence'],
      city: [null],
      state: [null],
      pin: [null],
      dob: [null],
      relationName: [null],
      relationType: ['Father'],
      nomineeName: [null],
      nomineeType: [null],
      permanentAddress: [null],
      permanentCity: [null],
      permanentState: [null],
      permanentPinCode: [null]
    })
    if (this.customerName) {
      this.applicantForm.controls.customerName.setValue(this.customerName);
    } else {
      if(this.applicant && this.applicant.customerName){
        this.applicantForm.controls.customerName.setValue(this.applicant.customerName);
      }
    }
    if (this.applicant && this.applicant.permanentPhone) {
      this.applicantForm.controls.permanentPhoneNumber.setValue(this.applicant.permanentPhone);
    }
    if (this.applicant && this.applicant.validationIds && this.applicant.validationIds[0]) {
      this.applicantForm.controls.idTypes.setValue(this.applicant.validationIds[0].idTypes);
    }
     else {
      this.applicantForm.controls.idTypes.setValue(this.kycList[2].name);
    }
    if (this.applicant && this.applicant.validationIds && this.applicant.validationIds[0]) {
      this.applicantForm.controls.idValue.setValue(this.applicant.validationIds[0].idValue);
    }
    if (this.applicant && this.applicant.validationIds && this.applicant.validationIds[1]) {
      this.applicantForm.controls.idTypes1.setValue(this.applicant.validationIds[1].idTypes);
    } 
    else {
      this.applicantForm.controls.idTypes1.setValue(this.kycList[1].name);
    }
    if (this.applicant && this.applicant.validationIds && this.applicant.validationIds[1]) {
      this.applicantForm.controls.idValue1.setValue(this.applicant.validationIds[1].idValue);
    }
      console.log('this.applicant.validationIds::::',this.applicant.validationIds)
    if (this.applicant && this.applicant.validationIds && this.applicant.validationIds[2]) {
      this.applicantForm.controls.idTypes2.setValue(this.applicant.validationIds[2].idTypes);
    }
    // else {
    //   this.applicantForm.controls.idTypes2.setValue(this.kycList[2].name);
    // }
    if (this.applicant && this.applicant.validationIds && this.applicant.validationIds[2]) {
      this.applicantForm.controls.idValue2.setValue(this.applicant.validationIds[2].idValue);
    }
    // if (this.applicant.panNumber) {
    //   this.applicantForm.controls.panNumber.setValue(this.applicant.panNumber);
    // }
    if (this.applicant && this.applicant.telephone && this.applicant.telephone[0].telephoneType) {
      this.applicantForm.controls.telephoneType.setValue(this.applicant.telephone[0].telephoneType);
    }
    if (this.applicant && this.applicant.telephone && this.applicant.telephone[0].telephoneNumber) {
      this.applicantForm.controls.telephoneNumber.setValue(this.applicant.telephone[0].telephoneNumber);
    }
    if (this.applicant && this.applicant.address && this.applicant.address[0] && this.applicant.address[0].address) {
      this.applicantForm.controls.address.setValue(this.applicant.address[0].address);
    }
    if (this.applicant && this.applicant.address && this.applicant.address[0] && this.applicant.address[0].addressType) {
      this.applicantForm.controls.addressType.setValue(this.applicant.address[0].addressType);
    }
    if (this.applicant && this.applicant.address && this.applicant.address[0] && this.applicant.address[0].city) {
      this.applicantForm.controls.city.setValue(this.applicant.address[0].city);
    }
    if (this.applicant && this.applicant.address && this.applicant.address[0] &&  this.applicant.address[0].state) {
      this.applicantForm.controls.state.setValue(this.applicant.address[0].state);
    }
    if (this.applicant && this.applicant.address && this.applicant.address[0] && this.applicant.address[0].pin) {
      this.applicantForm.controls.pin.setValue(this.applicant.address[0].pin);
    }
    if (this.applicant && this.applicant.dob) {
      this.applicantForm.controls.dob.setValue(this.applicant.dob);
    }
    if (this.applicant && this.applicant.relationName) {
      this.applicantForm.controls.relationName.setValue(this.applicant.relationName);
    }
    if (this.applicant && this.applicant.relationType) {
      this.applicantForm.controls.relationType.setValue(this.applicant.relationType);
    }
    if (this.applicant && this.applicant.nomineeName) {
      this.applicantForm.controls.nomineeName.setValue(this.applicant.nomineeName);
    }
    if (this.applicant && this.applicant.nomineeType) {
      this.applicantForm.controls.nomineeType.setValue(this.applicant.nomineeType);
    }
    if (this.applicant && this.applicant.permanentAddress) {
      this.applicantForm.controls.permanentAddress.setValue(this.applicant.permanentAddress);
    }
    if (this.applicant && this.applicant.permanentCity) {
      this.applicantForm.controls.permanentCity.setValue(this.applicant.permanentCity);
    }
    if (this.applicant && this.applicant.permanentState) {
      this.applicantForm.controls.permanentState.setValue(this.applicant.permanentState);
    }
    if (this.applicant && this.applicant.permanentPinCode) {
      this.applicantForm.controls.permanentPinCode.setValue(this.applicant.permanentPinCode);
    }
  }

  autoGrowTextZone(e) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15) + "px";
  }
  kycStatus() {
    const _this=this;
    return new Promise((resolve,reject)=>{
      _this.crmService.getLeadStatus().subscribe((response: any) => {
        console.log(response);
        resolve(response)
        if(response){
          if(response[3] && response[3].id){
            _this.failedStatusId = response[3].id;
          }
          if(response[6] && response[6].id){
            _this.crifStatusId = response[6].id;
          }
        }
      },
      ((error)=>{
        reject(error);
      }))
    })
   
  }
  filesSelected(event, type) {
    console.log('event',event)
    const input = event.target.files;
    console.log('input',input.length)
    if(input.length < 3){
      this.fileService.filesSelected(event, this.selectedFiles[type]).then(
        () => {
          for (const pic of this.selectedFiles[type].files) {
            let fileObjFinal;
            const size = pic["size"] / 1024;
            if (pic["type"]) {
              const fileObj = {
                owner: this.activeUser,
                fileName: pic["name"],
                fileSize: size / 1024,
                caption: "",
                fileType: pic["type"].split("/")[1],
              }
              fileObjFinal = fileObj;
            } else {
              const picType = "jpeg";
              const fileObj = {
                owner: this.activeUser,
                fileName: pic["name"],
                fileSize: size / 1024,
                caption: "",
                fileType: picType,
              }
              fileObjFinal = fileObj;
            }
            fileObjFinal['file'] = pic;
            fileObjFinal['type'] = type;
            console.log('fileObjFinal',fileObjFinal)
            this.filesToUpload.push(fileObjFinal);
            console.log('this.filesToUpload', this.filesToUpload);
            this.sendApplicantInfo();
          }
        }).catch((error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
    }
    else{
      const error="Max two file can uplaod"
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    }
    
  }

  sendApplicantInfo() {
    let applicantInfo = {
      id: this.applicantId,
      info: this.getApplicantInfo(),
      files: this.filesToUpload
    }
    console.log("sendd files",this.filesToUpload)
    console.log("In send Applicant", applicantInfo);
    this.addApplicant.emit(applicantInfo);
  }
  removApplicant(applicantId) {
    console.log('applicantId',this.applicant)
    if(this.applicant && this.applicant.id){
      let removeApplicant={
        applicantid:this.applicant.id,
        status:this.leadInfo.status.name,
        creditScore:true,
        leadUID:this.leadInfo.uid
  
      }
      this.removeApplicant.emit(removeApplicant);
    }
    else{
      let removeApplicant={
        applicantid:applicantId,
        status:this.leadInfo.status.name,
        creditScore:false
      }
      this.removeApplicant.emit(removeApplicant);
    }
    
    
  }
  getApplicantInfo() {
    let applicantInfo: any = {
      "originFrom": "Lead",
      "originUid": this.parentId,
      "dob": this.datePipe.transform(this.applicantForm.controls.dob.value,'yyyy-MM-dd'),
      "telephone": [
        {
          "telephoneType": this.applicantForm.controls.telephoneType.value,
          "telephoneNumber": this.applicantForm.controls.telephoneNumber.value
        }
      ],
      "validationIds": [],
      "relationType": this.applicantForm.controls.relationType.value,
      "relationName": this.applicantForm.controls.relationName.value,
      "permanentAddress": this.applicantForm.controls.permanentAddress.value,
      "permanentCity": this.applicantForm.controls.permanentCity.value,
      "permanentState": this.applicantForm.controls.permanentState.value,
      "permanentPinCode": this.applicantForm.controls.permanentPinCode.value,
      "nomineeType": this.applicantForm.controls.nomineeType.value,
      "nomineeName": this.applicantForm.controls.nomineeName.value,
      "address": [
        {
          "addressType": this.applicantForm.controls.addressType.value,
          "address": this.applicantForm.controls.address.value,
          "city": this.applicantForm.controls.city.value,
          "state": this.applicantForm.controls.state.value,
          "pin": this.applicantForm.controls.pin.value
        }
      ],
      // "panNumber": this.applicantForm.controls.panNumber.value,
    }
    // if (this.applicant.validationIds && this.applicant.validationIds[0].attachments) {
    //   applicantInfo.validationIds[0].attachments = this.applicant.validationIds[0].attachments;
    // }
    // if (this.applicant.validationIds && this.applicant.validationIds[1].attachments) {
    //   applicantInfo.validationIds[1].attachments = this.applicant.validationIds[1].attachments;
    // }
    // "validationIds": [
    //   {
    //     "idTypes": this.applicantForm.controls.idTypes.value,
    //     "idValue": this.applicantForm.controls.idValue.value,
    //     // "attachments": this.applicantForm.controls.atta
    //   },
    //   {
    //     "idTypes": this.applicantForm.controls.idTypes1.value,
    //     "idValue": this.applicantForm.controls.idValue1.value,
    //     // "attachments": this.fileKycData
    //   }
    // ],
    if (this.applicantForm.controls.idTypes && this.applicantForm.controls.idTypes.value) {
      let kyc = {
        'idTypes': this.applicantForm.controls.idTypes.value,
        'idValue':this.applicantForm.controls.idValue.value,
        'attachments': []
      }

      // applicantInfo["validationIds"][0]['idTypes'] = this.applicantForm.controls.idTypes.value;
      // applicantInfo["validationIds"][0]['idValue'] = this.applicantForm.controls.idValue.value;
      if (this.applicant.validationIds && this.applicant.validationIds[0] && this.applicant.validationIds[0].attachments) {
        kyc['attachments'] = this.applicant.validationIds[0].attachments;
      }
      applicantInfo.validationIds.push(kyc);
      // this.applicant.validationIds[0]['idTypes'] = this.applicantForm.controls.idTypes.value;
      // this.applicant.validationIds[0]['idValue'] = this.applicantForm.controls.idValue.value;
      // if (this.applicant.validationIds && this.applicant.validationIds[0].attachments) {
      //   applicantInfo.validationIds[0].attachments = this.applicant.validationIds[0].attachments;
      // }
    }
    if (this.applicantForm.controls.idTypes1 && this.applicantForm.controls.idTypes1.value) {
      let kyc = {
        'idTypes': this.applicantForm.controls.idTypes1.value,
        'idValue':this.applicantForm.controls.idValue1.value,
        'attachments': []
      }
      if (this.applicant.validationIds && this.applicant.validationIds[1] && this.applicant.validationIds[1].attachments) {
        kyc['attachments'] = this.applicant.validationIds[1].attachments;
      }
      applicantInfo.validationIds.push(kyc);
      // applicantInfo["validationIds"][1]['idTypes'] = this.applicantForm.controls.idTypes1.value;
      // applicantInfo["validationIds"][1]['idValue'] = this.applicantForm.controls.idValue1.value;
      // if (this.applicant.validationIds && this.applicant.validationIds[1].attachments) {
      //   applicantInfo.validationIds[1]['attachments'] = this.applicant.validationIds[1].attachments;
      // }
    }

    if (this.applicantForm.controls.idTypes2 && this.applicantForm.controls.idTypes2.value) {
      let kyc = {
        'idTypes': this.applicantForm.controls.idTypes2.value,
        'idValue':this.applicantForm.controls.idValue2.value,
        'attachments': []
      }
      if (this.applicant && this.applicant.validationIds && this.applicant.validationIds[2] && this.applicant.validationIds[2].attachments) {
        kyc['attachments'] = this.applicant.validationIds[2].attachments;
      }
      applicantInfo.validationIds.push(kyc);
      // this.applicant.validationIds[2]['idTypes'] = this.applicantForm.controls.idTypes2.value;
      // this.applicant.validationIds[2]['idValue'] = this.applicantForm.controls.idValue2.value;
      // if (this.applicant.validationIds && this.applicant.validationIds[2].attachments) {
      //   applicantInfo.validationIds[2].attachments = this.applicant.validationIds[2].attachments;
      // }
    }
    // if (this.applicant.panAttachments) {
    //   applicantInfo.panAttachments = this.applicant.panAttachments;
    // }
    if (this.applicant && this.applicant['parent']) {
      applicantInfo['parent'] = this.applicant['parent'];
    } else {
      applicantInfo['parent'] = false;
    }
    if (this.applicantForm.controls.customerName) {
      applicantInfo['customerName'] = this.applicantForm.controls.customerName.value;
    }
    if (this.applicantForm.controls.permanentPhoneNumber) {
      applicantInfo['permanentPhone'] = this.applicantForm.controls.permanentPhoneNumber.value;
    } else if (this.applicant['phone']) {
      applicantInfo['permanentPhone'] = this.applicant['phone'];
    }
    if (this.applicant['name']) {
      applicantInfo['customerName'] = this.applicant['name'];
    }  
    if (this.applicant['id']) {
      applicantInfo['id'] = this.applicant['id'];
    } 
    return applicantInfo;
  }

  resetErrors() {

  }
  deleteTempImage(i, type) {
    let files= this.filesToUpload.filter((fileObj) => {
      if(fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name){
        if(fileObj.type){
          return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type===type);
        }
      }
    });
    if (files && files.length > 0) {
      console.log(this.filesToUpload.indexOf(files[0]));
      if(this.filesToUpload && this.filesToUpload.indexOf(files[0])){
        const index = this.filesToUpload.indexOf(files[0]);
        this.filesToUpload.splice(index,1);
      }
    }
    this.selectedFiles[type].files.splice(i, 1);
    this.selectedFiles[type].base64.splice(i, 1);
    this.selectedFiles[type].caption.splice(i, 1);
    if (type === 'kyc1') {
      this.applicant.validationIds[0].attachments = [];

    } else if (type === 'kyc2') {
      this.applicant.validationIds[1].attachments = [];
    } 
    else if (type === 'kyc3') {
      this.applicant.validationIds[2].attachments = [];
    } 
    
    console.log(files);
    // else if (type === 'pan') {
    //   this.applicant.panAttachments = [];
    // }
    this.sendApplicantInfo();
  }
  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  showCrifscoreSection() {
    this.showCrifSection = !this.showCrifSection
  }
  saveCrifApplicant(kycInfoList) {
    // console.log('kycIbfoList',kycInfoList)
    this.api_loading = true;
        this.bCrifBtnDisable=true;
      const postData:any={
        "originUid": kycInfoList.originUid,
        "leadKycId": kycInfoList.id,
      }
    this.crmService.processInquiry(postData).subscribe(
      (data:any) => {
        console.log('data::',data.status)
        this.getCrifInquiryVerification(kycInfoList);
      },
      error => {
        this.api_loading = false;
        this.bCrifBtnDisable=false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })});
  }
  getCrifInquiryVerification(kycInfoList){
    const _this=this;
    return new Promise((resolve,reject)=>{
      _this.crmService.getCrifInquiryVerification(kycInfoList.originUid, kycInfoList.id).subscribe(
        (element)=>{
          resolve(element);
          // console.log('elemnt',element)
          if(element){
            _this.crifDetails = element;
            if(_this.crifDetails &&  _this.crifDetails.crifHTML){
              _this.crifHTML = _this.crifDetails.crifHTML;
            }
            if(_this.crifDetails && _this.crifDetails.crifScoreString){
              _this.crifScore = _this.crifDetails.crifScoreString;
            }
            _this.api_loading=false;
            _this.showPdfIcon = true;
            _this.bCrifBtnDisable=true;
          }
          
        }
      ),
      ((error)=>{
        reject(error);
      })
    })
  }
  printCRIF() {
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);
    printWindow.document.write(this.crifHTML);
    printWindow.moveTo(0, 0);
    printWindow.print();
    printWindow.document.close();
    setTimeout(() => {
      printWindow.close();
    }, 500);
  }
  handlePinCode(type){
    console.log('type',type)
    // if(type==='applicantPinCode'){
      var events = 'ccp';
      console.log('events',events,events.split)
      events.split(' ').forEach(e => 
        this.renderer.listen(this.el.nativeElement, e, (event) => {
          console.log('this.renderer',this.renderer)
        event.preventDefault();
        })
      );
    // }
  }
  applicantName(event:any,input){
    console.log(input)
    console.log(event);
    // var charCode = event.keyCode;

    //         if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

    //             return true;
    //         else
    //             return false;

  }
  dialogImgView(fileDetails:any){
    console.log('fileDetails',fileDetails);
    if(fileDetails){
      if(fileDetails.fileName && (fileDetails.fileType===('png' || 'jpeg' || 'bmp' || 'webp' || 'gif'))){
        let fileExtn:any=fileDetails.fileName.split('.').reverse()[0];
        if(fileExtn){
          let image='image/' + fileExtn;
          if(this.fileService && this.fileService.IMAGE_FORMATS){
            for(var i=0;i<this.fileService.IMAGE_FORMATS.length;i++){
              if(this.fileService.IMAGE_FORMATS[i]===image){
                console.log('imageIf',image);
                const dialogRef= this.dialog.open(PreviewpdfComponent,{
                  width:'100%',
                  // panelClass: ['popup-class', 'confirmationmainclass'],
                  data:{
                    requestType:'priviewFile',
                    data:fileDetails,
                  }
                })
                dialogRef.afterClosed().subscribe((res)=>{
                  console.log(res)
                })
              }
            }
          }
        }
      }
      else{
        console.log('imageelse');
        window.open(fileDetails.s3path);
      }
     
      
    }
    
    
    
   
  }


 
  


}


