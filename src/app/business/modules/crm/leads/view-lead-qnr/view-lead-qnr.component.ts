import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectConstants } from "../../../../../app.component";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { GroupStorageService } from "../../../../../shared/services/group-storage.service";
import { CrmService } from "../../crm.service";
import { ProviderServices } from "../../../../../business/services/provider-services.service";
import { WordProcessor } from "../../../../../shared/services/word-processor.service";
import { MatDialog } from "@angular/material/dialog";
import { CrmSelectMemberComponent } from "../../../../../business/shared/crm-select-member/crm-select-member.component";
import { TeleBookingService } from '../../../../../shared/services/tele-bookings-service';
import { SharedFunctions } from "../../../../../shared/functions/shared-functions";
import { LeadsService } from "../leads-service";


@Component({
  selector: 'app-view-lead-qnr',
  templateUrl: './view-lead-qnr.component.html',
  styleUrls: ['./view-lead-qnr.component.css']
})
export class ViewLeadQnrComponent implements OnInit {

  leadUID: any; // To store lead uid to fetch lead information
  leadInfo: any; // To store the lead information
  inquiryInfo:any;
  applicants: any = []; // By default only applicant will be there
  applicantsInfo = {};
  filesToUpload = [];
  filesCount = 0;
  activeUser: any;
  crifDetails: any;
  crifScore: any;
  showCrifSection = false;
  crifHTML: any;
  showPdfIcon: boolean;
  crifDialog: any;
  categoryId: any;
  questionaire: any;
  showQuestionnaire: boolean;
  questionAnswers: any;
  notes: any;
  api_loading_video: boolean;
  api_loading: boolean;
  api_loading_UpdateKyc: boolean;
  api_loading_UpdateKycProceed: boolean;
  headerName = 'Add/Update Details';
  telephoneNumber: any;
  api_loadingNotes: boolean = false;
  public monthName: any = [
    {
      'count': '01',
      'monthName': 'January'
    },
    {
      'count': '02',
      'monthName': 'February'
    },
    {
      'count': '03',
      'monthName': 'March'
    },
    {
      'count': '04',
      'monthName': 'April'
    },
    {
      'count': '05',
      'monthName': 'May'
    },
    {
      'count': '06',
      'monthName': 'June'
    },
    {
      'count': '07',
      'monthName': 'July'
    },
    {
      'count': '08',
      'monthName': 'August'
    },
    {
      'count': '09',
      'monthName': 'September'
    },
    {
      'count': '10',
      'monthName': 'October'
    },
    {
      'count': '11',
      'monthName': 'November'
    },
    {
      'count': '12',
      'monthName': 'December'
    }
  ]
  kycInfo:any;
  bCrifBtnDisable:boolean;
  generateCrifText:string='';
  api_loadingprintCrif:boolean;
  remarksDisable:boolean=true;
  notesErrorMsg:string;
  afterUpdate:any;
  crifBtnForHide:boolean;
  fileLoading: boolean;
  type: string;
  tempType: any;
  tempInquiryId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private crmService: CrmService,
    private location: Location,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private providerServices: ProviderServices,
    private wordProcessor: WordProcessor,
    private dialog: MatDialog,
    private router: Router,
    private teleService: TeleBookingService,
    private sharedFunctions: SharedFunctions,
    private leadsService: LeadsService
  ) {
    this.activatedRoute.params.subscribe(
      (params: any) => {
        if(params.id){
          this.leadUID = params.id;
        }
      }
    )
    this.activatedRoute.queryParams.subscribe((queryParams)=>{
      console.log('queryParams',queryParams)
      if(queryParams && queryParams.type){
        this.tempType=queryParams.type;
      }
      if(queryParams && queryParams.inquiryId){
        this.tempInquiryId=queryParams.inquiryId;
      }
      // if(this.type===undefined &&  this.tempType==='KYC'){
      //   this.leadUID= this.tempInquiryId;
      // }
    })
  }

  initLead() {
    const _this = this;
    _this.questionaire = {};
    console.log('leadUID',_this.leadUID);
    _this.fetchLeadInfo(_this.leadUID).then(
      (leadInfo: any) => {
        console.log('1stleadInfo',leadInfo)
        _this.leadInfo = leadInfo; // Setting Lead information.
        console.log('leadInfo::::::',_this.leadInfo)
        if( _this.leadInfo && _this.leadInfo.customer && this.leadInfo.customer.phoneNo){
          _this.telephoneNumber=_this.leadInfo.customer.phoneNo;
        }
        _this.api_loading_UpdateKyc = false;
        console.log('leadInfostatus::::::', _this.leadInfo.status)
        if (leadInfo && leadInfo.status && (leadInfo.status.name === 'New' || leadInfo.status.name === 'KYC Updated' || leadInfo.status.name === 'KYC')) {
          if (leadInfo.kycCreated) {
            _this.crmService.getkyc(leadInfo.uid).subscribe(
              (kycInfo) => {
                console.log("KYC Info:", kycInfo);
                _this.initApplicantForm(kycInfo);
                _this.kycInfo=kycInfo;
                _this.api_loading_UpdateKyc = false;
                _this.api_loading=false;
              }
            )
          } else {
            // alert('alert')
            let applicant = {
              parent: true,
              name: _this.leadInfo.customer.name,
              phone: _this.leadInfo.customer.phoneNo
            }
            _this.applicants = [0];
            console.log('_this.applicantsInfo',_this.applicantsInfo)
            _this.applicantsInfo[0] = applicant;
          }
          if(leadInfo.status.name === 'New'){
            _this.headerName = "Leads";
          }
          else if(leadInfo.status.name === 'KYC Updated'){
            _this.headerName = "CRIF";
          }
          else if(leadInfo.status.name === 'KYC'){
            _this.headerName = "KYC";
          }
        } else if (leadInfo && leadInfo.status && (leadInfo.status.name === 'Login' ||  leadInfo.status.name === 'Bank Details'
        || _this.leadInfo.status.name==='Loan Application' || _this.leadInfo.status.name==='Two Wheeler Details')) {
          _this.headerName = leadInfo.status.aliasName;
          _this.crmService.getkyc(leadInfo.uid).subscribe(
            (kycInfo) => {
              console.log("KYC Info:", kycInfo);
              _this.initApplicantForm(kycInfo);
            }
          )
        } else if (leadInfo && leadInfo.status && leadInfo.status.name === 'Credit Score Generated') {
          // console.log('this.kycInfo',this.kycInfo)
          _this.crmService.getkyc(leadInfo.uid).subscribe(
            (kycInfo:any) => {
              console.log("KYC Info:", kycInfo);
              _this.kycInfo=kycInfo;
              kycInfo.forEach((item)=>{    
                _this.headerName = 'Sales Field Verification';            
                _this.getCrifInquiryVerification(item);
              })              
            }
          )
          _this.getQuestionaire();
        }  else {
          if (leadInfo && leadInfo.status && leadInfo.status.name === 'Login Verified') {
            _this.headerName = 'Credit Recommendation';
          }
          else if (leadInfo && leadInfo.status && leadInfo.status.name === 'Credit Recommendation') {
            _this.headerName = 'Loan Sanction';
            _this.crmService.getkyc(leadInfo.uid).subscribe(
              (kycInfo) => {
                console.log("KYC Info:", kycInfo);
                _this.initApplicantForm(kycInfo);
              }
            )
          } else { 
            _this.headerName = leadInfo.status.aliasName;
          }
          _this.getQuestionaire();
        }
      }
    );
  }
  getTelephoneNumer(phNo) {
    this.telephoneNumber = this.teleService.getTeleNumber(phNo);
  }
  /**
   * Init method
   */
  ngOnInit() {
    this.activeUser = this.groupService.getitemFromGroupStorage("ynw-user");
    this.initLead();
  }

  initApplicantForm(kycList) {
    console.log('kycList',kycList);
    this.applicants = [];
    for (let kycIndex = 0; kycIndex < kycList.length; kycIndex++) {
      let applicant = kycList[kycIndex];
      if (!applicant.customerName) {
        applicant['customerName'] = this.leadInfo.customer.name;
      }
      this.applicantsInfo[kycIndex] = applicant;
      this.applicants.push(kycIndex);
    }
  }

  removeApplicant(applicantInfo, applicationIndex) {
    console.log('applicantInfo',applicantInfo);
     if (applicantInfo && ((applicantInfo['status'] === 'New') || (applicantInfo['status'] === 'KYC'))) {
      if(applicantInfo && (applicantInfo['creditScore']===true)){
        if (applicantInfo && applicantInfo['applicantid'] && this.leadInfo && this.leadInfo.uid) {
          console.log('applicantInfoapplicantid,applicantInfo',applicantInfo)
          const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
            width: "100%",
            panelClass: ["popup-class", "confirmationmainclass"],
            data: {
              requestType: "applicantRemove",
            }
          });
          dialogRef.afterClosed().subscribe((dialogresponse: any) => {
            if (dialogresponse === 'remove') {
              this.crmService.deleteCoApplicant(applicantInfo['applicantid'], this.leadInfo.uid).subscribe((response) => {
                if (response) {
                  this.applicantsInfo = {};
                  this.updateKyc()
                  // this.initLead();
                  this.snackbarService.openSnackBar('Successfully removed Co-Applicant');
                }
              })
            }
          });
        }
      }
      else{
        if (this.applicantsInfo && this.applicantsInfo[applicantInfo['applicantid']]) {
          const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
            width: "100%",
            panelClass: ["popup-class", "confirmationmainclass"],
            data: {
              requestType: "applicantRemove",
            }
          });
          dialogRef.afterClosed().subscribe((response)=>{
            if(response=== 'remove'){
              delete this.applicantsInfo[applicantInfo['applicantid']];
              if (this.applicants) {
                const index = this.applicants.indexOf(applicantInfo['applicantid']);
                this.applicants.splice(index, 1);
                this.updateKyc()
                console.log("After:", this.applicantsInfo);
                this.snackbarService.openSnackBar('Successfully removed Co-Applicant');
              }
            }
          })
          
        }
      }
       
     }
     else{
      if (applicantInfo && applicantInfo['applicantid'] && this.leadInfo && this.leadInfo.uid) {
        const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
          width: "100%",
          panelClass: ["popup-class", "confirmationmainclass"],
          data: {
            requestType: "applicantRemove",
          }
        });
        dialogRef.afterClosed().subscribe((dialogresponse: any) => {
          if (dialogresponse === 'remove') {
            this.crmService.deleteCoApplicant(applicantInfo['applicantid'], this.leadInfo.uid).subscribe((response) => {
              if (response) {
                this.applicantsInfo = {};
                this.updateKyc()
                // this.initLead();
                this.snackbarService.openSnackBar('Successfully removed Co-Applicant');
              }
            })
          }
        });
      }
     }
    
    
  }

  addCoApplicant() {
    let maxVal = parseInt(Object.keys(this.applicantsInfo).reduce((a, b) => this.applicantsInfo[a] > this.applicantsInfo[b] ? a : b)) + 1;
    console.log("maxVal",maxVal);
    this.applicants.push(maxVal);
    this.applicantsInfo[maxVal] = {
      parent: false,
      parentid: {
        id: this.leadInfo.customer.id
      }
    }
    console.log("maxVal",this.applicantsInfo[maxVal]);

  }

  /**
   * returns fetch lead information by uid
   * @param leadUID lead uid
   */
  fetchLeadInfo(leadUID) {
    const _this = this;
      return new Promise(function (resolve, reject) { 
        if(_this.type===undefined &&  _this.tempType==='KYC'){
          // alert('alert2')
          _this.crmService.getEnquiryDetails(leadUID).subscribe((inquiryInfo:any)=>{
            console.log('inquiryInfo',inquiryInfo)
            resolve(inquiryInfo)
          },
          (error)=>{
            reject(error);
          }
          )
        }
        else{
          _this.crmService.getLeadDetails(leadUID).subscribe(
            (leadInfo: any) => {
              resolve(leadInfo);
            }, (error) => {
              reject(error);
            }
          )
        }
      })
    
  }
  uploadAudioVideo(data) {
    const _this = this;
    let count = 0;
    console.log("DAta:",data);
    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        console.log("S3URLOBJ:", s3UrlObj);
        console.log('_this.filesToUpload',_this.filesToUpload)
        const file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === (s3UrlObj.orderId) ) ? fileObj : '');
        })[0];
        console.log("File:", file);
        if (file) {
          await _this.uploadFiles(file['file'], s3UrlObj.url).then(
            () => {
              count++;
              console.log("Count", count);
              console.log("Count", data.length);
              if (count === data.length) {
                console.log("HERE");
                resolve(true);
              }
            }
          );
        }
        else{
          resolve(true);
        }     
      }
    })
  }
  uploadFiles(file, url) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.providerServices.videoaudioS3Upload(file, url)
        .subscribe(() => {
          resolve(true);
        }, error => {
          console.log('error',error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }
  getFileInfo(type, list) {
    console.log('list',list)
    let fileInfo = list.filter((fileObj) => {
      console.log('fileObj',fileObj);
      return fileObj.type === type ? fileObj : '';
    });
    console.log('fileInfo',fileInfo)
    // list=''
    return fileInfo;
  }
  receivedApplicantInfo(applicant, applicantIndex) {
    console.log(applicant);
    let filesObj = applicant.files;
    // console.log('applicant.files',applicant.files)
    if (applicant.info) {
      this.applicantsInfo[applicantIndex] = applicant.info;
    }
    console.log('this.applicantsInfo[applicantIndex]', this.applicantsInfo[applicantIndex] )
    if (this.applicantsInfo[applicantIndex]) {
        if (this.applicantsInfo){
          let fileData = this.getFileInfo('kyc1', filesObj);
          for(let i=0;i<fileData.length;i++){
            if ( fileData && fileData.length > 0 && !fileData[i]['order']) {
              console.log('fileData[0]',fileData[i])
              fileData[i]['order'] = this.filesCount++;
              this.filesToUpload.push(fileData[i]);
              this.applicantsInfo[applicantIndex].validationIds[0].attachments = fileData;
            }
          } 
        }
        if (this.applicantsInfo){
          let fileData = this.getFileInfo('kyc2', filesObj);
          // fileData && fileData.length > 0  &&
          for(let i=0;i<fileData.length;i++){
           if (fileData && fileData.length > 0 && !fileData[i]['order']) {
             fileData[i]['order'] = this.filesCount++;
             this.filesToUpload.push(fileData[i]);
             this.applicantsInfo[applicantIndex].validationIds[1].attachments = fileData;
           }
         }
        }
      if (this.applicantsInfo[applicantIndex].validationIds[2]) {
        if (this.applicantsInfo[applicantIndex].validationIds[2].idTypes2 != null || 
          this.applicantsInfo[applicantIndex].validationIds[2].idTypes2 != '') {
          if (this.applicantsInfo) {
            let fileData = this.getFileInfo('kyc3', filesObj);
            for(let i=0;i<fileData.length;i++){
              if (fileData && fileData.length > 0 && !fileData[i]['order']) {
                fileData[i]['order'] = this.filesCount++;
                this.filesToUpload.push(fileData[i]);
                this.applicantsInfo[applicantIndex].validationIds[2].attachments = fileData;
              }
            }
          }
        } else {
          this.applicantsInfo[applicantIndex].validationIds.splice(2, 1);
        }
      }
      if (this.applicantsInfo) {
            let fileData = this.getFileInfo('other', filesObj);
            console.log("Other Attachments called",fileData) 
            for(let i=0;i<fileData.length;i++)
            {
              if (fileData && fileData.length > 0 && !fileData[i]['order']) {
              fileData[i]['order'] = this.filesCount++;
              this.filesToUpload.push(fileData[i]);
              this.applicantsInfo[applicantIndex].otherAttachments = fileData;
            }
        }
      }
    }
    if (this.applicantsInfo && this.applicantsInfo[applicantIndex] && this.applicantsInfo[applicantIndex].parent) {
      this.applicantsInfo[applicantIndex]['customer'] = this.leadInfo.customer.id;
    } else {
      this.applicantsInfo[applicantIndex]['parentid'] = {}
      this.applicantsInfo[applicantIndex]['parentid']['id'] = this.leadInfo.customer.id;
    }
    this.applicantsInfo[applicantIndex]['originUid'] = this.leadInfo.uid;
    // this.applicantsInfo[applicantIndex]['originFrom'] = "Lead";
    if(this.type===undefined &&  this.tempType==='KYC'){
      this.applicantsInfo[applicantIndex]['originFrom'] = "Enquire";
    }
    else{
      this.applicantsInfo[applicantIndex]['originFrom'] = "Lead";
    }

    if (applicantIndex === 0 && !this.applicantsInfo[applicantIndex]['permanentPhone']) {
      this.applicantsInfo[applicantIndex]['permanentPhone'] = this.leadInfo.customer.phoneNo;
    }
    console.log(applicantIndex);
    console.log('applicantsInfo:::::',this.applicantsInfo);
    const serviceCall= applicant.text;
    // console.log('serviceCall',serviceCall);
    if((serviceCall==='Delete') || (serviceCall==='InputFileUpload')){
      this.api_loading=true;
      console.log('servicecall',serviceCall);
      this.afterUpdate='UpdateServiceCall'
      this.updateKyc(serviceCall);
    }
  }

  /**
   * Back to previous page
   */
  goBack() {
    this.location.back();
  }



  updateQNRProceedStatus(uuid) {
    console.log('this.leadInfo.status.name111', this.leadInfo.status.name);
    this.providerServices.updateQNRProceedStatus(this.leadInfo.status.id, uuid)
      .subscribe((data) => {
        this.router.navigate(['provider', 'crm']);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.api_loading_video = false;
        });
  }
  uploadAudioVideoQNR(s3UrlObj) {
    const _this = this;
    let count = 0;
    let postData = {
      urls: []
    };
    console.log("uplod:", _this.questionAnswers.filestoUpload);

    return new Promise(async function (resolve, reject) {
      if (s3UrlObj.urls && s3UrlObj.urls.length > 0) {
        for (const s3Obj of s3UrlObj.urls) {
          postData['urls'].push({ uid: s3Obj.uid, labelName: s3Obj.labelName });

          const file = _this.questionAnswers.filestoUpload[s3Obj.labelName][s3Obj.document];
          await _this.uploadFiles(file, s3Obj.url).then(
            () => {
              count++;
              console.log(s3UrlObj.urls.length);
              if (count === s3UrlObj.urls.length) {
                resolve(postData);
              }
              console.log(count);
            }
          );
        }
        _this.api_loading_UpdateKycProceed = false;
        _this.api_loading_UpdateKyc = false;
      }
    });

  }

  uploadFileStatus(uuid, data) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      console.log("Data:", data);
      if (data.urls.length > 0) {
        _this.uploadAudioVideoQNR(data).then(
          (uploadInput) => {
            _this.providerServices.providerLeadQnrUploadStatusUpdate(uuid, uploadInput).subscribe((data) => {
              resolve(true);
            },
              error => {
                _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                _this.api_loading = false;
                _this.api_loading_video = false;
                _this.api_loading_UpdateKycProceed = false;
              });
          }
        );
      } else {
        resolve(true);
      }
    })
  }

  complete(uuid, type?) {
    if (type) {
      this.api_loading_UpdateKyc = false;
      this.snackbarService.openSnackBar('saved successfully');
      // this.initLead();
    } else {
      this.api_loading_UpdateKyc = false;
      this.updateQNRProceedStatus(uuid);
    }
  }
  submitQuestionnaire(uuid, type?) {
    const _this = this;
    const dataToSend: FormData = new FormData();
    const blobpost_Data = new Blob([JSON.stringify(_this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    if (this.leadInfo.status.name === 'Login Verified' || this.questionaire.transactionType==='LEADSTATUS') {
      _this.providerServices.submitLeadLoginVerifyQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        _this.complete(uuid, type);
      });
    } else if ((this.questionaire && this.questionaire.questionAnswers && this.questionaire.questionAnswers[0].answerLine) || this.leadInfo.status.name === 'Credit Recommendation') {
      _this.providerServices.resubmitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        _this.complete(uuid, type);
      });
    } else {
      _this.providerServices.submitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        _this.complete(uuid, type);
      });
    }
  }
  /**
   * Save button 
   */
  updateKyc(errorType?) {
    const _this = this;
    if (this.leadInfo.status.name === 'Credit Score Generated' || this.leadInfo.status.name === 'Sales Verified'
      || this.leadInfo.status.name === 'Login Verified' || this.leadInfo.status.name === 'Credit Recommendation'
      || this.leadInfo.status.name === 'Login' || this.leadInfo.status.name === 'Bank Details Verified'
      || this.leadInfo.status.name==='Loan Application Verified' || this.leadInfo.status.name==='Two Wheeler Details Verified') {
      console.log('updateKyc', this.leadInfo.status.name);
      console.log(this.questionAnswers);
      if (!this.questionAnswers.answers) {
        this.api_loading = false;
        // this.api_loading_UpdateKycProceed = true;
        return false;
      }
      this.api_loading_UpdateKyc = true      
      this.submitQuestionnaire(this.leadInfo.uid, 'save');
    } else if (this.leadInfo.status.name === 'New' || this.leadInfo.status.name === 'KYC Updated' ||  this.leadInfo.status.name === 'KYC') {
      this.api_loading_UpdateKyc = true;
      console.log('this.kycInfo',this.kycInfo)
      console.log("Applicants Update", this.applicantsInfo);
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key:any) => {
        console.log('key',key)
        applicantsList.push(this.applicantsInfo[key]);
      })
        console.log('applicantsList',applicantsList)
        this.crmService.addkyc(applicantsList).subscribe((s3urls: any) => {
          console.log('afterupdateKYCDAta', s3urls);
          // this.api_loading_UpdateKyc = false;
          if (s3urls.length > 0) {
            this.uploadAudioVideo(s3urls).then(
              (dataS3Url) => {
                console.log('dataS3Url',dataS3Url)
                if(_this.leadInfo.status.name === 'KYC Updated'){
                  _this.snackbarService.openSnackBar('Updated successfully');
                }
                else{
                  if(errorType === 'InputFileUpload' || errorType==='Delete'){
                    console.log('errorType',errorType)
                  }
                  else{
                    _this.snackbarService.openSnackBar('KYC updated successfully');
                  }
                  
                }
                _this.api_loading_UpdateKyc = false;
                _this.api_loading=false;
                if(_this.leadInfo.status.name === 'New' || _this.leadInfo.status.name === 'KYC'){
                  _this.router.navigate(['/provider/viewleadqnr/' + this.leadUID]);
                }
                else{
                  _this.initLead();
                }
                
              }, (error) => {
                console.log("upload error", error);
              }
            );
          } else {
            if(this.leadInfo.status.name === 'KYC Updated'){
              this.snackbarService.openSnackBar('Updated successfully');
            }
            else{
              this.snackbarService.openSnackBar('KYC updated successfully');
            }
            this.api_loading_UpdateKyc = false;
            this.initLead();
          }
        },
          (error) => {
            setTimeout(() => {
              this.api_loading_UpdateKyc = false;
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }, projectConstants.TIMEOUT_DELAY);
          })
    } 
  }
  /**
   * Proceed Button
   */
  ProceedStatus() {
    const _this=this;
    if (this.leadInfo.status.name === 'Credit Score Generated' || this.leadInfo.status.name === 'Sales Verified'
      || this.leadInfo.status.name === 'Login Verified' || this.leadInfo.status.name === 'Credit Recommendation'
      || this.leadInfo.status.name === 'Bank Details Verified' || this.leadInfo.status.name==='Loan Application Verified'
      || this.leadInfo.status.name==='Two Wheeler Details Verified'
    ) {
      // this.api_loading_UpdateKyc=true;
      this.api_loading_UpdateKycProceed = true;
      if (this.leadInfo.status.name === 'Credit Recommendation') {
        this.complete(this.leadInfo.uid);
        this.snackbarService.openSnackBar('Updated successfully'); 
      } else {
        if (!this.questionAnswers.answers) {
          this.api_loading = false;
          this.api_loading_UpdateKycProceed = false;
          return false;
        }
        this.api_loading_UpdateKycProceed = true;        
        console.log('this.questionAnswers.answers',this.questionAnswers.answers)
        console.log(this.leadInfo)        
        if(this.leadInfo.isRedirected){
          console.log("this.leadInfo.isRedirected")
          this.providerServices.validateProviderQuestionnaire(this.questionAnswers.answers).subscribe((data: any) => {
            this.api_loading = false;
            if (data.length === 0) {
              this.submitQuestionnaire(this.leadInfo.uid);
              this.snackbarService.openSnackBar('Updated successfully');
            } else {
              this.api_loading_UpdateKycProceed = false;
            }
            this.sharedFunctions.sendMessage({ type: 'qnrValidateError', value: data });
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              this.api_loading = false;
            });
        } else{
          this.providerServices.validateProviderQuestionnaire(this.questionAnswers.answers).subscribe((data: any) => {
            this.api_loading = false;
            if (data.length === 0) {
              this.submitQuestionnaire(this.leadInfo.uid);
              this.snackbarService.openSnackBar('Updated successfully');
            } else {
              this.api_loading_UpdateKycProceed = false;
            }
            this.sharedFunctions.sendMessage({ type: 'qnrValidateError', value: data });
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              this.api_loading = false;
            });
        }
      }
    } else if (this.leadInfo.status.name === 'Login') {
      this.crmService.proceedToLoginVerified(this.leadInfo.status.id, this.leadInfo.uid).subscribe((response) => {
        this.api_loading_UpdateKycProceed = true;
        this.snackbarService.openSnackBar('Updated successfully');
        this.router.navigate(['provider', 'crm']);
      }, (error) => {
        this.api_loading_UpdateKycProceed = false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    } else if (this.leadInfo.status.name === 'Bank Details' || this.leadInfo.status.name==='Loan Application' 
    || this.leadInfo.status.name==='Two Wheeler Details'){
      this.complete(this.leadInfo.uid);
    } else {
      this.api_loading_UpdateKycProceed = true;
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key) => {
        console.log(key)
        applicantsList.push(this.applicantsInfo[key]);
      })
      this.crmService.addkyc(applicantsList).subscribe((s3urls: any) => {
        console.log('afterupdateKYCDAta', applicantsList,s3urls);
        this.api_loading_UpdateKyc = false;
        this.api_loading_UpdateKycProceed = false;
        console.log("s3urls.length",s3urls.length)
        if (s3urls.length > 0) {
          console.log("Entered if")
          this.uploadAudioVideo(s3urls).then(
            () => {
              if(_this.leadInfo.status.name === 'KYC Updated'){
                _this.snackbarService.openSnackBar('Updated successfully');
              }
              else{
                _this.snackbarService.openSnackBar('KYC updated successfully');
              }
               console.log("Proceeding done4")
               _this.api_loading_UpdateKyc = false;
               _this.api_loading_UpdateKycProceed = false;
              if (_this.leadInfo.status.name === 'New' || _this.leadInfo.status.name === 'KYC') {
                console.log("Proceeding done")
                _this.proceedToCrif(applicantsList);
              } else {
                _this.proceedAfterKycUpdation();
              }

            }, (error) => {
              console.log("upload error", error);
            }
          );
        } else {
          if(this.leadInfo.status.name === 'KYC Updated'){
            this.snackbarService.openSnackBar('Updated successfully');
          }
          else{
            this.snackbarService.openSnackBar('KYC updated successfully');
          }
           console.log("Proceeding done3")
          this.api_loading_UpdateKyc = false;
          this.api_loading_UpdateKycProceed = false;
          if (this.leadInfo.status.name === 'New' || this.leadInfo.status.name === 'KYC') {
            console.log("Proceeding done2")
            this.proceedToCrif(applicantsList);
          } else {
            this.proceedAfterKycUpdation();
          }
        }
      },
        (error) => {
          setTimeout(() => {
            this.api_loading_UpdateKyc = false;
            this.api_loading_UpdateKycProceed = false;
            console.log('error',error)
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }, projectConstants.TIMEOUT_DELAY);
        })
    }
  }

  proceedToCrif(applicantsList) {
    this.crmService.getproceedStatus(this.leadInfo.status.id,applicantsList).subscribe((response) => {
      console.log('afterupdateFollowUpData', response);
      this.api_loading_UpdateKycProceed = false;
      this.router.navigate(['provider', 'crm']);
    },
      (error) => {
        this.api_loading_UpdateKycProceed = false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })
  }
  proceedAfterKycUpdation() {
    this.api_loading_UpdateKycProceed = true
    this.crmService.ProceedStatusToSales(this.leadInfo.uid).subscribe(
      () => {
        this.api_loading_UpdateKycProceed = false;
        this.router.navigate(['provider', 'crm']);
      }
      , (error) => {
        this.api_loading_UpdateKycProceed = false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })
  }

  getQuestionaire() {
    this.questionaire = {};
    this.providerServices.getActiveQuestionaire(this.leadInfo.uid).subscribe(
      (questionaire: any) => {
        this.questionaire = questionaire;
        console.log(this.questionaire);
        if (this.questionaire.questionAnswers) {
          this.questionAnswers = this.questionaire.questionAnswers;
        }
        this.showQuestionnaire = true;
      }
    )
  }
  getQuestionAnswers(event) {
    console.log("In getQuestion Answers");
    const _this = this;
    this.questionAnswers = event;
    // this.questionAnswers.answers.answerLine.forEach((element, index) => {
    //   if (element.answer && element.answer.fileUpload) {
    //     element.answer.fileUpload.forEach((element1, index1) => {
    //       console.log("Element1:");
    //       console.log(element1);        
    //         _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['driveId'] = element1.driveId;
    //         _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['uid'] = element1.uid;
    //         _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['status'] = 'COMPLETE';
    //         _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['action'] = 'add';
    //     });
    //   }
    // });
  console.log("Show:",_this.questionAnswers);
  }
  
  autoGrowTextZone(e) {
    if(e){
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight + 15) + "px";
      this.remarksDisable=false;
      this.notesErrorMsg=''
    }
    else{
      this.notesErrorMsg='Please give some remarks'
      const error= this.notesErrorMsg 
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      this.remarksDisable=true;
    }
    
  }
  saveNotes() {
    console.log('this.notes',this.notes);
    if (this.notes !== '') {
      this.api_loadingNotes = true;
      this.remarksDisable=false;
      const createNoteData: any = {
        "note": this.notes
      }
      this.crmService.addLeadNotes(this.leadInfo.uid, createNoteData).subscribe((response: any) => {
        console.log('response', response)
        this.notes = '';
        setTimeout(() => {
          this.initLead();
          this.api_loadingNotes = false;
          this.remarksDisable=false;
        }, projectConstants.TIMEOUT_DELAY);
        this.snackbarService.openSnackBar('Remarks added successfully');
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    }
    else{
      this.notesErrorMsg='Please give some remarks'
      const error= this.notesErrorMsg 
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
     this.remarksDisable=true;
    }
  }
  noteView(noteDetails: any) {
    console.log("notedetails", noteDetails);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        requestType: "noteDetails",
        header: "Remarks Details",
        noteDetails: noteDetails
      }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.initLead();
      console.log("response", response);
    });
  }

  redirect(uid) {
    console.log('uid',uid)
    const dialogRef=this.dialog.open(CrmSelectMemberComponent,{
      width:"100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data:{
        requestType:'createUpdateNotes',
        info:uid,
        header: "Add remarks"
      }
    })
    dialogRef.afterClosed().subscribe((response:any)=>{
      console.log('response',response);
      if (response) {
        this.crmService.proceedToRedirectNotesadded(this.leadInfo.uid, this.leadInfo.status.id, response).subscribe(
          () => {
            this.router.navigate(['provider', 'crm']);
          }
          , (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          })
      }
    })
  }
  showCrifscoreSection() {
    if(this.generateCrifText==='Verify CRIF Score of'){
      this.showCrifSection = !this.showCrifSection
    }
  }
  getCrifInquiryVerification(kycInfoList){
     console.log('kycIbfoList2',kycInfoList.originUid,kycInfoList.id)
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
            _this.api_loadingprintCrif=false;
            _this.showPdfIcon = true;
            _this.generateCrifText='Verify CRIF Score of'
            _this.bCrifBtnDisable=true;
            this.crifBtnForHide=false;
          }
          
        },
        ((error:any)=>{
          if(this.leadInfo && this.leadInfo.status){
            if(this.leadInfo.status.name==='Credit Score Generated'){
              this.generateCrifText='Sorry you have no CRIF score of';
            }
          }
        })
      ),
      ((error)=>{
         console.log('error222222',error)
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

  uploadFile(input) {
    this.fileLoading = true;
    const _this = this;
    const fileString = [{
      caption: input.caption,
      mimeType: input.file.type,
      url: input.file.name,
      size: input.file.size,
      labelName: input.labelName
    }]
    const dataToSend: FormData = new FormData();
    const requestsInfo = {
      "proId": this.leadInfo.customer.id,
      "questionnaireId": this.questionaire.questionnaireName
    }
    const requests = new Blob([JSON.stringify(requestsInfo)], { type: 'application/json' });
    dataToSend.append('requests', requests);
    dataToSend.append('files', new Blob([JSON.stringify(fileString)], { type: 'application/json' }));
    this.leadsService.uploadFile(dataToSend).subscribe(
      (info: any) => {
        this.uploadAudioVideoQNR(info).then(()=>{
          console.log("Show:",_this.questionAnswers);
          _this.questionAnswers.answers.answerLine.forEach((element, index) => {
              if (element.answer && element.answer.fileUpload && element.labelName === input.labelName) {
                console.log("Element:", element)
                element.answer.fileUpload.forEach((element1, index1) => {
                  console.log("Element1:");
                  console.log(element1);
                  if (element1.caption === input.caption) {
                    _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['driveId'] = info.urls[0].driveId;
                    _this.questionAnswers.filestoUpload[element.labelName][element1.caption]['driveId'] = info.urls[0].driveId;
                    _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['uid'] = info.urls[0].uid;
                    _this.questionAnswers.filestoUpload[element.labelName][element1.caption]['uid'] = info.urls[0].uid;
                    _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['status'] = 'COMPLETE';
                    _this.questionAnswers.filestoUpload[element.labelName][element1.caption]['status'] = 'COMPLETE';
                    _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['action'] = 'add';
                    _this.questionAnswers.filestoUpload[element.labelName][element1.caption]['action'] = 'add';
                    _this.questionAnswers.answers.answerLine[index]['answer']['fileUpload'][index1]['s3path'] = info.urls[0].viewPath;
                    _this.questionAnswers.filestoUpload[element.labelName][element1.caption]['s3path'] = info.urls[0].viewPath;
                  } 
                });
              }
            });
          console.log("Show1:",_this.questionAnswers);
          this.fileLoading = false;
        });
      }, error => {
        console.log(error);
        this.fileLoading = false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    )
  }
  reject(uid) {
    console.log('uid',uid);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent,{
      width:"100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data:{
        requestType:'createUpdateNotes',
        info:uid,
        header: 'Add remarks',
      }
    })
    dialogRef.afterClosed().subscribe((response:any)=>{
      // console.log('response',response);
      // console.log(this.leadInfo.status)
      if(response){
        // console.log(this.leadInfo.status);
        let leadType:string='';
        if(this.leadInfo && this.leadInfo.status && this.leadInfo.status.name==='KYC'){
          leadType='enquire';
        }
        else{
          leadType='lead';
        }
        // console.log('leadType',leadType)
        this.crmService.rejectedStatusLeadkyc(this.leadInfo.uid,leadType,response).subscribe((response) => {
          console.log('afterreject', response);
          this.router.navigate(['provider', 'crm']);
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          })
      }
    })
    
  }
  editable(data){
    // console.log('disableFormFieldViewLead',data['info'].validationIds[0].idValue);


  }
}
