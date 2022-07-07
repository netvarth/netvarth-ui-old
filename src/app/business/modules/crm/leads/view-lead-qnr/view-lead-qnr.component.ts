import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectConstants } from "../../../../../app.component";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { GroupStorageService } from "../../../../../shared/services/group-storage.service";
import { CrmService } from "../../crm.service";
import { ProviderServices } from "../../../../../business/services/provider-services.service";
import { WordProcessor } from "../../../../../shared/services/word-processor.service";
// import { PreviewpdfComponent } from "./previewpdf/previewpdf.component";
import { MatDialog } from "@angular/material/dialog";
import { CrmSelectMemberComponent } from "../../../../../business/shared/crm-select-member/crm-select-member.component";
import { TeleBookingService } from '../../../../../shared/services/tele-bookings-service';
// import { SharedFunctions } from "../../../../../shared/functions/shared-functions";


@Component({
  selector: 'app-view-lead-qnr',
  templateUrl: './view-lead-qnr.component.html',
  styleUrls: ['./view-lead-qnr.component.css']
})
export class ViewLeadQnrComponent implements OnInit {

  leadUID: any; // To store lead uid to fetch lead information
  leadInfo: any; // To store the lead information
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
    // private sharedFunctions: SharedFunctions
  ) {
    this.activatedRoute.params.subscribe(
      (params: any) => {
        this.leadUID = params.id;
      }
    )
  }

  initLead() {
    const _this = this;
    _this.questionaire = {};
    _this.fetchLeadInfo(_this.leadUID).then(
      (leadInfo: any) => {
        _this.leadInfo = leadInfo; // Setting Lead information.
        _this.getTelephoneNumer(_this.leadInfo.customer.phoneNo);
        this.api_loading_UpdateKyc = false;
        console.log('leadInfostatus::::::', _this.leadInfo.status)
        if (leadInfo.status.name === 'New' || leadInfo.status.name === 'KYC Updated') {
          if (leadInfo.kycCreated) {
            _this.crmService.getkyc(leadInfo.uid).subscribe(
              (kycInfo) => {
                console.log("KYC Info:", kycInfo);
                _this.initApplicantForm(kycInfo);
                // this.api_loading=false;
                this.api_loading_UpdateKyc = false;
              }
            )
          } else {
            let applicant = {
              parent: true,
              name: _this.leadInfo.customer.name,
              phone: _this.leadInfo.customer.phoneNo
            }
            _this.applicants = [0];
            _this.applicantsInfo[0] = applicant;
          }
        } else if (leadInfo.status.name === 'Login') {
          _this.headerName = "Login Verification";
          _this.crmService.getkyc(leadInfo.uid).subscribe(
            (kycInfo) => {
              console.log("KYC Info:", kycInfo);
              _this.initApplicantForm(kycInfo);
            }

          )
        }
        // else if (leadInfo.status.name === 'Credit Recommendation') {
        //   _this.headerName = 'Loan Sanction';
        //   // _this.headerName = "Login Verification";
        // _this.crmService.getkyc(leadInfo.uid).subscribe(
        //   (kycInfo) => {
        //     console.log("KYC Info:", kycInfo);
        //     _this.initApplicantForm(kycInfo);
        //   }

        // )
        // }
        else {
          if (leadInfo.status.name === 'Login Verified') {
            this.headerName = 'Credit Recommendation';
          }
          else if (leadInfo.status.name === 'Credit Recommendation') {
            this.headerName = 'Loan Sanction';
            _this.headerName = "Login Verification";
            _this.crmService.getkyc(leadInfo.uid).subscribe(
              (kycInfo) => {
                console.log("KYC Info:", kycInfo);
                _this.initApplicantForm(kycInfo);
              }

            )
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
    this.applicants = [];
    for (let kycIndex = 0; kycIndex < kycList.length; kycIndex++) {
      console.log(kycList[kycIndex]);
      let applicant = kycList[kycIndex];
      if (!applicant.customerName) {
        applicant['customerName'] = this.leadInfo.customer.name;
      }
      this.applicantsInfo[kycIndex] = applicant;
      console.log(this.applicantsInfo);
      this.applicants.push(kycIndex);
    }
  }

  // removeApplicant(applicantId, applicationIndex) {
  //   console.log(applicationIndex);
  //   console.log(applicantId);
  //   console.log("Before:", this.applicantsInfo);
  //   // this.applicantsInfo.splice(applicantId,1);
  //   delete this.applicantsInfo[applicantId];
  //   const index = this.applicants.indexOf(applicantId);
  //   this.applicants.splice(index, 1);
  //   console.log("After:", this.applicantsInfo);
  // }
  removeApplicant(applicantInfo, applicationIndex) {
    if(applicantInfo && (applicantInfo['status'])){
      if (this.applicantsInfo && this.applicantsInfo[applicantInfo['applicantid']]) {
        delete this.applicantsInfo[applicantInfo['applicantid']];
        if (this.applicants) {
          const index = this.applicants.indexOf(applicantInfo['applicantid']);
          this.applicants.splice(index, 1);
          console.log("After:", this.applicantsInfo);
        }
      }
    }
    // else if(applicantInfo && (applicantInfo['status']==='KYC Updated')) {
    //   if (applicantInfo && applicantInfo['applicantid'] && this.leadInfo && this.leadInfo.uid) {
    //     this.crmService.deleteCoApplicant(applicantInfo['applicantid'],this.leadInfo.uid).subscribe((response) => {
    //       if (response) {
    //         this.initLead();
    //         console.log(response)
    //         console.log("After:", this.applicantsInfo);
    //       }
    //     })
    //   }
    // }
  }

  addCoApplicant() {
    let maxVal = parseInt(Object.keys(this.applicantsInfo).reduce((a, b) => this.applicantsInfo[a] > this.applicantsInfo[b] ? a : b)) + 1;
    console.log(maxVal);
    this.applicants.push(maxVal);
    this.applicantsInfo[maxVal] = {
      parent: false,
      parentid: {
        id: this.leadInfo.customer.id
      }
    }
  }

  /**
   * returns fetch lead information by uid
   * @param leadUID lead uid
   */
  fetchLeadInfo(leadUID) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.crmService.getLeadDetails(leadUID).subscribe(
        (leadInfo: any) => {
          resolve(leadInfo);
        }, (error) => {
          reject(error);
        }
      )
    })
  }
  uploadAudioVideo(data) {
    const _this = this;
    let count = 0;
    console.log("DAta:",data);
    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        console.log("S3URLOBJ:", s3UrlObj);
        const file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === s3UrlObj.orderId) ? fileObj : '');
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
          console.log(error);
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }
  getFileInfo(type, list) {
    let fileInfo = list.filter((fileObj) => {
      return fileObj.type === type ? fileObj : '';
    });
    return fileInfo;
  }
  receivedApplicantInfo(applicant, applicantIndex) {
    console.log(applicant);
    let filesObj = applicant.files;
    if (applicant.info) {
      this.applicantsInfo[applicantIndex] = applicant.info;
    }
    if (this.applicantsInfo[applicantIndex]) {
      if (this.applicantsInfo[applicantIndex].validationIds[0].attachments && this.applicantsInfo[applicantIndex].validationIds[0].attachments.length > 0) {
      } else {
        let fileData = this.getFileInfo('kyc1', filesObj);
        if (fileData && fileData.length > 0 && !fileData[0]['order']) {
          fileData[0]['order'] = this.filesCount++;
          this.filesToUpload.push(fileData[0]);
          this.applicantsInfo[applicantIndex].validationIds[0].attachments = fileData;
        }
      }
      if (this.applicantsInfo[applicantIndex].validationIds[1].attachments && this.applicantsInfo[applicantIndex].validationIds[1].attachments.length > 0) {
      } else {
        let fileData = this.getFileInfo('kyc2', filesObj);
        if (fileData && fileData.length > 0 && !fileData[0]['order']) {
          fileData[0]['order'] = this.filesCount++;
          this.filesToUpload.push(fileData[0]);
          this.applicantsInfo[applicantIndex].validationIds[1].attachments = fileData;
        }
      }
      if (this.applicantsInfo[applicantIndex].validationIds[2]) {
        if (this.applicantsInfo[applicantIndex].validationIds[2].idTypes2 != null || this.applicantsInfo[applicantIndex].validationIds[2].idTypes2 != '') {
          this.applicantsInfo[applicantIndex].validationIds.splice(2, 1);
        } else {
          if (this.applicantsInfo[applicantIndex].validationIds[2].attachments && this.applicantsInfo[applicantIndex].validationIds[2].attachments.length > 0) {
          } else {
            let fileData = this.getFileInfo('kyc3', filesObj);
            if (fileData && fileData.length > 0 && !fileData[0]['order']) {
              fileData[0]['order'] = this.filesCount++;
              this.filesToUpload.push(fileData[0]);
              this.applicantsInfo[applicantIndex].validationIds[2].attachments = fileData;
            }
          }
        }
      }


      // if (this.applicantsInfo[applicantIndex].panAttachments && this.applicantsInfo[applicantIndex].panAttachments.length > 0) {
      // } else {
      //   let fileData = this.getFileInfo('pan', filesObj);
      //   if (fileData && fileData.length > 0 && !fileData[0]['order']) {
      //     fileData[0]['order'] = this.filesCount++;
      //     this.filesToUpload.push(fileData[0]);
      //     this.applicantsInfo[applicantIndex].panAttachments = fileData;
      //   }
      // }
    }
    if (this.applicantsInfo[applicantIndex].parent) {
      this.applicantsInfo[applicantIndex]['customer'] = this.leadInfo.customer.id;
    } else {
      this.applicantsInfo[applicantIndex]['parentid'] = {}
      this.applicantsInfo[applicantIndex]['parentid']['id'] = this.leadInfo.customer.id;
    }
    this.applicantsInfo[applicantIndex]['originUid'] = this.leadInfo.uid;
    this.applicantsInfo[applicantIndex]['originFrom'] = "Lead";

    if (applicantIndex === 0 && !this.applicantsInfo[applicantIndex]['permanentPhone']) {
      this.applicantsInfo[applicantIndex]['permanentPhone'] = this.leadInfo.customer.phoneNo;
    }
    console.log(applicantIndex);
    console.log('applicantsInfo:::::',this.applicantsInfo);
  }

  /**
   * Back to previous page
   */
  goBack() {
    this.location.back();
  }

  reject() {
    this.crmService.rejectedStatusLeadkyc(this.leadInfo.uid).subscribe((response) => {
      console.log('afterupdateFollowUpData', response);
      this.router.navigate(['provider', 'crm']);
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })
  }

  updateQNRProceedStatus(uuid) {
    console.log('this.leadInfo.status.name', this.leadInfo.status.name)
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
      this.initLead();
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
    if (this.leadInfo.status.name === 'Login Verified') {
      _this.providerServices.submitLeadLoginVerifyQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        this.uploadFileStatus(uuid, data).then(
          () => {
            _this.complete(uuid, type);
          }
        );
      });
    } else if ((this.questionaire && this.questionaire.questionAnswers && this.questionaire.questionAnswers[0].answerLine) || this.leadInfo.status.name === 'Credit Recommendation') {
      _this.providerServices.resubmitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        this.uploadFileStatus(uuid, data).then(
          () => {
            _this.complete(uuid, type);
          }
        );
      });
    } else {
      _this.providerServices.submitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        this.uploadFileStatus(uuid, data).then(
          () => {
            _this.complete(uuid, type);
          }
        );
      });
    }
  }
  /**
   * Save button 
   */
  updateKyc() {
    if (this.leadInfo.status.name === 'Credit Score Generated' || this.leadInfo.status.name === 'Sales Verified'
      || this.leadInfo.status.name === 'Login Verified' || this.leadInfo.status.name === 'Credit Recommendation'
      || this.leadInfo.status.name === 'Login') {
      console.log('this.leadInfo.status.name', this.leadInfo.status.name)
      this.api_loading_UpdateKyc = true
      this.submitQuestionnaire(this.leadInfo.uid, 'save');
    } else if (this.leadInfo.status.name === 'New' || this.leadInfo.status.name === 'KYC Updated') {
      this.api_loading_UpdateKyc = true;
      console.log("Applicants Update", this.applicantsInfo);
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key) => {
        applicantsList.push(this.applicantsInfo[key]);
      })
      this.crmService.addkyc(applicantsList).subscribe((s3urls: any) => {
        console.log('afterupdateKYCDAta', s3urls);
        this.api_loading_UpdateKyc = false;
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            () => {
              if(this.leadInfo.status.name === 'KYC Updated'){
                this.snackbarService.openSnackBar('Updated successfully');
              }
              else{
                this.snackbarService.openSnackBar('KYC updated successfully');
              }
              
              this.api_loading_UpdateKyc = false;
              this.initLead();
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
    if (this.leadInfo.status.name === 'Credit Score Generated' || this.leadInfo.status.name === 'Sales Verified'
      || this.leadInfo.status.name === 'Login Verified' || this.leadInfo.status.name === 'Credit Recommendation'
    ) {
      // this.api_loading_UpdateKyc=true;
      this.api_loading_UpdateKycProceed = true;
      if (this.leadInfo.status.name === 'Credit Recommendation') {
        this.complete(this.leadInfo.uid);
      } else {
        this.api_loading_UpdateKycProceed = true;
        console.log('this.questionAnswers.answers',this.questionAnswers.answers)
        this.submitQuestionnaire(this.leadInfo.uid);
        // this.providerServices.validateProviderQuestionnaire(this.questionAnswers.answers).subscribe((data: any) => {
        //   this.api_loading = false;
        //   if (data.length === 0) {
        //     this.submitQuestionnaire(this.leadInfo.uid);
        //   } else {
        //     this.api_loading_UpdateKycProceed = false;
        //   }
        //   this.sharedFunctions.sendMessage({ type: 'qnrValidateError', value: data });
        // }, error => {
        //   this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        //   this.api_loading = false;
        // });
      }

    } else if (this.leadInfo.status.name === 'Login') {
      this.crmService.proceedToLoginVerified(this.leadInfo.status.id, this.leadInfo.uid).subscribe((response) => {
        this.api_loading_UpdateKycProceed = true;
        this.router.navigate(['provider', 'crm']);
      }, (error) => {
        this.api_loading_UpdateKycProceed = false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    }

    // else if (this.leadInfo.status.name === 'Credit Recommendation' ) {
    //   this.crmService.proceedToLoginVerified(this.leadInfo.uid).subscribe((response) => {
    //     this.api_loading_UpdateKycProceed=true;
    //     this.router.navigate(['provider', 'crm']);
    //   }, (error) => {
    //     this.api_loading_UpdateKycProceed=false;
    //     this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //   });
    // }
    else {
      this.api_loading_UpdateKycProceed = true;
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key) => {
        applicantsList.push(this.applicantsInfo[key]);
      })
      this.crmService.addkyc(applicantsList).subscribe((s3urls: any) => {
        console.log('afterupdateKYCDAta', s3urls);
        this.api_loading_UpdateKyc = false;
        this.api_loading_UpdateKycProceed = false;
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            () => {
              if(this.leadInfo.status.name === 'KYC Updated'){
                this.snackbarService.openSnackBar('Updated successfully');
              }
              else{
                this.snackbarService.openSnackBar('KYC updated successfully');
              }
              this.api_loading_UpdateKyc = false;
              this.api_loading_UpdateKycProceed = false;
              if (this.leadInfo.status.name === 'New') {
                this.proceedToCrif(applicantsList);
              } else {
                this.proceedAfterKycUpdation();
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
          this.api_loading_UpdateKycProceed = false;
          if (this.leadInfo.status.name === 'New') {
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
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }, projectConstants.TIMEOUT_DELAY);
        })

      // this.crmService.addkyc(applicantsList).subscribe((response) => {
      //   this.api_loading_UpdateKycProceed = true;
      //   console.log('afterupdateKYCDAta', response);
      //   this.uploadAudioVideo(response).then();
      //   this.crmService.getproceedStatus(applicantsList).subscribe((response) => {
      //     console.log('afterupdateFollowUpData', response);
      //     this.api_loading_UpdateKycProceed = false;
      //     this.router.navigate(['provider', 'crm']);
      //   },
      //     (error) => {
      //       this.api_loading_UpdateKycProceed = false;
      //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      //     })
      // },
      //   (error) => {
      //     this.api_loading_UpdateKycProceed = false;
      //     this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      //   })
    }
  }

  proceedToCrif(applicantsList) {
    this.crmService.getproceedStatus(applicantsList).subscribe((response) => {
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
        console.log("Current Questionaire:", this.questionaire);
        this.showQuestionnaire = true;
      }
    )
  }
  getQuestionAnswers(event) {
    console.log('event', event)
    this.questionAnswers = event;
    console.log('filestoUpload',event.answers.answerLine)
    console.log(' this.questionAnswers ', this.questionAnswers );
    console.log(this.leadInfo.status.name);
      // if(event && event.answers && event.answers.answerLine){
      //   event.answers.answerLine.forEach((item)=>{
      //     if(item && item.answer && item.answer.fileUpload){
      //       item.answer.fileUpload.forEach((res:any,index)=>{
      //         this.updateKyc()
      //       })
      //     }
      //   })
      // }
  }
  autoGrowTextZone(e) {
    if(e){
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight + 15) + "px";
    }
    
  }
  saveNotes() {
    if (this.notes !== undefined) {
      this.api_loadingNotes = true;
      const createNoteData: any = {
        "note": this.notes
      }
      this.crmService.addLeadNotes(this.leadInfo.uid, createNoteData).subscribe((response: any) => {
        console.log('response', response)
        this.notes = '';
        setTimeout(() => {
          this.initLead();
          this.api_loadingNotes = false;
        }, projectConstants.TIMEOUT_DELAY);
        this.snackbarService.openSnackBar('Remarks added successfully');
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
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

  redirect() {
    this.crmService.proceedToRedirect(this.leadInfo.uid).subscribe(
      () => {
        this.router.navigate(['provider', 'crm']);
      }
      , (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })
  }
}
