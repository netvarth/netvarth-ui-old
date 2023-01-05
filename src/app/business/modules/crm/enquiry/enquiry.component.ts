import { Component, HostListener, OnInit } from '@angular/core';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CrmService } from '../crm.service';
import { UntypedFormBuilder } from '@angular/forms';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class enquiryComponent implements OnInit {
  public headerName: any;
  public api_loading: boolean = true;
  public customer_label: any;
  public createEnquiryForm: any;
  public searchby: any = '';
  public innerWidth: any;
  public templateList: any = [];
  public activityList: any = [];
  public activityTitleDialogValue: any = 'None';
  public activityIdDialogValue: any;
  public activityLocationIdDialogValue: any;
  public activityOriginUidDialogValue: any;
  public categoryList: any = [];
  public emptyFielderror = false;
  public qParams: {};
  public form_data: any;
  public newDateFormat: any = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  public prefillnewCustomerwithfield: any = '';
  private onDestroy$: Subject<void> = new Subject<void>();
  public customer_data: any;
  public show_customer: boolean = false;
  public create_customer: boolean = false;
  public disabledNextbtn: boolean = true;
  public hideSearch: boolean = false;
  public jaldeeId: any;
  public formMode: any
  public countryCode: any;
  public customer_email: any;
  public enquiryErrorMsg: string = '';
  public enquiryTemplateId: any;
  public customerActivityText: any = 'New'
  public enquiryDefultFormControl: any;
  public enterFirstName: string = 'Enter First Name';
  public enterSecondName: string = 'Enter Second Name';
  public enterPhoNeNo: string = 'Enter Phone No';
  public enterEmailId: string = 'Enter Email Id';
  public selectProduct: string = 'Select Product';
  public enquiryArr: any = [];
  public activityListTitleDialogValue: any;
  public activityListDescriptionDialogValue: any;
  public activityListCategoryDialogValue: any;
  public activityListTypeDialogValue: any
  public activityListStatusDialogValue: any
  public activityListpriorityDialogValue: any;
  public enquiryCreateIdAfterRes: any;
  public enterproposedAmount: string = 'Enter Propsed Amount'
  public sourcingChannelPlaceholder: string = 'None';
  public sourcingChhannelCatList: any = [];
  sourcingChhannelCatListNew: any = []
  errorMsg: string;
  api_loading_SearchCustomer: boolean;
  fieldValue: any = '';
  customerData: any;
  constructor(
    private locationobj: Location,
    private router: Router,
    private crmService: CrmService,
    private createEnquiryFB: UntypedFormBuilder,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private provider_services: ProviderServices,
  ) {

  }
  ngOnInit(): void {
    this.api_loading = false;
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.activityLocationIdDialogValue = user.bussLocs[0];
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.headerName = 'Create Enquiry';
    this.createEnquiryForm = this.createEnquiryFB.group({
      enquiryDetails: [''],
      firstNameValue: [''],
      lastNameValue: [''],
      phoneNoValue: [''],
      emailValue: [''],
      userTaskCategory: [''],
      proposedAmount: [100000],
      sourcingChannel: ['']

    })
    this.enquiryCategoryList()
    this.getTemplateEnuiry()
    this.sourcingChannelCategory()
    this.onReSize()
  }
  @HostListener('window:resize', ['$event'])
  onReSize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.placeholderTruncate(this.customer_label)
    }
    else {
      this.searchby = 'Search by ' + this.customer_label + ' id/name/email/phone number';
    }
  }
  placeholderTruncate(value: string, completeWords = true,) {
    const labelTerm = value.substring(0, 4)
    this.searchby = 'Search by ' + labelTerm + ' id/name/phone #';
    return `${value.substring(0, 4)}`;
  }
  sourcingChannelCategory() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.enquiryCategory().subscribe((cat: any) => {
        resolve(cat)
        _this.sourcingChhannelCatList.push(cat)
      },
        ((error) => {
          reject(error)
        }))
    })

  }
  goback() {
    this.locationobj.back();
  }
  enquiryDetailsInput(value: any, event) {
    this.fieldValue = value;
    if (!value) {
      this.customerActivityText = 'New';
      this.inquiryFormPatchValue()
      this.enableFormControl()
    }
    else {
      this.errorMsg = '';
    }
  }
  validationField(event?) {
    if (event) {
      if (this.fieldValue) {
        let charCodeEnter = event.keyCode;
        let charkeyName = event.key
        if (charCodeEnter === 13 && charkeyName === 'Enter') {
          this.searchCustomer()
        }
      }
    }

  }
  searchCustomer(event?) {
    this.api_loading_SearchCustomer = true;
    // console.log('this.customer_data', this.customer_data);
    setTimeout(() => {
      this.api_loading_SearchCustomer = false;
      if (this.customer_data = []) {
        this.inquiryFormPatchValue()
      }
      this.emptyFielderror = false;
      if (this.createEnquiryForm.controls.enquiryDetails.value && this.createEnquiryForm.controls.enquiryDetails.value === '') {
        this.emptyFielderror = true;
      }
      else {
        this.qParams = {};
        let mode = 'id';
        this.form_data = null;
        let post_data = {};
        const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
        const isEmail = emailPattern.test(this.createEnquiryForm.controls.enquiryDetails.value);
        if (isEmail) {
          mode = 'email';
          this.prefillnewCustomerwithfield = 'email';
        } else {
          const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
          const isNumber = phonepattern.test(this.createEnquiryForm.controls.enquiryDetails.value);
          const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
          const isCount10 = phonecntpattern.test(this.createEnquiryForm.controls.enquiryDetails.value);
          if (isNumber && isCount10) {
            mode = 'phone';
            this.prefillnewCustomerwithfield = 'phone';
          }
          else if (isNumber && this.createEnquiryForm.controls.enquiryDetails.value.length > 7) {
            mode = 'phone';
            this.prefillnewCustomerwithfield = 'phone';
          } else if (isNumber && this.createEnquiryForm.controls.enquiryDetails.value.length < 7) {
            mode = 'id';
            this.prefillnewCustomerwithfield = 'id';
          }
        }
        switch (mode) {
          case 'phone':
            post_data = {
              'phoneNo-eq': this.createEnquiryForm.controls.enquiryDetails.value
            };
            this.qParams['phone'] = this.createEnquiryForm.controls.enquiryDetails.value;
            break;
          case 'email':
            post_data = {
              'email-eq': this.createEnquiryForm.controls.enquiryDetails.value
            };
            this.qParams['email'] = this.createEnquiryForm.controls.enquiryDetails.value;
            break;
          case 'id':
            post_data['or=jaldeeId-eq'] = this.createEnquiryForm.controls.enquiryDetails.value + ',firstName-eq=' + this.createEnquiryForm.controls.enquiryDetails.value;
            break;
        }
        const _this = this;
        return new Promise((resolve, reject) => {
          _this.provider_services.getCustomer(post_data)
            .pipe(takeUntil(_this.onDestroy$))
            .subscribe(
              (data: any) => {
                resolve(data);
                _this.enquiryArr = data;
                if (data.length === 0) {
                  _this.defaultPlaceHolder()
                  _this.errorMsg = 'Customer not found, Please create customer and continue';
                  _this.createEnquiryForm.patchValue({
                    enquiryDetails: ''
                  })
                }
                _this.customer_data = [];
                if (data.length === 0) {
                  _this.show_customer = false;
                  _this.create_customer = true;
                  _this.defaultPlaceHolder()
                  _this.errorMsg = 'Customer not found, Please create customer and continue';
                  _this.disableFormControl()
                  _this.createEnquiryForm.patchValue({
                    enquiryDetails: ''
                  })
                } else {
                  _this.disableFormControl()
                  _this.inquiryFormPatchValue(data[0]);
                  _this.customerActivityText = 'View'
                  if (data.length > 1) {
                    _this.customer_data = data[0];
                    _this.hideSearch = true;
                  } else {
                    _this.customer_data = data[0];
                    if (_this.customer_data) {
                      _this.hideSearch = true;
                    }
                  }
                  _this.disabledNextbtn = false;
                  _this.jaldeeId = _this.customer_data.jaldeeId;
                  _this.show_customer = true;
                  _this.create_customer = false;
                  _this.formMode = data.type;
                  if (_this.customer_data.countryCode && _this.customer_data.countryCode !== '+null') {
                    _this.countryCode = _this.customer_data.countryCode;
                  } else {
                    _this.countryCode = '+91';
                  }
                  if (_this.customer_data.email && _this.customer_data.email !== 'null') {
                    _this.customer_email = _this.customer_data.email;
                  }

                  if (_this.customer_data.jaldeeId && _this.customer_data.jaldeeId !== 'null') {
                    _this.jaldeeId = _this.customer_data.jaldeeId;
                  }
                  if (_this.customer_data.firstName && _this.customer_data.firstName !== 'null') {
                    _this.jaldeeId = _this.customer_data.firstName;
                  }
                }
              },
              (error) => {
                // console.log('werror1:::::::::::::::')
                reject(error);
                const manualError: string = 'Please give some valid input'
                _this.snackbarService.openSnackBar(manualError, { 'panelClass': 'snackbarerror' });
                _this.wordProcessor.apiErrorAutoHide(_this, error);
                this.api_loading_SearchCustomer = false;
              }
            )
        })

      }
    }, projectConstants.TIMEOUT_DELAY);

  }
  enquiryCategoryList() {
    this.crmService.getLeadTemplate().subscribe((category: any) => {
      this.categoryList.push(category)
      this.createEnquiryForm.controls.userTaskCategory.setValue(this.categoryList[0][0].id);
    })
  }
  search() {
    this.hideSearch = false;
  }
  saveCreateEnquiry(data) {
    console.log(data);
    this.api_loading = true;
    // console.log(this.router);
    if (data.emailValue === '' && data.enquiryDetails === '' && data.firstNameValue === '' && data.lastNameValue === '' &&
      data.phoneNoValue === '' && data.proposedAmount === 100000 && data.sourcingChannel === '' && data.userTaskCategory === 1) {
      const error = 'Please add customer details';
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.api_loading = false;
    }
    else {
      if (this.createEnquiryForm.controls.proposedAmount.value >= 100000) {
        if (this.enquiryArr.length !== 0 && this.customer_data !== undefined) {
          // console.log('first')
          const createEnquiry: any = {
            "location": { "id": this.activityLocationIdDialogValue },
            "customer": { "id": this.customer_data.id },
            "enquireMasterId": this.enquiryTemplateId,
            "leadMasterId": this.createEnquiryForm.controls.userTaskCategory.value,
            "isLeadAutogenerate": true,
            "originUid": this.activityOriginUidDialogValue,
            "taskMasterId": this.activityIdDialogValue,
            "targetPotential": this.createEnquiryForm.controls.proposedAmount.value,
            "category": { "id": this.createEnquiryForm.controls.sourcingChannel.value }
          }
          if (createEnquiry.category.id === '') {
            const createEnquiry1: any = {
              "location": { "id": this.activityLocationIdDialogValue },
              "customer": { "id": this.customer_data.id },
              "enquireMasterId": this.enquiryTemplateId,
              "leadMasterId": this.createEnquiryForm.controls.userTaskCategory.value,
              "isLeadAutogenerate": true,
              "originUid": this.activityOriginUidDialogValue,
              "taskMasterId": this.activityIdDialogValue,
              "targetPotential": this.createEnquiryForm.controls.proposedAmount.value,
              "category": { "id": this.createEnquiryForm.controls.sourcingChannel.value }
            }
            this.crmService.createEnquiry(createEnquiry1).subscribe((response) => {
              setTimeout(() => {
                this.api_loading = true;
                this.snackbarService.openSnackBar('Successfully created enquiry');
                this.createEnquiryForm.reset();
                this.router.navigate(['provider', 'crm']);
              }, projectConstants.TIMEOUT_DELAY);
            },
              (error) => {
                setTimeout(() => {
                  this.api_loading = false;
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }, projectConstants.TIMEOUT_DELAY);
              })
          }
          else {
            this.crmService.createEnquiry(createEnquiry).subscribe((response) => {
              setTimeout(() => {
                this.api_loading = true;
                this.snackbarService.openSnackBar('Successfully created enquiry');
                this.createEnquiryForm.reset();
                this.router.navigate(['provider', 'crm']);
              }, projectConstants.TIMEOUT_DELAY);
            },
              (error) => {
                setTimeout(() => {
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }, projectConstants.TIMEOUT_DELAY);
                this.api_loading = false;
              })
          }

        }
        else if (this.enquiryArr.length === 0 || this.customer_data === undefined) {
          // console.log('this.enquiryArr.length ===0')
          // console.log('second')
          const afterCompleteAddData: any = {
            "firstName": this.createEnquiryForm.controls.firstNameValue.value,
            "lastName": this.createEnquiryForm.controls.lastNameValue.value,
            "phoneNo": this.createEnquiryForm.controls.phoneNoValue.value,
            "email": this.createEnquiryForm.controls.emailValue.value,
            "countryCode": '+91',
            "userTaskCategory": this.createEnquiryForm.controls.userTaskCategory.value,
            "targetPotential": this.createEnquiryForm.controls.proposedAmount.value,
            "category": { "id": this.createEnquiryForm.controls.sourcingChannel.value }
          }
          this.crmService.getProviderCustomers({ 'phoneNo-eq': this.createEnquiryForm.controls.phoneNoValue.value }).subscribe((data: any) => {
            this.customerData = data;
            if (afterCompleteAddData.category.id === '') {
              console.log("this.customerData if", this.customerData)
              if (this.customerData && this.customerData[0] && this.customerData[0].id) {
                return new Promise((resolve, reject) => {
                  const _this = this;
                  setTimeout(() => {
                    _this.api_loading = true;
                    _this.enquiryCreateIdAfterRes = this.customerData[0].id;
                    const createEnquiry: any = {
                      "location": { "id": _this.activityLocationIdDialogValue },
                      "customer": { "id": _this.enquiryCreateIdAfterRes },
                      "enquireMasterId": _this.enquiryTemplateId,
                      "leadMasterId": _this.createEnquiryForm.controls.userTaskCategory.value,
                      "isLeadAutogenerate": true,
                      "originUid": _this.activityOriginUidDialogValue,
                      "targetPotential": _this.createEnquiryForm.controls.proposedAmount.value,
                      "category": { "id": 0 }
                    }
                    _this.crmService.createEnquiry(createEnquiry).subscribe((response) => {
                      setTimeout(() => {
                        _this.api_loading = true;
                        _this.snackbarService.openSnackBar('Successfully created enquiry');
                        _this.router.navigate(['provider', 'crm']);
                      }, projectConstants.TIMEOUT_DELAY);
                    },
                      (error) => {
                        setTimeout(() => {
                          _this.api_loading = false
                          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        }, projectConstants.TIMEOUT_DELAY);
                      })
                  }, projectConstants.TIMEOUT_DELAY);
                })
              }

              else {
                return new Promise((resolve, reject) => {
                  this.crmService.createProviderCustomer(afterCompleteAddData).subscribe((response: any) => {
                    const _this = this;
                    setTimeout(() => {
                      resolve(response);
                      _this.api_loading = true;
                      _this.enquiryCreateIdAfterRes = response;
                      const createEnquiry: any = {
                        "location": { "id": _this.activityLocationIdDialogValue },
                        "customer": { "id": _this.enquiryCreateIdAfterRes },
                        "enquireMasterId": _this.enquiryTemplateId,
                        "leadMasterId": _this.createEnquiryForm.controls.userTaskCategory.value,
                        "isLeadAutogenerate": true,
                        "originUid": _this.activityOriginUidDialogValue,
                        "targetPotential": _this.createEnquiryForm.controls.proposedAmount.value,
                        "category": { "id": 0 }
                      }
                      _this.crmService.createEnquiry(createEnquiry).subscribe((response) => {
                        setTimeout(() => {
                          _this.api_loading = true;
                          _this.snackbarService.openSnackBar('Successfully created enquiry');
                          _this.router.navigate(['provider', 'crm']);
                        }, projectConstants.TIMEOUT_DELAY);
                      },
                        (error) => {
                          setTimeout(() => {
                            _this.api_loading = false
                            _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                          }, projectConstants.TIMEOUT_DELAY);
                        })
                    }, projectConstants.TIMEOUT_DELAY);
                  },
                    (error) => {
                      this.api_loading = false
                      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
                    })
                })
              }


            }

            else {
              const _this = this;
              console.log("this.customerData else", this.customerData)
              if (this.customerData && this.customerData[0] && this.customerData[0].id) {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    _this.api_loading = true;
                    _this.enquiryCreateIdAfterRes = this.customerData[0].id;
                    const createEnquiry: any = {
                      "location": { "id": _this.activityLocationIdDialogValue },
                      "customer": { "id": _this.enquiryCreateIdAfterRes },
                      "enquireMasterId": _this.enquiryTemplateId,
                      "leadMasterId": _this.createEnquiryForm.controls.userTaskCategory.value,
                      "isLeadAutogenerate": true,
                      "originUid": _this.activityOriginUidDialogValue,
                      "targetPotential": _this.createEnquiryForm.controls.proposedAmount.value,
                      "category": { "id": _this.createEnquiryForm.controls.sourcingChannel.value }
                    }
                    _this.crmService.createEnquiry(createEnquiry).subscribe((response) => {
                      setTimeout(() => {
                        _this.api_loading = true;
                        _this.snackbarService.openSnackBar('Successfully created enquiry');
                        _this.router.navigate(['provider', 'crm']);
                      }, projectConstants.TIMEOUT_DELAY);
                    },
                      (error) => {
                        setTimeout(() => {
                          _this.api_loading = false
                          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        }, projectConstants.TIMEOUT_DELAY);
                      })
                  }, projectConstants.TIMEOUT_DELAY);
                })
              }
              else {
                return new Promise((resolve, reject) => {
                  this.crmService.createProviderCustomer(afterCompleteAddData).subscribe((response: any) => {
                    setTimeout(() => {
                      resolve(response);
                      _this.api_loading = true;
                      _this.enquiryCreateIdAfterRes = response;
                      const createEnquiry: any = {
                        "location": { "id": _this.activityLocationIdDialogValue },
                        "customer": { "id": _this.enquiryCreateIdAfterRes },
                        "enquireMasterId": _this.enquiryTemplateId,
                        "leadMasterId": _this.createEnquiryForm.controls.userTaskCategory.value,
                        "isLeadAutogenerate": true,
                        "originUid": _this.activityOriginUidDialogValue,
                        "targetPotential": _this.createEnquiryForm.controls.proposedAmount.value,
                        "category": { "id": _this.createEnquiryForm.controls.sourcingChannel.value }
                      }
                      _this.crmService.createEnquiry(createEnquiry).subscribe((response) => {
                        setTimeout(() => {
                          _this.api_loading = true;
                          _this.snackbarService.openSnackBar('Successfully created enquiry');
                          _this.router.navigate(['provider', 'crm']);
                        }, projectConstants.TIMEOUT_DELAY);
                      },
                        (error) => {
                          setTimeout(() => {
                            _this.api_loading = false
                            _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                          }, projectConstants.TIMEOUT_DELAY);
                        })
                    }, projectConstants.TIMEOUT_DELAY);
                  },
                    ((error) => {
                      reject(error);
                      _this.api_loading = false
                      _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    })
                  )
                })
              }
            }


          });


        }
      }
      else {
        setTimeout(() => {
          this.api_loading = false;
          this.snackbarService.openSnackBar('Minimum proposed amount is 100000', { 'panelClass': 'snackbarerror' });
        }, projectConstants.TIMEOUT_DELAY);
      }
    }


  }
  getTemplateEnuiry() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getEnquiryTemplate().subscribe((template: any) => {
        resolve(template)
        _this.enquiryTemplateId = template[0].id;
      },
        (error) => {
          reject(error);
        }
      )
    })
  }
  handleNameField(fieldname, value, event: any) {
    if (event) {
      this.errorMsg = '';
      let charCode = event.keyCode;
      if (fieldname === ('firstName') || fieldname === ('lastName')) {
        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8) {
          return true;
        }
        else {
          const error = 'Invalid character at ' + fieldname.charAt(0).toUpperCase() + fieldname.slice(1);;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          return false;
        }
      }
      else if (fieldname === 'phoneNo') {
        if ((charCode >= 48 && charCode < 58)) {
          return true;
        }
        else {
          const error = 'Invalid character at ' + fieldname.charAt(0).toUpperCase() + fieldname.slice(1);;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          return false;
        }
      }
    }

  }
  enableFormControl() {
    this.createEnquiryForm.controls['firstNameValue'].enable()
    this.createEnquiryForm.controls['lastNameValue'].enable();
    this.createEnquiryForm.controls['phoneNoValue'].enable()
    this.createEnquiryForm.controls['emailValue'].enable();
    this.createEnquiryForm.controls['sourcingChannel'].enable()
    this.createEnquiryForm.controls['userTaskCategory'].enable();
    this.createEnquiryForm.controls['proposedAmount'].enable()
  }
  disableFormControl() {
    this.createEnquiryForm.controls['firstNameValue'].disable()
    this.createEnquiryForm.controls['lastNameValue'].disable();
    this.createEnquiryForm.controls['phoneNoValue'].disable()
    this.createEnquiryForm.controls['emailValue'].disable();
    // this.createEnquiryForm.controls['sourcingChannel'].disable()
    // this.createEnquiryForm.controls['userTaskCategory'].disable();
    // this.createEnquiryForm.controls['proposedAmount'].disable()
  }
  defaultPlaceHolder() {
    this.enterFirstName = 'Enter First Name';
    this.enterSecondName = 'Enter Second Name'
    this.enterEmailId = 'Enter Email Name'
    this.enterPhoNeNo = 'Enter Phone No'
    this.customerActivityText = 'New';
    this.selectProduct = 'Select Product';
  }
  inquiryFormPatchValue(data?) {
    if (data) {
      this.createEnquiryForm.patchValue({
        firstNameValue: data.firstName,
        lastNameValue: data.lastName,
        phoneNoValue: data.phoneNo,
        emailValue: data.email,
      })
    } else {
      this.createEnquiryForm.patchValue({
        firstNameValue: '',
        lastNameValue: '',
        phoneNoValue: '',
        emailValue: '',
      })
    }
  }

}