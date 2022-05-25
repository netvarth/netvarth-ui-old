import { Component, OnInit } from '@angular/core';
// import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
// import { projectConstants } from '../../../../../../src/app/app.component';
// import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location,DatePipe } from '@angular/common';
// import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
// import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '../crm.service';
import { FormBuilder } from '@angular/forms';
// import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
// import * as moment from 'moment';
// import  {CrmSelectMemberComponent} from '../../../shared/crm-select-member/crm-select-member.component'
import { MatDialog } from '@angular/material/dialog';
// import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { CrmSelectMemberComponent } from '../../../shared/crm-select-member/crm-select-member.component';




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
      public categoryList:any=[
        {
          id:1,name:'Category 1'
        },
        {
          id:2,name:'Category 2'
        }
      ]


      constructor(
        private locationobj: Location,
        // private lStorageService: LocalStorageService,
        // private router: Router,
        // private activated_route: ActivatedRoute,
         private crmService: CrmService,
        //  public fed_service: FormMessageDisplayService,
         private createEnquiryFB: FormBuilder,
         private dialog: MatDialog, 
        // private snackbarService: SnackbarService,
         private datePipe:DatePipe,
        //  private _Activatedroute:ActivatedRoute,
         private groupService:GroupStorageService,
         private wordProcessor: WordProcessor,
      ){

      }
    ngOnInit(): void {
        this.api_loading = false;
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log("User is :", user);
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
      searchCustomer(){}
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
          if(response !== undefined && response !=='None'){
            this.activityTitleDialogValue=== response.title;
            this.activityIdDialogValue=== response.id
          }
          else if(response==='None' && response !== undefined){
            this.activityTitleDialogValue=== 'None'
          }
          else if(response==='Close' && response !== undefined){
            this.activityTitleDialogValue==='None'
          }
          // else{
          //   this.activityTitleDialogValue==='None'
          // }
          
        })
      }
      handleTaskPrioritySelection(categoryValue){
        console.log('categoryValue',categoryValue)
      }
      saveCreateEnquiry(){
        const createEnquiry:any={
          "firstName":this.createEnquiryForm.controls.firstNameValue.value,
          "lastName":this.createEnquiryForm.controls.lastNameValue.value,
          "phoneNumber": this.createEnquiryForm.controls.phoneNoValue.value,
          "email":this.createEnquiryForm.controls.emailValue.value,
          "sourceCtrl":  this.activityIdDialogValue,
        }
        console.log('createEnquiry',createEnquiry)
      }
  }