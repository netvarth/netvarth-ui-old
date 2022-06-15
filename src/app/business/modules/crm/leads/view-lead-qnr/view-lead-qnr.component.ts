import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectConstants } from "../../../../../app.component";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { GroupStorageService } from "../../../../../shared/services/group-storage.service";
import { CrmService } from "../../crm.service";
import { ProviderServices } from "../../../../../business/services/provider-services.service";
import { WordProcessor } from "../../../../../shared/services/word-processor.service";
import { PreviewpdfComponent } from "./previewpdf/previewpdf.component";
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
  afterQuestionaire: any;
  unreleased_arr: any;
  unreleased_question_arr: any;
  released_arr: any;
  api_loading_video: boolean;
  api_loading: boolean;
  headerName;

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

    this.fetchLeadInfo(this.leadUID).then(
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
              // id: _this.leadInfo.customer.id,
              name: _this.leadInfo.customer.name,
              phone: _this.leadInfo.customer.phoneNo
            }
            _this.applicants = [0];
            _this.applicantsInfo[0] = applicant;
            // console.log("Applicants:", _this.applicants);
            // console.log("Applicants:", _this.applicantsInfo[0]);
          }
        } else if (leadInfo.status.name === 'Credit Score Generated') {
          _this.getQuestionaire();
        } else if (leadInfo.status.name === 'Sales Verified') {
          console.log("Here");
          _this.getAfterQuestionaire();
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
      // if (!applicant.permanentPhone) {
      //   applicant['permanentPhone'] = this.leadInfo.customer.phoneNo;
      // }
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
      },
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
  async uploadAudioVideo(data) {
    // console.log("File List:", this.filesToUpload);
    for (const s3UrlObj of data) {
      console.log(this.filesToUpload);
      console.log(s3UrlObj);
      // this.api_loading_video = true;
      const file = this.filesToUpload.filter((fileObj) => {
        return ((fileObj.order === s3UrlObj.orderId) ? fileObj : '');
      })[0];
      console.log("File:", file);
      if (file) {
        await this.uploadFiles(file['file'], s3UrlObj.url).then();
      }
    }
  }
  uploadFiles(file, url) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.providerServices.videoaudioS3Upload(file, url)
        .subscribe(() => {
          resolve(true);
        }, error => {
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          // _this.api_loading = false;
          // _this.api_loading_video = false;
          resolve(false);
        });
    })
  }
  updateKyc() {
    if (this.leadInfo.status.name === 'Credit Score Generated') {
      this.submitQnr('save');
    } else if (this.leadInfo.status.name === 'Sales Verified') {
      console.log("AFter QRN");
      this.submitAfterQnr('save');
    } else if (this.leadInfo.status.name === 'New' || this.leadInfo.status.name === 'KYC Updated') {
      console.log("Applicants Update", this.applicantsInfo);
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key) => {
        applicantsList.push(this.applicantsInfo[key]);
      })
      this.crmService.addkyc(applicantsList).subscribe((response) => {
        console.log('afterupdateKYCDAta', response);
        this.uploadAudioVideo(response);
        this.snackbarService.openSnackBar('KYC updated successfully');
        this.initLead();
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
    // console.log("Applicant11:", applicantIndex);
    console.log(applicant);
    let filesObj = applicant.files;
    // console.log(filesObj);
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
    // console.log(this.applicants);
    // console.log("OVerr");
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
  submitQnr(type?) {
    console.log(this.questionaire);
    if (this.questionaire.labels && this.questionaire.labels.length > 0) {
      this.submitQuestionnaire(this.leadInfo.uid, type);
    }
  }
  submitAfterQnr(type?) {
    console.log(this.unreleased_question_arr);
    if (this.unreleased_question_arr[0].labels && this.unreleased_question_arr[0].labels.length > 0) {
      console.log("submit after qnr");
      this.submitAfterQuestionnaire(this.leadInfo.uid, type);
    }
  }

  updateLoginStatus(uuid, postData) {
    this.providerServices.providerLeadQnrafterUploadStatusUpdate(uuid, postData)
      .subscribe((data) => {
        this.router.navigate(['provider', 'crm']);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.api_loading_video = false;
        });
  }

  updateSalesStatus(uuid, postData) {
    this.providerServices.providerLeadQnrUploadStatusUpdate(uuid, postData)
      .subscribe((data) => {
        this.router.navigate(['provider', 'crm']);

        // this.initLead();
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.api_loading_video = false;
        });
  }

  submitAfterQuestionnaire(uuid, type) {
    console.log("Gererere");
    const dataToSend: FormData = new FormData();
    const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    this.providerServices.submitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
      let postData = {
        urls: []
      };
      if (data.urls && data.urls.length > 0) {
        for (const url of data.urls) {
          this.api_loading_video = true;
          const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
          this.providerServices.videoaudioS3Upload(file, url.url)
            .subscribe(() => {
              postData['urls'].push({ uid: url.uid, labelName: url.labelName });
              if (data.urls.length === postData['urls'].length) {
                if (!type) {
                  this.updateLoginStatus(uuid, postData);
                }
              }
            },

              error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.api_loading_video = false;
              });
        }

      } else {
        if (!type) {
          this.updateLoginStatus(uuid, postData);
        }
      }
    }, error => {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      this.api_loading = false;
      this.api_loading_video = false;
    });
  }

  submitQuestionnaire(uuid, type?) {
    const dataToSend: FormData = new FormData();
    const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    this.providerServices.submitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
      let postData = {
        urls: []
      };
      if (data.urls && data.urls.length > 0) {
        for (const url of data.urls) {
          this.api_loading_video = true;
          const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
          this.providerServices.videoaudioS3Upload(file, url.url)
            .subscribe(() => {
              postData['urls'].push({ uid: url.uid, labelName: url.labelName });
              if (data.urls.length === postData['urls'].length) {
                if (!type) {
                  this.updateSalesStatus(uuid, postData);
                }
              }
            },
              error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.api_loading_video = false;
              });
        }

      } else {
        if (!type) {
          this.updateSalesStatus(uuid, postData);
        }
      }
    }, error => {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      this.api_loading = false;
      this.api_loading_video = false;
    });
  }


  ProceedStatus() {
    if (this.leadInfo.status.name === 'KYC Updated') {
      this.crmService.ProceedStatusToSales(this.leadInfo.uid).subscribe(
        () => {
          // this.initLead();
          this.router.navigate(['provider', 'crm']);
        }
        , (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
    } else if (this.leadInfo.status.name === 'Credit Score Generated') {
      this.submitQnr();
    } else if (this.leadInfo.status.name === 'Sales Verified') {
      this.submitAfterQnr();
    } else {
      let applicantsList = [];
      Object.keys(this.applicantsInfo).forEach((key) => {
        applicantsList.push(this.applicantsInfo[key]);
      })
      this.crmService.addkyc(applicantsList).subscribe((response) => {
        console.log('afterupdateKYCDAta', response);
        this.uploadAudioVideo(response);
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
  getAfterQuestionaire() {
    this.released_arr = this.leadInfo.releasedQnr.filter(releasedQn => releasedQn.status === 'released');
    console.log(this.released_arr);

    if (this.released_arr.length === 0) {
      let unreleased_arr = this.leadInfo.releasedQnr.filter(releasedQn => releasedQn.status === 'unReleased');
      this.crmService.releaseLeadQnr('released', this.leadInfo.uid, unreleased_arr[0].id).subscribe(
        () => {
          this.initLead();
        }
      )
    } else {
      this.crmService.getLeadafterQnrDetails(this.leadInfo.uid).subscribe(data => {
        this.afterQuestionaire = data;
        console.log(this.afterQuestionaire);
        this.unreleased_question_arr = this.afterQuestionaire.filter(releasedquestion => releasedquestion.id === this.released_arr[0].id);
        if (this.unreleased_question_arr && this.unreleased_question_arr[0].labels && this.unreleased_question_arr[0].labels.length > 0) {
          this.showQuestionnaire = true;
        }
      })
    }

  }
  getQuestionaire() {
    this.crmService.getLeadQnrDetails(this.leadInfo.category.id).subscribe(data => {
      this.questionaire = data;
      if (this.questionaire && this.questionaire.labels && this.questionaire.labels.length > 0) {
        this.showQuestionnaire = true;
      }
    })
  }
  getQuestionAnswers(event) {
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
      },
      error => {
      });
    this.showPdfIcon = true;
  }
  preview(crif_data) {
    // console.log("Files : ", this.customers)
    this.crifDialog = this.dialog.open(PreviewpdfComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'uploadfilecomponentclass'],
      disableClose: true,
      data: {
        crif: crif_data,
        type: 'pdf_view'
      }
    });
    this.crifDialog.afterClosed().subscribe(result => {
      if (result) {
      }
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
        // this.api_loading = true;
        this.notes = '';
        setTimeout(() => {
          this.initLead();
          // this.api_loading = false;
        }, projectConstants.TIMEOUT_DELAY);
        this.snackbarService.openSnackBar('Remarks added successfully');
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
      // }

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
}