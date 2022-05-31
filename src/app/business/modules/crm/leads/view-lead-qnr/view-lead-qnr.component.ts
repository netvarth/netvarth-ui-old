import { Component, OnInit} from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location,DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { LocalStorageService } from '../../../../../../../src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router ,NavigationExtras } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
// import { Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
// import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../../../../src/app/business/services/provider-services.service';
import { WordProcessor } from '../../../../../../../src/app/shared/services/word-processor.service';
// import { DateTimeProcessor } from '../../../../../../../src/app/shared/services/datetime-processor.service';
// import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FileService } from '../../../../../../../src/app/shared/services/file-service';
import { PreviewuploadedfilesComponent } from '../../../jaldee-drive/previewuploadedfiles/previewuploadedfiles.component';
@Component({
  selector: 'app-view-lead-qnr',
  templateUrl: './view-lead-qnr.component.html',
  styleUrls: ['./view-lead-qnr.component.css']
})
export class ViewLeadQnrComponent implements OnInit{
  
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
  showCustomers = false;
  private onDestroy$: Subject<void> = new Subject<void>();
  filter = {
    first_name: '',
    jaldeeid: '',
    last_name: '',
    date: null,
    mobile: '',
    countrycode:'',
    email: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  //form variable start
  public createLeadForm:any;
  filteredCustomers:any;
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
  public selectLeadCustomer:any;
  public createBTimeField:boolean=false;
  public updateBTimefield:boolean=false;
  public dayGapBtwDate:any;
  public hour:any;
  public minute:any;
  customer_count: any = 0;
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
  customer: any;
  customers: any = [];
  loadComplete: boolean;
  selectLeadCustomerId: any;
  customer_label: any;
  searchby = '';
  form_data: any;
  emptyFielderror = false;
  create_new = false;
  qParams: {};
  prefillnewCustomerwithfield = '';
  customer_data: any;
  show_customer = false;
  create_customer = false;
  disabledNextbtn = true;
  jaldeeId: any;
  formMode: string;
  countryCode;
  customer_email: any;
  search_input: any;
  hideSearch = false;
  leadMasterData: any;
  leadId:any;
  leadquestionnaireList: any = [];
  leadafterquestionnaireList: any = [];
  public headerName:string='Lead Overview';
  showQuestionnaire = false;
  questionAnswers; // questionaire answers
  catId: any;
  api_loading_video;
  public innerWidth:any;
  public customerInfoError:any='';
  public editable:boolean=true;
  leadkid: any;
  leadTokens:any=[]
  public notesList:any=[]
  parentUid: any;
  updateLeadData:any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  selectedMessagePan = {
    files: [],
    base64: [],
    caption: []
  };
  fileData: any;
  fileDataPan: any;
  active_user: any;
  showKyc = false;
  kycDetails:any=[]
  custId: any;
  custname: any;
  showupdateKyc= false;
  showqnr= false;
  showafterqnr= false;
  unreleased_arr:any;
  unreleased_question_arr: any;
  released_arr: any;
  released_arr1: any;
  qnrData:  any;
  crifDetails: any;
  crifScore: any;
  fileviewdialogRef: any;
  firstCustomerName:any;
  customerName:any;
  customerPhNo:any;
  constructor(private locationobj: Location,
  
    // private lStorageService: LocalStorageService,
    private router: Router,
    private provider_services: ProviderServices,
     private crmService: CrmService,
     public fed_service: FormMessageDisplayService,
     private createLeadFB: FormBuilder,
     private dialog: MatDialog, private snackbarService: SnackbarService,
     private datePipe:DatePipe,
     private wordProcessor: WordProcessor,
     private providerservices: ProviderServices,
     private _Activatedroute:ActivatedRoute,
     private providerService: ProviderServices,
     private groupService:GroupStorageService,
     private fileService: FileService,
    //  private dateTimeProcessor: DateTimeProcessor

     ) { 
      //this.router.navigate(['provider', 'lead','create-lead'])
     }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
    this.active_user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.api_loading = false;
    this._Activatedroute.paramMap.subscribe(params => { 
      this.leadUid = params.get('id');
      this.crmService.getLeadDetails(this.leadUid).subscribe(data => {
      
        this.leadDetails = data;
        console.log("leadDetails",this.leadDetails)
        this.leadkid = this.leadDetails.uid
        
        this.api_loading = false;
        this.getLeadToken();
        if(this.leadDetails && this.leadDetails.category && this.leadDetails.category.id){
          this.catId = this.leadDetails.category.id
        }
        



        if(this.leadDetails && this.leadDetails.customer && this.leadDetails.customer.id) {
          this.custId = this.leadDetails.customer.id;
          
        }
        if(this.leadDetails.customer){
          this.firstCustomerName=this.leadDetails.customer.name.charAt(0);
          this.customerName= this.leadDetails.customer.name;
          this.customerPhNo= this.leadDetails.customer.phoneNo;
        } 
        if(this.leadDetails && this.leadDetails.customer && this.leadDetails.customer.name) {
          this.custname = this.leadDetails.customer.name;
          
        }
        if(this.leadDetails.status.name === 'New') {
          this.showKyc = true;
        }
        if(this.leadDetails.status.name === 'KYC Updated') {
          this.showupdateKyc = true;
          this.getKycDetails();
        }
        if(this.leadDetails.status.name === 'Credit Score Generated') {
          this.showqnr = true;
          this.getLeadQnr()
        }
        
      
        if(this.leadDetails.status.name === 'Sales Verified') {
          this.changeQnrStatus()
          this.showafterqnr = true;
          
          // this.showqnr = true;
        }
      
        this.leadDetails.notes.forEach((notesdata:any)=>{
          this.notesList.push(notesdata)
        })
      
    })
    })
    this.crmService.leadToCraeteViaServiceData = this.updateLeadData;
   
    this._Activatedroute.queryParams.subscribe(qparams => {
      if (qparams.parentUid) {
          this.parentUid = qparams.parentUid;
      }
    });
    
   
  this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
      
        this.selectMember= user.firstName + user.lastName;
        this.selectLeadManger=user.firstName + user.lastName;
      
        this.assigneeId=user.id;
        this.selectLeadMangerId=user.id;
        this.locationId= user.bussLocs[0]
        if(user.userType === 1){
          this.userType='PROVIDER'
        }
      
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        if(this.innerWidth<=768){
          this.placeholderTruncate(this.customer_label)
        }
        else{
          this.searchby = 'Search by ' + this.customer_label + ' id/name/email/phone number';
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
      idTypes:[null],
      idValue:[null],
      panNumber:[null],
      telephoneType:[null],
      telephoneNumber:[null],
      address:[null],
      city:[null],
      state:[null],
      pin : [null],
      dob:[null],
      relationName:[null],
      relationType:[null],
      nomineeName:[null],
      nomineeType:[null],
      permanentAddress : [null],
      permanentCity:[null],
      permanentState:[null],
      permanentPinCode:[null]
    }) 
      this.createBTimeField=true;
      this.updateBTimefield=false;
        this.selectHeader='Add Lead';
        this.leadDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
       
        this.selectedDate = this.leadDueDate;
        this.leadDueTime= "0000" ;
       
        this.estDurationWithDay=this.leadDueTime;
        const estDurationDay=this.datePipe.transform(this.estDurationWithDay,'d')
        const estDurationHour=this.datePipe.transform(this.estDurationWithDay,'h')
        const estDurationMinurte= this.datePipe.transform(this.estDurationWithDay,'mm')
        this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
        // this.customer = { "id" :  this.selectLeadCustomerId};
      
    
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getLeadTypeListData()
  }
  getKycDetails(){
    this.crmService.getkyc(this.leadkid).subscribe(data => {
      this.kycDetails = data;
      this.updateValue = this.kycDetails[0];
     
       this.createLeadForm.patchValue({
        idTypes : this.updateValue.validationIds[0].idTypes,
        idValue:this.updateValue.validationIds[0].idValue,
        telephoneType:this.updateValue.telephone[0].telephoneType,
        telephoneNumber:this.updateValue.telephone[0].telephoneNumber,
        relationType:this.updateValue.relationType,
        relationName:this.updateValue.relationName,
        permanentAddress:this.updateValue.permanentAddress,
        permanentCity:this.updateValue.permanentCity,
        permanentState:this.updateValue.permanentState,
        permanentPinCode:this.updateValue.permanentPinCode,
        nomineeType:this.updateValue.nomineeType,
        nomineeName:this.updateValue.nomineeName,
        addressType:this.updateValue.address[0].addressType,
        city:this.updateValue.address[0].city,
        address:this.updateValue.address[0].address,
        state:this.updateValue.address[0].state,
        pin:this.updateValue.address[0].pin,
        panNumber:this.updateValue.panNumber
       
    })
  })
  if(this.updateValue.panAttachments[0]){

  }
  }
  getLeadToken(){
    this.crmService.getLeadTokens(this.leadDetails.uid).subscribe(data => {
      this.leadTokens = data;
    
  })
  }
  
  
  getLeadQnr(){
    this.crmService.getLeadQnrDetails(this.catId).subscribe(data => {
      this.leadquestionnaireList = data;
      if (this.leadquestionnaireList && this.leadquestionnaireList.labels && this.leadquestionnaireList.labels.length > 0) {
        this.showQuestionnaire = true;
    } 
  })
  }
  getQuestionAnswers(event) {
    this.questionAnswers = event;
  }
  placeholderTruncate(value: string, completeWords = true,) {
    let lastindex = 4;
    if (completeWords) {
      lastindex = value.substring(0, 4).lastIndexOf(' ');
   console.log(lastindex)
    }
    
    const labelTerm = value.substring(0, 4)
   
    this.searchby = 'Enter ' + labelTerm+ ' id/name/phone #';
  
    return `${value.substring(0, 4)}`;
  }
  getLeadmaster(){
   
  }
  getAssignMemberList(){
    this.crmService.getMemberList().subscribe((memberList:any)=>{
    
      this.allMemberList.push(memberList)
        // this.allMemberList.sort((a:any, b:any) => (a.firstName).localeCompare(b.firstName))
    },(error:any)=>{
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    })
  }
  getCategoryListData(){
    this.crmService.getLeadCategoryList().subscribe((categoryList:any)=>{
    
      this.categoryListData.push(categoryList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }
  getLeadTypeListData(){
    this.crmService.getLeadType().subscribe((leadTypeList:any)=>{
     
      this.leadTypeList.push(leadTypeList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
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
  handleidValue(textareaValue) {
    // console.log(textareaValue)
    this.leadError=null
    this.boolenLeadError=false
  }
  handletelephoneNumber(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlestate(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlepin(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handledob(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlpanNumber(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlepermanentCity(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlepermanentState(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlepermanentPinCode(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlenomineeName(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  hamdleaddress(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlecity(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  handlerelationName(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
  }
  hamdlepermanentAddress(textareaValue){
    this.leadError=null
    this.boolenLeadError=false
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

  
  setPaginationFilter(api_filter) {
    // if (this.customer_count <= 10) {
    //   this.pagination.startpageval = 1;
    // }
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }

  setFilterForApi() {
    const api_filter = {};
    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }
    if (this.filter.jaldeeid !== '') {
      api_filter['or=jaldeeId-eq'] = this.filter.jaldeeid + ',Mrid-eq=' + this.filter.jaldeeid;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    // if (this.filter.date != null) {
    //   api_filter['dob-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.date);
    // }
    // if (this.filter.email !== '') {
    //   api_filter['email-eq'] = this.filter.email;
    // }
    // if (this.filter.mobile !== '') {
    //   const pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
    //   const mval = pattern.test(this.filter.mobile);
    //   if (mval) {
    //     api_filter['phoneNo-eq'] = this.filter.mobile;
    //   } else {
    //     this.filter.mobile = '';
    //   }
    // }
    // if(this.filter.countrycode !== ''){
    //   api_filter['countryCode-eq'] = this.filter.countrycode;
    // }
    return api_filter;
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
   
    this.estDurationWithDay=this.leadDueDays;
    const estDurationDay=this.estDurationWithDay
    const estDurationHour=this.leadDueHrs
    const estDurationMinute= this.leadDueMin
    this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinute };
    

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
    let i = 0;
    this.fileData = [
      {
        owner: "",
        fileName: "",
        fileSize: "",
        caption: "",
        fileType: "",
        order: ""
      }
    ];
    for (const pic of this.selectedMessage.files) {
      // console.log("Uploaded Image : ", captions[i]);
      const size = pic["size"] / 1024;

      //parseInt(((Math.round(size/1024 * 100) / 100).toFixed(2))),
     
      if (pic["type"]) {
        this.fileData = [
          {
            owner: this.active_user.id,
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: pic["type"].split("/")[1],
            order: i++
          }
        ];
      } else {
        const picType = "jpeg";
        this.fileData = [
          {
            owner: this.active_user.id,
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: picType,
            order: i++
          }
        ];
      }
      // console.log("Selected File Is : ", this.fileData)
      // captions[i] = (this.imgCaptions[i]) ? this.imgCaptions[i] : '';
      // i++;
      // dataToSend.append('attachments', this.fileData);
     
    }
    if(this.selectedMessage.files.length === 0){
      this.fileData = [
        
      ];
    }
    let j = 0;
    this.fileDataPan = [
      {
        owner: "",
        fileName: "",
        fileSize: "",
        caption: "",
        fileType: "",
        order: ""
      }
    ];
    for (const pic of this.selectedMessagePan.files) {
      // console.log("Uploaded Image : ", captions[i]);
      const size = pic["size"] / 1024;

      //parseInt(((Math.round(size/1024 * 100) / 100).toFixed(2))),
    
      if (pic["type"]) {
        this.fileDataPan = [
          {
            owner: this.active_user.id,
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: pic["type"].split("/")[1],
            order: j++
          }
        ];
      } else {
        const picType = "jpeg";
        this.fileDataPan = [
          {
            owner: this.active_user.id,
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: picType,
            order: j++
          }
        ];
      }
      // console.log("Selected File Is : ", this.fileData)
      // captions[i] = (this.imgCaptions[i]) ? this.imgCaptions[i] : '';
      // i++;
      // dataToSend.append('attachments', this.fileData);
     
    }
    if(this.selectedMessagePan.files.length === 0){
      this.fileDataPan = [
        
      ];
    }
    const createLeadData:any =[{
      "originFrom": "Lead",
      "originUid": this.leadkid,
      "customer": this.custId,
      "customerName": this.custname,
      "dob": "2022-05-27",
      "telephone": [
        {
          "telephoneType": this.createLeadForm.controls.telephoneType.value,
          "telephoneNumber": this.createLeadForm.controls.telephoneNumber.value
        }
      ],
      "relationType": this.createLeadForm.controls.relationType.value,
      "relationName": this.createLeadForm.controls.relationName.value,
      "validationIds": [
        {
          "idTypes": this.createLeadForm.controls.idTypes.value,
          "idValue": this.createLeadForm.controls.idValue.value,
          "attachments": this.fileData
        }
      ],
      "permanentAddress": this.createLeadForm.controls.permanentAddress.value,
      "permanentCity": this.createLeadForm.controls.permanentCity.value,
      "permanentState": this.createLeadForm.controls.permanentState.value,
      "permanentPinCode": this.createLeadForm.controls.permanentPinCode.value,
      "nomineeType": this.createLeadForm.controls.nomineeType.value,
      "nomineeName": this.createLeadForm.controls.nomineeName.value,
      "address": [
        {
          "addressType": "Residence",
          "address": this.createLeadForm.controls.address.value,
          "city": this.createLeadForm.controls.city.value,
          "state": this.createLeadForm.controls.state.value,
          "pin": this.createLeadForm.controls.pin.value
        }
      ],
      "panNumber": this.createLeadForm.controls.panNumber.value,
      "panAttachments": this.fileDataPan,
      // "parentid": {
      //   "id": ''
      // },
      "parent": true
    }]
  
      // this.boolenLeadError=false;
      // this.api_loading = true;
     
      this.crmService.addkyc(createLeadData).subscribe((response)=>{
      
        setTimeout(() => {
          this.api_loading = true;
          this.createLeadForm.reset();
          const navigationExtras: NavigationExtras =  {
            queryParams: {
              type: 'LEAD'
            }
          }
          console.log(navigationExtras)
        this.router.navigate(['provider', 'crm']);
        }, projectConstants.TIMEOUT_DELAY);
      },
      (error)=>{
        setTimeout(() => {
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
          // this.router.navigate(['provider', 'lead']);
        }, projectConstants.TIMEOUT_DELAY);
      })
    
    
  }
   onSubmitCraeteLeadForm(){
  }

  
  searchCustomer() {
    this.emptyFielderror = false;
    if (this.createLeadForm.controls.customerDetails.value && this.createLeadForm.controls.customerDetails.value === '') {
      this.emptyFielderror = true;
    }

    else {
      this.qParams = {};
      let mode = 'id';
      this.form_data = null;
      let post_data = {};
      const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const isEmail = emailPattern.test(this.createLeadForm.controls.customerDetails.value);
      if (isEmail) {
        mode = 'email';
        this.prefillnewCustomerwithfield = 'email';
      } else {
        const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const isNumber = phonepattern.test(this.createLeadForm.controls.customerDetails.value);
        const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
        const isCount10 = phonecntpattern.test(this.createLeadForm.controls.customerDetails.value);
        if (isNumber && isCount10) {
          mode = 'phone';
          this.prefillnewCustomerwithfield = 'phone';
        } 
        else if (isNumber && this.createLeadForm.controls.customerDetails.value.length >7) {
          mode = 'phone';
          this.prefillnewCustomerwithfield = 'phone';
        } else if (isNumber && this.createLeadForm.controls.customerDetails.value.length <7 ) {
          mode = 'id';
          this.prefillnewCustomerwithfield = 'id';
        }
      }
     

      switch (mode) {
        case 'phone':
          post_data = {
            'phoneNo-eq': this.createLeadForm.controls.customerDetails.value
          };
          this.qParams['phone'] = this.createLeadForm.controls.customerDetails.value;
          break;
        case 'email':
          post_data = {
            'email-eq': this.createLeadForm.controls.customerDetails.value
          };
          this.qParams['email'] = this.createLeadForm.controls.customerDetails.value;
          break;
        case 'id':
          post_data['or=jaldeeId-eq'] = this.createLeadForm.controls.customerDetails.value + ',firstName-eq=' + this.createLeadForm.controls.customerDetails.value;
          // post_data = {
          //   'jaldeeId-eq': form_data.search_input
          // };
          break;
      }

      this.provider_services.getCustomer(post_data)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (data: any) => {
            this.customer_data = [];
            if (data.length === 0) {
              this.show_customer = false;
              this.create_customer = true;

              this.createNew();
            } else {
              if (data.length > 1) {
                // const customer = data.filter(member => !member.parent);
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
  createNew(){
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createCustomer',
        header:'Select' + this.customer_label,
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
  
    if(res=== ''){
      this.hideSearch = false;
    }else{
      const filter = { 'id-eq': res };
      this.provider_services.getCustomer(filter).subscribe((response:any)=>{
        this.customer_data = response[0];
       
        this.hideSearch = true;
      },
      (error)=>{
        this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      })
    }
   
  })
  }
  search(){
    this.hideSearch = false;
  }
  submitQnr(){
    if (this.leadquestionnaireList.labels && this.leadquestionnaireList.labels.length > 0) {
      this.submitQuestionnaire(this.leadDetails.uid);
  }
  }
  submitafterQnr(){
    if (this.unreleased_question_arr[0].labels && this.unreleased_question_arr[0].labels.length > 0) {
      this.submitAfterQuestionnaire(this.leadDetails.uid);
  }
  }
  submitQuestionnaire(uuid) {
    const dataToSend: FormData = new FormData();
    // if (this.questionAnswers.files) {
    //     for (const pic of this.questionAnswers.files) {
    //         dataToSend.append('files', pic['name']);
    //     }
    // }
    const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    this.providerService.submitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        let postData = {
            urls: []
        };
        if (data.urls && data.urls.length > 0) {
            for (const url of data.urls) {
                this.api_loading_video = true;
                const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
                this.provider_services.videoaudioS3Upload(file, url.url)
                    .subscribe(() => {
                        postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                        if (data.urls.length === postData['urls'].length) {
                            this.provider_services.providerLeadQnrUploadStatusUpdate(uuid, postData)
                                .subscribe((data) => {
                                    // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('APPOINTMNT_SUCC'));
                                    const navigationExtras: NavigationExtras =  {
                                      queryParams: {
                                        type: 'LEAD'
                                      }
                                    }
                                    //  this.router.navigate(['provider', 'crm'], navigationExtras);
                                    console.log(navigationExtras)
        this.router.navigate(['provider', 'crm']);
                                },
                                    error => {
                                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                        this.api_loading = false;
                                        this.api_loading_video = false;
                                    });
                        }
                    },
                  
                        error => {
                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                            this.api_loading = false;
                            this.api_loading_video = false;
                        });
            }
           
        } else {
            // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('APPOINTMNT_SUCC'));
            const navigationExtras: NavigationExtras =  {
              queryParams: {
                type: 'LEAD'
              }
            }
            //  this.router.navigate(['provider', 'crm'], navigationExtras);\
            console.log(navigationExtras)
        this.router.navigate(['provider', 'crm']);
        }
    }, error => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        this.api_loading = false;
        this.api_loading_video = false;
    });
  }
  submitAfterQuestionnaire(uuid) {
    const dataToSend: FormData = new FormData();
    // if (this.questionAnswers.files) {
    //     for (const pic of this.questionAnswers.files) {
    //         dataToSend.append('files', pic['name']);
    //     }
    // }
    const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    this.providerService.submitProviderLeadQuestionnaire(dataToSend, uuid).subscribe((data: any) => {
        let postData = {
            urls: []
        };
        if (data.urls && data.urls.length > 0) {
            for (const url of data.urls) {
                this.api_loading_video = true;
                const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
                this.provider_services.videoaudioS3Upload(file, url.url)
                    .subscribe(() => {
                        postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                        if (data.urls.length === postData['urls'].length) {
                            this.provider_services.providerLeadQnrafterUploadStatusUpdate(uuid, postData)
                                .subscribe((data) => {
                                    // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('APPOINTMNT_SUCC'));
                                   
                                    const navigationExtras: NavigationExtras =  {
                                      queryParams: {
                                        type: 'LEAD'
                                      }
                                    }
                                    //  this.router.navigate(['provider', 'crm'], navigationExtras);
                                    console.log(navigationExtras)
        this.router.navigate(['provider', 'crm']);
                                },
                                    error => {
                                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                        this.api_loading = false;
                                        this.api_loading_video = false;
                                    });
                        }
                    },
                  
                        error => {
                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                            this.api_loading = false;
                            this.api_loading_video = false;
                        });
            }
           
        } else {
            // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('APPOINTMNT_SUCC'));
            const navigationExtras: NavigationExtras =  {
              queryParams: {
                type: 'LEAD'
              }
            }
            // this.router.navigate(['provider', 'crm'], navigationExtras);
            console.log(navigationExtras)
        this.router.navigate(['provider', 'crm']);
        }
    }, error => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        this.api_loading = false;
        this.api_loading_video = false;
    });
  }
  changeQnrStatus() {
    this.unreleased_arr = this.leadDetails.releasedQnr.filter(releasedQn => releasedQn.status === 'unReleased');
    if(this.unreleased_arr.length !== 0){
      if(this.unreleased_arr && this.unreleased_arr[0].status === 'unReleased'){
      
        this.providerservices.changeLeadQuestionnaireStatus('released',this.leadkid, this.unreleased_arr[0].id).subscribe(data => {
          this.qnrData = data;
          if(this.qnrData === true){
            this.getleadDetails();
          }
         
        },
        
          error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
         
      }
    }
   
    else{
      this.getleadDetails();
          
    }
     
  }
 
  getAfterQnr(){
  this.released_arr = this.leadDetails.releasedQnr.filter(releasedQn => releasedQn.status === 'released');
         console.log( this.released_arr + ' this.released_arr')
  if(this.released_arr.length !==0){
    this.crmService.getLeadafterQnrDetails(this.leadkid).subscribe(data => {
      this.leadafterquestionnaireList = data;
    
      this.unreleased_question_arr = this.leadafterquestionnaireList.filter(releasedquestion => releasedquestion.id === this.released_arr[0].id);
    
      if (this.unreleased_question_arr && this.unreleased_question_arr[0].labels && this.unreleased_question_arr[0].labels.length > 0) {
     
        this.showQuestionnaire = true;
    } 
  })
  }
  
  }
  filesSelected(event) {
   
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  filesSelectedPan(event) {
  
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessagePan.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessagePan.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
  }
  deleteTempImagePan(i) {
    this.selectedMessagePan.files.splice(i, 1);
    this.selectedMessagePan.base64.splice(i, 1);
    this.selectedMessagePan.caption.splice(i, 1);
  }
  getImage(url, file) {
    return this.fileService.getImage(url, file);
}
saveCrif(){
  const post_data = {
    "customer": {
      "id": this.custId,
      "name": this.custname,
    },
    'originUid': this.leadkid,
};
this.crmService.crifVerification(post_data).subscribe(
  () => {
    const navigationExtras: NavigationExtras =  {
      queryParams: {
        type: 'LEAD'
      }
    }
    // this.router.navigate(['provider', 'crm'], navigationExtras);
    console.log(navigationExtras)
        this.router.navigate(['provider', 'crm']);
  },
  error => {
  });
}
saveCrifApplicant(){
  const post_data = {
    "customer": {
      "id": this.custId,
      "name": this.custname,
    },
    'originUid': this.leadkid,
};
this.crmService.crifVerification(post_data).subscribe(
  (data) => {
    this.crifDetails = data;
    this.crifScore =  this.crifDetails.crifScoreString
    // const navigationExtras: NavigationExtras =  {
    //   queryParams: {
    //     type: 'LEAD'
    //   }
    // }
    // this.router.navigate(['provider', 'lead'], navigationExtras);
  },
  error => {
  });
}
getleadDetails(){
  this.crmService.getLeadDetails(this.leadkid).subscribe(data => {
    this.leadDetails = data;
    this.getAfterQnr()
  });
}
getImageType(fileType) {
  // console.log(fileType);
   return this.fileService.getImageByType(fileType);
}
preview(file) {
  this.fileviewdialogRef = this.dialog.open(PreviewuploadedfilesComponent, {
    width: "100%",
    panelClass: [
      "popup-class",
      "commonpopupmainclass"
      // "uploadfilecomponentclass"
    ],
    disableClose: true,
    data: {
      file: file
    }
  });
  this.fileviewdialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}
}

