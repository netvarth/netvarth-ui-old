import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location, DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { LocalStorageService } from '../../../../../../../src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
// import { CrmSelectMemberComponent } from '../../../../shared/crm-select-member/crm-select-member.component'
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
// import { takeUntil } from 'rxjs/operators';
// import { Subject } from 'rxjs';
import { FileService } from '../../../../../../../src/app/shared/services/file-service';
// import { PreviewuploadedfilesComponent } from '../../../jaldee-drive/previewuploadedfiles/previewuploadedfiles.component';
import { CrmSelectMemberComponent } from '../../../../shared/crm-select-member/crm-select-member.component';
// import { PreviewuploadedfilesComponent } from '../../../jaldee-drive/previewuploadedfiles/previewuploadedfiles.component';
import { PreviewpdfComponent } from '../../../../../../../src/app/business/modules/crm/leads/view-lead-qnr/previewpdf/previewpdf.component';
@Component({
  selector: 'app-view-lead-qnr',
  templateUrl: './view-lead-qnr.component.html',
  styleUrls: ['./view-lead-qnr.component.css']
})
export class ViewLeadQnrComponent implements OnInit {

  public tooltipcls: any = '';
  public select_cap: any = Messages.SELECT_CAP;
  public newDateFormat: any = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  public perPage: any = projectConstants.PERPAGING_LIMIT;
  public apiloading: any = true;
  public availableDates: any = [];
  public minDate: any = new Date();
  public maxDate: any;
  public ddate: any;
  public api_loading: any = true;
  showCustomers = false;
  // private onDestroy$: Subject<void> = new Subject<void>();
  filter = {
    first_name: '',
    jaldeeid: '',
    last_name: '',
    date: null,
    mobile: '',
    countrycode: '',
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
  public createLeadForm: any;
  filteredCustomers: any;
  public leadError: null;
  public selectMember: any;
  public categoryListData: any = [];
  public allMemberList: any = [];
  public leadTypeList: any = [];
  public leadStatusList: any = [];
  public leadPriorityList: any = [];
  public userType: any;
  public locationName: any;
  public areaName: any;
  public locationId: any;
  public leadDueDate: any;
  public leadDueTime: any;
  public leadDueDays: any;
  public leadDueHrs: any;
  public leadDueMin: any;
  public selectedDate: any;
  public leadErrorText: any;
  public boolenLeadError: boolean = false;
  public assigneeId: any;
  public selectedTime: any;
  public selectLeadManger: any;
  public selectLeadMangerId: any;
  public selectLeadCustomer: any;
  public createBTimeField: boolean = false;
  public updateBTimefield: boolean = false;
  public dayGapBtwDate: any;
  public hour: any;
  public minute: any;
  customer_count: any = 0;
  //update variable;
  public updateValue: any;
  public updateTitleLead: any;
  public lead: any;
  public selectHeader: any;
  public updateUserType: any;
  public updateMemberId: any;
  public updateManagerId: any;
  public updateLeadId: any;
  public updteLocationId: any;
  leadUid: any;
  leadDetails: any;
  public minTime = new Date().getTime();
  public bEstDuration: boolean = false;
  public updateAssignMemberDetailsToDialog: any;
  public updateSelectLeadMangerDetailsToDialog: any;
  public sel_loc: any;
  leadStatusModal: any;
  leadPriority: any;
  public estDurationWithDay: any;
  public estTime: any;
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
  leadId: any;
  leadquestionnaireList: any = [];
  leadafterquestionnaireList: any = [];
  public headerName: string = 'Lead Overview';
  showQuestionnaire = false;
  questionAnswers; // questionaire answers
  catId: any;
  api_loading_video;
  public innerWidth: any;
  public customerInfoError: any = '';
  public editable: boolean = true;
  leadkid: any;
  leadTokens: any = []
  public notesList: any = []
  parentUid: any;
  updateLeadData: any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  selectedMessageCoApplicant = {
    files: [],
    base64: [],
    caption: []
  };
  selectedMessagePan = {
    files: [],
    base64: [],
    caption: []
  };
  selectedMessageCoApplicantPan={
    files: [],
    base64: [],
    caption: []
  }
  selectedMessagekyc = {
    files: [],
    base64: [],
    caption: []
  };
  selectedMessagekycCoApplicant = {
    files: [],
    base64: [],
    caption: []
  };
  fileData: any;
  fileDataCoApplicant: any;
  fileDataPan: any;
  fileDataPanCoApplicant:any;
  fileDatakyc1: any;
  fileDatakyc1CoApplicant: any;
  active_user: any;
  showKyc = false;
  kycDetails: any = []
  custId: any;
  custname: any;
  showupdateKyc = false;
  showqnr = false;
  showafterqnr = false;
  unreleased_arr: any;
  unreleased_question_arr: any;
  released_arr: any;
  released_arr1: any;
  qnrData: any;
  crifDetails: any;
  crifScore: any;
  fileviewdialogRef: any;
  firstCustomerName: any;
  customerName: any;
  customerPhNo: any;
  filestoUpload: any = [];
  kycresponse: ArrayBuffer;
  failedStatusId: any;
  idvalue1: any;
  idTypes1: any;
  idtypes1: any;
  addressType1: any;
  city1: any;
  address1: any;
  state1: any;
  pin1: any;
  nomineeType1: any;
  nomineeName1: any;
  panNumber1: any;
  crifStatusId: any;
  public notesTextarea:any;
  public isShown: boolean = false ;
  createCoApplicantForm:any;
  fromGroupListDynamic:any;
  count:number=0;
  formControlArray:any=[];
  formControlarr:any=[];
  coApplicantSubmitList:any=[];
  coApplicantListFormSubmit:any=[];
  coApplicantText:any;
  updateValueCoApplicant:any=[];
  stateList:any=[]
  crifHTML: any;
  showPdfIcon: boolean;
  isAnyCoapp: boolean = false ;
  constructor(private locationobj: Location,

    // private lStorageService: LocalStorageService,
    private router: Router,
    private provider_services: ProviderServices,
    private crmService: CrmService,
    public fed_service: FormMessageDisplayService,
    private createLeadFB: FormBuilder,
    private dialog: MatDialog, private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private wordProcessor: WordProcessor,
    private providerservices: ProviderServices,
    private _Activatedroute: ActivatedRoute,
    private providerService: ProviderServices,
    private groupService: GroupStorageService,
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
        console.log("leadDetails", this.leadDetails)
        this.leadkid = this.leadDetails.uid

        this.api_loading = false;
        this.getLeadToken();
        if (this.leadDetails && this.leadDetails.category && this.leadDetails.category.id) {
          this.catId = this.leadDetails.category.id
        }
        if (this.leadDetails && this.leadDetails.customer && this.leadDetails.customer.id) {
          this.custId = this.leadDetails.customer.id;
        }
        if (this.leadDetails&&this.leadDetails.customer&&this.leadDetails.customer.phoneNo) {
                  
          this.customerPhNo = this.leadDetails.customer.phoneNo;
        }
        if (this.leadDetails && this.leadDetails.customer && this.leadDetails.customer.name) {
          this.custname = this.leadDetails.customer.name;
          this.firstCustomerName = this.leadDetails.customer.name.charAt(0);
          this.customerName = this.leadDetails.customer.name;
        }
        if (this.leadDetails.status.name === 'New') {
          this.showKyc = true;
        }
        if (this.leadDetails.status.name === 'KYC Updated') {
          this.showupdateKyc = true;
          this.getKycDetails();
        }
        if (this.leadDetails.status.name === 'Credit Score Generated') {
          this.showqnr = true;
          this.getLeadQnr()
        }


        if (this.leadDetails.status.name === 'Sales Verified') {
          this.changeQnrStatus()
          this.showafterqnr = true;

          // this.showqnr = true;
        }

        this.leadDetails.notes.forEach((notesdata: any) => {
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

    this.selectMember = user.firstName + user.lastName;
    this.selectLeadManger = user.firstName + user.lastName;

    this.assigneeId = user.id;
    this.selectLeadMangerId = user.id;
    this.locationId = user.bussLocs[0]
    if (user.userType === 1) {
      this.userType = 'PROVIDER'
    }

    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    if (this.innerWidth <= 768) {
      this.placeholderTruncate(this.customer_label)
    }
    else {
      this.searchby = 'Search by ' + this.customer_label + ' id/name/email/phone number';
    }


    this._Activatedroute.paramMap.subscribe(params => {
      this.leadUid = params.get('leadid');
      if (this.leadUid) {
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

    this.api_loading = false;
    this.createLeadForm = this.createLeadFB.group({
      idTypes: [null],
      idTypes1: [null],
      idValue: [null],
      idValue1: [null],
      panNumber: [null],
      telephoneType: [null],
      telephoneNumber: [null],
      address: [null],
      addressType: [null],
      city: [null],
      state: [null],
      pin: [null],
      dob: [null],
      relationName: [null],
      relationType: [null],
      nomineeName: [null],
      nomineeType: [null],
      permanentAddress: [null],
      permanentCity: [null],
      permanentState: [null],
      permanentPinCode: [null]
    })
    this.createBTimeField = true;
    this.updateBTimefield = false;
    this.selectHeader = 'Add Lead';
    this.leadDueDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    this.selectedDate = this.leadDueDate;
    this.leadDueTime = "0000";

    this.estDurationWithDay = this.leadDueTime;
    const estDurationDay = this.datePipe.transform(this.estDurationWithDay, 'd')
    const estDurationHour = this.datePipe.transform(this.estDurationWithDay, 'h')
    const estDurationMinurte = this.datePipe.transform(this.estDurationWithDay, 'mm')
    this.estTime = { "days": estDurationDay, "hours": estDurationHour, "minutes": estDurationMinurte };
    // this.customer = { "id" :  this.selectLeadCustomerId};


    this.getAssignMemberList()
    this.getCategoryListData()
    this.getLeadTypeListData()
    this.leadStatus()
    // this.getNotesDetails()
    this.createCoApplicantForm=this.createLeadFB.group({
      // proposedAmmount:[null],
      nameCoApplicant:[null],
      phNOCoApplicant:[null],
      idTypesCoApplicant:[null],
      idValueCoApplicant:[null],
      panNumberCoApplicant:[null],
      telephoneTypeCoApplicant:[null],
      telephoneNumberCoApplicant:[null],
      addressCoAplicant:[null],
      cityCoApplicant:[null],
      stateCoApplicant:[null],
      pinCoApplicant:[null],
      dobCoApplicant:[null],
      relationNameCoApplicant:[null],
      relationTypeCoApplicant:[null],
      nomineeNameCoApplicant:[null],
      nomineeTypeCoApplicant:[null],
      permanentAddressCoApplicant:[null],
      permanentCityCoApplicant:[null],
      permanentStateCoApplicant:[null],
      permanentPinCodeCoApplicant:[null],
      idValue1CoApplicant:[null],
      idTypes1CoApplicant:[null],
      addressTypeCoApplicant:[null],
      idTypes2CoApplicant:[null],
      idValue2CoApplicant:[null],

    })
    this.getStateName()
  }
  getStateName(){
    this.crmService.getStateName().subscribe((res:any)=>{
      this.stateList.push(res)
    })
  }
  // getNotesDetails(){
  //   this.leadDetails.notes.forEach((notesdata: any) => {
  //     this.notesList.push(notesdata)
  //   })
  // }
  getKycDetails() {
    this.crmService.getkyc(this.leadkid).subscribe(data => {
      this.kycDetails = data;
      console.log(' this.kycDetails', this.kycDetails)
      this.updateValue = this.kycDetails[0];
      // this.updateValueCoApplicant= this.
      console.log(this.kycDetails)
      
      
      if (this.updateValue && this.updateValue.address && this.updateValue.address[0].addressType) {
        this.addressType1 = this.updateValue.address[0].addressType
      }
      if (this.updateValue && this.updateValue.address && this.updateValue.address[0].city) {
        this.city1 = this.updateValue.address[0].city
      }
      if (this.updateValue && this.updateValue.address && this.updateValue.address[0].address) {
        this.address1 = this.updateValue.address[0].address
      }
      if (this.updateValue && this.updateValue.address && this.updateValue.address[0].state) {
        this.state1 = this.updateValue.address[0].state
      }
      if (this.updateValue && this.updateValue.address && this.updateValue.address[0].pin) {
        this.pin1 = this.updateValue.address[0].pin
      }

      if (this.updateValue && this.updateValue.nomineeType) {
        this.nomineeType1 = this.updateValue.nomineeType
      }
      if (this.updateValue && this.updateValue.nomineeName) {
        this.nomineeName1 = this.updateValue.nomineeName
      }
      if (this.updateValue && this.updateValue.panNumber) {
        this.panNumber1 = this.updateValue.panNumber
      }
      if (this.updateValue && this.updateValue.validationIds[1] && this.updateValue.validationIds[1].idValue) {
        this.idvalue1 = this.updateValue.validationIds[1].idValue
      }
      if (this.updateValue && this.updateValue.validationIds[1] && this.updateValue.validationIds[1].idTypes) {
        this.idtypes1 = this.updateValue.validationIds[1].idTypes
      }
      console.log(this.updateValue)
      this.createLeadForm.patchValue({
        idTypes: this.updateValue.validationIds[0].idTypes,
        idTypes1: this.idtypes1,
        idValue: this.updateValue.validationIds[0].idValue,
        idValue1: this.idvalue1,
        telephoneType: this.updateValue.telephone[0].telephoneType,
        telephoneNumber: this.updateValue.telephone[0].telephoneNumber,
        relationType: this.updateValue.relationType,
        relationName: this.updateValue.relationName,
        permanentAddress: this.updateValue.permanentAddress,
        permanentCity: this.updateValue.permanentCity,
        permanentState: this.updateValue.permanentState,
        permanentPinCode: this.updateValue.permanentPinCode,
        nomineeType: this.nomineeType1,
        nomineeName: this.nomineeName1,
        addressType: this.addressType1,
        city: this.city1,
        address: this.address1,
        state: this.state1,
        pin: this.pin1,
        panNumber: this.panNumber1,
        dob: this.updateValue.dob

      })
      // this.kycDetails.forEach((item:any)=>{
      //   this.createCoApplicantForm.patchValue({
      //     nameCoApplicant:item.customerName,
      //     phNOCoApplicant:item.permanentPhoneNumber,
      //     idTypes1CoApplicant:item.validationIds.idTypes,
      //     idValue1CoApplicant:item.validationIds.idValue,
      //     idTypes2CoApplicant:item.validationIds.idTypes,
      //     idValue2CoApplicant:item.validationIds.idValue,
      //     panNumberCoApplicant:item.panNumber,
      //     telephoneTypeCoApplicant:item.telephone.telephoneType,
      //     telephoneNumberCoApplicant:item.telephone.telephoneNumber,
      //     permanentAddressCoApplicant:item.permanentAddress,
      //     permanentCityCoApplicant:item.permanentCity,
      //     permanentStateCoApplicant:item.permanentState,
      //     permanentPinCodeCoApplicant:item.permanentPinCode,
      //     dobCoApplicant:item.dob,
      //     relationNameCoApplicant:item.relationName,
      //     relationTypeCoApplicant:item.relationType,
      //     nomineeNameCoApplicant:item.nomineeName,
      //     nomineeTypeCoApplicant:item.nomineeType,
      //     addressTypeCoApplicant:item.address.addressType,
      //     addressCoAplicant:item.address.address,
      //     cityCoApplicant:item.address.city,
      //     stateCoApplicant:item.address.state,
      //     pinCoApplicant:item.address.pin
      //   })

       

      // })
      // this.getFormFields()
      // this.addCoApplicant()
      // this.createCoApplicantForm.controls.nameCoApplicant.value=this.kycDetails[1].customerName

    })
  }
  getLeadToken() {
    this.crmService.getLeadTokens(this.leadDetails.uid).subscribe(data => {
      this.leadTokens = data;

    })
  }


  getLeadQnr() {
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

    this.searchby = 'Enter ' + labelTerm + ' id/name/phone #';

    return `${value.substring(0, 4)}`;
  }
  getLeadmaster() {

  }
  getAssignMemberList() {
    this.crmService.getMemberList().subscribe((memberList: any) => {

      this.allMemberList.push(memberList)
      // this.allMemberList.sort((a:any, b:any) => (a.firstName).localeCompare(b.firstName))
    }, (error: any) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    })
  }
  getCategoryListData() {
    this.crmService.getLeadCategoryList().subscribe((categoryList: any) => {

      this.categoryListData.push(categoryList)
    },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }
    )
  }
  getLeadTypeListData() {
    this.crmService.getLeadType().subscribe((leadTypeList: any) => {

      this.leadTypeList.push(leadTypeList)
    },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }




  goback() {
    this.locationobj.back();
  }
  resetErrors() {
    this.leadError = null;

  }
  autoGrowTextZone(e) {
    // console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15) + "px";
  }
  // leadTitle(event){
  //   // console.log(event)
  // }
  hamdleLeadTitle(leadTitleValue) {
    // console.log('leadTitleValue',leadTitleValue)
    this.leadError = null
    this.boolenLeadError = false

  }
  handleidValue(textareaValue) {
    // console.log(textareaValue)
    this.leadError = null
    this.boolenLeadError = false
  }
  handleidValue1(textareaValue) {
    // console.log(textareaValue)
    this.leadError = null
    this.boolenLeadError = false
  }
  handletelephoneNumber(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  handlestate(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  handlepin(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  handledob(textareaValue) {
    console.log('textareaValue',textareaValue)
    this.leadError = null
    this.boolenLeadError = false
  }
  handlpanNumber(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  handlepermanentCity(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  handlepermanentState(textareaValue) {
    console.log('textareaValue',textareaValue)
    this.leadError = null
    this.boolenLeadError = false
  }
  handlepermanentPinCode(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  handlenomineeName(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  hamdleaddress(textareaValue) {
    console.log('textareaValue',textareaValue)
    this.leadError = null
    this.boolenLeadError = false
  }
  handlecity(textareaValue) {
    console.log('textareaValue',textareaValue)
    this.leadError = null
    this.boolenLeadError = false
  }
  handlerelationName(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }
  hamdlepermanentAddress(textareaValue) {
    this.leadError = null
    this.boolenLeadError = false
  }

  hamdleLeadManager(leadManger) {
    // console.log(leadManger)
  }
  handleLeadCategorySelection(leadCategory) {
    // console.log(leadCategory)
    // this.boolenLeadError=false

  }
  handleLeadTypeSelection(leadType: any) {
    console.log('leadType',leadType)

  }
  handleLeadPrioritySelection(leadPriority, leadPriorityText: any) {
    // console.log('leadPriority',leadPriority);
    // console.log('leadPriorityText',leadPriorityText)
    // console.log('this.createLeadForm.controls.userLeadPriority.value',this.createLeadForm.controls.userLeadPriority.value)
  }
  handleLeadLocation(leadLocation) {
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
    return api_filter;
  }













  handleLeadStatus(leadStatus) {
    // console.log(leadStatus)

  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  openTimeField() {
    this.createBTimeField = true;
    this.updateBTimefield = false;
  }
  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 24 ? 'am' : 'pm';
    if (parseInt(hour) == 0)
      hour = 24;
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > 24 ? hour - 24 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
  
    return `${hour}:${min} ${part}`
    // }

  }
  handleTargetResult(targetResult) {
    // console.log('targetResult',targetResult)
  }
  handleTargetPotential(targetPotential) {
    // console.log('targetPotential',targetPotential)
  }
  showCreateLeadButtonCaption() {
    if (this.crmService.leadActivityName === 'Create' || this.crmService.leadActivityName === 'subLeadCreate' || this.crmService.leadActivityName === 'CreatE' || this.crmService.leadActivityName === 'CreteLeadMaster') {
      let caption = '';
      caption = 'Add';
      return caption;
    }
    else {
      let caption = '';
      caption = 'Update';
      return caption;
    }

  }
  addressType(value){
    console.log('value',value)
  }
  saveCreateLead() {
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
    this.fileDataCoApplicant = [
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
    }
    for (const pic of this.selectedMessageCoApplicant.files) {
      // console.log("Uploaded Image : ", captions[i]);
      const size = pic["size"] / 1024;

      //parseInt(((Math.round(size/1024 * 100) / 100).toFixed(2))),

      if (pic["type"]) {
        this.fileDataCoApplicant = [
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
        this.fileDataCoApplicant = [
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
    }
    if (this.selectedMessage.files.length === 0) {
      this.fileData = [

      ];
    }
    if (this.selectedMessageCoApplicant.files.length === 0) {
      this.fileDataCoApplicant = [

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
    this.fileDataPanCoApplicant = [
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
    for (const pic of this.selectedMessageCoApplicantPan.files) {
      // console.log("Uploaded Image : ", captions[i]);
      const size = pic["size"] / 1024;

      //parseInt(((Math.round(size/1024 * 100) / 100).toFixed(2))),

      if (pic["type"]) {
        this.fileDataPanCoApplicant = [
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
        this.fileDataPanCoApplicant = [
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

    }
    if (this.selectedMessageCoApplicantPan.files.length === 0) {
      this.fileDataPanCoApplicant = [

      ];
    }
    if (this.selectedMessagePan.files.length === 0) {
      this.fileDataPan = [

      ];
    }
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.dob.value)
    // console.log('this.createLeadForm.controls.telephoneType.value',this.createLeadForm.controls.telephoneType.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.telephoneNumber.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.relationType.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.relationName.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.idTypes.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.idValue.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.idTypes1.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.idValue1.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.permanentAddress.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.permanentCity.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.permanentState.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.permanentPinCode.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.nomineeType.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.nomineeName.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.addressType.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.address.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.city.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.pin.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.state.value)
    // console.log('this.createLeadForm.controls.dob.value',this.createLeadForm.controls.panNumber.value)
    // console.log('fileDataPan',this.fileDataPan)
    
    const createLeadData: any = {
      "originFrom": "Lead",
      "originUid": this.leadkid,
      "customer": this.custId,
      "customerName": this.custname,
      "dob": this.createLeadForm.controls.dob.value,
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
        },
        {
          "idTypes": this.createLeadForm.controls.idTypes1.value,
          "idValue": this.createLeadForm.controls.idValue1.value,
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
          "addressType": this.createLeadForm.controls.addressType.value,
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
    }
    this.coApplicantListFormSubmit.push(createLeadData)
    if(this.isAnyCoapp){
      this.submitCoApplicant()
    }
    console.log('coApplicantListFormSubmit',this.coApplicantListFormSubmit)
    console.log('createLeadData',createLeadData)
    console.log('this.coApplicantSubmitList',this.coApplicantSubmitList)

    // this.boolenLeadError=false;
    // this.api_loading = true;

    this.crmService.addkyc(this.coApplicantListFormSubmit).subscribe((response) => {
      this.kycresponse = response;
      console.log('response',response)
      // this.uploadAudioVideo(this.kycresponse, 'kyc');
      setTimeout(() => {
        this.api_loading = true;
        this.crmService.getproceedStatus(this.coApplicantListFormSubmit).subscribe((response)=>{
          console.log('response',response)
        })
        this.createLeadForm.reset();
        // const navigationExtras: NavigationExtras = {
        //   queryParams: {
        //     type: 'LEAD'
        //   }
        // }
        // console.log(navigationExtras)
        this.router.navigate(['provider', 'crm']);
      }, projectConstants.TIMEOUT_DELAY);
      
    },
      (error) => {
        setTimeout(() => {
        //  this.coApplicantListFormSubmit=[]
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          // this.router.navigate(['provider', 'lead']);
        }, projectConstants.TIMEOUT_DELAY);
      })

    // this.uploadAudioVideo(this.kycresponse, 'kyc');
  }
  proposedAmmount(value){
    console.log('valueeeeeeeeeee',value)
    // console.log('value',this.createCoApplicantForm.controls.proposedAmmount.value)
  }
  deleteDynamicForm(length){
    this.isAnyCoapp = false;
    console.log('length',length)
    const index: number = this.formControlArray.indexOf(length);
    console.log('index',index)
      if (index === -1) {
          this.formControlArray.splice(index, 1);
      } 
  }
  addCoApplicant(){
    this.isAnyCoapp = true;
    // document.getElementById("reset").innerHTML;
    
    console.log(' this.coApplicantText', this.coApplicantText)
    // this.count++;
    console.log(this.count)
    if(this.count++){
      this.formGroup()
    }
  }
  formGroup(){
    this.fromGroupListDynamic = this.createLeadFB.array(this.getFormFields().map(item => this.createLeadFB.group(item)));

    this.createCoApplicantForm = this.createLeadFB.group({
      formField: this.fromGroupListDynamic
    });
    console.log(this.createCoApplicantForm);
  }
  getFormFields() {
    // this.formControlArray = [];
    const arrLength:number=1
    for (let i = 0; i < arrLength; i++) {
      this.formControlArray.push({ 
        // proposedAmmount:[null],
      nameCoApplicant:[null],
      phNOCoApplicant:[null],
      idTypesCoApplicant:[null],
      idValueCoApplicant:[null],
      panNumberCoApplicant:[null],
      telephoneTypeCoApplicant:[null],
      telephoneNumberCoApplicant:[null],
      addressCoAplicant:[null],
      cityCoApplicant:[null],
      stateCoApplicant:[null],
      pinCoApplicant:[null],
      dobCoApplicant:[null],
      relationNameCoApplicant:[null],
      relationTypeCoApplicant:[null],
      nomineeNameCoApplicant:[null],
      nomineeTypeCoApplicant:[null],
      permanentAddressCoApplicant:[null],
      permanentCityCoApplicant:[null],
      permanentStateCoApplicant:[null],
      permanentPinCodeCoApplicant:[null],
      idValue1CoApplicant:[null],
      idTypes1CoApplicant:[null],
      addressTypeCoApplicant:[null],
      idTypes2CoApplicant:[null],
      idValue2CoApplicant:[null],

      });
    }
    console.log('formControlArray',this.formControlArray)
    return this.formControlArray;
  }
  submitCoApplicant(){
   this.coApplicantSubmitList= this.createCoApplicantForm.controls.formField.value
    console.log('proposedAmmount',this.coApplicantSubmitList)
    // console.log('proposedAmmount',this.coApplicantSubmitList[0].proposedAmmount)
    this.coApplicantSubmitList.forEach((item:any)=>{
      console.log(item)
      const createKycCoApplicantData: any = {
        // "proposedAmmount":item.proposedAmmount,
        "originFrom": "Lead",
        "originUid": this.leadkid,
        // "customer": this.custId,
        "customerName": item.nameCoApplicant,
        "permanentPhoneNumber": item.phNOCoApplicant,
        "dob": item.dobCoApplicant,
        "telephone": [
          {
            "telephoneType": item.telephoneTypeCoApplicant,
            "telephoneNumber": item.telephoneNumberCoApplicant
          }
        ],
        "relationType": item.relationTypeCoApplicant,
        "relationName": item.relationNameCoApplicant,
        "validationIds": [
          {
            "idTypes": item.idTypes1CoApplicant,
            "idValue": item.idValue1CoApplicant,
            "attachments": this.fileDataCoApplicant
          },
          {
            "idTypes": item.idTypes2CoApplicant,
            "idValue": item.idValue2CoApplicant,
            "attachments": this.fileDataCoApplicant
          }
        ],
        "permanentAddress": item.permanentAddressCoApplicant,
        "permanentCity": item.permanentCityCoApplicant,
        "permanentState": item.permanentStateCoApplicant,
        "permanentPinCode": item.permanentPinCodeCoApplicant,
        "nomineeType": item.nomineeTypeCoApplicant,
        "nomineeName": item.nomineeNameCoApplicant,
        "address": [
          {
            "addressType": item.addressTypeCoApplicant,
            "address": item.addressCoAplicant,
            "city": item.cityCoApplicant,
            "state": item.stateCoApplicant,
            "pin": item.pinCoApplicant
          }
        ],
        "panNumber": item.panNumberCoApplicant,
        "panAttachments": this.fileDataPanCoApplicant,
        "parentid": {
          "id": this.custId
        },
        "parent": false
      }
      console.log('createKycCoApplicantDataaaa',createKycCoApplicantData)
      this.coApplicantListFormSubmit.push(createKycCoApplicantData)
      console.log('coApplicantListFormSubmit',this.coApplicantListFormSubmit)

    })
    
    
  }

  // createNew() {
  //   const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
  //     width: '100%',
  //     panelClass: ['popup-class', 'confirmationmainclass'],
  //     data: {
  //       requestType: 'createCustomer',
  //       header: 'Select' + this.customer_label,
  //     }
  //   })
  //   dialogRef.afterClosed().subscribe((res: any) => {

  //     if (res === '') {
  //       this.hideSearch = false;
  //     } else {
  //       const filter = { 'id-eq': res };
  //       this.provider_services.getCustomer(filter).subscribe((response: any) => {
  //         this.customer_data = response[0];

  //         this.hideSearch = true;
  //       },
  //         (error) => {
  //           this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
  //         })
  //     }

  //   })
  // }
  search() {
    this.hideSearch = false;
  }
  submitQnr() {
    if (this.leadquestionnaireList.labels && this.leadquestionnaireList.labels.length > 0) {
      this.submitQuestionnaire(this.leadDetails.uid);
    }
  }
  submitafterQnr() {
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
                    const navigationExtras: NavigationExtras = {
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
        const navigationExtras: NavigationExtras = {
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

                    const navigationExtras: NavigationExtras = {
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
        const navigationExtras: NavigationExtras = {
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
    if (this.unreleased_arr.length !== 0) {
      if (this.unreleased_arr && this.unreleased_arr[0].status === 'unReleased') {

        this.providerservices.changeLeadQuestionnaireStatus('released', this.leadkid, this.unreleased_arr[0].id).subscribe(data => {
          this.qnrData = data;
          if (this.qnrData === true) {
            this.getleadDetails();
          }

        },

          error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });

      }
    }

    else {
      this.getleadDetails();

    }

  }

  getAfterQnr() {
    this.released_arr = this.leadDetails.releasedQnr.filter(releasedQn => releasedQn.status === 'released');
    console.log(this.released_arr + ' this.released_arr')
    if (this.released_arr.length !== 0) {
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
    console.log('eventFileSelected',event);
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
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
  filesSelectedCoApplicant(event){
    console.log('eventFileSelected',event);
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessageCoApplicant.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessageCoApplicant.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  filesSelectedPan(event) {
    console.log('filesSelectedPan',event);
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
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
  filesSelectedPanCoApplicant(event){
    console.log('filesSelectedPan',event);
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessageCoApplicantPan.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessageCoApplicantPan.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  filesSelectedkycCoApplicant(event){
    console.log('filesSelectedkyc',event);
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessagekycCoApplicant.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessagekycCoApplicant.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  filesSelectedkyc(event) {
    console.log('filesSelectedkyc',event);
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessagekyc.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessagekyc.base64.push(e.target['result']);
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
    // selectedMessageCoApplicant
  }
  deleteTempImageCoApplicant(i) {
    this.selectedMessageCoApplicant.files.splice(i, 1);
    this.selectedMessageCoApplicant.base64.splice(i, 1);
    this.selectedMessageCoApplicant.caption.splice(i, 1);
    // selectedMessageCoApplicant
  }
  deleteTempImagePan(i) {
    this.selectedMessagePan.files.splice(i, 1);
    this.selectedMessagePan.base64.splice(i, 1);
    this.selectedMessagePan.caption.splice(i, 1);
  }
  deleteTempImagePanCoApplicant(i) {
    this.selectedMessageCoApplicantPan.files.splice(i, 1);
    this.selectedMessageCoApplicantPan.base64.splice(i, 1);
    this.selectedMessageCoApplicantPan.caption.splice(i, 1);
  }
  deleteTempImagekyc(i) {
    this.selectedMessagekyc.files.splice(i, 1);
    this.selectedMessagekyc.base64.splice(i, 1);
    this.selectedMessagekyc.caption.splice(i, 1);
  }
  deleteTempImagekycCoApplicant(i) {
    this.selectedMessagekycCoApplicant.files.splice(i, 1);
    this.selectedMessagekycCoApplicant.base64.splice(i, 1);
    this.selectedMessagekycCoApplicant.caption.splice(i, 1);
  }
  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  saveCrif() {
    const post_data = {
      "customer": {
        "id": this.custId,
        "name": this.custname,
      },
      'originUid': this.leadkid,
    };
    this.crmService.crifVerification(post_data).subscribe(
      () => {
        const navigationExtras: NavigationExtras = {
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
  // saveCrifApplicant() {
  //   const post_data = {
  //     "customer": {
  //       "id": this.custId,
  //       "name": this.custname,
  //     },
  //     'originUid': this.leadkid,
  //   };
  //   this.crmService.crifVerification(post_data).subscribe(
  //     (data) => {
  //       this.crifDetails = data;
  //       this.crifScore = this.crifDetails.crifScoreString
  //       // const navigationExtras: NavigationExtras =  {
  //       //   queryParams: {
  //       //     type: 'LEAD'
  //       //   }
  //       // }
  //       // this.router.navigate(['provider', 'lead'], navigationExtras);
  //     },
  //     error => {
  //     });
  // }
  getleadDetails() {
    this.crmService.getLeadDetails(this.leadkid).subscribe(data => {
      this.leadDetails = data;
      this.getAfterQnr()
    });
  }
  getImageType(fileType) {
    // console.log(fileType);
    return this.fileService.getImageByType(fileType);
  }
  // preview(file) {
  //   this.fileviewdialogRef = this.dialog.open(PreviewuploadedfilesComponent, {
  //     width: "100%",
  //     panelClass: [
  //       "popup-class",
  //       "commonpopupmainclass"
  //       // "uploadfilecomponentclass"
  //     ],
  //     disableClose: true,
  //     data: {
  //       file: file,
  //       type: 'kyc'
  //     }
  //   });
  //   this.fileviewdialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //     }
  //   });
  // }
  leadStatus() {
    this.crmService.getLeadStatus().subscribe((response: any) => {
      console.log(response);
      this.failedStatusId = response[3].id;
      this.crifStatusId = response[7].id;
      console.log('this.failedStatusId', this.failedStatusId)
    })
  }
  failedStatus() {
    this.crmService.addLeadStatus(this.leadDetails.uid, this.failedStatusId).subscribe((response) => {
      console.log('afterupdateFollowUpData', response);
      setTimeout(() => {
        this.router.navigate(['provider', 'crm']);
      }, projectConstants.TIMEOUT_DELAY);
    },
      (error) => {
        setTimeout(() => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }, projectConstants.TIMEOUT_DELAY);
      })
  }
  crifStatus() {
   
    this.crmService.addLeadStatus(this.leadDetails.uid, this.crifStatusId).subscribe((response) => {
      console.log('afterupdateFollowUpData', response);
      setTimeout(() => {
        this.router.navigate(['provider', 'crm']);
      }, projectConstants.TIMEOUT_DELAY);
    },
      (error) => {
        setTimeout(() => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }, projectConstants.TIMEOUT_DELAY);
      })
  }

  noteView(noteDetails: any) {
    console.log("notedetails", noteDetails);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        requestType: "noteDetails",
        header: "Remarks Details",
        noteDetails: noteDetails
      }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.ngOnInit();
      console.log("response", response);
    });
  }
  handleNotesDescription(textValue:any){
    console.log('taskDescription',textValue)
  }
  saveCreateNote(notesValue:any){
    if(this.notesTextarea !==undefined){
      console.log('this.notesTextarea',this.notesTextarea);
      const createNoteData:any = {
        "note" :this.notesTextarea
      }
        console.log('createNoteData',createNoteData)
        this.crmService.addLeadNotes(this.updateValue.originUid,createNoteData).subscribe((response:any)=>{
          console.log('response',response)
          this.api_loading = true;
          setTimeout(() => {
            // this.dialogRef.close(notesValue)
            this.ngOnInit()
            // this.getNotesDetails()
            this.api_loading = false;
          }, projectConstants.TIMEOUT_DELAY);
          this.snackbarService.openSnackBar('Remarks added successfully');
        },
        (error)=>{
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
        })
      // }
      
    }
  }
  toggleShow() {

    this.isShown = ! this.isShown;
    
    }

    
  // uploadAudioVideo(data, type) {
  //   console.log(data)

  //       const file = this.filestoUpload[data[0].url];
  //       this.providerService.videoaudioS3Upload(file, data[0].url)
  //         .subscribe(() => {


  //         },
  //           error => {
  //             this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });

  //           });

  // }

  saveCrifApplicant() {
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
        this.crifHTML = this.crifDetails.crifHTML;
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
      this.showPdfIcon = true;
  }
  preview(crif_data) {
    console.log("Files : ", this.customers)
    this.fileviewdialogRef = this.dialog.open(PreviewpdfComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'uploadfilecomponentclass'],
      disableClose: true,
      data: {
        crif: crif_data,
    type:'pdf_view'
      }
    });
    this.fileviewdialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
}

