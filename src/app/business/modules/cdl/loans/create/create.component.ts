import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../otp-verify/otp-verify.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
// import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdlService } from '../../cdl.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { FileService } from '../../../../../shared/services/file-service';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
// import { SharedServices } from '../../../../../shared/services/shared-services';
// import { SubSink } from 'subsink';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };

  selectedFiles = {
    "aadhar": { files: [], base64: [], caption: [] },
    "pan": { files: [], base64: [], caption: [] },
    "photo": { files: [], base64: [], caption: [] }
  }


  aadharverification = false;
  verification = false;
  panverification = false;
  emailverification = false;
  address1: any = '';
  address2: any = '';
  city: any = '';
  phoneNumber: any;
  state: any = '';
  pincode: any = '';
  addresscheck: any = true;
  showaddressfields: any = false;
  // loanamount: any = 0;
  // totalpayment: any = 0;
  // downpayment: any = 0;
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
  relations = projectConstantsLocal.RELATIONSHIPS;
  filesToUpload: any = [];
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
      if (params.id) {
        this.cdlservice.getLoanById(params.id).subscribe((data) => {
          this.loanData = data;
          this.action = params.action;
          this.loanId = params.id;
          if (params.action == 'update' && this.loanData) {
            this.headerText = "Update Loan";
            this.btnText = "Update Loan";
            this.createLoan.controls.phone.setValue(this.loanData.customer.phoneNo);
            this.createLoan.controls.name.setValue(this.loanData.customer.firstName + ' ' + this.loanData.customer.lastName);
            this.createLoan.controls.email.setValue(this.loanData.customer.email);
            this.createLoan.controls.aadharnumber.setValue(this.loanData.loanApplicationKycList[0].aadhaar);
            this.createLoan.controls.pannumber.setValue(this.loanData.loanApplicationKycList[0].pan);
            this.createLoan.controls.loantype.setValue(this.loanData.type.id);
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
            this.createLoan.controls.category.setValue(this.loanData.category.id);
            this.createLoan.controls.loanproduct.setValue(this.loanData.loanProduct.id);
            this.createLoan.controls.totalpayment.setValue(this.loanData.invoiceAmount);
            this.createLoan.controls.downpayment.setValue(this.loanData.downpaymentAmount);
            this.createLoan.controls.loanamount.setValue(this.loanData.requestedAmount);
            this.createLoan.controls.remarks.setValue(this.loanData.remarks);
            this.createLoan.controls.emicount.setValue(this.loanData.emiPaidAmountMonthly);
            this.createLoan.controls.nomineename.setValue(this.loanData.loanApplicationKycList[0].nomineeName);
            this.createLoan.controls.nomineetype.setValue(this.loanData.loanApplicationKycList[0].nomineeType);

            this.aadharverification = true;
            this.verification = true;
            this.emailverification = true;
            this.panverification = true;


          }
        })
      }
    });




    this.createLoan = this.createLoanFormBuilder.group({
      phone: [null],
      name: [null],
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
      nomineename: [null]
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
    this.cdlservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })
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

  getCustomerDetails(filter) {
    this.cdlservice.getCustomerDetails(filter).subscribe((data) => {
      this.customerDetails = data;
      if (this.customerDetails && this.customerDetails.length != 0) {
        console.log("this.customerDetails", this.customerDetails)
        if (this.customerDetails[0] && (this.customerDetails[0].firstName || this.customerDetails[0].lastName)) {
          if (this.customerDetails[0].firstName && this.customerDetails[0].lastName) {
            this.createLoan.controls.name.setValue(this.customerDetails[0].firstName + " " + this.customerDetails[0].lastName);
          }
          else if (this.customerDetails[0].firstName && !this.customerDetails[0].lastName) {
            this.createLoan.controls.name.setValue(this.customerDetails[0].firstName);
          }
          else if (!this.customerDetails[0].firstName && this.customerDetails[0].lastName) {
            this.createLoan.controls.name.setValue(this.customerDetails[0].lastName);
          }
        }
        if (this.customerDetails[0] && this.customerDetails[0].email) {
          this.createLoan.controls.email.setValue(this.customerDetails[0].email)
        }
        if (this.customerDetails[0] && this.customerDetails[0].address) {
          this.createLoan.controls.permanentaddress1.setValue(this.customerDetails[0].address)
        }
        if (this.customerDetails[0] && this.customerDetails[0].id) {
          this.customerId = this.customerDetails[0].id;
          // this.loanApplication['consumer'] = {
          //   "id": this.loanData.status.id
          // };
        }

      }

      else {
        this.createLoan.controls.name.setValue("")
        this.createLoan.controls.email.setValue("")
      }
    })
  }


  resetErrors() {

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

  saveAsLead() {
    
  
    // if (this.addresscheck) {
    //   this.createLoan.controls.currentaddress1.setValue(this.createLoan.controls.permanentAddress1.value);
    //   this.createLoan.controls.currentaddress2.setValue(this.createLoan.controls.permanentAddress2.value);
    //   this.createLoan.controls.currentcity.setValue(this.createLoan.controls.permanentCity.value);
    //   this.createLoan.controls.currentstate.setValue(this.createLoan.controls.permanentState.value);
    //   this.createLoan.controls.currentpincode.setValue(this.createLoan.controls.permanentPin.value);
    // }
    if (this.createLoan.controls.name.value) {
      let nameVal = this.createLoan.controls.name.value;
      const name = nameVal.split(" ");
      this.firstName = name[0];
      if (name[1]) {
        this.lastName = name[1];
      }
      else {
        this.lastName = "";
      }
    }
    this.loanApplication = {
      "customer": {
        "firstName": this.firstName,
        "lastName": this.lastName,
        "phoneNo": this.createLoan.controls.phone.value,
        "email": this.createLoan.controls.email.value,
        "countryCode": "+91"
      },
      "type": { "id": this.createLoan.controls.loantype.value },
      "loanProduct": { "id": this.createLoan.controls.loanproduct.value },
      "assignee": { "id": this.user.id },
      "category": { "id": this.createLoan.controls.category.value },
      "location": { "id": this.user.bussLocs[0] },
      "locationArea": this.createLoan.controls.permanentcity.value,
      "invoiceAmount": this.createLoan.controls.totalpayment.value,
      "downpaymentAmount": this.createLoan.controls.downpayment.value,
      "requestedAmount": this.createLoan.controls.loanamount.value,
      "remarks": this.createLoan.controls.remarks.value,
      "emiPaidAmountMonthly": this.createLoan.controls.emicount.value,
      "loanApplicationKycList": [
        {
          "isCoApplicant": false,
          "maritalStatus": this.createLoan.controls.martialstatus.value,
          "employmentStatus": this.createLoan.controls.employmenttype.value,
          "monthlyIncome": this.createLoan.controls.salary.value,
          "aadhaar": this.createLoan.controls.aadharnumber.value,
          "pan": this.createLoan.controls.pannumber.value,
          "isAadhaarVerified": true,
          "isPanVerified": true,
          "nomineeType": this.createLoan.controls.nomineetype.value,
          "nomineeName": this.createLoan.controls.nomineename.value,
          "permanentAddress1": this.createLoan.controls.permanentaddress1.value,
          "permanentAddress2": this.createLoan.controls.permanentaddress2.value,
          "permanentPin": this.createLoan.controls.permanentpincode.value,
          "permanentCity": this.createLoan.controls.permanentcity.value,
          "permanentState": this.createLoan.controls.permanentstate.value,
          "currentAddress1": this.createLoan.controls.currentaddress1.value,
          "currentAddress2": this.createLoan.controls.currentaddress2.value,
          "currentPin": this.createLoan.controls.currentpincode.value,
          "currentCity": this.createLoan.controls.currentpincode.value,
          "currentState": this.createLoan.controls.currentstate.value,
          // "aadhaarAttachments": [this.fileObjFinal]
        }
      ]
    }


    if (this.loanApplication) {
      if (this.action == "update") {
        this.loanApplication['status'] = {
          "id": this.loanData.status.id
        };
        this.loanApplication.customer = {
          "id": this.loanData.customer.id
        };
        this.loanApplication.loanApplicationKycList[0]['id'] = this.loanData.loanApplicationKycList[0].id;
        console.log("response");
        this.cdlservice.updateLoan(this.loanId, this.loanApplication).subscribe((response: any) => {
          console.log("response", response);
          this.snackbarService.openSnackBar("Loan Application Updated Successfully")
          this.router.navigate(['provider', 'cdl', 'loans'])
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
        console.log("response");
      }
      else {
        console.log(this.filesToUpload);

        for(let i = 0;i<this.filesToUpload.length;i++) {
          this.filesToUpload[i]['order']=i;
          if (this.filesToUpload[i]["type"] == 'aadhar') {
            this.loanApplication.loanApplicationKycList[0]['aadhaarAttachments']=[];
            this.loanApplication.loanApplicationKycList[0]['aadhaarAttachments'].push(this.filesToUpload[i]);
          } 
          if (this.filesToUpload[i]["type"] == 'pan') {
            this.loanApplication.loanApplicationKycList[0]['panAttachments']=[];
            this.loanApplication.loanApplicationKycList[0]['panAttachments'].push(this.filesToUpload[i]);
          } 
          if (this.filesToUpload[i]["type"] == 'photo') {
            this.loanApplication['customerPhoto']=[];
            this.loanApplication['customerPhoto'].push(this.filesToUpload[i]);
          } 
        }
          
        console.log("Loan Application Data : ", this.loanApplication)


        this.cdlservice.createLoan(this.loanApplication).subscribe((s3urls: any) => {
          console.log("response", s3urls);


          if (s3urls.attachmentsUrls.length > 0) {
            this.uploadAudioVideo(s3urls['attachmentsUrls']).then(
              (dataS3Url) => {
                console.log(dataS3Url);
                this.snackbarService.openSnackBar("Loan Application Created Successfully")
                this.router.navigate(['provider', 'cdl', 'loans']);
              });
            }
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
    }
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
      _this.cdlservice.videoaudioS3Upload(file, url)
        .subscribe(() => {
          resolve(true);
        }, error => {
          console.log('error',error)
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
    console.log("Event ", event,type)
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
            if (this.loanAmount <= 50000) {
              this.snackbarService.openSnackBar("Eligibility Calculation Done");
              this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
            }
            else if (this.loanAmount > 50000 && this.loanAmount <= 200000) {
              this.router.navigate(['provider', 'cdl', 'loans', 'additionalqa']);
            }
            else {
              this.snackbarService.openSnackBar("Sorry,This Loan Was Rejected", { 'panelClass': 'snackbarerror' });
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  type: 'rejected'
                }
              }
              this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
            }

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
      const dialogRef = this.dialog.open(OtpVerifyComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          type: 'Mobile Number',
          phoneNumber: this.createLoan.controls.phone.value
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result = "verified") {
            this.verification = true;
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






  verifyemail() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Email'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.emailverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
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
