import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../otp-verify/otp-verify.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
// import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { FileService } from '../../../../../shared/services/file-service';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SelectSchemeComponent } from '../select-scheme/select-scheme.component';
import { CdlService } from '../../cdl.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  loanDetailsSaved = false;
  bankDetailsSaved = false;
  kycDetailsSaved = false;
  customerDetailsSaved = false;
  calculatedMafilScore: any = 0;
  customerEducationScore: any = 0;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  showBankAttachments: any = false;
  bankDetailsVerified: any = false;
  loanApplicationKycId: any;
  loanProductsSelected: any;
  showCoapplicant = false;
  banksList: any;
  todayDate = new Date()
  minDob: any;
  selectedFiles = {
    "aadhar": { files: [], base64: [], caption: [] },
    "pan": { files: [], base64: [], caption: [] },
    "photo": { files: [], base64: [], caption: [] },
    "bank": { files: [], base64: [], caption: [] }
  }
  genders = [
    {
      name: 'male',
      displayName: 'Male'
    },
    {
      name: 'female',
      displayName: 'Female'
    }
  ];
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
  guarantorVerification: any;
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
  createLoan: UntypedFormGroup;
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
  customerDetailsVerified: any;
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
  partnerParentId: any;
  dialCode: any;
  firstName: any;
  lastName: any;
  downPayment: any;
  loanStatuses: any;
  loanSchemes: any;
  from: any;
  bankData: any;
  partnerId: any;
  relations = projectConstantsLocal.RELATIONSHIPS;
  addressRelations: any;
  employmentTypes = projectConstantsLocal.EMPLOYMENT_TYPES;
  stateList = projectConstantsLocal.INDIAN_STATES;
  filesToUpload: any = [];
  dealers: any;
  mafilScoreFields: any;
  SelectedloanProducts: any = [];
  accountaggregating: boolean = false;
  mafilEmployee: any = false;
  movableAssets: boolean = false;
  loanProductCategories: any;
  loanProductSubCategories: any;
  productCategoryId: any;
  productSubCategoryId: any;
  totalPaymentValue: number;
  subventionLoan: any = false;
  allPanelsExpanded: boolean;
  enquireUid: any;
  enquireLeadData: any;
  disablePhone: any = false;
  filteredOptions: Observable<string[]>;
  banksListNames = new FormControl('');
  bankListName: any;
  customerData: any;
  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private activated_route: ActivatedRoute,
    private createLoanFormBuilder: UntypedFormBuilder,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private cdlService: CdlService,
    private fileService: FileService,
  ) {

    this.activated_route.queryParams.subscribe((params) => {
      if (params && params.from) {
        this.from = params.from;
      }
      if (params && params.type && params.type == 'enquire') {
        if (params && params.enquireId) {
          this.enquireUid = params.enquireId;
          const api_filter = {};
          api_filter['loanNature-eq'] = 'ConsumerDurableLoan';
          api_filter['uid-eq'] = this.enquireUid;

          this.cdlService.getLeadsByUid(this.enquireUid).subscribe((data: any) => {
            this.enquireLeadData = data;
            if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.firstName) {
              this.createLoan.controls.firstname.setValue(this.enquireLeadData.customer.firstName);
            }
            if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.lastName) {
              this.createLoan.controls.lastname.setValue(this.enquireLeadData.customer.lastName);
            }
            if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.phoneNo) {
              this.createLoan.controls.phone.setValue(this.enquireLeadData.customer.phoneNo);
              this.disablePhone = true;
            }
            if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.email) {
              this.createLoan.controls.email.setValue(this.enquireLeadData.customer.email);
            }
            if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.dob) {
              this.createLoan.controls.dob.setValue(this.enquireLeadData.customer.dob);
            }
            if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.gender) {
              this.createLoan.controls.gender.setValue(this.enquireLeadData.customer.gender);
            }
            if (this.enquireLeadData && this.enquireLeadData.targetPotential) {
              this.createLoan.controls.loanamount.setValue(this.enquireLeadData.targetPotential);
            }
            if (this.enquireLeadData && this.enquireLeadData.customerCity) {
              this.createLoan.controls.permanentcity.setValue(this.enquireLeadData.customerCity);
            }
            if (this.enquireLeadData && this.enquireLeadData.customerState) {
              this.createLoan.controls.permanentstate.setValue(this.enquireLeadData.customerState);
            }
            if (this.enquireLeadData && this.enquireLeadData.customerPin) {
              this.createLoan.controls.permanentpincode.setValue(this.enquireLeadData.customerPin);
            }
          });
        }
      }
      if (params && params.id) {
        this.cdlService.getLoanById(params.id).subscribe((data) => {
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
            this.createLoan.controls.dob.setValue(this.loanData.customer.dob);
            this.createLoan.controls.gender.setValue(this.loanData.customer.gender);
            this.createLoan.controls.aadharnumber.setValue(this.loanData.loanApplicationKycList[0].aadhaar);
            this.createLoan.controls.pannumber.setValue(this.loanData.loanApplicationKycList[0].pan);
            if (this.loanData && this.loanData.type && this.loanData.type.id) {
              this.createLoan.controls.loantype.setValue(this.loanData.type.id);
            }
            this.createLoan.controls.permanentRelationType.setValue(this.loanData.loanApplicationKycList[0].permanentRelationType);
            this.createLoan.controls.permanentRelationName.setValue(this.loanData.loanApplicationKycList[0].permanentRelationName);
            this.createLoan.controls.permanentaddress1.setValue(this.loanData.loanApplicationKycList[0].permanentAddress1);
            this.createLoan.controls.permanentaddress2.setValue(this.loanData.loanApplicationKycList[0].permanentAddress2);
            this.createLoan.controls.permanentcity.setValue(this.loanData.loanApplicationKycList[0].permanentCity);
            this.createLoan.controls.permanentstate.setValue(this.loanData.loanApplicationKycList[0].permanentState);
            this.createLoan.controls.permanentpincode.setValue(this.loanData.loanApplicationKycList[0].permanentPin);

            this.createLoan.controls.currentRelationType.setValue(this.loanData.loanApplicationKycList[0].currentRelationType);
            this.createLoan.controls.currentRelationName.setValue(this.loanData.loanApplicationKycList[0].currentRelationName);
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
            if (this.loanData && this.loanData.productCategoryId) {
              this.createLoan.controls.productcategory.setValue(this.loanData.productCategoryId);
              this.getLoanProductSubCategories(this.loanData.productCategoryId)
              this.productCategoryId = this.loanData.productCategoryId;
            }
            if (this.loanData && this.loanData.productSubCategoryId) {
              this.createLoan.controls.productsubcategory.setValue(this.loanData.productSubCategoryId);
              this.productSubCategoryId = this.loanData.productSubCategoryId;
            }

            if (this.productCategoryId && this.productSubCategoryId) {
              console.log("Coming to Products")
              this.getLoanProducts(this.productCategoryId, this.productSubCategoryId)
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
            if (this.loanData && this.loanData.employee == false || this.loanData.employee == true) {
              this.createLoan.controls.employee.setValue(this.loanData.employee);
            }

            if (this.loanData && this.loanData.subventionLoan == false || this.loanData.subventionLoan == true) {
              this.createLoan.controls.subventionLoan.setValue(this.loanData.subventionLoan);
            }

            if (this.loanData && this.loanData.employeeCode) {
              this.createLoan.controls.employeeCode.setValue(this.loanData.employeeCode);
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
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].nomineeDob) {
              this.createLoan.controls.nomineeDob.setValue(this.loanData.loanApplicationKycList[0].nomineeDob);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].nomineePhone) {
              this.createLoan.controls.nomineePhone.setValue(this.loanData.loanApplicationKycList[0].nomineePhone);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].nomineeDob) {
              this.createLoan.controls.nomineeDob.setValue(this.loanData.loanApplicationKycList[0].nomineeDob);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].nomineePhone) {
              this.createLoan.controls.nomineePhone.setValue(this.loanData.loanApplicationKycList[0].nomineePhone);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].guarantorType) {
              this.createLoan.controls.guarantorType.setValue(this.loanData.loanApplicationKycList[0].guarantorType);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].guarantorName) {
              this.createLoan.controls.guarantorName.setValue(this.loanData.loanApplicationKycList[0].guarantorName);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].isGuarantorPhoneVerified) {
              this.guarantorVerification = true;
              this.showCoapplicant = true;
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].guarantorDob) {
              this.createLoan.controls.guarantorDob.setValue(this.loanData.loanApplicationKycList[0].guarantorDob);
            }
            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].guarantorPhone) {
              this.createLoan.controls.guarantorPhone.setValue(this.loanData.loanApplicationKycList[0].guarantorPhone);
            }
            // if (this.loanData && this.loanData.loanScheme && this.loanData.loanScheme.schemeName) {
            //   this.createLoan.controls.scheme.setValue(this.loanData.loanScheme.schemeName);
            //   this.schemeSelected = this.loanData.loanScheme;
            // }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].isPanVerified) {
              this.panverification = true;
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].isAadhaarVerified) {
              this.aadharverification = true;
            }

            if (this.loanData && this.loanData.partner && this.loanData.partner.id) {
              this.createLoan.controls.dealer.setValue(this.loanData.partner.id);
            }

            if (this.loanData && this.loanData.loanProducts && this.loanData.loanProducts[0]) {
              // this.loanData.loanProducts.map((data) => {
              //   this.SelectedloanProducts.push(data)
              // });
              console.log("this.SelectedloanProducts", this.SelectedloanProducts);
            }

            // if (this.loanData && this.loanData.loanProducts && this.loanData.loanProducts[0]) {
            //   this.loanData.loanProducts.map((data) => {
            //     this.SelectedloanProducts.push(data)
            //   });
            //   console.log("this.SelectedloanProducts", this.SelectedloanProducts);
            // }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].customerEducation) {
              this.createLoan.controls.customerEducation.setValue(this.loanData.loanApplicationKycList[0].customerEducation);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].customerEmployement) {
              this.createLoan.controls.customerEmployement.setValue(this.loanData.loanApplicationKycList[0].customerEmployement);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].salaryRouting) {
              this.createLoan.controls.salaryRouting.setValue(this.loanData.loanApplicationKycList[0].salaryRouting);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].familyDependants) {
              this.createLoan.controls.familyDependants.setValue(this.loanData.loanApplicationKycList[0].familyDependants);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].noOfYearsAtPresentAddress) {
              this.createLoan.controls.noOfYearsAtPresentAddress.setValue(this.loanData.loanApplicationKycList[0].noOfYearsAtPresentAddress);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].currentResidenceOwnershipStatus) {
              this.createLoan.controls.currentResidenceOwnershipStatus.setValue(this.loanData.loanApplicationKycList[0].currentResidenceOwnershipStatus);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].ownedMovableAssets) {
              this.createLoan.controls.ownedMovableAssets.setValue(this.loanData.loanApplicationKycList[0].ownedMovableAssets);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].vehicleNo) {
              this.createLoan.controls.vehicleNo.setValue(this.loanData.loanApplicationKycList[0].vehicleNo);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].earningMembers) {
              this.createLoan.controls.earningMembers.setValue(this.loanData.loanApplicationKycList[0].earningMembers);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].existingCustomer) {
              this.createLoan.controls.existingCustomer.setValue(this.loanData.loanApplicationKycList[0].existingCustomer);
            }

            if (this.loanData && this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].goodsFinanced) {
              this.createLoan.controls.goodsFinanced.setValue(this.loanData.loanApplicationKycList[0].goodsFinanced);
            }

            if (this.loanData && this.loanData.customerMobileVerified) {
              this.verification = true;
            }

            if (this.loanData && this.loanData.customerEmailVerified) {
              this.emailverification = true;
            }

            if (this.loanData && this.loanData.customerMobileVerified && this.loanData.customer && this.loanData.consumerPhoto && this.loanData.consumerPhoto.length > 0) {
              this.customerDetailsVerified = true;
            }


            if (this.loanData && this.loanData.isRequestSubmitted) {
              this.loanDetailsSaved = true;
            }

            if (this.loanData && this.loanData.isBankVerified) {
              this.bankDetailsVerified = true;
            }

            if (this.loanData && this.loanData.isKycVerified) {
              this.kycDetailsSaved = true;
            }



            this.selectedFiles['photo'].files = this.loanData.consumerPhoto;
            this.selectedFiles['aadhar'].files = this.loanData.loanApplicationKycList[0].aadhaarAttachments;
            this.selectedFiles['pan'].files = this.loanData.loanApplicationKycList[0].panAttachments;


          }
        })
        console.log(params.id);
        this.cdlService.getBankDetailsById(params.id).subscribe((data) => {
          this.bankData = data;
          console.log("this.bankData", this.bankData)
          if (this.bankData) {
            this.bankDetailsSaved = true;
            this.bankListName = this.bankData.bankName;
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
      nomineePhone: [null],
      nomineeDob: [null],
      bank: [null],
      ifsc: [null],
      account: [null],
      bankstatements: [null],
      // scheme: [null],
      dealer: [null],
      customerEducation: [null],
      customerEmployement: [null],
      salaryRouting: [null],
      familyDependants: [null],
      noOfYearsAtPresentAddress: [null],
      currentResidenceOwnershipStatus: [null],
      ownedMovableAssets: [null],
      vehicleNo: [null],
      goodsFinanced: [null],
      dob: [null],
      earningMembers: [null],
      gender: [null],
      existingCustomer: [null],
      employee: [null],
      employeeCode: [null],
      permanentRelationType: [null],
      permanentRelationName: [null],
      currentRelationType: [null],
      currentRelationName: [null],
      productcategory: [null],
      productsubcategory: [null],
      guarantorType: [null],
      guarantorName: [null],
      guarantorPhone: [null],
      guarantorDob: [null],
      subventionLoan: [null]
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');


    if (this.user && this.user.partnerId) {
      this.partnerId = this.user.partnerId;
    }

    this.filteredOptions = this.banksListNames.valueChanges.pipe(startWith(''),
      map(value => this._filter(value || '')),
    );


    this.minDob = this.subtractYears(this.todayDate, 18);
    console.log("user", this.user);
    this.getLoanCategories();
    this.getLoanTypes();
    this.getLoanStatuses();
    // this.getLoanSchemes();
    this.getPartners();
    this.getMafilScoreFields();
    this.getLoanProductCategories();
    // this.getLoanProductSubCategories();
    this.getAddressRelations();
    this.getBankList();
    if (this.from && this.from == 'create') {
      this.customerDetailsPanel = false;
      this.kycDetailsPanel = true;
    }
    console.log("Coming to Products outside", this.productCategoryId, this.productSubCategoryId)
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.banksList.filter(option => option.bankName.toLowerCase().includes(filterValue));
  }



  subtractYears(date, years) {
    date.setFullYear(date.getFullYear() - years);
    return date;
  }

  getMafilScoreFields() {
    this.cdlService.mafilScoreFields().subscribe((data: any) => {
      this.mafilScoreFields = data;
    })
  }

  getAddressRelations() {
    this.cdlService.getAddressRelations().subscribe((data: any) => {
      this.addressRelations = data;
    })
  }


  getLoanCategories() {
    this.cdlService.getLoanCategoryList().subscribe((data) => {
      this.loanCategories = data;
    })
  }

  getLoanProductCategories() {
    this.cdlService.getLoanProductCategoryList().subscribe((data) => {
      this.loanProductCategories = data;
    })
  }


  getLoanProductSubCategories(id) {
    this.cdlService.getLoanProductSubCategoryList(id).subscribe((data) => {
      this.loanProductSubCategories = data;
    })
  }

  getLoanSchemes() {
    this.cdlService.getLoanSchemes().subscribe((data) => {
      this.loanSchemes = data;
      console.log("this.loanSchemes", this.loanSchemes)
    })
  }


  getBusinessProfile() {
    this.cdlService.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      console.log("this.businessDetails", this.businessDetails)
    })
  }


  getBankList() {
    this.cdlService.getBankList().subscribe((data) => {
      this.banksList = data;
      console.log("this.banksList", this.banksList)
    })
  }


  getLoanTypes() {
    this.cdlService.getLoanTypeList().subscribe((data) => {
      this.loanTypes = data;
      console.log("this.loanTypes", this.loanTypes)
    })
  }

  getLoanStatuses() {
    this.cdlService.getLoanStatuses().subscribe((data) => {
      this.loanStatuses = data;
      console.log("this.loanStatuses", this.loanStatuses)
    })
  }


  getLoanProducts(categoryId, subCategoryId) {
    this.cdlService.getLoanProducts(categoryId, subCategoryId).subscribe((data) => {
      this.loanProducts = data;
      console.log("this.loanProducts", this.loanProducts)
    })
  }

  getCustomerDetails(filter) {
    this.cdlService.getCustomerDetails(filter).subscribe((data) => {
      this.customerDetails = data;
      // if (this.customerDetails && this.customerDetails.length != 0) {
      //   console.log("this.customerDetails", this.customerDetails)
      //   if (this.customerDetails[0].firstName) {
      //     this.createLoan.controls.firstname.setValue(this.customerDetails[0].firstName);
      //   }
      //   if (this.customerDetails[0].lastName) {
      //     this.createLoan.controls.lastname.setValue(this.customerDetails[0].lastName);
      //   }
      //   if (this.customerDetails[0] && this.customerDetails[0].email) {
      //     this.createLoan.controls.email.setValue(this.customerDetails[0].email)
      //   }
      //   if (this.customerDetails[0] && this.customerDetails[0].address) {
      //     this.createLoan.controls.permanentaddress1.setValue(this.customerDetails[0].address)
      //   }
      //   if (this.customerDetails[0] && this.customerDetails[0].dob) {
      //     this.createLoan.controls.dob.setValue(this.customerDetails[0].dob)
      //   }
      //   if (this.customerDetails[0] && this.customerDetails[0].id) {
      //     this.customerId = this.customerDetails[0].id;
      //   }
      // }
      // else {
      //   this.createLoan.controls.name.setValue("")
      //   this.createLoan.controls.email.setValue("")
      // }
    })
  }


  fillCustomerDetails(data) {
    this.customerDetails = data;
    if (this.customerDetails) {
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
        if (this.customerDetails[0] && this.customerDetails[0].dob) {
          this.createLoan.controls.dob.setValue(this.customerDetails[0].dob)
        }
        if (this.customerDetails[0] && this.customerDetails[0].id) {
          this.customerId = this.customerDetails[0].id;
        }
      }
      else {
        this.createLoan.controls.name.setValue("")
        this.createLoan.controls.email.setValue("")
      }
    }
  }

  expandAll() {
    this.customerDetailsPanel = true;
    this.kycDetailsPanel = true;
    this.loanDetailsPanel = true;
    this.otherDetailsPanel = true;
    this.bankDetailsPanel = true;
    this.allPanelsExpanded = true;
  }

  closeAll() {
    this.customerDetailsPanel = false;
    this.kycDetailsPanel = false;
    this.loanDetailsPanel = false;
    this.otherDetailsPanel = false;
    this.bankDetailsPanel = false;
    this.allPanelsExpanded = false;

  }

  mafilEmployeeStatus() {
    this.mafilEmployee = this.createLoan.controls.employee.value;
    console.log(this.mafilEmployee)
  }

  subventionLoanStatus() {
    this.subventionLoan = this.createLoan.controls.subventionLoan.value;
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


  getImagefromUrl(url, file) {
    if (file.fileType == 'pdf') {
      return './assets/images/pdf.png';
    } else if (file.fileType == 'application/vnd.ms-excel' || file.fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return './assets/images/xls.png';
    } else if (file.fileType == 'audio/mp3' || file.fileType == 'audio/mpeg' || file.fileType == 'audio/ogg') {
      return './assets/images/audio.png';
    } else if (file.fileType == 'video/mp4' || file.fileType == 'video/mpeg') {
      return './assets/images/video.png';
    } else if (file.fileType == 'application/msword' || file.fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.fileType.includes('docx') || file.fileType.includes('doc')) {
      return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
    } else if (file.fileType.includes('txt')) {
      return './assets/images/ImgeFileIcon/docTxt.png';
    } else {
      return url;
    }
  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }

  saveAsLead() {


    // if (this.addresscheck) {
    //   this.createLoan.controls.currentaddress1.setValue(this.createLoan.controls.permanentAddress1.value);
    //   this.createLoan.controls.currentaddress2.setValue(this.createLoan.controls.permanentAddress2.value);
    //   this.createLoan.controls.currentcity.setValue(this.createLoan.controls.permanentCity.value);
    //   this.createLoan.controls.currentstate.setValue(this.createLoan.controls.permanentState.value);
    //   this.createLoan.controls.currentpincode.setValue(this.createLoan.controls.permanentPin.value);
    // }
    // if (this.createLoan.controls.name.value) {
    //   let nameVal = this.createLoan.controls.name.value;
    //   const name = nameVal.split(" ");
    //   this.firstName = name[0];
    //   if (name[1]) {
    //     this.lastName = name[1];
    //   }
    //   else {
    //     this.lastName = "";
    //   }
    // }
    this.loanApplication = {
      "customer": {
        "firstName": this.createLoan.controls.firstname.value,
        "lastName": this.createLoan.controls.lastname.value,
        "phoneNo": this.createLoan.controls.phone.value,
        "email": this.createLoan.controls.email.value,
        "dob": this.createLoan.controls.dob.value,
        "gender": this.createLoan.controls.gender.value,
        "countryCode": "+91"
      },
      "type": { "id": this.createLoan.controls.loantype.value },
      "loanProducts": this.loanProductsSelected,
      "category": { "id": this.createLoan.controls.category.value },
      "productCategoryId": this.createLoan.controls.productcategory.value,
      "productSubCategoryId": this.createLoan.controls.productsubcategory.value,
      "location": { "id": this.user.bussLocs[0] },
      "partner": { "id": this.createLoan.controls.dealer.value },
      "locationArea": this.createLoan.controls.permanentcity.value,
      "invoiceAmount": this.createLoan.controls.totalpayment.value,
      "downpaymentAmount": this.createLoan.controls.downpayment.value,
      "requestedAmount": this.createLoan.controls.loanamount.value,
      "remarks": this.createLoan.controls.remarks.value,
      "emiPaidAmountMonthly": this.createLoan.controls.emicount.value,
      "employee": this.mafilEmployee,
      "subventionLoan": this.createLoan.controls.subventionLoan.value,
      "employeeCode": this.createLoan.controls.employeeCode.value,
      "loanApplicationKycList": [
        {
          "isCoApplicant": false,
          "maritalStatus": this.createLoan.controls.martialstatus.value,
          "pan": this.createLoan.controls.pannumber.value,
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
          "employmentStatus": this.createLoan.controls.employmenttype.value,
          "monthlyIncome": this.createLoan.controls.salary.value,
          "nomineeType": this.createLoan.controls.nomineetype.value,
          "nomineeName": this.createLoan.controls.nomineename.value,
          "nomineeDob": this.createLoan.controls.nomineeDob.value,
          "nomineePhone": this.createLoan.controls.nomineePhone.value,
          "customerEducation": this.createLoan.controls.customerEducation.value,
          "customerEmployement": this.createLoan.controls.customerEmployement.value,
          "salaryRouting": this.createLoan.controls.salaryRouting.value,
          "familyDependants": this.createLoan.controls.familyDependants.value,
          "earningMembers": this.createLoan.controls.earningMembers.value,
          "existingCustomer": this.createLoan.controls.existingCustomer.value,
          "noOfYearsAtPresentAddress": this.createLoan.controls.noOfYearsAtPresentAddress.value,
          "currentResidenceOwnershipStatus": this.createLoan.controls.currentResidenceOwnershipStatus.value,
          "ownedMovableAssets": this.createLoan.controls.ownedMovableAssets.value,
          "vehicleNo": this.createLoan.controls.vehicleNo.value,
          "goodsFinanced": this.createLoan.controls.goodsFinanced.value,
          "permanentRelationType": this.createLoan.controls.permanentRelationType.value,
          "permanentRelationName": this.createLoan.controls.permanentRelationName.value,
          "currentRelationType": this.createLoan.controls.currentRelationType.value,
          "currentRelationName": this.createLoan.controls.currentRelationName.value,
          "guarantorName": this.createLoan.controls.guarantorName.value,
          "guarantorDob": this.createLoan.controls.guarantorDob.value,
          "guarantorType": this.createLoan.controls.guarantorType.value,
          "guarantorPhone": this.createLoan.controls.guarantorPhone.value
        }
      ]
    }


    if (this.loanApplication) {
      if (this.action == "update") {

        if (this.loanData && this.loanData.status && this.loanData.status.id) {
          this.loanApplication['status'] = {
            "id": this.loanData.status.id
          };
        }
        if (this.loanData && this.loanData.customer && this.loanData.customer.id) {
          this.loanApplication.customer['id'] = this.loanData.customer.id;
        }
        if (this.loanData && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].id) {
          this.loanApplication.loanApplicationKycList[0]['id'] = this.loanData.loanApplicationKycList[0].id;
        }
        this.cdlService.updateLoan(this.loanId, this.loanApplication).subscribe((s3urls: any) => {
          this.snackbarService.openSnackBar("Loan Application Updated Successfully")
          this.router.navigate(['provider', 'cdl', 'loans']);

        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
        console.log("response");
      }
      else {
        console.log(this.filesToUpload);

        for (let i = 0; i < this.filesToUpload.length; i++) {
          this.filesToUpload[i]['order'] = i;
          if (this.filesToUpload[i]["type"] == 'aadhar') {
            this.loanApplication.loanApplicationKycList[0]['aadhaarAttachments'] = [];
            this.loanApplication.loanApplicationKycList[0]['aadhaarAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'pan') {
            this.loanApplication.loanApplicationKycList[0]['panAttachments'] = [];
            this.loanApplication.loanApplicationKycList[0]['panAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'photo') {
            this.loanApplication['consumerPhoto'] = [];
            this.loanApplication['consumerPhoto'].push(this.filesToUpload[i]);
          }
        }

        console.log("Loan Application Data : ", this.loanApplication)


        this.cdlService.createLoan(this.loanApplication).subscribe((s3urls: any) => {
          console.log("response", s3urls);
          if (s3urls.attachmentsUrls.length > 0) {
            this.uploadAudioVideo(s3urls['attachmentsUrls']).then(
              (dataS3Url) => {
                console.log(dataS3Url);
              });
          }
          this.bankDetails = {
            "originUid": s3urls.uid,
            "loanApplicationUid": s3urls.uid,
            "bankName": this.createLoan.controls.bank.value,
            "bankAccountNo": this.createLoan.controls.account.value,
            "bankIfsc": this.createLoan.controls.ifsc.value,
            "bankAccountVerified": true
          }
          this.cdlService.saveBankDetails(this.bankDetails).subscribe((data) => {
            console.log("this.loanProducts", this.loanProducts);
            this.snackbarService.openSnackBar("Loan Application Created Successfully")
            this.router.navigate(['provider', 'cdl', 'loans']);
          }), (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          }
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
    }
  }


  scoreCalculate(score) {
    this.calculatedMafilScore = this.calculatedMafilScore + score;
  }

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
      _this.cdlService.videoaudioS3Upload(file, url)
        .subscribe(() => {
          resolve(true);
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }


  getPartners() {
    let api_filter = {
      'isApproved-eq': true,
      'isActive-eq': true
    }
    this.cdlService.getDealersByFilter(api_filter).subscribe((data) => {
      this.dealers = data;
      console.log("this.dealers", this.dealers)
    })
  }


  goBack() {
    this.location.back();
  }

  goNext() {
    this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
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
            owner: this.partnerId,
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
      let data = {
        "id": this.loanData.id,
        "uid": this.loanId,
        "remarks": this.createLoan.controls.remarks.value
      }
      this.cdlService.saveRemarks(data).subscribe((data: any) => {
        if (data) {
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
                this.cdlService.ApprovalRequest(this.loanId).subscribe((data: any) => {
                  if (data.isAutoApproval && data.isApproved) {
                    const navigationExtras: NavigationExtras = {
                      queryParams: {
                        type: 'autoapproved',
                        uid: this.loanId
                      }
                    }
                    this.snackbarService.openSnackBar("Loan Auto Approved");
                    this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
                  }
                  else if (!data.isAutoApproval && data.isApproved) {
                    const navigationExtras: NavigationExtras = {
                      queryParams: {
                        type: 'approved',
                        uid: this.loanId
                      }
                    }
                    this.snackbarService.openSnackBar("Loan Application Submitted.Waiting for Credit Officers Approval");
                    this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
                  }
                  else if (!data.isAutoApproval && data.isApproved) {
                    const navigationExtras: NavigationExtras = {
                      queryParams: {
                        type: 'approved',
                        uid: this.loanId
                      }
                    }
                    this.snackbarService.openSnackBar("Loan Application Submitted.Waiting for Credit Officers Approval");
                    this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
                  }
                  else if (!data.isAutoApproval && !data.isApproved) {
                    const navigationExtras: NavigationExtras = {
                      queryParams: {
                        type: 'rejected',
                        uid: this.loanId
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
        else {
          this.snackbarService.openSnackBar("Failed to Check Eligibility", { 'panelClass': 'snackbarerror' })
        }
      })
    }
  }

  verifyotp() {

    if (!this.createLoan.controls.firstname.value || (this.createLoan.controls.firstname.value && this.createLoan.controls.firstname.value == '')) {
      this.snackbarService.openSnackBar("Please Enter Customer Firstname", { 'panelClass': 'snackbarerror' });
      return false
    }

    if (!this.createLoan.controls.lastname.value || (this.createLoan.controls.lastname.value && this.createLoan.controls.lastname.value == '')) {
      this.snackbarService.openSnackBar("Please Enter Customer Lastname", { 'panelClass': 'snackbarerror' });
      return false
    }

    if (!this.createLoan.controls.dob.value || (this.createLoan.controls.dob.value && this.createLoan.controls.dob.value == '')) {
      this.snackbarService.openSnackBar("Please Enter Date of Birth", { 'panelClass': 'snackbarerror' });
      return false
    }

    if (!this.createLoan.controls.gender.value || (this.createLoan.controls.gender.value && this.createLoan.controls.gender.value == '')) {
      this.snackbarService.openSnackBar("Please Select Gender", { 'panelClass': 'snackbarerror' });
      return false
    }


    if (this.createLoan.controls.phone.value && this.createLoan.controls.phone.value != '' && this.createLoan.controls.phone.value.length == 10) {
      let can_remove = false;
      if (this.createLoan.controls.firstname.value && this.createLoan.controls.lastname.value) {
        this.nameData = {
          "firstName": this.createLoan.controls.firstname.value,
          "lastName": this.createLoan.controls.lastname.value,
          "dob": this.createLoan.controls.dob.value,
          "gender": this.createLoan.controls.gender.value,
        }
      }

      if (this.enquireUid) {
        this.nameData['enquireUid'] = this.enquireUid
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
            if (result.customerData) {
              this.customerData = result.customerData
              console.log("this.customerData", this.customerData)
            }
            const filter = { 'phoneNo-eq': this.createLoan.controls.phone.value };
            this.getCustomerDetails(filter);
            const navigationExtras: NavigationExtras = {
              queryParams: {
                id: this.loanId,
                action: 'update'
              }
            };
            console.log("Navigation", navigationExtras)
            this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras);
          }
        }
      });
      return can_remove;
    }
    else {
      this.snackbarService.openSnackBar("Please Enter a Valid Mobile Number", { 'panelClass': 'snackbarerror' });
    }
  }



  verifyGuarantorotp() {
    if (this.createLoan.controls.guarantorPhone.value && this.createLoan.controls.guarantorPhone.value != '' && this.createLoan.controls.guarantorPhone.value.length == 10) {
      let can_remove = false;
      if (this.createLoan.controls.guarantorName.value) {
        this.nameData = {
          "firstName": this.createLoan.controls.guarantorName.value,
          "dob": this.createLoan.controls.guarantorDob.value
        }
      }

      const dialogRef = this.dialog.open(OtpVerifyComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          type: 'Mobile Number',
          data: this.nameData,
          from: 'guarantor',
          id: this.loanId,
          kycid: this.loanApplicationKycId,
          phoneNumber: this.createLoan.controls.guarantorPhone.value
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.msg == "success") {
            this.guarantorVerification = true;
            // this.loanId = result.uid;
            // const filter = { 'phoneNo-eq': this.createLoan.controls.guarantorPhone.value };
            // this.getCustomerDetails(filter);
            // const navigationExtras: NavigationExtras = {
            //   queryParams: {
            //     id: this.loanId,
            //     action: 'update'
            //   }
            // };
            // console.log("Navigation", navigationExtras)
            // this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras);
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
    this.cdlService.getCustomerDetails(filter).subscribe((data) => {
      this.customerDetails = data;
      if (this.customerDetails[0] && this.customerDetails[0].id) {
        this.customerId = this.customerDetails[0].id;
      }
      this.loanApplication = {
        "customer": {
          "id": this.customerId,
          "firstName": this.createLoan.controls.firstname.value,
          "lastName": this.createLoan.controls.lastname.value,
          "email": this.createLoan.controls.email.value,
          "dob": this.createLoan.controls.dob.value,
          "gender": this.createLoan.controls.gender.value
        },
        // "assignee": { "id": 139799 },
        "location": { "id": this.user.bussLocs[0] },
        "loanApplicationKycList": [
          {
            "id": 0,
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

    this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {
      console.log('Loan Data', data)
      if (this.loanApplication && data && data.status && data.status.id) {
        this.loanApplication['status'] = { "id": data.status.id };
      }
      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].id) {
        this.loanApplication.loanApplicationKycList[0].id = data.loanApplicationKycList[0].id
        // this.loanApplication.loanApplicationKycList[0]["isCoApplicant"] = false
        this.loanApplicationKycId = data.loanApplicationKycList[0].id
      }
      this.cdlService.updateLoan(this.loanId, this.loanApplication).subscribe((s3urls: any) => {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }

        this.customerDetailsPanel = false;
        this.kycDetailsPanel = true;
        this.customerDetailsVerified = true;
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


  changeMovableAssets(event) {
    if (event.value == 1) {
      this.movableAssets = false
    }
    else {
      this.movableAssets = true
    }
  }



  changeProductCategory(event) {
    this.productCategoryId = event.value;
    this.getLoanProductSubCategories(event.value)
  }

  changeProductSubCategory(event) {
    this.productSubCategoryId = event.value;
    this.getLoanProducts(this.productCategoryId, this.productSubCategoryId)
  }



  refreshAadharVerify() {
    this.cdlService.refreshAadharVerify(this.loanApplicationKycId).subscribe((data: any) => {
      if (data) {
        this.aadharverification = true;
        this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {
          if (data) {
            this.createLoan.controls.permanentaddress1.setValue(data.loanApplicationKycList[0].permanentAddress1);
            this.createLoan.controls.permanentaddress2.setValue(data.loanApplicationKycList[0].permanentAddress2);
            this.createLoan.controls.permanentcity.setValue(data.loanApplicationKycList[0].permanentCity);
            this.createLoan.controls.permanentpincode.setValue(data.loanApplicationKycList[0].permanentPin);
            this.cdlService.getStateByPin(data.loanApplicationKycList[0].permanentPin).subscribe((data: any) => {
              if (data && data.length > 0) {
                this.createLoan.controls.permanentstate.setValue(data[0].state);
              }
              this.verifyingUID = false;
            })
          }
          this.verifyingUID = false;
        })
      }
    });
  }







  idVerification(type) {
    if (this.verification) {
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

      this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {

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

        this.cdlService.verifyIds(type, this.loanApplication).subscribe((s3urls: any) => {
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
    } else {
      this.snackbarService.openSnackBar("Please Verify Phone Number First", { 'panelClass': 'snackbarerror' })
    }



  }





  saveAddress() {
    if (this.addresscheck) {
      this.createLoan.controls.currentaddress1.setValue(this.createLoan.controls.permanentaddress1.value);
      this.createLoan.controls.currentaddress2.setValue(this.createLoan.controls.permanentaddress2.value);
      this.createLoan.controls.currentcity.setValue(this.createLoan.controls.permanentcity.value);
      this.createLoan.controls.currentstate.setValue(this.createLoan.controls.permanentstate.value);
      this.createLoan.controls.currentpincode.setValue(this.createLoan.controls.permanentpincode.value);
      this.createLoan.controls.currentRelationType.setValue(this.createLoan.controls.permanentRelationType.value);
      this.createLoan.controls.currentRelationName.setValue(this.createLoan.controls.permanentRelationName.value);
    }
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
      "currentCity": this.createLoan.controls.currentcity.value,
      "currentState": this.createLoan.controls.currentstate.value,
      "permanentRelationType": this.createLoan.controls.permanentRelationType.value,
      "permanentRelationName": this.createLoan.controls.permanentRelationName.value,
      "currentRelationType": this.createLoan.controls.currentRelationType.value,
      "currentRelationName": this.createLoan.controls.currentRelationName.value
    }

    this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {

      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].id) {
        this.loanApplication["id"] = data.loanApplicationKycList[0].id
      }

      this.cdlService.addressUpdate(this.loanApplication).subscribe((s3urls: any) => {
        this.panelsManage(false, false, true, false);
        this.kycDetailsSaved = true;
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
    console.log(this.loanProductsSelected)
    this.loanApplication = {
      "uid": this.loanId,
      "loanProducts": this.loanProductsSelected,
      "category": {
        "id": this.createLoan.controls.category.value
      },
      "type": {
        "id": this.createLoan.controls.loantype.value
      },
      "productCategoryId": this.createLoan.controls.productcategory.value,
      "productSubCategoryId": this.createLoan.controls.productsubcategory.value,
      // "loanScheme": {
      //   "id": this.schemeSelected.id
      // },
      "partner": {
        "id": this.createLoan.controls.dealer.value
      },
      "montlyIncome": this.createLoan.controls.salary.value,
      "invoiceAmount": this.createLoan.controls.totalpayment.value,
      "downpaymentAmount": this.createLoan.controls.downpayment.value,
      "requestedAmount": this.createLoan.controls.loanamount.value,
      "emiPaidAmountMonthly": this.createLoan.controls.emicount.value,
      "employee": this.mafilEmployee,
      "subventionLoan": this.createLoan.controls.subventionLoan.value,
      "employeeCode": this.createLoan.controls.employeeCode.value,
      "loanApplicationKycList": [
        {
          "employmentStatus": this.createLoan.controls.employmenttype.value,
          "monthlyIncome": this.createLoan.controls.salary.value,
          "nomineeType": this.createLoan.controls.nomineetype.value,
          "nomineeName": this.createLoan.controls.nomineename.value,
          "nomineeDob": this.createLoan.controls.nomineeDob.value,
          "nomineePhone": this.createLoan.controls.nomineePhone.value,
          "customerEducation": this.createLoan.controls.customerEducation.value,
          "customerEmployement": this.createLoan.controls.customerEmployement.value,
          "salaryRouting": this.createLoan.controls.salaryRouting.value,
          "familyDependants": this.createLoan.controls.familyDependants.value,
          "earningMembers": this.createLoan.controls.earningMembers.value,
          "existingCustomer": this.createLoan.controls.existingCustomer.value,
          "noOfYearsAtPresentAddress": this.createLoan.controls.noOfYearsAtPresentAddress.value,
          "currentResidenceOwnershipStatus": this.createLoan.controls.currentResidenceOwnershipStatus.value,
          "ownedMovableAssets": this.createLoan.controls.ownedMovableAssets.value,
          "vehicleNo": this.createLoan.controls.vehicleNo.value,
          "goodsFinanced": this.createLoan.controls.goodsFinanced.value,
          "guarantorName": this.createLoan.controls.guarantorName.value,
          "guarantorDob": this.createLoan.controls.guarantorDob.value,
          "guarantorType": this.createLoan.controls.guarantorType.value,
          "guarantorPhone": this.createLoan.controls.guarantorPhone.value
        }
      ]
    }

    this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {

      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].id) {
        this.loanApplication.loanApplicationKycList[0]["id"] = data.loanApplicationKycList[0].id
      }
      if (data && data.id) {
        this.loanApplication["id"] = data.id
      }
      if (data && data.id) {
        this.loanApplication["id"] = data.id
      }

      if (this.user && this.user.partnerId) {
        this.loanApplication["partner"] = { 'id': this.user.partnerId }
      }

      this.cdlService.loanDetailsSave(this.loanApplication).subscribe((s3urls: any) => {
        this.panelsManage(false, false, false, true);
        this.loanDetailsSaved = true;
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


  productSelect(values) {
    console.log(values)
    this.loanProductsSelected = values.map((data) => {
      return { "id": data.id, "categoryId": data.category.id, "typeId": data.type.id }
    })

    console.log(this.loanProductsSelected)
  }


  refreshBankDetails() {

  }

  verifyBankDetails() {
    const verifyBank = {
      "bankName": this.bankListName,
      "bankAccountNo": this.createLoan.controls.account.value,
      "bankIfsc": this.createLoan.controls.ifsc.value
    }

    if (this.loanId) {
      verifyBank['originUid'] = this.loanId
      verifyBank['loanApplicationUid'] = this.loanId
    }

    this.cdlService.verifyBankDetails(verifyBank).subscribe((data: any) => {
      if (data) {
        this.cdlService.getBankDetailsById(this.loanId).subscribe((bankInfo) => {
          this.bankData = bankInfo;
        });
        this.bankDetailsVerified = true;
        this.accountaggregating = true;
      }
      this.snackbarService.openSnackBar("Bank Details Verified Successfully");

    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }


  aggregateAccount() {
    this.cdlService.accountAggregate(this.loanId, 0).subscribe((data: any) => {
      if (data) {
        this.accountaggregating = false;
        this.snackbarService.openSnackBar("We have sent you a link for Account Aggregation Please gohead and verify your details")
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }




  saveBankDetails() {
    this.bankDetails = {
      "originUid": this.loanId,
      "loanApplicationUid": this.loanId,
      "bankName": this.bankListName,
      "bankAccountNo": this.createLoan.controls.account.value,
      "bankIfsc": this.createLoan.controls.ifsc.value
    }

    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'bank') {
        this.bankDetails['bankStatementAttachments'] = [];
        this.bankDetails['bankStatementAttachments'].push(this.filesToUpload[i]);
      }
    }

    if (this.bankData == null) {
      this.cdlService.saveBankDetails(this.bankDetails).subscribe((s3urls: any) => {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        this.cdlService.getBankDetailsById(this.loanId).subscribe((bankInfo) => {
          this.bankData = bankInfo;
        });
        this.bankDetailsSaved = true;
        this.snackbarService.openSnackBar("Bank Details Saved Successfully")

      }), (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }
    }
    else {

      this.cdlService.updateBankDetails(this.bankDetails).subscribe((s3urls: any) => {
        console.log("Coming Here")

        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        this.bankDetailsSaved = true;
        this.snackbarService.openSnackBar("Bank Details Saved Successfully")

      }), (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }
    }


  }

  verifyEmail() {
    if (this.verification) {
      if (this.createLoan.controls.email.value && this.createLoan.controls.email.value.includes('@') && this.createLoan.controls.email.value.includes('.')) {
        if (this.createLoan.controls.email.value != '') {
          const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
          const isEmail = emailPattern.test(this.createLoan.controls.email.value);
          if (!isEmail) {
            this.snackbarService.openSnackBar("Please Enter a Valid Email Id", { 'panelClass': 'snackbarerror' });
            return false
          }

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
      else {
        this.snackbarService.openSnackBar("Please Enter a Valid Email Id", { 'panelClass': 'snackbarerror' });
      }
    } else {
      this.snackbarService.openSnackBar("Please Verify Phone Number First", { 'panelClass': 'snackbarerror' });
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
    this.downPayment = Number(event.target.value);
    this.createLoan.controls.loanamount.setValue(this.createLoan.controls.totalpayment.value - this.downPayment)
    if (this.createLoan.controls.loanamount.value > 50000) {
      this.showBankAttachments = true;
    }
    else {
      this.showBankAttachments = false;
    }
    if (this.createLoan.controls.loanamount.value > 100000) {
      this.showCoapplicant = true;
    }
    else {
      this.showCoapplicant = false;
    }
  }

  totalPayment(event) {
    if (Number(event.target.value) > 1000) {
      this.totalPaymentValue = Number(event.target.value);
      this.createLoan.controls.downpayment.setValue(this.createLoan.controls.totalpayment.value * 0.2)
      this.createLoan.controls.loanamount.setValue(this.createLoan.controls.totalpayment.value - this.createLoan.controls.downpayment.value)
    }
    else {
      this.createLoan.controls.downpayment.setValue(0)
      this.createLoan.controls.loanamount.setValue(0)
    }
    if (this.createLoan.controls.loanamount.value > 100000) {
      this.showCoapplicant = true;
    }
    else {
      this.showCoapplicant = false;
    }
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
