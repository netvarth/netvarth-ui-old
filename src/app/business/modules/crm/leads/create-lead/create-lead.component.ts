import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location,DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { LocalStorageService } from '../../../../../../../src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
// import { Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
// import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
// import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.css']
})
export class CreateLeadComponent implements OnInit {
  public tooltipcls:any= '';
  public select_cap:any= Messages.SELECT_CAP;
  public newDateFormat:any= projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  public perPage:any= projectConstants.PERPAGING_LIMIT;
  public apiloading:any= true;
  public availableDates: any = [];
  public minDate:any=new Date();
  public maxDate:any;
  public ddate:any;
  public api_loading:any= true;

  //form variable start
  public createLeadForm:any;
  public leadError:null;
  public selectMember:any;
  public categoryListData:any=[];
  public allMemberList:any=[];
  public leadTypeList:any=[];
  public leadStatusList:any=[];
  public leadPriorityList:any=[];
  public userType:any;
  public locationName:any;
  public areaName:any;
  public locationId:any;
  public leadDueDate:any;
  public leadDueTime:any;
  public leadDueDays:any;
  public leadDueHrs:any;
  public leadDueMin:any;
  public selectedDate:any;
  public leadErrorText:any;
  public boolenLeadError:boolean=false;
  public assigneeId:any;
  public selectedTime:any;
  public selectLeadManger:any;
  public selectLeadMangerId:any;
  public createBTimeField:boolean=false;
  public updateBTimefield:boolean=false;
  public dayGapBtwDate:any;
  public hour:any;
  public minute:any;
  //update variable;
  public updateValue:any;
  public updateTitleLead:any;
  public lead:any;
  public selectHeader:any;
  public updateUserType:any;
  public updateMemberId:any;
  public updateManagerId:any;
  public updateLeadId:any;
  public updteLocationId:any;
  leadUid : any;
  leadDetails: any;
  public minTime=new Date().getTime();
  public bEstDuration:boolean=false;
  public updateAssignMemberDetailsToDialog:any;
  public updateSelectLeadMangerDetailsToDialog:any;
  public sel_loc:any;
  leadStatusModal: any;
  leadPriority: any;
  public estDurationWithDay:any;
  public estTime:any;
  estDurationWithTime: any;
  constructor(private locationobj: Location,
    // private lStorageService: LocalStorageService,
    private router: Router,
     private crmService: CrmService,
     public fed_service: FormMessageDisplayService,
     private createLeadFB: FormBuilder,
     private dialog: MatDialog, private snackbarService: SnackbarService,
     private datePipe:DatePipe,
     private _Activatedroute:ActivatedRoute,
     private groupService:GroupStorageService

     ) { 
      //this.router.navigate(['provider', 'lead','create-lead'])
     }

  ngOnInit(): void {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log("User is :", user);
        this.selectMember= user.firstName + user.lastName;
        this.selectLeadManger=user.firstName + user.lastName;
        console.log(' this.selectMember', this.selectMember)
        console.log(' this.selectMember', this.selectLeadManger)
        this.assigneeId=user.id;
        this.selectLeadMangerId=user.id;
        this.locationId= user.bussLocs[0]
        if(user.userType === 1){
          this.userType='PROVIDER'
        }



    this._Activatedroute.paramMap.subscribe(params => { 
      this.leadUid = params.get('leadid');
      if(this.leadUid)
      {
        this.crmService.leadActivityName = "subLeadCreate";
      }
    });
    // this._Activatedroute.paramMap.subscribe(params => { 
    //   this.leadUid = params.get('leadid');
    //   if(this.leadUid)
    //   {
    //     this.crmService.leadActivityName = "Update";
    //   }
    // });

    this.api_loading=false;
    this.createLeadForm=this.createLeadFB.group({
      leadTitle:[null,[Validators.required]],
      leadDescription:[null],
      userLeadCategory:[null,[Validators.required]],
      userLeadType:[null,[Validators.required]],
      leadLocation:[null,[Validators.required]],
      areaName:[null],
      leadStatus:[null,[Validators.required]],
      leadDate:[null,[Validators.required]],
      leadDays:[0],
      leadHrs:[0],
      leadMin:[0],
      userLeadPriority:[null,[Validators.required]],
      targetResult:[null],
      targetPotential:[null],
    }) 
    if(this.crmService.leadActivityName!='Create' && this.crmService.leadActivityName!='subLeadCreate' && this.crmService.leadActivityName!='CreatE' && this.crmService.leadActivityName!='CreteLeadMaster'){
      this.selectHeader='Update Lead'
      this.createBTimeField=false;
      this.updateBTimefield=true;
      this.updateValue=this.crmService.leadToCraeteViaServiceData;
      console.log('this.updateValue',this.updateValue)
      if(this.updateValue != undefined){
        console.log(' this.updateValue', this.updateValue);
      this.createLeadForm.patchValue({
        leadTitle:this.updateValue.title,
        leadDescription:this.updateValue.description,
        targetPotential:this.updateValue.targetPotential,
        targetResult:this.updateValue.targetResult,
        userLeadCategory:this.updateValue.category.id,
        userLeadType:this.updateValue.type.id,
        leadStatus:this.updateValue.status.id,
        userLeadPriority:this.updateValue.priority.id,
      })
      this.locationName =this.updateValue.location.name;
      this.areaName =this.updateValue.locationArea;
      this.updteLocationId= this.updateValue.location.id
      this.leadDueDays=this.updateValue.leadDays;
      this.leadDueHrs=this.updateValue.leadHrs;
      this.leadDueMin=this.updateValue.leadMin;
      this.selectMember= this.updateValue.assignee.name;
      this.updateMemberId=this.updateValue.assignee.id;
      this.selectLeadManger= this.updateValue.manager.name;
      this.updateManagerId= this.updateValue.manager.id
      this.updateUserType=this.updateValue.userTypeEnum;
      // this.leadDueTime=this.updateValue.estDuration
       this.estTime={ "days" :this.updateValue.estDuration.days, "hours" :this.updateValue.estDuration.hours, "minutes" : this.updateValue.estDuration.minutes };
      }
      else{
        this.router.navigate(['provider', 'lead']);
      }
    }
    else if(this.crmService.leadActivityName==='CreatE'){
      this.createBTimeField=true;
      this.updateBTimefield=false;
      this.selectHeader='Add Lead';
      this.leadDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd') 
      console.log(' this.leadDueDate', this.leadDueDate);
      this.selectedDate = this.leadDueDate;
      this.leadDueTime= '0000' ;
      console.log(' this.leadDueTime', this.leadDueTime)
      this.estDurationWithDay=this.leadDueDays;
      this.estDurationWithTime=this.leadDueTime;
      const estDurationDay=this.estDurationWithDay
      const estDurationHour=this.leadDueTime.slice(0,2)
      const estDurationMinurte= this.leadDueTime.slice(3,)
      this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
      console.log('this.estTime',this.estTime)
    }
    else if(this.crmService.leadActivityName==='Create'){
      this.createBTimeField=true;
      this.updateBTimefield=false;
      // this.selectMember='Select Member';
      // this.selectLeadManger='Select Lead Manger'
        this.selectHeader='Add Lead';
        this.leadDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd') 
        // this.datePipe.transform(this.leadDueDate,'yyyy-MM-dd');
        console.log(' this.leadDueDate', this.leadDueDate);
        this.selectedDate = this.leadDueDate;
        this.leadDueTime= "0000" ;
        console.log(' this.leadDueTime', this.leadDueTime)
        this.estDurationWithDay=this.leadDueTime;
        const estDurationDay=this.datePipe.transform(this.estDurationWithDay,'d')
        const estDurationHour=this.datePipe.transform(this.estDurationWithDay,'h')
        const estDurationMinurte= this.datePipe.transform(this.estDurationWithDay,'mm')
        this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
        console.log('this.estTime',this.estTime)
        console.log('new Date()',new Date())
        const leadMaster= this.crmService.leadMasterToCreateServiceData;
        console.log('leadMaster',leadMaster);
        // this.createLeadForm.controls.leadTitle.value = leadMaster.title;
        // this.createLeadForm.controls.leadDescription.value= leadMaster.description;
        // this.createLeadForm.controls.userLeadCategory.value= leadMaster.category.id;
        // this.createLeadForm.controls.userLeadType.value= leadMaster.type.id;
        // this.createLeadForm.controls.userLeadPriority.value= leadMaster.priority.id;

    }
    else if(this.crmService.leadActivityName==='CreteLeadMaster'){
      this.createBTimeField=true;
      this.updateBTimefield=false;
      // this.selectMember='Select Member';
      // this.selectLeadManger='Select Lead Manger'
        this.selectHeader='Add Lead';
        this.leadDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd') 
        // this.datePipe.transform(this.leadDueDate,'yyyy-MM-dd');
        console.log(' this.leadDueDate', this.leadDueDate);
        this.selectedDate = this.leadDueDate;
        this.leadDueTime= "0000" ;
        console.log(' this.leadDueTime', this.leadDueTime)
        this.estDurationWithDay=this.leadDueTime;
        const estDurationDay=this.datePipe.transform(this.estDurationWithDay,'d')
        const estDurationHour=this.datePipe.transform(this.estDurationWithDay,'h')
        const estDurationMinurte= this.datePipe.transform(this.estDurationWithDay,'mm')
        this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
        console.log('this.estTime',this.estTime)
        console.log('new Date()',new Date())
    }
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getLeadTypeListData()
    this.getLeadStatusListData()
    this.getLeadPriorityListData()
    this.getLocation()
    // this.getLeadmaster()
  }
  getLeadmaster(){
    this.crmService.getLeadMasterList().subscribe((response)=>{
      console.log('LeadMasterList :',response);
    })
  }
  getLocation(){
    this.crmService.getProviderLocations().subscribe((res)=>{
      console.log('location.........',res)
      this.locationName= res[0].place;
      this.updteLocationId= res[0].id;
    })
  }
  getAssignMemberList(){
    this.crmService.getMemberList().subscribe((memberList:any)=>{
      console.log('memberList',memberList)
      this.allMemberList.push(memberList)
        // this.allMemberList.sort((a:any, b:any) => (a.firstName).localeCompare(b.firstName))
    },(error:any)=>{
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    })
  }
  getCategoryListData(){
    this.crmService.getCategoryList().subscribe((categoryList:any)=>{
      // console.log('category',categoryList);
      this.categoryListData.push(categoryList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }
  getLeadTypeListData(){
    this.crmService.getLeadType().subscribe((leadTypeList:any)=>{
      // console.log('leadTypeList',leadTypeList);
      this.leadTypeList.push(leadTypeList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getLeadStatusListData(){
    this.crmService.getLeadStatus().subscribe((leadStatus:any)=>{
      console.log('leadStatus',leadStatus);
      this.leadStatusList.push(leadStatus);
      if(this.crmService.leadActivityName==='Create' || this.crmService.leadActivityName==='subLeadCreate' || this.crmService.leadActivityName==='CreatE' || this.crmService.leadActivityName==='CreteLeadMaster'){
        this.leadStatusModal=this.leadStatusList[0][0].id;
      }
      else{
        this.leadStatusModal=this.updateValue.status.id
      }
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getLeadPriorityListData(){
    this.crmService.getLeadPriority().subscribe((leadPriority:any)=>{
      console.log('leadPriority',leadPriority);
      this.leadPriorityList.push(leadPriority);
      if(this.crmService.leadActivityName==='Create' || this.crmService.leadActivityName==='subLeadCreate' || this.crmService.leadActivityName==='CreatE' || this.crmService.leadActivityName==='CreteLeadMaster'){
        this.leadPriority=this.leadPriorityList[0][0].id;
      }else{
        this.leadPriority=this.updateValue.priority.id;
      }
      console.log( this.leadPriority)
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }


  goback() {
    this.locationobj.back();
  }
  resetErrors(){
    this.leadError = null;

  }
  autoGrowTextZone(e) {
    // console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15)+"px";
  }
  // leadTitle(event){
  //   // console.log(event)
  // }
  hamdleLeadTitle(leadTitleValue){
    // console.log('leadTitleValue',leadTitleValue)
    this.leadError=null
    this.boolenLeadError=false

  }
  handleLeadDescription(textareaValue) {
    // console.log(textareaValue)
    this.leadError=null
    this.boolenLeadError=false
  }
  selectManagerDialog(handleSelectManager:any){
    // console.log('handleselectMember',handleSelectManager);
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createleadSelectManager',
        header:'Assign Manager',
        memberList: this.allMemberList,
        assignMembername:handleSelectManager,
        updateSelectLeadManager:this.updateSelectLeadMangerDetailsToDialog,
        updateManagerId:this.updateManagerId,
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('afterSelectPopupValue',res)
    if(res===''){
      // console.log('Select lead manager')
      this.selectLeadManger = this.updateValue.manager.name;//'Select lead manager'

    }
    else{
      this.updateSelectLeadMangerDetailsToDialog=res;
    // console.log('updateSelectLeadMangerDetailsToDialog',this.updateSelectLeadMangerDetailsToDialog)
    this.selectLeadManger=((res.firstName + res.lastName))
    this.selectLeadMangerId= res.id;
    this.updateManagerId=this.selectLeadMangerId
    }
  })
  }
  
  selectMemberDialog(handleselectMember:any){
    // console.log('handleselectMember',handleselectMember)
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createleadSelectMember',
        header:'Assign Member',
        memberList: this.allMemberList,
        assignMembername:handleselectMember,
        updateSelectedMember:this.updateAssignMemberDetailsToDialog,
        updateAssignMemberId:this.updateMemberId
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('afterSelectPopupValue',res);
    if(res===''){
      // console.log('Select Manager')
      this.selectMember =  this.updateValue.assignee.name;//'Select Manager'
    }else{
      this.updateAssignMemberDetailsToDialog=res;
    console.log('this.updateAssignMemberDetailsToDialog',this.updateAssignMemberDetailsToDialog)
    this.selectMember = (res.firstName + res.lastName);
    this.userType = res.userType;
    // this.locationName = res.locationName;
    this.locationId = res.bussLocations[0];
    this.locationName = res.locationName;
    this.assigneeId= res.id;
    this.updateMemberId=this.assigneeId;
    this.updteLocationId= this.locationId;
    }
  })
  }
  hamdleLeadManager(leadManger){
    // console.log(leadManger)
  }
  handleLeadCategorySelection(leadCategory){
    // console.log(leadCategory)
    // this.boolenLeadError=false

  }
  handleLeadTypeSelection(leadType:any){
    // console.log('leadType',leadType)

  }
  handleLeadPrioritySelection(leadPriority,leadPriorityText:any){
    // console.log('leadPriority',leadPriority);
    // console.log('leadPriorityText',leadPriorityText)
    // console.log('this.createLeadForm.controls.userLeadPriority.value',this.createLeadForm.controls.userLeadPriority.value)
  }
  handleLeadLocation(leadLocation){
    // console.log(leadLocation)

  }
  handleLeadStatus(leadStatus){
    // console.log(leadStatus)

  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  handleDateChange(e){
    // this.bEstDuration=true;
    // this.updateBTimefield=false;
    // this.createBTimeField=true;
    
    // console.log(e)
    const date1= this.datePipe.transform(this.leadDueDate,'yyyy-MM-dd');
    this.selectedDate= date1;
    // console.log('date.',date1)
    const date2= this.datePipe.transform(new Date(),'yyyy-MM-dd');
    // console.log('date2',date2);
    if(date1> date2){
      const diffBtwDate = Date.parse(date1) - Date.parse(date2);
    const diffIndays = diffBtwDate / (1000 * 3600 * 24);
    this.dayGapBtwDate= diffIndays
    // console.log('diffInDays',diffIndays)
      // console.log('selected date graeter',date1)
    }
    else{
      const diffBtwDate = Date.parse(date2) - Date.parse(date1);
      // console.log('diffBtwDate',diffBtwDate)
    const diffIndays = diffBtwDate / (1000 * 3600 * 24);
    this.dayGapBtwDate= diffIndays
    // console.log('diffInDays',diffIndays);
      // console.log('both equal');
    }
    
  }
  handleLeadEstDuration(estDuration:any){
    // const time= this.datePipe.transform(new Date().getTime(),'HH');
    // const timeMInute= this.datePipe.transform(new Date().getTime(),'mm');
    // // console.log('time',time)
    // this.hour= time;
    // this.minute=timeMInute
    // // this.leadDueTime=this.datePipe.transform(estDuration,'d:h:mm')
    
    // console.log('estDurationb',estDuration)
    // if(estDuration<='24:00'){
    //   // console.log('...............gggg')
    //   this.transform(estDuration)
    // }
    console.log("entered")
    this.estDurationWithDay=this.leadDueDays;
    const estDurationDay=this.estDurationWithDay
    const estDurationHour=this.leadDueHrs
    const estDurationMinute= this.leadDueMin
    this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinute };
    console.log('estDurationDay',this.estTime)

  }
  openTimeField(){
    this.createBTimeField=true;
      this.updateBTimefield=false;
  }
  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 24 ? 'am' : 'pm';
    if(parseInt(hour) == 0)
     hour = 24;
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 24 ? hour - 24 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    // console.log('`${hour}:${min} ${part}`',`${hour}:${min} ${part}`);
    // if(hour<24){
      // const day:number=0;
      // if(this.dayGapBtwDate==0){
      //   // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
      //   this.selectedTime={ "days" : this.dayGapBtwDate, "hours" : 24-hour, "minutes" : 60-min };
      // }
      // else{
      //   // console.log('this.hour',this.hour)
      //   // console.log('hour',hour);
      //   if(this.hour >hour){
      //     this.selectedTime={ "days" : this.dayGapBtwDate, "hours" :this.hour-hour, "minutes" : this.minute-min };
      //     // console.log('this.selectedTime1',this.selectedTime)
      //   }
      //   else{
      //     this.selectedTime={ "days" : this.dayGapBtwDate, "hours" : hour-this.hour, "minutes" : min-this.minute };
      //     // console.log('this.selectedTime2',this.selectedTime)
      //   }
      // }
      return `${hour}:${min} ${part}`
    // }
    
  }
  handleTargetResult(targetResult){
    // console.log('targetResult',targetResult)
  }
  handleTargetPotential(targetPotential){
  // console.log('targetPotential',targetPotential)
  }
  showCreateLeadButtonCaption() {
    if(this.crmService.leadActivityName==='Create' || this.crmService.leadActivityName==='subLeadCreate' || this.crmService.leadActivityName==='CreatE' || this.crmService.leadActivityName==='CreteLeadMaster' ){
      let caption = '';
      caption = 'Add';
      return caption;
    }
    else{
      let caption = '';
      caption = 'Update';
      return caption;
    }
    
}
  saveCreateLead(){
    // this.api_loading = true;
    if(this.crmService.leadActivityName!='Create' && this.crmService.leadActivityName!='subLeadCreate' && this.crmService.leadActivityName!='CreatE' && this.crmService.leadActivityName !='CreteLeadMaster'){
      console.log("est time update data : ",this.estTime  )
      const updateLeadData:any = {
        "title":this.createLeadForm.controls.leadTitle.value,
        "description":this.createLeadForm.controls.leadDescription.value,
        "userType":this.updateUserType,
        "category":{"id":this.createLeadForm.controls.userLeadCategory.value},
        "type":{"id":this.createLeadForm.controls.userLeadType.value},
  
        "status":{"id":this.createLeadForm.controls.leadStatus.value},
        "priority":{"id":this.createLeadForm.controls.userLeadPriority.value},
        "dueDate" : this.datePipe.transform(this.leadDueDate,'yyyy-MM-dd'),
        "location" : { "id" : this.updteLocationId},
        "locationArea" : this.createLeadForm.controls.areaName.value,

  
        "assignee":{"id":this.updateMemberId },
        "manager":{"id":this.updateManagerId},
        "targetResult" : this.createLeadForm.controls.targetResult.value,
        "targetPotential" : this.createLeadForm.controls.targetPotential.value,
        "estDuration" : this.estTime    
      }
      console.log('updateLeadData',updateLeadData)
      if(this.updateUserType===('PROVIDER' || 'CONSUMER') && (this.createLeadForm.controls.leadTitle.value!=null)){
        // this.api_loading = true;
        console.log("2")
        this.boolenLeadError=false;
        console.log('updateLeadData',updateLeadData)
        this.crmService.updateLead(this.updateValue.leadUid, updateLeadData).subscribe((response)=>{
          console.log('afterUpdateList',response);
          setTimeout(() => {
            this.createLeadForm.reset();
          this.router.navigate(['provider', 'lead']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            // this.router.navigate(['provider', 'lead']);
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
     
      console.log(' this.updateUserType', this.updateUserType)

    }
    else{
    const createLeadData:any = {
      "parentLeadUid" : this.leadUid,
      "title":this.createLeadForm.controls.leadTitle.value,
      "description":this.createLeadForm.controls.leadDescription.value,
      "userType":this.userType,
      "category":{"id":this.createLeadForm.controls.userLeadCategory.value},
      "type":{"id":this.createLeadForm.controls.userLeadType.value},

      "status":{"id":this.createLeadForm.controls.leadStatus.value},
      "priority":{"id":this.createLeadForm.controls.userLeadPriority.value},
      "dueDate" : this.selectedDate,
      "location" : { "id" : this.locationId},
      "locationArea":this.areaName,
      "assignee":{"id":this.assigneeId},
      "manager":{"id":this.selectLeadMangerId},
      "targetResult" : this.createLeadForm.controls.targetResult.value,
      "targetPotential" : this.createLeadForm.controls.targetPotential.value,
      "estDuration" : this.estTime   
    }
    console.log('createLeadData',createLeadData)
    console.log('this.userType',this.userType)
    if(this.userType===('PROVIDER' || 'CONSUMER') && (this.createLeadForm.controls.leadTitle.value!=null)){
      // this.boolenLeadError=false;
      // this.api_loading = true;
      console.log("1")
      this.crmService.addLead(createLeadData).subscribe((response)=>{
        console.log('afterCreateList',response);
        setTimeout(() => {
          this.createLeadForm.reset();
        this.router.navigate(['provider', 'lead']);
        }, projectConstants.TIMEOUT_DELAY);
      },
      (error)=>{
        setTimeout(() => {
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
          // this.router.navigate(['provider', 'lead']);
        }, projectConstants.TIMEOUT_DELAY);
      })
    }
    }
  }
   onSubmitCraeteLeadForm(){
  }

}
