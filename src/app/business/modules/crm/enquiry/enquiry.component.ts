import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../../../src/app/app.component';
// import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location,DatePipe } from '@angular/common';
// import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import {  Router } from '@angular/router';
import { CrmService } from '../crm.service';
import { FormBuilder } from '@angular/forms';
// import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
// import * as moment from 'moment';
// import  {CrmSelectMemberComponent} from '../../../shared/crm-select-member/crm-select-member.component'
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
      public activityTitleDialogValue:any='Select Channel';
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
      public selectProduct:string='Selet Product';
      public enquiryArr:any=[];
      public activityListTitleDialogValue:any;
      public activityListDescriptionDialogValue:any;
      public activityListCategoryDialogValue:any;
      public activityListTypeDialogValue:any
      public activityListStatusDialogValue:any
      public activityListpriorityDialogValue:any




     





      constructor(
        private locationobj: Location,
        // private lStorageService: LocalStorageService,
        private router: Router,
        // private activated_route: ActivatedRoute,
         private crmService: CrmService,
        //  public fed_service: FormMessageDisplayService,
         private createEnquiryFB: FormBuilder,
         private dialog: MatDialog, 
        private snackbarService: SnackbarService,
         private datePipe:DatePipe,
        //  private _Activatedroute:ActivatedRoute,
         private groupService:GroupStorageService,
         private wordProcessor: WordProcessor,
         private provider_services: ProviderServices,
      ){

      }
    ngOnInit(): void {
        this.api_loading = false;
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log("User is :", user);
        this.activityLocationIdDialogValue= user.bussLocs[0];
        console.log('this.activityLocationIdDialogValue',this.activityLocationIdDialogValue)
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
       console.log('DatePipe',this.datePipe.transform(new Date(),'yyyy-MM-dd'))
       this.headerName='Create Enquiry';
       this.createEnquiryForm= this.createEnquiryFB.group({
        enquiryDetails:[''],
        firstNameValue:[''],
        lastNameValue:[''],
        phoneNoValue:[''],
        emailValue:[''],
        userTaskCategory:['']
        // activityList:[],

       })
       if(this.innerWidth<=768){
         console.log(this.innerWidth)
        this.placeholderTruncate(this.customer_label)
      }
      else{
        this.searchby = 'Search by ' + this.customer_label + ' id/name/email/phone number';
      }
      // this.getTemplateList()
      this.getTotalTaskActivity()
      this.enquiryCategoryList()
      this.getTemplateEnuiry()
    }
      goback() {
        this.locationobj.back();
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
        this.searchby = 'Enter ' + labelTerm+ ' id/name/phone #';
        console.log(' this.searchby', this.searchby)
        return `${value.substring(0, 4)}`;
      }
      enquiryDetailsInput(value:any){
        console.log('value',value);
        if(!value){
          console.log('kkk');
          this.createEnquiryForm.controls.firstNameValue.setValue('');
           this.createEnquiryForm.controls.lastNameValue.setValue('');
           this.createEnquiryForm.controls.phoneNoValue.setValue('');
           this.createEnquiryForm.controls.emailValue.setValue('');
           this.createEnquiryForm.controls.userTaskCategory.setValue('');
        }
      }
      searchCustomer() {
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
              // post_data = {
              //   'jaldeeId-eq': form_data.search_input
              // };
              break;
          }
    
          this.provider_services.getCustomer(post_data)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
              (data: any) => {
                console.log('data',data);
                this.enquiryArr=data;
                if(data.length===0){
                  // this.createEnquiryForm.patchValue({
                  //   firstNameValue:'',
                  //   lastNameValue:'',
                  //   phoneNoValue:'',
                  //   emailValue:'',
                  //   userTaskCategory:'',
                  // })
                  this.enterFirstName='Enter First Name';
                  this.enterSecondName='Enter Second Name'
                  this.enterEmailId='Enter Email Name'
                  this.enterPhoNeNo='Enter Phone No'
                  this.customerActivityText='New';
                  this.selectProduct='Select Product'
               }
                // console.log('data[0].firstName',data[0].firstName)
                // this.createEnquiryForm.patchValue({
                //   firstNameValue:data[0].firstName,
                //   lastNameValue:data[0].lastName,
                //   phoneNoValue:data[0].phoneNo,
                //   emailValue:data[0].email,
                // })
                this.customer_data = [];
                if (data.length === 0) {
                  this.show_customer = false;
                  this.create_customer = true;
                //   this.createEnquiryForm.patchValue({
                //   firstNameValue:'',
                //   lastNameValue:'',
                //   phoneNoValue:'',
                //   emailValue:'',
                //   userTaskCategory:'',
                // })
                  this.enterFirstName='Enter First Name';
                  this.enterSecondName='Enter Second Name'
                  this.enterEmailId='Enter Email Name'
                  this.enterPhoNeNo='Enter Phone No'
                  this.customerActivityText='New';
                  this.selectProduct='Select Product'
                  // this.createNew();
                  // this.createCustomer()
                } else {
                  this.createEnquiryForm.patchValue({
                    firstNameValue:data[0].firstName,
                    lastNameValue:data[0].lastName,
                    phoneNoValue:data[0].phoneNo,
                    emailValue:data[0].email,
                  })
                  this.customerActivityText='View'
                  if (data.length > 1) {
                    // const customer = data.filter(member => !member.parent);
                    this.customer_data = data[0];
                    console.log('this.customer_data',this.customer_data);
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
        // console.log(' this.customer_data', this.customer_data);
      }
      hamdlefirstName(firstName:any){
        console.log('firstName',firstName);
      }
      hamdlelastName(lastName:any){
        console.log('lastName',lastName);
      }
      hamdlephoneNo(telNo){
        console.log('telNo',telNo)
      }
      hamdleemail(email){
        console.log('email',email)
      }
      handleSourcingChannel(sourcingChannelValue:any){
        console.log('sourcingChannelValue',sourcingChannelValue);
        const templateValue = this.createEnquiryForm.controls.sourcingChannel.value;
        console.log('templateValue',templateValue) 
      }
      getTemplateList(){
        this.crmService.getTaskMasterList().subscribe((response:any)=>{
          console.log('templateList :',response);
          this.templateList.push(response)
          // this.createEnquiryForm.controls.sourcingChannel.setValue(response[0].id)
          
        })
        
      }
      getTotalTaskActivity(){
        this.crmService.getTotalTask().subscribe((response)=>{
          console.log('response',response);
          this.activityList.push(response);
  
        })
      }
      selectActivityListDialog(activityListData:any){
        console.log('activityList',activityListData)
        const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
          width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createTaskActivityList',
        data:this.activityList,
        noneData:'None'
       
      }
        })
        dialogRef.afterClosed().subscribe((response:any)=>{
          console.log('response',response);
          if(response !== undefined && response !=='None' && response !== 'Close'){
            this.activityTitleDialogValue= response.title;
            this.activityIdDialogValue= response.id,
            this.activityOriginUidDialogValue= response.taskUid;
            this.activityListTitleDialogValue=response.title;
            this.activityListDescriptionDialogValue=response.description;
            this.activityListCategoryDialogValue= response.category.id;
            this.activityListTypeDialogValue= response.type.id;
            this.activityListStatusDialogValue= response.status.id;
            this.activityListpriorityDialogValue= response.priority.id;




            // this.activityLocationIdDialogValue= response.location.id
          }
          else if(response==='None' && response !== undefined && response !== 'Close'){
            this.activityTitleDialogValue= 'None'
          }
          else if(response==='Close' && response !== undefined){
            this.activityTitleDialogValue='Select Channel'
          }
          // else{
          //   this.activityTitleDialogValue==='None'
          // }
          
        })
      }
      handleTaskPrioritySelection(categoryValue){
        console.log('categoryValue',categoryValue)
      }
      enquiryCategoryList(){
        this.crmService.getLeadTemplate().subscribe((category:any)=>{
          console.log('category',category)
          this.categoryList.push(category)
        })
      }
      search(){
        this.hideSearch = false;
      }
      saveCreateEnquiry(){
        console.log('this.customer_data.id',this.customer_data);
        if(this.enquiryArr.length !==0){
        const createEnquiry:any = {
        //   "title" : this.activityListTitleDialogValue,
    		// "description" : this.activityListDescriptionDialogValue,
    		// "category" : { "id": this.activityListCategoryDialogValue },
    		// "type" : { "id": this.activityListTypeDialogValue},
    		// "status" : { "id":  this.activityListStatusDialogValue},
    		// "priority" : { "id": this.activityListpriorityDialogValue },

          "location" : { "id" : this.activityLocationIdDialogValue},
          "customer" : {"id" :  this.customer_data.id},
          "enquireMasterId":this.enquiryTemplateId,
          "leadMasterId": this.createEnquiryForm.controls.userTaskCategory.value,
          "isLeadAutogenerate":true,
          "originUid":this.activityOriginUidDialogValue
        }
        console.log('createEnquiry',createEnquiry);
        this.crmService.createEnquiry(createEnquiry).subscribe((response)=>{
          console.log('createEnquiry',response);
          setTimeout(() => {
            this.api_loading = true;
            this.createEnquiryForm.reset();
          this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            console.log('error',error)
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
          }, projectConstants.TIMEOUT_DELAY);
        })
        }
        else{
          this.createCustomer()
        }
        
        
      }
      createCustomer(){
          const afterCompleteAddData:any = {
            "firstName": this.createEnquiryForm.controls.firstNameValue.value,
            "lastName": this.createEnquiryForm.controls.lastNameValue.value,
            "phoneNo": this.createEnquiryForm.controls.phoneNoValue.value,
            "email": this.createEnquiryForm.controls.emailValue.value,
            "countryCode": '+91',
          }
          console.log('afterCompleteAddData',afterCompleteAddData)
          this.crmService.createProviderCustomer(afterCompleteAddData).subscribe((response:any)=>{
            setTimeout(() => {
              console.log('afterCompleteAddData',response);
              this.api_loading = true;
            this.createEnquiryForm.reset();
          this.router.navigate(['provider', 'crm']);
            }, projectConstants.TIMEOUT_DELAY);
          },
          (error)=>{
            console.log('error1',error)
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
          })
      }
      getTemplateEnuiry(){
        this.crmService.getEnquiryTemplate().subscribe((template:any)=>{
          console.log('template',template)
          this.enquiryTemplateId = template[0].id;
          console.log(' this.enquiryTemplateId', this.enquiryTemplateId)
        })
      }
  }