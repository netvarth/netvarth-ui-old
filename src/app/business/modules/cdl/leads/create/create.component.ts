import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { CdlService } from '../../cdl.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
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
  createLead: UntypedFormGroup;
  user: any;
  customerDetails: any;
  customerId: any = 0;
  loanId: any;
  loanAmount: any;
  headerText: any = "Create Loan";
  stateList = projectConstantsLocal.INDIAN_STATES;
  btnText: any = "Save as Lead";
  templateData: any;
  defaultTemplate: any;
  categoryId: any;
  enquireUid: any;
  enquireLeadData: any;
  constructor(
    private location: Location,
    private router: Router,
    // private dialog: MatDialog,

    private snackbarService: SnackbarService,
    private createLoanFormBuilder: UntypedFormBuilder,
    private groupService: GroupStorageService,
    private activatedRoute: ActivatedRoute,
    private cdlService: CdlService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      console.log("params", params)
      if (params && params.id) {
        this.enquireUid = params.id;
        const api_filter = {};
        api_filter['loanNature-eq'] = 'ConsumerDurableLoan';
        api_filter['uid-eq'] = this.enquireUid;
        this.cdlService.getLeadsByUid(this.enquireUid).subscribe((data: any) => {
          this.enquireLeadData = data;
          if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.firstName) {
            this.createLead.controls.firstname.setValue(this.enquireLeadData.customer.firstName);
          }
          if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.lastName) {
            this.createLead.controls.lastname.setValue(this.enquireLeadData.customer.lastName);
          }
          if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.phoneNo) {
            this.createLead.controls.phone.setValue(this.enquireLeadData.customer.phoneNo);
          }
          if (this.enquireLeadData && this.enquireLeadData.customer && this.enquireLeadData.customer.email) {
            this.createLead.controls.email.setValue(this.enquireLeadData.customer.email);
          }
          if (this.enquireLeadData && this.enquireLeadData.targetPotential) {
            this.createLead.controls.loanamount.setValue(this.enquireLeadData.targetPotential);
          }
          if (this.enquireLeadData && this.enquireLeadData.customerCity) {
            this.createLead.controls.permanentcity.setValue(this.enquireLeadData.customerCity);
          }
          if (this.enquireLeadData && this.enquireLeadData.customerState) {
            this.createLead.controls.permanentstate.setValue(this.enquireLeadData.customerState);
          }
          if (this.enquireLeadData && this.enquireLeadData.customerPin) {
            this.createLead.controls.permanentpincode.setValue(this.enquireLeadData.customerPin);
          }
          if (this.enquireLeadData && this.enquireLeadData.aadhaar) {
            this.createLead.controls.aadhar.setValue(this.enquireLeadData.aadhaar);
          }
          if (this.enquireLeadData && this.enquireLeadData.pan) {
            this.createLead.controls.pan.setValue(this.enquireLeadData.pan);
          }
        });
      }
    });
    this.createLead = this.createLoanFormBuilder.group({
      phone: [null],
      firstname: [null],
      lastname: [null],
      email: [null],
      permanentcity: [null],
      permanentstate: [null],
      permanentpincode: [null],
      loanamount: [null],
      aadhar: [null],
      pan: [null]
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
  }

  saveAsLead() {
    let customer = {
      "firstName": this.createLead.controls.firstname.value,
      "lastName": this.createLead.controls.lastname.value,
      "phoneNo": this.createLead.controls.phone.value,
      "email": this.createLead.controls.email.value,
      "countryCode": "+91"
    }

    const filter = { 'phoneNo-eq': this.createLead.controls.phone.value };
    this.cdlService.getCustomerDetails(filter).subscribe((data) => {
      this.customerDetails = data;
      if (this.customerDetails[0] && this.customerDetails[0].id) {
        this.customerId = this.customerDetails[0].id;
        this.createEnquire(this.customerId)
      }
      else {
        this.cdlService.createCustomer(customer).subscribe((data) => {
          this.customerId = data;
          this.createEnquire(this.customerId)
        });
      }
    });

  }

  createEnquire(customerId) {
    if (customerId) {
      this.cdlService.getCdlEnquireTemplate('ConsumerDurableLoan').subscribe((data) => {
        this.templateData = data;
        if (data && data[0]) {
          this.defaultTemplate = data[0];
          if (this.defaultTemplate && this.defaultTemplate.category && this.defaultTemplate.category.value && this.defaultTemplate.category.value.id) {
            this.categoryId = this.defaultTemplate.category.value.id;
          }
          if (this.defaultTemplate) {
            let enquireData = {
              "category": { "id": this.categoryId },
              "customer": { "id": customerId },
              "customerCity": this.createLead.controls.permanentcity.value,
              "aadhaar": this.createLead.controls.aadhar.value,
              "pan": this.createLead.controls.pan.value,
              "customerState": this.createLead.controls.permanentstate.value,
              "customerPin": this.createLead.controls.permanentpincode.value,
              "location": { "id": this.user.bussLocs[0] },
              "enquireMasterId": this.defaultTemplate.id,
              "targetPotential": this.createLead.controls.loanamount.value
            }

            console.log(enquireData)
            this.cdlService.createEnquire(enquireData).subscribe((data) => {
              if (data) {
                this.snackbarService.openSnackBar("Lead Created Successfully")
                this.router.navigate(['provider', 'cdl', 'leads']);
              }
            }, (error) => {
              console.log('error', error)
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
          }
        }
      });
    }
  }

  convertToLoan() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'enquire',
        enquireId: this.enquireUid
      }
    }
    this.router.navigate(['provider', 'cdl', 'loans', 'create'], navigationExtras);
  }

  resetErrors() {

  }

  goBack() {
    this.location.back();
  }

  goNext() {
    this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
  }
}
