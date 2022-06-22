import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Location } from '@angular/common';
import {  Router } from '@angular/router';
import { CrmService } from '../crm.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { CrmSelectMemberComponent } from '../../../shared/crm-select-member/crm-select-member.component';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-enquiry',
    templateUrl: './enquiry.component.html',
    styleUrls: ['./enquiry.component.css']
  })
  export class enquiryComponent implements OnInit{
      public headerName:any;
      public api_loading:boolean = true;
      public  customer_label: any;
      public createEnquiryForm:any;
      public  searchby:any='';
      public innerWidth:any;
      public templateList:any=[];
      public activityList:any=[];
      public activityTitleDialogValue:any='None';
      public activityIdDialogValue:any;
      public activityLocationIdDialogValue:any;
      public activityOriginUidDialogValue:any;
      public categoryList:any=[];
      public  emptyFielderror = false;
      public qParams: {};
      public  form_data: any;
      public newDateFormat:any= projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
      public prefillnewCustomerwithfield:any = '';
      private onDestroy$: Subject<void> = new Subject<void>();
      public customer_data: any;
      public show_customer:boolean = false;
      public  create_customer:boolean = false;
      public disabledNextbtn:boolean = true;
      public   hideSearch:boolean = false;
      public jaldeeId:any;
      public formMode:any
      public countryCode:any;
      public customer_email:any;
      public enquiryErrorMsg:string='';
      public enquiryTemplateId:any;
      public customerActivityText:any='New'
      public enquiryDefultFormControl:any;
      public enterFirstName:string='Enter First Name';
      public enterSecondName:string='Enter Second Name';
      public enterPhoNeNo:string='Enter Phone No';
      public enterEmailId:string='Enter Email Id';
      public selectProduct:string='Select Product';
      public enquiryArr:any=[];
      public activityListTitleDialogValue:any;
      public activityListDescriptionDialogValue:any;
      public activityListCategoryDialogValue:any;
      public activityListTypeDialogValue:any
      public activityListStatusDialogValue:any
      public activityListpriorityDialogValue:any;
      public enquiryCreateIdAfterRes:any;
      public enterproposedAmount:string='Enter Propsed Amount'
      public sourcingChannelPlaceholder:string='None';
      public sourcingChhannelCatList:any=[];
      sourcingChhannelCatListNew:any=[]
  errorMsg: string;
      constructor(
        private locationobj: Location,
        private router: Router,
         private crmService: CrmService,
         private createEnquiryFB: FormBuilder,
         private dialog: MatDialog, 
        private snackbarService: SnackbarService,
         private groupService:GroupStorageService,
         private wordProcessor: WordProcessor,
         private provider_services: ProviderServices,
      ){

      }
    ngOnInit(): void {
        this.api_loading = false;
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.activityLocationIdDialogValue= user.bussLocs[0];
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
       this.headerName='Create Enquiry';
       this.createEnquiryForm= this.createEnquiryFB.group({
        enquiryDetails:[''],
        firstNameValue:[''],
        lastNameValue:[''],
        phoneNoValue:[''],
        emailValue:[''],
        userTaskCategory:[''],
        proposedAmount:[0],
        sourcingChannel:['']

       })
      this.enquiryCategoryList()
      this.getTemplateEnuiry()
      this.getTaskmaster()
      this.sourcingChannelCategory()

      console.log('this.innerWidth = window.innerWidth;',this.innerWidth = window.innerWidth)
        console.log('this.innerWidth ',this.innerWidth )
        if(this.innerWidth<=768){
          this.placeholderTruncate(this.customer_label)
        }
        else{
          this.searchby = 'Search by ' + this.customer_label + ' id/name/email/phone number';
        }
    }
    placeholderTruncate(value: string, completeWords = true,) {
      let lastindex = 4;
      if (completeWords) {
        lastindex = value.substring(0, 4).lastIndexOf(' ');
        console.log('lastindex',lastindex)
      }
      console.log('value.substring(0, 4)',value.substring(0, 4))
      const labelTerm = value.substring(0, 4)
      console.log('labelTerm',labelTerm)
      this.searchby = 'Search by ' + labelTerm+ ' id/name/phone #';
      console.log(' this.searchby', this.searchby)
      return `${value.substring(0, 4)}`;
    }
    sourcingChannelCategory(){
      this.crmService.enquiryCategory().subscribe((cat:any)=>{
        this.sourcingChhannelCatList.push(cat)
      })
    }
      goback() {
        this.locationobj.back();
      }
      enquiryDetailsInput(value:any){
        console.log('value',value)
        if(!value){
           this.customerActivityText='New';
           this.createEnquiryForm.patchValue({
            firstNameValue:'',
            lastNameValue:'',
            phoneNoValue:'',
            emailValue:'',
          })
          this.errorMsg='Please give some valid input'
        }
        else{
          this.errorMsg=''
        }
      }
      searchCustomer() {
        console.log('this.customer_data',this.customer_data)
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
            else if (isNumber && this.createEnquiryForm.controls.enquiryDetails.value.length >7) {
              mode = 'phone';
              this.prefillnewCustomerwithfield = 'phone';
            } else if (isNumber && this.createEnquiryForm.controls.enquiryDetails.value.length <7 ) {
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
    
          this.provider_services.getCustomer(post_data)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
              (data: any) => {
                this.enquiryArr=data;
                if(data.length===0){
                  this.enterFirstName='Enter First Name';
                  this.enterSecondName='Enter Second Name'
                  this.enterEmailId='Enter Email Name'
                  this.enterPhoNeNo='Enter Phone No'
                  this.customerActivityText='New';
                  this.selectProduct='Select Product'
               }
                this.customer_data = [];
                if (data.length === 0) {
                  this.show_customer = false;
                  this.create_customer = true;
                  this.enterFirstName='Enter First Name';
                  this.enterSecondName='Enter Second Name'
                  this.enterEmailId='Enter Email Name'
                  this.enterPhoNeNo='Enter Phone No'
                  this.customerActivityText='New';
                  this.selectProduct='Select Product'
                } else {
                  this.createEnquiryForm.patchValue({
                    firstNameValue:data[0].firstName,
                    lastNameValue:data[0].lastName,
                    phoneNoValue:data[0].phoneNo,
                    emailValue:data[0].email,
                  })
                  this.customerActivityText='View'
                  if (data.length > 1) {
                    this.customer_data = data[0];
                    this.hideSearch = true;
                  }else {
                    this.customer_data = data[0];
                    if(this.customer_data){
                      this.hideSearch = true;
                    }
                  }
                  this.disabledNextbtn = false;
                  this.jaldeeId = this.customer_data.jaldeeId;
                  this.show_customer = true;
                  this.create_customer = false;
               
                  this.formMode = data.type;
                  if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
                    this.countryCode = this.customer_data.countryCode;
                  } else {
                    this.countryCode = '+91';
                  }
                  if (this.customer_data.email && this.customer_data.email !== 'null') {
                    this.customer_email = this.customer_data.email;
                  }
    
                  if (this.customer_data.jaldeeId && this.customer_data.jaldeeId !== 'null') {
                    this.jaldeeId = this.customer_data.jaldeeId;
                  }
                  if (this.customer_data.firstName && this.customer_data.firstName !== 'null') {
                    this.jaldeeId = this.customer_data.firstName;
                  }
    
                }
              },
              error => {
                this.wordProcessor.apiErrorAutoHide(this, error);
              }
            );
        }
      }
      getTemplateList(){
        this.crmService.getTaskMasterList().subscribe((response:any)=>{
          this.templateList.push(response)
        }) 
      }
      
      getTaskmaster(){
        this.crmService.getTaskMasterList().subscribe((response)=>{
          this.activityList.push(response);
        })
      }
      selectActivityListDialog(activityListData:any){
        const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
          width: '745px',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'taskMasterList',
        data:this.activityList[0],
        noneData:'None'
       
      }
        })
        dialogRef.afterClosed().subscribe((response:any)=>{
          if(response !== undefined && response !=='None' && response !== 'Close'){
            this.activityTitleDialogValue= response.title.value;
            this.activityIdDialogValue= response.id,
            this.activityOriginUidDialogValue= response.taskUid;
            this.activityListTitleDialogValue=response.title.value;
            this.activityListDescriptionDialogValue=response.description;
            this.activityListCategoryDialogValue= response.category.id;
            this.activityListTypeDialogValue= response.type.id;
            this.activityListStatusDialogValue= response.status.id;
            this.activityListpriorityDialogValue= response.priority.id;
            this.createEnquiryForm.patchValue({
              proposedAmount:response.targetPotential.value
            })
          }
          else if(response==='None' && response !== undefined && response !== 'Close'){
            this.activityTitleDialogValue= 'None'
          }
          else if(response==='Close' && response !== undefined){
            this.activityTitleDialogValue='None'
          }
        })
      }
      enquiryCategoryList(){
        this.crmService.getLeadTemplate().subscribe((category:any)=>{
          this.categoryList.push(category)
          this.createEnquiryForm.controls.userTaskCategory.setValue(this.categoryList[0][0].id);
        })
      }
      search(){
        this.hideSearch = false;
      }
      saveCreateEnquiry(){
        if(this.enquiryArr.length !==0 && this.customer_data !== undefined){
        const createEnquiry:any = {
          "location" : { "id" : this.activityLocationIdDialogValue},
          "customer" : {"id" :  this.customer_data.id},
          "enquireMasterId":this.enquiryTemplateId,
          "leadMasterId": this.createEnquiryForm.controls.userTaskCategory.value,
          "isLeadAutogenerate":true,
          "originUid":this.activityOriginUidDialogValue,
          "taskMasterId":this.activityIdDialogValue,
          "targetPotential":this.createEnquiryForm.controls.proposedAmount.value,
          "category":{"id":this.createEnquiryForm.controls.sourcingChannel.value}
        }
        if(createEnquiry.category.id===''){
          const createEnquiry1:any = {
            "location" : { "id" : this.activityLocationIdDialogValue},
            "customer" : {"id" :  this.customer_data.id},
            "enquireMasterId":this.enquiryTemplateId,
            "leadMasterId": this.createEnquiryForm.controls.userTaskCategory.value,
            "isLeadAutogenerate":true,
            "originUid":this.activityOriginUidDialogValue,
            "taskMasterId":this.activityIdDialogValue,
            "targetPotential":this.createEnquiryForm.controls.proposedAmount.value,
            "category":{"id":this.createEnquiryForm.controls.sourcingChannel.value}
          }
          this.crmService.createEnquiry(createEnquiry1).subscribe((response)=>{
            setTimeout(() => {
              this.api_loading = true;
              this.snackbarService.openSnackBar('Successfully created enquiry');
              this.createEnquiryForm.reset();
            this.router.navigate(['provider', 'crm']);
            }, projectConstants.TIMEOUT_DELAY);
          },
          (error)=>{
            setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            }, projectConstants.TIMEOUT_DELAY);
          })
        }
        else{
          this.crmService.createEnquiry(createEnquiry).subscribe((response)=>{
            setTimeout(() => {
              this.api_loading = true;
              this.snackbarService.openSnackBar('Successfully created enquiry');
              this.createEnquiryForm.reset();
            this.router.navigate(['provider', 'crm']);
            }, projectConstants.TIMEOUT_DELAY);
          },
          (error)=>{
            setTimeout(() => {
              this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            }, projectConstants.TIMEOUT_DELAY);
          })
        }
        
        }
         if(this.customer_data === undefined){
          const afterCompleteAddData:any = {
            "firstName": this.createEnquiryForm.controls.firstNameValue.value,
            "lastName": this.createEnquiryForm.controls.lastNameValue.value,
            "phoneNo": this.createEnquiryForm.controls.phoneNoValue.value,
            "email": this.createEnquiryForm.controls.emailValue.value,
            "countryCode": '+91',
            "userTaskCategory":this.createEnquiryForm.controls.userTaskCategory.value,
            "targetPotential":this.createEnquiryForm.controls.proposedAmount.value,
            "category":{"id":this.createEnquiryForm.controls.sourcingChannel.value}
          }
          if(afterCompleteAddData.category.id===''){
            this.crmService.createProviderCustomer(afterCompleteAddData).subscribe((response:any)=>{
            setTimeout(() => {
              this.enquiryCreateIdAfterRes= response;
              const createEnquiry:any = {
                "location" : { "id" : this.activityLocationIdDialogValue},
                "customer" : {"id" :  this.enquiryCreateIdAfterRes},
                "enquireMasterId":this.enquiryTemplateId,
                "leadMasterId": this.createEnquiryForm.controls.userTaskCategory.value,
                "isLeadAutogenerate":true,
                "originUid":this.activityOriginUidDialogValue,
                "targetPotential":this.createEnquiryForm.controls.proposedAmount.value,
                "category":{"id":0}
              }
              this.crmService.createEnquiry(createEnquiry).subscribe((response)=>{
                setTimeout(() => {
                  this.api_loading = true;
                  this.snackbarService.openSnackBar('Successfully created enquiry');
                this.router.navigate(['provider', 'crm']);
                }, projectConstants.TIMEOUT_DELAY);
              },
              (error)=>{
                setTimeout(() => {
                  this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
                }, projectConstants.TIMEOUT_DELAY);
              })
            }, projectConstants.TIMEOUT_DELAY);
          },
          (error)=>{
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
          })
            
          }
          else{
            this.crmService.createProviderCustomer(afterCompleteAddData).subscribe((response:any)=>{
            setTimeout(() => {
              this.enquiryCreateIdAfterRes= response;
              const createEnquiry:any = {
                "location" : { "id" : this.activityLocationIdDialogValue},
                "customer" : {"id" :  this.enquiryCreateIdAfterRes},
                "enquireMasterId":this.enquiryTemplateId,
                "leadMasterId": this.createEnquiryForm.controls.userTaskCategory.value,
                "isLeadAutogenerate":true,
                "originUid":this.activityOriginUidDialogValue,
                "targetPotential":this.createEnquiryForm.controls.proposedAmount.value,
                "category":{"id":this.createEnquiryForm.controls.sourcingChannel.value}
              }
              this.crmService.createEnquiry(createEnquiry).subscribe((response)=>{
                setTimeout(() => {
                  this.api_loading = true;
                  this.snackbarService.openSnackBar('Successfully created enquiry');
                this.router.navigate(['provider', 'crm']);
                }, projectConstants.TIMEOUT_DELAY);
              },
              (error)=>{
                setTimeout(() => {
                  this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
                }, projectConstants.TIMEOUT_DELAY);
              })
            }, projectConstants.TIMEOUT_DELAY);
          },
          (error)=>{
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
          })
          } 
        }
      }
      createCustomer(){
          const afterCompleteAddData:any = {
            "firstName": this.createEnquiryForm.controls.firstNameValue.value,
            "lastName": this.createEnquiryForm.controls.lastNameValue.value,
            "phoneNo": this.createEnquiryForm.controls.phoneNoValue.value,
            "email": this.createEnquiryForm.controls.emailValue.value,
            "countryCode": '+91',
            "userTaskCategory":this.createEnquiryForm.controls.userTaskCategory.value,
            "targetPotential":this.createEnquiryForm.controls.proposedAmount.value,
            "category":{"id":this.createEnquiryForm.controls.sourcingChannel.value}
          }
          if(afterCompleteAddData.category.id===''){
            this.crmService.createProviderCustomer(afterCompleteAddData).subscribe((response:any)=>{
              setTimeout(() => {
                this.enquiryCreateIdAfterRes= response
                this.snackbarService.openSnackBar('Successfull created enquiry');
              this.createEnquiryForm.reset();
            this.router.navigate(['provider', 'crm']);
              }, projectConstants.TIMEOUT_DELAY);
            },
            (error)=>{
              this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
            })
          }
          else{
            this.crmService.createProviderCustomer(afterCompleteAddData).subscribe((response:any)=>{
              setTimeout(() => {
                this.enquiryCreateIdAfterRes= response
                this.snackbarService.openSnackBar('Successfull created enquiry');
              this.createEnquiryForm.reset();
            this.router.navigate(['provider', 'crm']);
              }, projectConstants.TIMEOUT_DELAY);
            },
            (error)=>{
              this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
            })
          }
      }
      getTemplateEnuiry(){
        this.crmService.getEnquiryTemplate().subscribe((template:any)=>{
          this.enquiryTemplateId = template[0].id;
        })
      }
      handleFirstName(nnumberText){
        console.log(nnumberText)
        this.errorMsg=''
      }
  }