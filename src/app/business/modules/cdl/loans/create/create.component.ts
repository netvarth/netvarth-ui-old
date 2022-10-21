import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../otp-verify/otp-verify.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
// import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { FileService } from '../../../../../shared/services/file-service';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SelectSchemeComponent } from '../select-scheme/select-scheme.component';
import { CdlService } from '../../../../../business/modules/cdl/cdl.service';
// import { SharedServices } from '../../../../../../../shared/services/shared-services';
// import { SubSink } from 'subsink';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  customerDetailsPanel = true;
  kycDetailsPanel = false;
  loanDetailsPanel = false;
  otherDetailsPanel = false;
  bankDetailsPanel = false;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  loanApplicationKycId: any;
  selectedFiles = {
    "aadhar": { files: [], base64: [], caption: [] },
    "pan": { files: [], base64: [], caption: [] },
    "photo": { files: [], base64: [], caption: [] },
    "bank": { files: [], base64: [], caption: [] }
  }
  lebalUplaodFile: string = 'Click & Upload your files here';
  actionText: any;
  schemeSelected: any;
  aadharverification = false;
  verification = false;
  panverification = false;
  emailverification = false;
  accountverification = false;
  address1: any = '';
  address2: any = '';
  city: any = '';
  phoneNumber: any;
  state: any = '';
  pincode: any = '';
  bankDetails: any;
  nameData: any;
  verifyingUID = false;
  addresscheck: any = true;
  showaddressfields: any = false;
  phone: any = '';
  name: any = '';
  email: any = '';
  aadhar: any = '';
  pan: any = '';
  salary: any = '';
  office: any = '';
  emi: any = '';
  remarks: any = '';
  createLoan: FormGroup;
  loanApplication: any;
  loanCategories: any;
  loanProducts: any;
  loanTypes: any;
  user: any;
  customerInfo: any;
  customerDetails: any;
  customerId: any = 0;
  customerName: any;
  otpSuccess: any;
  otpError: any;
  otpEntered: any;
  businessDetails: any;
  loanData: any;
  action: any;
  loanId: any;
  loanAmount: any;
  headerText: any = "Create Loan";
  btnText: any = "Save as Lead";
  // private subs = new SubSink();
  config = {
    allowNumbersOnly: true,
    length: 4,
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  phoneError: any;
  dialCode: any;
  businessId: any;
  firstName: any;
  lastName: any;
  loanStatuses: any;
  loanSchemes: any;
  from: any;
  bankData: any;
  relations = projectConstantsLocal.RELATIONSHIPS;
  employmentTypes = projectConstantsLocal.EMPLOYMENT_TYPES;
  filesToUpload: any = [];
  dealers: any;
  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private activated_route: ActivatedRoute,
    private createLoanFormBuilder: FormBuilder,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private cdlservice: CdlService,
    private fileService: FileService
  ) {

    this.activated_route.queryParams.subscribe((params) => {
      if (params && params.from) {
        this.from = params.from;
      }
      if (params && params.id) {
        this.cdlservice.getLoanById(params.id).subscribe((data) => {
          this.loanData = data;
          this.action = params.action;
          this.loanId = params.id;
          console.log("this.LaonData", this.loanData)
          if (params.action == 'update' && this.loanData) {
            this.headerText = "Update Loan";
            this.btnText = "Update Loan";
            this.createLoan.controls.phone.setValue(this.loanData.customer.phoneNo);
            this.createLoan.controls.firstname.setValue(this.loanData.customer.firstName);
            this.createLoan.controls.lastname.setValue(this.loanData.customer.lastName);
            this.createLoan.controls.email.setValue(this.loanData.customer.email);
            this.createLoan.controls.aadharnumber.setValue(this.loanData.loanApplicationKycList[0].aadhaar);
            this.createLoan.controls.pannumber.setValue(this.loanData.loanApplicationKycList[0].pan);
            if (this.loanData && this.loanData.type && this.loanData.type.id) {
              this.createLoan.controls.loantype.setValue(this.loanData.type.id);
            }
            this.createLoan.controls.permanentaddress1.setValue(this.loanData.loanApplicationKycList[0].permanentAddress1);
            this.createLoan.controls.permanentaddress2.setValue(this.loanData.loanApplicationKycList[0].permanentAddress2);
            this.createLoan.controls.permanentcity.setValue(this.loanData.loanApplicationKycList[0].permanentCity);
            this.createLoan.controls.permanentstate.setValue(this.loanData.loanApplicationKycList[0].permanentState);
            this.createLoan.controls.permanentpincode.setValue(this.loanData.loanApplicationKycList[0].permanentPin);

            this.createLoan.controls.currentaddress1.setValue(this.loanData.loanApplicationKycList[0].currentAddress1);
            this.createLoan.controls.currentaddress2.setValue(this.loanData.loanApplicationKycList[0].currentAddress2);
            this.createLoan.controls.currentcity.setValue(this.loanData.loanApplicationKycList[0].currentCity);
            this.createLoan.controls.currentstate.setValue(this.loanData.loanApplicationKycList[0].currentState);
            this.createLoan.controls.currentpincode.setValue(this.loanData.loanApplicationKycList[0].currentPin);
            this.createLoan.controls.martialstatus.setValue(this.loanData.loanApplicationKycList[0].maritalStatus);
            this.createLoan.controls.employmenttype.setValue(this.loanData.loanApplicationKycList[0].employmentStatus);
            this.createLoan.controls.salary.setValue(this.loanData.loanApplicationKycList[0].monthlyIncome);
            if (this.loanData && this.loanData.category && this.loanData.category.id) {
              this.createLoan.controls.category.setValue(this.loanData.category.id);
            }
            if (this.loanData && this.loanData.loanProduct && this.loanData.loanProduct.id) {
              this.createLoan.controls.loanproduct.setValue(this.loanData.loanProduct.id);
            }
            if (this.loanData && this.loanData.invoiceAmount) {
              this.createLoan.controls.totalpayment.setValue(this.loanData.invoiceAmount);
            }
            if (this.loanData && this.loanData.downpaymentAmount) {
              this.createLoan.controls.downpayment.setValue(this.loanData.downpaymentAmount);
            }
            if (this.loanData && this.loanData.requestedAmount) {
              this.createLoan.controls.loanamount.setValue(this.loanData.requestedAmount);
            }
            if (this.loanData && this.loanData.remarks) {
              this.createLoan.controls.remarks.setValue(this.loanData.remarks);
            }
            if (this.loanData && this.loanData.emiPaidAmountMonthly) {
              this.createLoan.controls.emicount.setValue(this.loanData.emiPaidAmountMonthly);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].id) {
              this.loanApplicationKycId = this.loanData.loanApplicationKycList[0].id;
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].nomineeName) {
              this.createLoan.controls.nomineename.setValue(this.loanData.loanApplicationKycList[0].nomineeName);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].nomineeType) {
              this.createLoan.controls.nomineetype.setValue(this.loanData.loanApplicationKycList[0].nomineeType);
            }
            if (this.loanData && this.loanData.loanScheme && this.loanData.loanScheme.schemeName) {
              this.createLoan.controls.scheme.setValue(this.loanData.loanScheme.schemeName);
              this.schemeSelected = this.loanData.loanScheme;
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].isPanVerified) {
              this.panverification = true;
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].isAadhaarVerified) {
              this.aadharverification = true;
            }

            if (this.loanData && this.loanData.partner && this.loanData.partner.id) {
              this.createLoan.controls.dealer.setValue(this.loanData.partner.id);
            }

            this.verification = true;
            this.emailverification = true;

            this.selectedFiles['photo'].files = this.loanData.consumerPhoto;
            this.selectedFiles['aadhar'].files = this.loanData.loanApplicationKycList[0].aadhaarAttachments;
            this.selectedFiles['pan'].files = this.loanData.loanApplicationKycList[0].panAttachments;


          }
        })
        console.log(params.id);
        this.cdlservice.getBankDetailsById(params.id).subscribe((data) => {
          this.bankData = data;
          console.log("this.bankData", this.bankData)
          if (this.bankData) {
            this.createLoan.controls.bank.setValue(this.bankData.bankName);
            this.createLoan.controls.account.setValue(this.bankData.bankAccountNo);
            this.createLoan.controls.ifsc.setValue(this.bankData.bankIfsc);
            this.accountverification = this.bankData.bankAccountVerified;
            this.selectedFiles['bank'].files = this.bankData.bankStatementAttachments;
          }
        });

      }
    });

    this.createLoan = this.createLoanFormBuilder.group({
      phone: [null],
      firstname: [null],
      lastname: [null],
      email: [null],
      loantype: [null],
      customerphoto: [null],
      aadharnumber: [null],
      aadharattachment: [null],
      permanentaddress1: [null],
      permanentaddress2: [null],
      permanentcity: [null],
      permanentstate: [null],
      permanentpincode: [null],
      pannumber: [null],
      panattachment: [null],
      martialstatus: [null],
      employmenttype: [null],
      category: [null],
      salary: [null],
      emicount: [null],
      device: [null],
      totalpayment: [null],
      downpayment: [null],
      currentaddress1: [null],
      currentaddress2: [null],
      currentcity: [null],
      currentstate: [null],
      currentpincode: [null],
      loanamount: [null],
      remarks: [null],
      loanproduct: [null],
      nomineetype: [null],
      nomineename: [null],
      bank: [null],
      ifsc: [null],
      account: [null],
      bankstatements: [null],
      scheme: [null],
      dealer: [null]
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("user", this.user);
    this.getLoanCategories();
    this.getLoanTypes();
    this.getLoanProducts();
    this.getLoanStatuses();
    this.getLoanSchemes();
    this.getPartners();
    this.cdlservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })
    console.log("I am Here", this.from)

    if (this.from && this.from == 'create') {
      console.log("I am Here")
      this.customerDetailsPanel = false;
      this.kycDetailsPanel = true;
    }
  }


  getLoanCategories() {
    this.cdlservice.getLoanCategoryList().subscribe((data) => {
      this.loanCategories = data;
    })
  }

  getLoanSchemes() {
    this.cdlservice.getLoanSchemes().subscribe((data) => {
      this.loanSchemes = data;
      console.log("this.loanSchemes", this.loanSchemes)
    })
  }


  getBusinessProfile() {
    this.cdlservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      console.log("this.businessDetails", this.businessDetails)
    })
  }


  getLoanTypes() {
    this.cdlservice.getLoanTypeList().subscribe((data) => {
      this.loanTypes = data;
      console.log("this.loanTypes", this.loanTypes)
    })
  }

  getLoanStatuses() {
    this.cdlservice.getLoanStatuses().subscribe((data) => {
      this.loanStatuses = data;
      console.log("this.loanStatuses", this.loanStatuses)
    })
  }


  getLoanProducts() {
    this.cdlservice.getLoanProducts().subscribe((data) => {
      this.loanProducts = data;
      console.log("this.loanProducts", this.loanProducts)
    })
  }


  getPartners() {
    this.cdlservice.getDealers().subscribe((data) => {
      this.dealers = data;
      console.log("this.dealers", this.dealers)
    })
  }

  getCustomerDetails(filter) {
    this.cdlservice.getCustomerDetails(filter).subscribe((data) => {
      this.customerDetails = data;
      if (this.customerDetails && this.customerDetails.length != 0) {
        console.log("this.customerDetails", this.customerDetails)
        if (this.customerDetails[0].firstName) {
          this.createLoan.controls.firstname.setValue(this.customerDetails[0].firstName);
        }
        if (this.customerDetails[0].lastName) {
          this.createLoan.controls.lastname.setValue(this.customerDetails[0].lastName);
        }
        if (this.customerDetails[0] && this.customerDetails[0].email) {
          this.createLoan.controls.email.setValue(this.customerDetails[0].email)
        }
        if (this.customerDetails[0] && this.customerDetails[0].address) {
          this.createLoan.controls.permanentaddress1.setValue(this.customerDetails[0].address)
        }
        if (this.customerDetails[0] && this.customerDetails[0].id) {
          this.customerId = this.customerDetails[0].id;
        }
      }
      else {
        this.createLoan.controls.name.setValue("")
        this.createLoan.controls.email.setValue("")
      }
    })
  }

  expandAll() {
    this.customerDetailsPanel = true;
    this.kycDetailsPanel = true;
    this.loanDetailsPanel = true;
    this.otherDetailsPanel = true;
    this.bankDetailsPanel = true;
  }

  closeAll() {
    this.customerDetailsPanel = false;
    this.kycDetailsPanel = false;
    this.loanDetailsPanel = false;
    this.otherDetailsPanel = false;
    this.bankDetailsPanel = false;

  }

  resetErrors() {

  }

  getFileInfo(type, list) {
    console.log('list', list)
    let fileInfo = list.filter((fileObj) => {
      console.log('fileObj', fileObj);
      return fileObj.type === type ? fileObj : '';
    });
    console.log('fileInfo', fileInfo)
    // list=''
    return fileInfo;
  }

  deleteTempImage(i, type, deleteText) {
    let files = this.filesToUpload.filter((fileObj) => {
      // console.log('fileObj',fileObj)
      if (fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name) {
        if (fileObj.type) {
          return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type === type);
        }
      }
    });
    // console.log("files",files,i)
    if (files && files.length > 0) {
      console.log(this.filesToUpload.indexOf(files[0]));
      if (this.filesToUpload && this.filesToUpload.indexOf(files[0])) {
        const index = this.filesToUpload.indexOf(files[0]);
        this.filesToUpload.splice(index, 1);
      }
    }
    this.selectedFiles[type].files.splice(i, 1);
    this.selectedFiles[type].base64.splice(i, 1);
    this.selectedFiles[type].caption.splice(i, 1);
    if (type === 'aadhar') {
      this.loanData.loanApplicationKycList[0].aadharAttachments.splice(i, 1);
      this.actionText = 'Delete';

    } else if (type === 'pan') {
      this.loanData.loanApplicationKycList[0].panAttachments.splice(i, 1);
      this.actionText = 'Delete';
    }
    else if (type === 'photo') {
      this.loanData.consumerPhoto.splice(i, 1);
      this.actionText = 'Delete';
    }
    else if (type === 'other') {
      this.loanData.otherAttachments.splice(i, 1);
      this.actionText = 'Delete';
    }
    else if (type === 'bank') {
      this.loanData.bankAttachments.splice(i, 1);
      this.actionText = 'Delete';
    }
  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }

  // saveAsLead() {


  //   // if (this.addresscheck) {
  //   //   this.createLoan.controls.currentaddress1.setValue(this.createLoan.controls.permanentAddress1.value);
  //   //   this.createLoan.controls.currentaddress2.setValue(this.createLoan.controls.permanentAddress2.value);
  //   //   this.createLoan.controls.currentcity.setValue(this.createLoan.controls.permanentCity.value);
  //   //   this.createLoan.controls.currentstate.setValue(this.createLoan.controls.permanentState.value);
  //   //   this.createLoan.controls.currentpincode.setValue(this.createLoan.controls.permanentPin.value);
  //   // }
  //   // if (this.createLoan.controls.name.value) {
  //   //   let nameVal = this.createLoan.controls.name.value;
  //   //   const name = nameVal.split(" ");
  //   //   this.firstName = name[0];
  //   //   if (name[1]) {
  //   //     this.lastName = name[1];
  //   //   }
  //   //   else {
  //   //     this.lastName = "";
  //   //   }
  //   // }
  //   this.loanApplication = {
  //     "customer": {
  //       "firstName": this.createLoan.controls.firstname.value,
  //       "lastName": this.createLoan.controls.lastname.value,
  //       "phoneNo": this.createLoan.controls.phone.value,
  //       "email": this.createLoan.controls.email.value,
  //       "countryCode": "+91"
  //     },
  //     "type": { "id": this.createLoan.controls.loantype.value },
  //     "loanProduct": { "id": this.createLoan.controls.loanproduct.value },
  //     "assignee": { "id": this.user.id },
  //     "category": { "id": this.createLoan.controls.category.value },
  //     "location": { "id": this.user.bussLocs[0] },
  //     "locationArea": this.createLoan.controls.permanentcity.value,
  //     "invoiceAmount": this.createLoan.controls.totalpayment.value,
  //     "downpaymentAmount": this.createLoan.controls.downpayment.value,
  //     "requestedAmount": this.createLoan.controls.loanamount.value,
  //     "remarks": this.createLoan.controls.remarks.value,
  //     "emiPaidAmountMonthly": this.createLoan.controls.emicount.value,
  //     "loanApplicationKycList": [
  //       {
  //         "isCoApplicant": false,
  //         "maritalStatus": this.createLoan.controls.martialstatus.value,
  //         "employmentStatus": this.createLoan.controls.employmenttype.value,
  //         "monthlyIncome": this.createLoan.controls.salary.value,
  //         "aadhaar": this.createLoan.controls.aadharnumber.value,
  //         "pan": this.createLoan.controls.pannumber.value,
  //         "isAadhaarVerified": true,
  //         "isPanVerified": true,
  //         "nomineeType": this.createLoan.controls.nomineetype.value,
  //         "nomineeName": this.createLoan.controls.nomineename.value,
  //         "permanentAddress1": this.createLoan.controls.permanentaddress1.value,
  //         "permanentAddress2": this.createLoan.controls.permanentaddress2.value,
  //         "permanentPin": this.createLoan.controls.permanentpincode.value,
  //         "permanentCity": this.createLoan.controls.permanentcity.value,
  //         "permanentState": this.createLoan.controls.permanentstate.value,
  //         "currentAddress1": this.createLoan.controls.currentaddress1.value,
  //         "currentAddress2": this.createLoan.controls.currentaddress2.value,
  //         "currentPin": this.createLoan.controls.currentpincode.value,
  //         "currentCity": this.createLoan.controls.currentpincode.value,
  //         "currentState": this.createLoan.controls.currentstate.value,
  //       }
  //     ]
  //   }


  //   if (this.loanApplication) {
  //     if (this.action == "update") {

  //       if (this.loanData && this.loanData.status && this.loanData.status.id) {
  //         this.loanApplication['status'] = {
  //           "id": this.loanData.status.id
  //         };
  //       }
  //       if (this.loanData && this.loanData.customer && this.loanData.customer[0].id) {
  //         this.loanApplication.customer = {
  //           "id": this.loanData.customer[0].id
  //         };
  //       }
  //       if (this.loanData && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].id) {
  //         this.loanApplication.loanApplicationKycList[0]['id'] = this.loanData.loanApplicationKycList[0].id;
  //       }
  //       this.cdlservice.updateLoan(this.loanId, this.loanApplication).subscribe((s3urls: any) => {
  //         this.snackbarService.openSnackBar("Loan Application Updated Successfully")
  //         this.router.navigate(['provider', 'cdl', 'loans'])
  //       },
  //         (error) => {
  //           this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
  //         })
  //       console.log("response");
  //     }
  //     else {
  //       console.log(this.filesToUpload);

  //       for (let i = 0; i < this.filesToUpload.length; i++) {
  //         this.filesToUpload[i]['order'] = i;
  //         if (this.filesToUpload[i]["type"] == 'aadhar') {
  //           this.loanApplication.loanApplicationKycList[0]['aadhaarAttachments'] = [];
  //           this.loanApplication.loanApplicationKycList[0]['aadhaarAttachments'].push(this.filesToUpload[i]);
  //         }
  //         if (this.filesToUpload[i]["type"] == 'pan') {
  //           this.loanApplication.loanApplicationKycList[0]['panAttachments'] = [];
  //           this.loanApplication.loanApplicationKycList[0]['panAttachments'].push(this.filesToUpload[i]);
  //         }
  //         if (this.filesToUpload[i]["type"] == 'photo') {
  //           this.loanApplication['consumerPhoto'] = [];
  //           this.loanApplication['consumerPhoto'].push(this.filesToUpload[i]);
  //         }
  //       }

  //       console.log("Loan Application Data : ", this.loanApplication)


  //       this.cdlservice.createLoan(this.loanApplication).subscribe((s3urls: any) => {
  //         console.log("response", s3urls);


  //         if (s3urls.attachmentsUrls.length > 0) {
  //           this.uploadAudioVideo(s3urls['attachmentsUrls']).then(
  //             (dataS3Url) => {
  //               console.log(dataS3Url);
  //             });
  //         }
  //         this.bankDetails = {
  //           "originUid": s3urls.uid,
  //           "loanApplicationUid": s3urls.uid,
  //           "bankName": this.createLoan.controls.bank.value,
  //           "bankAccountNo": this.createLoan.controls.account.value,
  //           "bankIfsc": this.createLoan.controls.ifsc.value,
  //           "bankAccountVerified": true
  //         }
  //         this.cdlservice.saveBankDetails(this.bankDetails).subscribe((data) => {
  //           console.log("this.loanProducts", this.loanProducts);
  //           this.snackbarService.openSnackBar("Loan Application Created Successfully")
  //           this.router.navigate(['provider', 'cdl', 'loans']);
  //         }), (error) => {
  //           this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
  //         }
  //       },
  //         (error) => {
  //           this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
  //         })
  //     }
  //   }
  // }

  uploadAudioVideo(data) {
    const _this = this;
    let count = 0;
    console.log("DAta:", data);
    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        console.log("S3URLOBJ:", s3UrlObj);
        console.log('_this.filesToUpload', _this.filesToUpload)
        const file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === (s3UrlObj.orderId)) ? fileObj : '');
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
        else {
          resolve(true);
        }
      }
    })
  }
  uploadFiles(file, url) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.cdlservice.videoaudioS3Upload(file, url)
        .subscribe(() => {
          resolve(true);
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }



  goBack() {
    this.location.back();
  }

  goNext() {
    this.router.navigate(['provider', 'cdl', 'loans', 'approved'])
  }



  filesSelected(event, type) {
    console.log("Event ", event, type)
    const input = event.target.files;
    console.log("input ", input)
    this.fileService.filesSelected(event, this.selectedFiles[type]).then(
      () => {
        for (const pic of input) {
          const size = pic["size"] / 1024;
          let fileObj = {
            owner: this.businessId,
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: pic["type"].split("/")[1],
            action: 'add'
          }
          fileObj['file'] = pic;
          fileObj['type'] = type;
          this.filesToUpload.push(fileObj);
        }
      }).catch((error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })


  }




  imageSelect(event) {

  }


  checkELigibility() {
    this.loanAmount = this.createLoan.controls.loanamount.value
    if (this.loanAmount == 0) {
      this.snackbarService.openSnackBar("Please Fill All Fields", { 'panelClass': 'snackbarerror' });
    }
    else {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          from: 'loancreate'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result = "eligible") {
            this.cdlservice.ApprovalRequest(this.loanId).subscribe((data: any) => {
              if (data.isAutoApproval && data.isApproved) {
                const navigationExtras: NavigationExtras = {
                  queryParams: {
                    type: 'autoapproved'
                  }
                }
                this.snackbarService.openSnackBar("Loan Auto Approved");
                this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
              }
              else if (!data.isAutoApproval && data.isApproved) {
                const navigationExtras: NavigationExtras = {
                  queryParams: {
                    type: 'approved'
                  }
                }
                this.snackbarService.openSnackBar("Loan Application Submitted.Waiting for Credit Officers Approval");
                this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
              }
              else if (!data.isAutoApproval && data.isApproved) {
                const navigationExtras: NavigationExtras = {
                  queryParams: {
                    type: 'approved'
                  }
                }
                this.snackbarService.openSnackBar("Loan Application Submitted.Waiting for Credit Officers Approval");
                this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
              }
              else if (!data.isAutoApproval && !data.isApproved) {
                const navigationExtras: NavigationExtras = {
                  queryParams: {
                    type: 'rejected'
                  }
                }
                this.snackbarService.openSnackBar("Sorry This Loan Was Rejected", { 'panelClass': 'snackbarerror' });
                this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
              }
              console.log("Response", data);
            },
              (error) => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
              })
          }
        }
        else {
          console.log("Data Not Saved")
        }
      });
    }
  }

  verifyotp() {
    if (this.createLoan.controls.phone.value && this.createLoan.controls.phone.value != '' && this.createLoan.controls.phone.value.length == 10) {
      let can_remove = false;
      if (this.createLoan.controls.firstname.value && this.createLoan.controls.lastname.value) {
        this.nameData = {
          "firstName": this.createLoan.controls.firstname.value,
          "lastName": this.createLoan.controls.lastname.value,
        }
      }

      const dialogRef = this.dialog.open(OtpVerifyComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          type: 'Mobile Number',
          data: this.nameData,
          phoneNumber: this.createLoan.controls.phone.value
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.msg == "success") {
            this.verification = true;
            this.loanId = result.uid;
            const filter = { 'phoneNo-eq': this.createLoan.controls.phone.value };
            this.getCustomerDetails(filter);
          }
        }
      });
      return can_remove;
    }
    else {
      this.snackbarService.openSnackBar("Please Enter a Valid Mobile Number", { 'panelClass': 'snackbarerror' });

    }

  }




  saveCustomerDetails() {
    const filter = { 'phoneNo-eq': this.createLoan.controls.phone.value };
    this.cdlservice.getCustomerDetails(filter).subscribe((data) => {
      this.customerDetails = data;
      if (this.customerDetails[0] && this.customerDetails[0].id) {
        this.customerId = this.customerDetails[0].id;
      }
      this.loanApplication = {
        "customer": {
          "id": this.customerId,
          "firstName": this.createLoan.controls.firstname.value,
          "lastName": this.createLoan.controls.lastname.value,
          "email": this.createLoan.controls.email.value
        },
        "customerMobileVerified": this.verification,
        "customerEmailVerified": this.emailverification,
        "location": { "id": this.user.bussLocs[0] },
        "assignee": { "id": this.user.id },
        "loanApplicationKycList": [
          {
            "isCoApplicant": false
          }
        ]
      }

      for (let i = 0; i < this.filesToUpload.length; i++) {
        this.filesToUpload[i]['order'] = i;
        if (this.filesToUpload[i]["type"] == 'photo') {
          this.loanApplication['consumerPhoto'] = [];
          this.loanApplication['consumerPhoto'].push(this.filesToUpload[i]);
        }
      }
    });



    console.log(this.loanApplication, this.customerId)

    this.cdlservice.getLoanById(this.loanId).subscribe((data: any) => {
      console.log('Loan Data', data)
      if (this.loanApplication && data && data.status && data.status.id) {
        this.loanApplication['status'] = { "id": data.status.id };
      }
      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].id) {
        this.loanApplication.loanApplicationKycList[0]["id"] = data.loanApplicationKycList[0].id
        this.loanApplicationKycId = data.loanApplicationKycList[0].id
      }
      this.cdlservice.updateLoan(this.loanId, this.loanApplication).subscribe((s3urls: any) => {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: this.loanId,
            action: 'update',
            from: 'create'
          }
        };
        console.log("Navigation", navigationExtras)
        this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras);
        this.customerDetailsPanel = false;
        this.kycDetailsPanel = true;
        this.snackbarService.openSnackBar("Customer Details Saved Successfully")
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })


  }




  refreshAadharVerify() {
    this.cdlservice.refreshAadharVerify(this.loanApplicationKycId).subscribe((data: any) => {
      if (data) {
        this.aadharverification = true;
        this.cdlservice.getLoanById(this.loanId).subscribe((data: any) => {
          if (data) {
            this.createLoan.controls.permanentaddress1.setValue(data.loanApplicationKycList[0].permanentAddress1);
            this.createLoan.controls.permanentaddress2.setValue(data.loanApplicationKycList[0].permanentAddress2);
            this.createLoan.controls.permanentcity.setValue(data.loanApplicationKycList[0].permanentCity);
            this.createLoan.controls.permanentstate.setValue(data.loanApplicationKycList[0].permanentState);
            this.createLoan.controls.permanentpincode.setValue(data.loanApplicationKycList[0].permanentPin);
          }
          this.verifyingUID = false;
        })
      }
    });
  }







  idVerification(type) {
    this.loanApplication = {
      "loanApplicationUid": this.loanId,
      "customerPhone": this.createLoan.controls.phone.value,
    }

    if (type == 'Pan') {
      this.loanApplication["pan"] = this.createLoan.controls.pannumber.value;
    }
    else if (type == 'UID') {
      this.loanApplication["aadhaar"] = this.createLoan.controls.aadharnumber.value;
    }

    this.cdlservice.getLoanById(this.loanId).subscribe((data: any) => {

      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].id) {
        this.loanApplication["id"] = data.loanApplicationKycList[0].id
      }
      for (let i = 0; i < this.filesToUpload.length; i++) {
        this.filesToUpload[i]['order'] = i;
        if (this.filesToUpload[i]["type"] == 'pan' && type == 'Pan') {
          this.loanApplication['panAttachments'] = [];
          this.loanApplication['panAttachments'].push(this.filesToUpload[i]);
        }
        if (this.filesToUpload[i]["type"] == 'aadhar' && type == 'UID') {
          this.loanApplication['aadhaarAttachments'] = [];
          this.loanApplication['aadhaarAttachments'].push(this.filesToUpload[i]);
        }
      }

      this.cdlservice.verifyIds(type, this.loanApplication).subscribe((s3urls: any) => {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        if (type == 'Pan') {
          this.panverification = true;
          this.snackbarService.openSnackBar(type + " Verified Successfully")
        }
        else if (type == 'UID') {
          this.verifyingUID = true;
          this.snackbarService.openSnackBar("We have sent the verification link to mobile.Please Verify and click on refresh")
        }
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })


  }





  saveAddress() {
    this.loanApplication = {
      "loanApplicationUid": this.loanId,
      "customerPhone": this.createLoan.controls.phone.value,
      "permanentAddress1": this.createLoan.controls.permanentaddress1.value,
      "permanentAddress2": this.createLoan.controls.permanentaddress2.value,
      "permanentPin": this.createLoan.controls.permanentpincode.value,
      "permanentCity": this.createLoan.controls.permanentcity.value,
      "permanentState": this.createLoan.controls.permanentstate.value,
      "currentAddress1": this.createLoan.controls.currentaddress1.value,
      "currentAddress2": this.createLoan.controls.currentaddress2.value,
      "currentPin": this.createLoan.controls.currentpincode.value,
      "currentCity": this.createLoan.controls.currentpincode.value,
      "currentState": this.createLoan.controls.currentstate.value
    }

    this.cdlservice.getLoanById(this.loanId).subscribe((data: any) => {

      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].id) {
        this.loanApplication["id"] = data.loanApplicationKycList[0].id
      }

      this.cdlservice.addressUpdate(this.loanApplication).subscribe((s3urls: any) => {
        this.panelsManage(false, false, true, false);
        this.snackbarService.openSnackBar("Address Details Updated Successfully")
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })


  }


  panelsManage(customer, kyc, loan, bank) {
    this.customerDetailsPanel = customer;
    this.kycDetailsPanel = kyc;
    this.loanDetailsPanel = loan;
    this.bankDetailsPanel = bank;
  }

  saveLoanDetails() {
    this.loanApplication = {
      "uid": this.loanId,
      "loanProduct": {
        "id": this.createLoan.controls.loanproduct.value
      },
      "category": {
        "id": this.createLoan.controls.category.value
      },
      "type": {
        "id": this.createLoan.controls.loantype.value
      },
      "loanScheme": {
        "id": this.schemeSelected.id
      },
      "montlyIncome": this.createLoan.controls.salary.value,
      "invoiceAmount": this.createLoan.controls.totalpayment.value,
      "downpaymentAmount": this.createLoan.controls.downpayment.value,
      "requestedAmount": this.createLoan.controls.loanamount.value,
      "emiPaidAmountMonthly": this.createLoan.controls.emicount.value,
      "loanApplicationKycList": [
        {
          "employmentStatus": this.createLoan.controls.employmenttype.value,
          "monthlyIncome": this.createLoan.controls.salary.value,
          "nomineeType": this.createLoan.controls.nomineetype.value,
          "nomineeName": this.createLoan.controls.nomineename.value
        }
      ]
    }

    this.cdlservice.getLoanById(this.loanId).subscribe((data: any) => {

      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].id) {
        this.loanApplication.loanApplicationKycList[0]["id"] = data.loanApplicationKycList[0].id
      }
      if (data && data.id) {
        this.loanApplication["id"] = data.id
      }
      if (data && data.id) {
        this.loanApplication["id"] = data.id
      }

      this.loanApplication["partner"] = { 'id': this.createLoan.controls.dealer.value }

      this.cdlservice.loanDetailsSave(this.loanApplication).subscribe((s3urls: any) => {
        this.panelsManage(false, false, false, true);
        this.snackbarService.openSnackBar("Loan Details Updated Successfully")
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })

  }




  saveBankDetails() {
    this.bankDetails = {
      "originUid": this.loanId,
      "loanApplicationUid": this.loanId,
      "bankName": this.createLoan.controls.bank.value,
      "bankAccountNo": this.createLoan.controls.account.value,
      "bankIfsc": this.createLoan.controls.ifsc.value,
      "bankAccountVerified": true
    }

    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'bank') {
        this.bankDetails['bankStatementAttachments'] = [];
        this.bankDetails['bankStatementAttachments'].push(this.filesToUpload[i]);
      }
    }

    const verifyBank = {
      "loanApplicationUid": this.loanId,
    }

    if (this.bankData == null) {
      this.cdlservice.saveBankDetails(this.bankDetails).subscribe((s3urls: any) => {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        this.cdlservice.verifyBankDetails(verifyBank).subscribe((data: any) => {
          if (data) {
            this.cdlservice.getBankDetailsById(this.loanId).subscribe((bankInfo) => {
              this.bankData = bankInfo;
            });
          }
          this.snackbarService.openSnackBar("Bank Details Verified and Saved Successfully")

        }),
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          }
      }), (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }
    }
    else {

      this.cdlservice.updateBankDetails(this.bankDetails).subscribe((s3urls: any) => {
        console.log("Coming Here")

        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        this.cdlservice.verifyBankDetails(verifyBank).subscribe((data: any) => {
          this.snackbarService.openSnackBar("Bank Details Updated Successfully")

        }),
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          }
      }), (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }
    }


  }

  verifyEmail() {
    if (this.createLoan.controls.email.value && this.createLoan.controls.email.value != '') {
      let can_remove = false;
      const dialogRef = this.dialog.open(OtpVerifyComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          type: 'Email',
          id: this.loanId,
          email: this.createLoan.controls.email.value
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result && result.msg == "success") {
          this.emailverification = true
          this.snackbarService.openSnackBar("Email Id Verified");
        }
      });
      return can_remove;
    }
    else {
      this.snackbarService.openSnackBar("Please Enter a Valid Email Id", { 'panelClass': 'snackbarerror' });

    }

  }

  verifyaadhar() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Aadhar Number'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.aadharverification = true;
          this.address1 = "Vellara Building";
          this.address2 = "Museum CrossLane";
          this.city = "Thrissur";
          this.state = "Kerala";
          this.pincode = "680020";
          this.addresscheck = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }

  openSchemes() {
    const dialogRef = this.dialog.open(SelectSchemeComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        schemes: this.loanSchemes
      }
    });
    dialogRef.afterClosed().subscribe(scheme => {
      if (scheme) {
        console.log("selected", scheme);
        this.schemeSelected = scheme;
        this.createLoan.controls.scheme.setValue(scheme.schemeName);
      }
    });
  }

  verifyAccount() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Account Number'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.accountverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }



  payment(event) {
    // this.totalpayment = event.target.value;
    // this.downpayment = Math.round(this.totalpayment * 0.2);
    // this.loanamount = Math.round(this.totalpayment - this.downpayment);
  }

  verifypan() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Pan Number'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.panverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }


  addresschange(event) {
    if (event.target.checked) {
      this.showaddressfields = false;
    }
    else {
      this.showaddressfields = true;
    }
  }

}
