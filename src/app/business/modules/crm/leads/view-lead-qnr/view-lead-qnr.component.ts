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
  headerName = 'Add/Update Details';

  constructor(
    private activatedRoute: ActivatedRoute,
    private crmService: CrmService,
    private location: Location,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private providerServices: ProviderServices,
    private wordProcessor: WordProcessor,
    private dialog: MatDialog,
    private router: Router
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
        if (leadInfo.status.name === 'New' || leadInfo.status.name === 'KYC Updated') {
          if (leadInfo.kycCreated) {
            _this.crmService.getkyc(leadInfo.uid).subscribe(
              (kycInfo) => {
                console.log("KYC Info:", kycInfo);
                _this.initApplicantForm(kycInfo);
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
        } else if (leadInfo.status.name === 'Login'){
          _this.headerName = "Login Verification";
          _this.crmService.getkyc(leadInfo.uid).subscribe(
            (kycInfo) => {
              console.log("KYC Info:", kycInfo);
              _this.initApplicantForm(kycInfo);
            }
            
          )
        } else {
          if (leadInfo.status.name === 'Login Verified') {
            this.headerName = 'Credit Recommendation';
          } else if (leadInfo.status.name === 'Credit Recommendation') {
            this.headerName = 'Loan Sanction';
          }
          _this.getQuestionaire();
        }
      }
    );
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

  removeApplicant(applicantId, applicationIndex) {
    console.log(applicationIndex);
    console.log(applicantId);
    console.log("Before:", this.applicantsInfo);
    // this.applicantsInfo.splice(applicantId,1);
    delete this.applicantsInfo[applicantId];
    const index = this.applicants.indexOf(applicantId);
    this.applicants.splice(index, 1);
    console.log("After:", this.applicantsInfo);
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
    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        const file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === s3UrlObj.orderId) ? fileObj : '');
        })[0];
        console.log("File:", file);
        if (file) {
          await _this.uploadFiles(file['file'], s3UrlObj.url).then(
            () => {
              count++;
            }
          );
        }
        if (count === s3UrlObj.length) {
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
          console.log(error);
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }
  updateKyc() {
    if (this.leadInfo.status.name === 'Credit Score Generated' || this.leadInfo.status.name === 'Sales Verified' 
    || this.leadInfo.status.name === 'Login Verified' || this.leadInfo.status.name === 'Credit Recommendation') {
      this.submitQuestionnaire(this.leadInfo.uid, 'save');
    } else if (this.leadInfo.status.name === 'New' || this.leadInfo.status.name === 'KYC Updated') {
      console.log("Applicants Update", this.applicantsInfo);
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key) => {
        applicantsList.push(this.applicantsInfo[key]);
      })
      this.crmService.addkyc(applicantsList).subscribe((s3urls: any) => {
        console.log('afterupdateKYCDAta', s3urls);
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            () => {
              this.snackbarService.openSnackBar('KYC updated successfully');
              this.initLead();
            }
          );
        } else {
          this.snackbarService.openSnackBar('KYC updated successfully');
          this.initLead();
        }
      },
        (error) => {
          setTimeout(() => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }, projectConstants.TIMEOUT_DELAY);
        })
    }
  }

  checkFileExists(type, applicantInfo) {
    applicantInfo.validationIds
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
      if (this.applicantsInfo[applicantIndex].panAttachments && this.applicantsInfo[applicantIndex].panAttachments.length > 0) {
      } else {
        let fileData = this.getFileInfo('pan', filesObj);
        if (fileData && fileData.length > 0 && !fileData[0]['order']) {
          fileData[0]['order'] = this.filesCount++;
          this.filesToUpload.push(fileData[0]);
          this.applicantsInfo[applicantIndex].panAttachments = fileData;
        }
      }
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
    console.log(this.applicantsInfo);
  }

  /**
   * Back to previous page
   */
  goBack() {
    this.location.back();
  }

  /**
   * 
   * @param i 
   * @returns 
   */
  counter(i: number) {
    return new Array(i);
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
    this.providerServices.updateQNRProceedStatus(uuid)
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
    console.log("uplod:",_this.questionAnswers.filestoUpload);
    return new Promise(async function (resolve, reject) {
      if (s3UrlObj.urls && s3UrlObj.urls.length > 0) {
        for (const s3Obj of s3UrlObj.urls) {
          postData['urls'].push({ uid: s3Obj.uid, labelName: s3Obj.labelName });
          
          const file = _this.questionAnswers.filestoUpload[s3Obj.labelName][s3Obj.document];
          await _this.uploadFiles(file, s3Obj.url).then(
            () => {
              count++;
              console.log(count);
            }
          );
        }
        if (count == s3UrlObj.urls.length) {
          resolve(postData);
        }
      }
    });
  }

  uploadFileStatus(uuid, data) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      console.log("Data:",data);
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
      this.snackbarService.openSnackBar('saved successfully');
      this.initLead();
    } else {
      this.updateQNRProceedStatus(uuid);
    }
  }
  submitQuestionnaire(uuid, type?) {
    const _this = this;
    const dataToSend: FormData = new FormData();
    const blobpost_Data = new Blob([JSON.stringify(_this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    if (this.leadInfo.status.name==='Login Verified' || this.leadInfo.status.name === 'Credit Recommendation'){
      _this.providerServices.submitLeadLoginVerifyQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        this.uploadFileStatus(uuid, data).then(
          () => {
            _this.complete(uuid, type);
          }
        );
      });
    } else if (this.questionaire.questionAnswers && this.questionaire.questionAnswers[0].answerLine) {
      _this.providerServices.resubmitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        this.uploadFileStatus(uuid, data).then(
          () => {
            _this.complete(uuid, type);
          }
        );
      });
    }
    else {
      _this.providerServices.submitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        this.uploadFileStatus(uuid, data).then(
          () => {
            _this.complete(uuid, type);
          }
        );
      });
    }
  }

  ProceedStatus() {
    if (this.leadInfo.status.name === 'KYC Updated') {
      this.crmService.ProceedStatusToSales(this.leadInfo.uid).subscribe(
        () => {
          this.router.navigate(['provider', 'crm']);
        }
        , (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
    } else if (this.leadInfo.status.name === 'Credit Score Generated' || this.leadInfo.status.name === 'Sales Verified'
     || this.leadInfo.status.name === 'Login Verified'  || this.leadInfo.status.name === 'Credit Recommendation') {
      this.submitQuestionnaire(this.leadInfo.uid);
    } else if (this.leadInfo.status.name === 'Login' ) {
      this.crmService.proceedToLoginVerified(this.leadInfo.uid).subscribe((response) => {
        this.router.navigate(['provider', 'crm']);
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    } else {
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key) => {
        applicantsList.push(this.applicantsInfo[key]);
      })
      this.crmService.addkyc(applicantsList).subscribe((response) => {
        console.log('afterupdateKYCDAta', response);
        this.uploadAudioVideo(response).then();
        this.crmService.getproceedStatus(applicantsList).subscribe((response) => {
          console.log('afterupdateFollowUpData', response);
          this.router.navigate(['provider', 'crm']);
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          })
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
    }
  }
  getQuestionaire() {
    this.questionaire ={};
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
  }
  showCrifscoreSection() {
    this.showCrifSection = !this.showCrifSection
  }
  saveCrifApplicant() {
    const post_data = {
      "customer": {
        "id": this.leadInfo.customer.id,
        "name": this.leadInfo.customer.name,
      },
      'originUid': this.leadInfo.uid,
    };
    this.crmService.crifVerification(post_data).subscribe(
      (data) => {
        this.crifDetails = data;
        this.crifHTML = this.crifDetails.crifHTML;
        this.crifScore = this.crifDetails.crifScoreString
        this.showPdfIcon = true;
      },
      error => {
      });
  }
  autoGrowTextZone(e) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15) + "px";
  }
  saveNotes() {
    if (this.notes !== undefined) {
      const createNoteData: any = {
        "note": this.notes
      }
      this.crmService.addLeadNotes(this.leadInfo.uid, createNoteData).subscribe((response: any) => {
        console.log('response', response)
        this.notes = '';
        setTimeout(() => {
          this.initLead();
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
      this.ngOnInit();
      console.log("response", response);
    });
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
