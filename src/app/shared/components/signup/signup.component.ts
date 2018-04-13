import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  // styleUrls: ['./home.component.scss']
})
export class SignUpComponent implements OnInit {

  business_domains ;
  packages ;
  subDomainList = [];
  dropdownSettings = {
                        singleSelection: false,
                        text: 'Select Sub Sector',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        classes: 'myclass custom-class'
                      };
  selectedDomain = null;
  signupForm: FormGroup;
  api_error = null;
  is_provider = 'true';
  step = 1;
  otp = null;
  user_details;
  domainIsthere;
  selectedpackage;
  constructor(
    public dialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions
    ) {
        this.is_provider = data.is_provider || 'true';
     }

     ngOnInit() {
       this.createForm(1);
        this.shared_services.bussinessDomains()
        .subscribe(
          data => {
              this.business_domains = data;
             // this.setDomain(0);
          },
          error => {
              console.log(error);
          }
        );

        this.shared_services.getPackages()
        .subscribe(
          data => {
            this.packages = data;
          },
          error => {

          }
        );
     }

     createForm(step) {
      this.step = step;
      switch (step) {
        case 1:  this.signupForm = this.fb.group({
                          is_provider: ['true'],
                          phonenumber: ['', Validators.compose(
                                            [Validators.required,  Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)]) ],
                          first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                          last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                          selectedDomainIndex: ['', Validators.compose([Validators.required])],
                          selectedSubDomains: [0, Validators.compose([Validators.required])],
                          package_id : ['', Validators.compose([Validators.required])],
                          terms_condition: ['true'],

                 });
                 this.signupForm.get('is_provider').setValue(this.is_provider);
                 this.changeType();

                 break;
      }


     }

     changeType() {
       this.resetApiErrors();
       this.is_provider = this.signupForm.get('is_provider').value;

       if (this.is_provider === 'true') {
        this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
       } else {
        this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
       }

     }

     resetValidation(control_names) {
        // only for  this form
       // console.log(this.is_provider);
        if (this.is_provider === 'true') {
          control_names.map(control_name => {
            this.signupForm.get(control_name).setValidators(Validators.required);
            this.signupForm.get(control_name).updateValueAndValidity();
          });
        } else {
          control_names.map(control_name => {
            this.signupForm.get(control_name).setValidators(null);
            this.signupForm.get(control_name).updateValueAndValidity();
          });
        }

     }

     setDomain(i) {

     /*if (this.signupForm.get('selectedDomainIndex').value !== i) {
          this.signupForm.get('selectedDomainIndex').setValue(i);
      }*/
      this.domainIsthere = this.business_domains[i] || null;
      this.selectedDomain = this.business_domains[i] || null;
      this.setSubDomains(i);
     }

     setSubDomains(i) {
      this.subDomainList = [];
      const sub_domains = (this.business_domains[i]) ?  this.business_domains[i]['subDomains'] : [];
     // console.log('subdomains', sub_domains);
      sub_domains.forEach((element, index) => {
       // console.log('subid ', index);
        const ob = {'id': index , 'itemName': element.displayName , 'value': element.subDomain};
        this.subDomainList.push(ob);
      });
      this.signupForm.get('selectedSubDomains').setValue(0);
      /*console.log('first subdom', this.subDomainList[0]['value']);
      this.signupForm.setValue({selectedSubDomains: this.subDomainList[0]['id']});*/
     }

     onItemSelect(item: any) {
      // console.log(item);
      // console.log(this.signupForm.get('selectedSubDomains').value);

     }

     onSubmit() {
      this.resetApiErrors();
      this.user_details = {};
      const userProfile = {
        countryCode: '+91',
        primaryMobileNo: this.signupForm.get('phonenumber').value || null,
        firstName: this.signupForm.get('first_name').value || null,
        lastName: this.signupForm.get('last_name').value || null,
        // licensePackage: this.signupForm.get('package_id').value || null,
      };



      const isAdmin = (this.signupForm.get('is_provider').value === 'true') ? true : false;

      if (isAdmin) {

        const sector =  this.selectedDomain.domain || '';

        // const ob = this.signupForm.get('selectedSubDomains').value;
        // const sub_Sector = ob.map(el =>  el.value );
        const sub_Sector = this.subDomainList[this.signupForm.get('selectedSubDomains').value].value;
        // console.log('subsector', sub_Sector);


        this.user_details = {
            userProfile: userProfile,
            sector: sector,
            subSector: sub_Sector,
            isAdmin : isAdmin, // checked this to find provider or customer
            licPkgId: this.signupForm.get('package_id').value || null
        };
      //  console.log('providerdet', this.user_details);
        this.signUpApiProvider(this.user_details);

      } else {

        this.user_details = {
          userProfile : userProfile
        };

        this.signUpApiConsumer( this.user_details);

      }




     }

    signUpApiConsumer(user_details) {

      this.shared_services.signUpConsumer(user_details)
      .subscribe(
        data => {
           // console.log(data);
            this.createForm(2);
        },
        error => {
            console.log(error);
            this.api_error = error.error;
        }
      );

    }

    signUpApiProvider(user_details) {

      this.shared_services.signUpProvider(user_details)
      .subscribe(
        data => {
           // console.log(data);
            this.createForm(2);
        },
        error => {
            console.log(error);
            this.api_error = error.error;
        }
      );

    }


    onOtpSubmit(submit_data) {
      this.resetApiErrors();
      if (this.is_provider === 'true') {
              this.shared_services.OtpSignUpProviderValidate(submit_data.phone_otp)
              .subscribe(
                data => {
                  this.otp = submit_data.phone_otp;
                  this.createForm(3);
                },
                error => {
                  console.log(error);
                  this.api_error = error.error;
                }
              );
      } else {
          this.shared_services.OtpSignUpConsumerValidate(submit_data.phone_otp)
          .subscribe(
            data => {
              this.otp = submit_data.phone_otp;
              this.createForm(3);
            },
            error => {
              console.log(error);
              this.api_error = error.error;
            }
          );
      }

    }

    onPasswordSubmit(submit_data) {
      this.resetApiErrors();
      const post_data = { password: submit_data.new_password };

      if (this.is_provider === 'true') {
        this.shared_services.ProviderSetPassword(this.otp, post_data)
        .subscribe(
          data => {
            const login_data = {
              'countryCode': '+91',
              'loginId': this.user_details.userProfile.primaryMobileNo,
              'password': post_data.password
            };
            this.dialogRef.close();
            this.shared_functions.setitemonLocalStorage('new_provider', 'true');

            this.shared_functions.providerLogin(login_data);
          },
          error => {
            console.log(error);
            this.api_error = error.error;
          }
        );
      } else {
          this.shared_services.ConsumerSetPassword(this.otp, post_data)
          .subscribe(
            data => {
              const login_data = {
                'countryCode': '+91',
                'loginId': this.user_details.userProfile.primaryMobileNo,
                'password': post_data.password
              };
              this.dialogRef.close();
              this.shared_functions.consumerLogin(login_data);
            },
            error => {
              console.log(error);
              this.api_error = error.error;
            }
          );
      }

    }

    resetApiErrors() {
      this.api_error = null;
    }

    resendOtp(user_details) {

     if (user_details.isAdmin) {

      this.signUpApiProvider(user_details);
     } else {
      this.signUpApiConsumer(user_details);
     }

    }
    clickedPackage(e) {
      console.log('here', e);
      this.selectedpackage = e;
    }
    isSelectedClass(id) {
      if (id === this.selectedpackage) {
        return true;
      } else {
        return false;
      }
    }
}
