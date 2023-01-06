import { Component, OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ProviderServices } from "../../../../services/provider-services.service";
import { Observable,of } from "rxjs";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { UntypedFormGroup,UntypedFormBuilder, Validators} from "@angular/forms";
import { FormMessageDisplayService } from "../../../../../shared/modules/form-message-display/form-message-display.service";
import { CreateReminderComponent } from "./create-reminder/create-reminder.component";
import { GroupStorageService } from "../../../../../shared/services/group-storage.service";
import { ConfirmBoxComponent } from "../../../../../business/shared/confirm-box/confirm-box.component";
import * as moment from "moment";
import { DateTimeProcessor } from "../../../../../shared/services/datetime-processor.service";
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { map, startWith } from 'rxjs/operators';
import { Messages } from '../../../../../shared/constants/project-messages';
declare var $: any;
@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  styleUrls: ["./reminder.component.css"]
})
export class ReminderComponent implements OnInit {
  isCreate: boolean = false;
  amForm: UntypedFormGroup;
  tempAcId: any;
  phone: any;
  filteredCustomers: Observable<string[]>;
  selectedConsumers: any[] = [];
  date = new Date();
  serializedDate = new Date().toISOString();
  selectedTimes: any[] = [];
  selectedTimeslot:any;
  providerId: any;
  selectedConsumer: any;
  reminders: any[] = [];
  allReminderCounts = 0;
  selectedTime: any[]=[];
  reminderdialogRef: any;
  reminderDetails: any;
  reminderId: any;
  qParams = {};
  showBlockHint = false;
  totalName: string = '';
  customer_data: any;
  emptyFielderror = false;
    provider_label = '';
    create_new = false;
    form_data = null;
    customer_label = '';
    options: any[] = [];
  reminder = {
    name: "",
    message: "",
    fromDate: "",
    toDate: "",
    time: "",
    sms: true,
    email: false,
    phoneNumber: false
  };
  filter = {
    //projectConstantsLocal.PERPAGING_LIMIT
    page_count: projectConstantsLocal.PERPAGING_LIMIT,
    page: 1
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  searchForm: UntypedFormGroup;
  categoryForSearchingarray = ['Search with PhoneNumber','Search with Name or ID', 'Search with Email ID'];
  categoryvalue = 'Search with PhoneNumber';
  countryCodePhone = '+91';
  placeholderTemp: any = '7410410123';
  isEdit: boolean = false;
  selectedDay: string;
  selectedPhone: any;
  isTimeClicked: boolean = false;
  selectedId:any;
  providerFirstName: any;
  providerLastName: any;
  completedReminderCount = 0;
  hide: boolean = false;
  hideTime:boolean = false;
  isTimeNotSelected: boolean = false;
  reminder_title: any;
  isSelectedActive = false;
  isSelectedInActive = false;
  select_All = Messages.SELECT_ALL;
  selday_arr: any = [];
  weekdays = projectConstantsLocal.myweekdaysSchedule;
  Selall = false;
  constructor(
    private router: Router,
    public fed_service: FormMessageDisplayService,
    public location: Location,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private providerService: ProviderServices,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private activated_route: ActivatedRoute,
    private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor,


  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.activated_route.queryParams.subscribe(qparams => {
        if(qparams.id){
          this.selectedId = qparams.id;
          this.hide = true;
          // console.log("from patientsss :",this.selectedId);
          // this.editReminder(this.selectedId)
        }
    });
  }

  ngOnInit(): void {
    this.createForm();
    if(this.selectedId){
      console.log("from patientsss :",this.selectedId);
      this.getCustomerbyId(this.selectedId);
      this.editReminder();
    }
    this.pagination.startpageval = this.groupService.getitemFromGroupStorage('paginationStart') || 1;
     //this.getReminders();
     this.getActiveReminders();
    //this.getReminderCounts();
    this.getCompletedReminderCount();
    this.getAllReminderCount();
    this.bisinessProfile();
    const user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.providerId = user.id;
    this.providerFirstName = user.firstName;
    this.providerLastName = user.lastName;
    console.log("user :", user);
    const newdate = this.date;
    console.log("New Date :", newdate);
    const futrDte = new Date(newdate);
    console.log("Future Date :", futrDte);
    const obtmonth = futrDte.getMonth() + 1;
    let cmonth = "" + obtmonth;
    if (obtmonth < 10) {
      cmonth = "0" + obtmonth;
    }
    this.selectedDay =
      futrDte.getFullYear() + "-" + cmonth + "-" + futrDte.getDate();
    // this.selectedDay = seldate;
    console.log("Selected Date :",this.selectedDay);
    
  }






  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    //this.groupService.setitemToGroupStorage('customerPage', pg);
    this.filter.page = pg;
    //'pageclick'
    this.doSearch();
  }

  doSearch(type?) {
    if(this.isSelectedActive){
      this.getActiveReminders();
    }
    if(this.isSelectedInActive){
      this.getInActiveReminders();
    }

  }
  setPaginationFilter(api_filter) {
    if(this.isSelectedActive){
      if (this.allReminderCounts <= 10) {
        this.pagination.startpageval = 1;
      }
    }
    if(this.isSelectedInActive){
      if (this.completedReminderCount <= 10) {
        this.pagination.startpageval = 1;
      }
    }
    
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  setFilterForApi() {
    const api_filter = {};
      if (this.isSelectedActive) {
        api_filter['completed-eq'] = false;
      }
      if (this.isSelectedInActive) {
        api_filter['completed-eq'] = true;
      }
    return api_filter;
  }
  getActiveReminders(){
   // const filter = { 'completed-eq': 'false'};
    this.isSelectedActive = true;
    this.isSelectedInActive=false;
    let filter = {};
    filter = this.setFilterForApi();
    filter = this.setPaginationFilter(filter);
    this.providerService.getReminders(filter)
        .subscribe(
            (data:any) => {
                this.reminders = data;
                console.log("Active reminders :",data);
            });
  }

  getInActiveReminders(){
    this.isSelectedInActive = true;
    this.isSelectedActive = false;
    let filter = {};
    filter = this.setFilterForApi();
    filter = this.setPaginationFilter(filter);
   // const filter = { 'completed-eq': 'true'};
    this.providerService.getReminders(filter)
        .subscribe(
            (data:any) => {
                this.reminders = data;
                console.log("In Active reminders :",data);
            });
  }
  getAllReminderCount() {
    const filter = { 'completed-eq': 'false'};
    this.providerService.getCompletedReminderCount(filter)
        .subscribe(
            (data:any) => {
                this.allReminderCounts = data;
                this.pagination.totalCnt = data;
                console.log("All reminders :",data);
            });
}
getCompletedReminderCount() {
  const filter = { 'completed-eq': 'true'};
  this.providerService.getCompletedReminderCount(filter)
      .subscribe(
        (data:any) => {
              this.completedReminderCount = data;
              this.pagination.totalCnt = data;
              console.log("Completed reminders :",data);
          });
}

resetApiErrors() {
  // this.emailerror = null;
  // this.email1error = null;
  // this.phoneerror = null;
}
// getSchedulesCount() {
//     const filter = { 'state-eq': 'ENABLED' };
//     this.providerService.getSchedulesCount(filter)
//         .subscribe(
//             data => {
//                 this.schedules_count = data;
//                 console.log("app-appointmentmanager shedules :",this.schedules_count)
//             });
// }
handleCategoryselect(data) {
  console.log(data);
  this.searchForm.patchValue({
    search_input: ''
  });
  this.filteredCustomers = of([]);
}
filterOption() {
  this.filteredCustomers = this.searchForm.controls.search_input.valueChanges.pipe(startWith(''), map((value: any) => this._filter(value || '')),
  );
}
_filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.options.filter(option => option.toLowerCase().includes(filterValue));
}
  getCustomerbyId(id) {
    const filter = { 'id-eq': id };
    this.providerService.getCustomer(filter)
        .subscribe(
            (data: any) => {
              console.log("Respooooos :",data);
              //this.selectedConsumers = data;
              this.reminderId = 0;
              (this.reminder.fromDate = this.selectedDay);
              (this.reminder.toDate = this.selectedDay);
              this.selectedCustomerViaPhoneSearch(data[0],'edit');
              this.selectedCustomerViaEmail_Name_ID(data[0],'form_data','edit');
              this.initCustomerDetails(data[0],'edit');
              // this.selectedConsumer = data[0];
              // this.selectedConsumers.push(data[0]);
             // this.selectedConsumers.push(data);
                // if (data.length > 1) {
                //     const customer = data.filter(member => !member.parent);
                //     this.customer_data = customer[0];
                //     this.foundMultiConsumers = true;
                // } else {
                //     this.customer_data = data[0];
                //     this.foundMultiConsumers = false;
                // }
                // this.jaldeeId = this.customer_data.jaldeeId;
                // if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
                //     this.countryCode = this.customer_data.countryCode;
                // } else {
                //     this.countryCode = '+91';
                // }
                // this.waitlist_for.push({ id: data[0].id, firstName: data[0].firstName, lastName: data[0].lastName, apptTime: this.apptTime });
                // this.saveCheckin();
            });
}
  showTimePopup() {
    //this.selectedTimes = [];
   // this.isTimeClicked = true;
  
    const dialogref = this.dialog.open(CreateReminderComponent, {
      width: "40%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "updatenotificationclass"
      ],
      disableClose: true,
      data: {
        mode: "time"
      }
    });
  
    dialogref.afterClosed().subscribe(result => {
      // this.selectedTime =
      // timeSlot.hour +
      //   ":" +
      //   timeSlot.minute +
      //   " " + timeSlot.mode
       // (timeSlot.hour > 12 ? "PM" : "AM");
      console.log("selected time :", this.selectedTime);
      if (result !== undefined) {
        const hour = parseInt(
          moment(result.hour, [
            "hh:mm A"
          ]).format("hh"),
          10
        );
      const timeSlot = {
        hour:hour < 10 ? '0'+hour : hour,
        minute: result.minute < 10 ? '0'+result.minute : result.minute,
        mode:result.mode
        // parseInt(
        //   moment(result.minute, [
        //     "hh:mm A"
        //   ]).format("mm"),10
        // )
      };
    // timeSlot['hour'] < 10 ? '0'+timeSlot['hour'] : timeSlot['hour'];
    //  timeSlot['minute'] < 10 ? '0'+timeSlot['minute'] : timeSlot['minute']
    //     timeSlot['minute'] = result.minute < 10 ? '0'+result.minute : result.minute

      //timeSlot.hour < 10 ? '0'+timeSlot.hour : timeSlot.hour
      console.log("Time selllll :",timeSlot);
      
       const time = {
          'sTime':timeSlot.hour +
          ":" +
          timeSlot.minute +
          " " + timeSlot.mode,
          'eTime':timeSlot.hour +
          ":" +
          timeSlot.minute +
          " " + timeSlot.mode
         };
         if(time){
          this.selectedTime.push(time);
         }
         this.selectedTimes.push(timeSlot);
          console.log("slot:", this.selectedTime);
      }
    });
  
  }
  getReminders() {
    const filter = { 'completed-eq': 'false'};
    this.providerService.getReminders(filter).subscribe((res: any) => {
      console.log("Reminders :", res);
      this.reminders = res;
    });
  }
  // getReminderCounts() {
  //   this.providerService.getRemindersCount().subscribe(res => {
  //     console.log("Reminder count :", res);
  //     this.reminderCounts = res;
  //   });
  // }

  bisinessProfile() {
   this.searchForm.controls.search_input.setValue('');
    this.providerService.getBussinessProfile().subscribe((res: any) => {
      console.log("BProfileRes", res);
      if (res) {
        if (res["id"]) {
          this.tempAcId = res["id"];
          console.log("TempAcid :", this.tempAcId);
        }
      }
    });
  }

  goBack() {
    if(this.selectedId){
      // provider/customers/33678
      //this.router.navigate(["provider", "customers", `${this.selectedId}`]);
      this.location.back();

    }
   else if (!this.isCreate) {
      this.router.navigate(["provider", "settings"]);
    } else {
      this.isCreate = false;
      // this.isEdit = false;
    }
  }
  handleselectall() {
    this.Selall = true;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    for (let ii = 1; ii <= 7; ii++) {
      this.handleDaychecbox(ii);
    }
    this.weekdays = wkdaystemp;
  }
  handleselectnone() {
    this.Selall = false;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    this.weekdays = wkdaystemp;
  }
  handleDaychecbox(dayindx) {
    const selindx = this.selday_arr.indexOf(dayindx);
    if (selindx === -1) {
      this.selday_arr.push(dayindx);
    } else {
      this.selday_arr.splice(selindx, 1);
    }
    if (this.selday_arr.length === 7) {
      this.Selall = true;
    } else {
      this.Selall = false;
    }
  }
 // checks whether a given value is there in the given array
  check_existsinArray(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }
  stopprop(event) {
    event.stopPropagation();
  }
  deleteReminder(id, reminder) {
    console.log("ID : ", id);
    this.reminderdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "30%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        message: "Do you really want to delete " + (reminder.reminderName ? reminder.reminderName : reminder.message) + " ?"
      }
    });
    this.reminderdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 1) {
          this.providerService.deleteReminder(id).subscribe((data: any) => {
            this.snackbarService.openSnackBar("Deleted Reminder Successfully");
           // this.getReminders();
            this.getActiveReminders();
           // this.getReminderCounts();
           this.getCompletedReminderCount();
           this.getAllReminderCount();
          });
        }
      }
    });
  }
  editReminder(reminderId?) {
    this.isCreate = true;
    if(this.selectedId){
      this.reminder_title = 'Create Reminder';
    }
    else{
      this.reminder_title = 'Update Reminder';
    }
    this.reminderId = reminderId;
    this.selectedTimes = [];
    this.selectedTime = [];
    this.selectedConsumers = [];
    this.selectedConsumer = '';
    if(this.selectedId){
      this.hide = true;
    }
    else{
      this.hide = false;
    }
    this.providerService.getReminderById(reminderId).subscribe((data: any) => {
      console.log("Reminder Details Id :", data);
      this.reminderDetails = data;
      //this.removeTime(this.reminderDetails.schedule.timeSlots);
      this.isEdit = true;
      // this.updateForm(); 

       let sttime ;
       const hour = parseInt(
        moment(this.reminderDetails.schedule.timeSlots[0].sTime, [
          "hh:mm A"
        ]).format("hh"),
        10
      );
      const minute =  parseInt(
        moment(this.reminderDetails.schedule.timeSlots[0].sTime, [
          "h:mm A"
        ]).format("mm"),
        10
      );

      sttime = {
       hour:hour < 10 ? '0'+hour : hour,
       minute: minute < 10 ? '0'+minute : minute
     };
     if(this.reminderDetails.schedule.timeSlots[0].sTime.includes('PM')){
      sttime['mode'] = "PM"
    }
    else{
      sttime['mode'] = "AM"

    }
     if (sttime) {
      // const time = {
      //  'sTime':sttime.hour +
      //  ":" +
      //  sttime.minute +
      //  " " + sttime.mode,
      //  'eTime':sttime.hour +
      //  ":" +
      //  sttime.minute +
      //  " " + sttime.mode
      // };
    //  this.selectedTime.push(time)
     // this.selectedTime =
     //   sttime.hour +
     //   ":" +
     //   sttime.minute +
     //   " " + sttime.mode
       //(sttime.hour > 12 ? "PM" : "AM");
    // console.log("selected time :", this.selectedTime);
    
     // const existConsumerData = this.selectedTimes.find(x => x.hour === sttime.hour);
     // if(existConsumerData){
     //   // this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
     //   return false;
     // }
     // else{
     //  return this.selectedTimes.push(sttime);
     // }
    
     // this.selectedTimes.join(sttime);
     // this.selectedTimes[this.selectedTimes.length] = sttime;
      //this.selectedTimes.splice(0, 0, sttime);
      this.hideTime = true;
      //this.selectedTimes[0] = sttime;

     // this.selectedTimes.map((time)=>{
     //   this.selectedTimeslot =  time.hour +
     //   ":" +
     //   time.minute +
     //   " " +
     //   (time.hour > 12 ? "PM" : "AM");;
     // })
    
    // this.selectedTimeslots(this.reminderId,sttime);
   }
      //  sttime = {
      //   hour: parseInt(
      //     moment(this.reminderDetails.schedule.timeSlots[0].sTime, [
      //       "h:mm A"
      //     ]).format("hh"),
      //     10
      //   ),
      //   minute: parseInt(
      //     moment(this.reminderDetails.schedule.timeSlots[0].sTime, [
      //       "h:mm A"
      //     ]).format("mm"),
      //     10
      //   )
      // };
    
      if(this.reminderDetails.schedule.timeSlots){
        const existConsumerData = this.reminders.find((x) => {
         if(x.id === reminderId){
     const data =  x.schedule.timeSlots.map((res:any)=>{
            console.log("new slot :",res)
            let sttime ;
            let newTimeArray = [];
            const hour = parseInt(
              moment(res.sTime, [
                "hh:mm A"
              ]).format("hh"),
              10
            );
            const minute =  parseInt(
              moment(res.sTime, [
                "h:mm A"
              ]).format("mm"),
              10
            );

            sttime = {
             hour:hour < 10 ? '0'+hour : hour,
             minute: minute < 10 ? '0'+minute : minute
           };
           if(res.sTime.includes('PM')){
             sttime['mode'] = "PM"
           }
           else{
             sttime['mode'] = "AM"
     
           }
           const time = {
            'sTime':sttime.hour +
            ":" +
            sttime.minute +
            " " + sttime.mode,
            'eTime':sttime.hour +
            ":" +
            sttime.minute +
            " " + sttime.mode
           };
           if(time){
             this.selectedTime.push(time);
             console.log("selected time :", this.selectedTime);

           }
          //this.selectedTime.push(time);
           newTimeArray.push(sttime);
          return this.selectedTimes.push(sttime);

          })
          console.log("Edit slots :",data);
         
         }
        });
        console.log("Selected Time :",reminderId, existConsumerData);
    
      
      }
      this.selday_arr = [];
      // extracting the selected days
      for (let j = 0; j < this.reminderDetails.schedule.repeatIntervals.length; j++) {
        // pushing the day details to the respective array to show it in the page
        this.selday_arr.push(Number(this.reminderDetails.schedule.repeatIntervals[j]));
      }
      if (this.selday_arr.length === 7) {
        this.Selall = true;
      } else {
        this.Selall = false;
      }
      // const edtime = {
      //   hour: parseInt(
      //     moment(this.reminderDetails.schedule.timeSlots[0].eTime, [
      //       "h:mm A"
      //     ]).format("HH"),
      //     10
      //   ),
      //   minute: parseInt(
      //     moment(this.reminderDetails.schedule.timeSlots[0].eTime, [
      //       "h:mm A"
      //     ]).format("mm"),
      //     10
      //   )
      // };
      // this.reminder = {
      (this.reminder.name = this.reminderDetails.reminderName),
        (this.reminder.message = this.reminderDetails.message),
        (this.reminder.fromDate =
          this.reminderDetails.schedule.startDate || null),
        (this.reminder.toDate = this.reminderDetails.schedule.terminator.endDate),
        (this.reminder.time = ""),
        (this.reminder.sms =
          this.reminderDetails.reminderSource.Sms === "1" ? true : false),
        (this.reminder.email =
          this.reminderDetails.reminderSource.Email === "1" ? true : false),
        (this.reminder.phoneNumber =
          this.reminderDetails.reminderSource.PushNotification === "1"
            ? true
            : false);
      // }
      // if(this.reminderDetails.reminderSource.Sms === 1){
      //   this.reminder.sms = true;
      // }
      // if(this.reminderDetails.reminderSource.Email === 1){
      //   this.reminder.email = true;
      // }
      // if(this.reminderDetails.reminderSource.PushNotification === 1){
      //   this.reminder.phoneNumber = true;
      // }
      // this.amForm.patchValue({
      //   // qname: this.queue_data.name || null,
      //   // qlocation: this.queue_data.location.id || null,
      //   // qstarttime: sttime || null,
      //   // qendtime: edtime || null,
      //   // qcapacity: this.queue_data.capacity || null,
      //   'name':'' || null,
      //   'message':this.amForm.get('message').value || this.reminderDetails.message,
      //   // timeSlot: this.queue_data.timeDuration || 0,
      //   'fromDate': this.amForm.get('fromDate').value || this.reminderDetails.schedule.startDate || null,
      //   'toDate': this.amForm.get('toDate').value || this.reminderDetails.schedule.terminator.endDate,
      //   'sms': this.amForm.get('sms').value || this.reminderDetails.reminderSource.Sms,
      //   'email':this.amForm.get('email').value || this.reminderDetails.reminderSource.Email,
      //   'phoneNumber':this.amForm.get('phoneNumber').value || this.reminderDetails.reminderSource.PushNotification
      // });
    
      if(this.reminderDetails.providerConsumer.id){
        // this.getCustomerbyId(this.reminderDetails.providerConsumer.id);
        const filter = { 'id-eq': this.reminderDetails.providerConsumer.id };
        this.providerService.getCustomer(filter)
        .subscribe(
            (data: any) => {
              console.log("Respooooos :",data);
              //this.selectedConsumers = data;
              this.selectedCustomerViaPhoneSearch(data[0],'edit');
              this.selectedCustomerViaEmail_Name_ID(data[0],'form_data','edit');
              this.initCustomerDetails(data[0],'edit');

              
            });
      }
      //=== this.selectedConsumer.providerConsumer.id
      // if(this.reminderDetails.providerConsumer){
      //   this.providerService.getSearchCustomer(this.tempAcId, 'phoneNumber', this.selectedPhone).subscribe((res: any) => {
      //     console.log('selected consumer :', res);
      //     // this.options = res;
      //     // if(res.phoneNo === this.filteredCustomers[0].phoneNo){
      //     //   this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
      //     // }
      //     // else{
      //       // res.map((data)=>{
      //       //   console.log("Data :",data);
      //       //   if(this.reminderDetails.providerConsumer.id === data.id){
      //           //this.selectedConsumer = res;
      //           this.selectedConsumers.push(res);
      //       //  }
      //    //   })
      //       // console.log("Filtered Res :",this.filteredCustomers);
      //   //  }
      // })
      // }
      // if(this.reminderDetails.message){
      //   this.amForm.get('message').value;
      // }
    });
  }


  selectedTimeslots(reminderId,timeSlot){
   
    const existConsumerData = this.reminders.find(x => x.id === reminderId);
    console.log("Selected Time :",reminderId, existConsumerData);

    if(existConsumerData){
        return this.selectedTimes[0] = timeSlot;
    }
    else{
        return false;
    }
  }
  //getReminderById
  onCancel() {
    // this.router.navigate(['provider', 'settings', 'comm', 'reminder']);
    this.isCreate = false;
    // this.location.back();
  }
  createAddRemainder() {
    this.isCreate = true;
    this.Selall = false;
    this.selday_arr = [];
    this.reminder_title = 'Create Reminder';
    // this.isEdit = false;
    // this.createForm();
    
    (this.reminder.name = ""),
      (this.reminder.message = ""),
      (this.reminder.fromDate = this.selectedDay),
      (this.reminder.toDate = this.selectedDay),
      (this.reminder.time = ""),
      (this.reminder.sms = true),
      (this.reminder.email = false),
      (this.reminder.phoneNumber = false);
    this.selectedTimes = [];
    this.reminderId = 0;
    this.selectedId = 0;
    this.selectedConsumers = [];
    this.selectedConsumer = '';
    this.selectedTime = []
    this.hide = false;
    this.phone = '';
  }
  createForm(){
    this.searchForm = this.fb.group({
      search_input: ["", Validators.compose([Validators.required])]
      //Validators.compose([Validators.required])
  });
  }

  createnewForm() {
    // this.getCustomerQnr();
    // if (!this.haveMobile) {
    //   this.amForm = this.fb.group({
    //     first_name: [
    //       "",
    //       Validators.compose([
    //         Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)
    //       ])
    //     ],
    //     last_name: [
    //       "",
    //       Validators.compose([
    //         Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)
    //       ])
    //     ],
    //     email_id: [
    //       "",
    //       Validators.compose([
    //         Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)
    //       ])
    //     ],
    //     dob: [""],
    //     age: [""],
    //     ageType: ["year"],
    //     gender: [""],
    //     address: [""]
    //   });
    //   this.loading = false;
    // }
    // else {
    this.amForm = this.fb.group({
      name: [
        ""
        // Validators.compose([
        //   Validators.maxLength(10),
        //   Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)
        // ])
      ],
      message: [""],
      fromDate: [
        ""
        // Validators.compose([
        //   Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)
        // ])
      ],
      toDate: [
        ""
        // Validators.compose([
        //   Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)
        // ])
      ],
      time: [
        ""
        // Validators.compose([
        //   Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)
        // ])
      ],
      sms: [true],
      email: [false],
      phoneNumber: [false]
    });
    // this.loading = false;
    // }
    // if (this.action === "edit") {
    //   this.updateForm();
    // }

    // if (this.phoneNo) {
    //   this.amForm.get("mobile_number").setValue(this.phoneNo);
    // }

    // if (this.customer[0].countryCode) {
    //   this.amForm.get("countryCode").setValue(this.customer[0].countryCode);
    // }
    // if(this.customer[0].countryCode === ' ' || undefined || '' || null) {
    //   this.amForm.get("countryCode").setValue('+91');
    // }
    // else{
    //   this.amForm.get("countryCode").setValue('+91');
    // }
    // if (this.email) {
    //   this.amForm.get("email_id").setValue(this.email);
    // }
  }

  updateForm() {
    const sttime = {
      hour: parseInt(
        moment(this.reminderDetails.schedule.timeSlots[0].sTime, [
          "h:mm A"
        ]).format("HH"),
        10
      ),
      minute: parseInt(
        moment(this.reminderDetails.schedule.timeSlots[0].sTime, [
          "h:mm A"
        ]).format("mm"),
        10
      )
    };
    const edtime = {
      hour: parseInt(
        moment(this.reminderDetails.schedule.timeSlots[0].eTime, [
          "h:mm A"
        ]).format("HH"),
        10
      ),
      minute: parseInt(
        moment(this.reminderDetails.schedule.timeSlots[0].eTime, [
          "h:mm A"
        ]).format("mm"),
        10
      )
    };
    this.amForm.setValue({
      // qname: this.queue_data.name || null,
      // qlocation: this.queue_data.location.id || null,
      // qstarttime: sttime || null,
      // qendtime: edtime || null,
      // qcapacity: this.queue_data.capacity || null,
      message: this.reminderDetails.message,
      // timeSlot: this.queue_data.timeDuration || 0,
      fromDate: this.reminderDetails.schedule.startDate || null,
      toDate: this.reminderDetails.schedule.terminator.endDate,
      sms: this.reminderDetails.reminderSource.Sms,
      email: this.reminderDetails.reminderSource.Email,
      phoneNumber: this.reminderDetails.reminderSource.PushNotification
    });
    if (sttime || edtime) {
      this.selectedTimes.push(sttime);
    }
    // if(this.reminderDetails.reminderSource.Sms === 1){
    //   this.amForm.get('sms').setValue(true);
    // }
    // if(this.reminderDetails.reminderSource.Email === 1){
    //   this.amForm.get('email').setValue(true);
    // }
    // if(this.reminderDetails.reminderSource.PushNotification === 1){
    //   this.amForm.get('phoneNumber').setValue(true);
    // }
    console.log("Update Form :", this.amForm);
  }
  onSubmit(form_data) {
    console.log("Data :", form_data);
    let fromDate;
    let toDate;
    if (form_data.fromDate) {
      fromDate = this.dateTimeProcessor.transformToYMDFormat(form_data.fromDate);
    }
    if (form_data.toDate) {
      toDate = this.dateTimeProcessor.transformToYMDFormat(form_data.toDate);
    }
    if (this.reminderId) {
      const daystr: any = [];
      // const today = cdate.getFullYear() + '-' + mon + '-' + cdate.getDate();
      for (const cday of this.selday_arr) {
        daystr.push(cday);
      }
      if(form_data.name === "" || form_data.name === undefined){
        this.snackbarService.openSnackBar("Please enter reminder name", {
          panelClass: "snackbarerror"
        });
      }
     else if (form_data.message === "") {
        this.snackbarService.openSnackBar("Please enter reminder message", {
          panelClass: "snackbarerror"
        });

      } 
       // Check whether atleast one day is selected
       else if (this.selday_arr.length === 0) {
        const error = 'Please select the days';
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
      else if (form_data.fromDate === "" || form_data.fromDate === undefined) {
        this.snackbarService.openSnackBar("Please select from date", {
          panelClass: "snackbarerror"
        });
      }
      else if (form_data.toDate === "" || form_data.toDate === undefined) {
        this.snackbarService.openSnackBar("Please select to date", {
          panelClass: "snackbarerror"
        });
      }
      //this.selectedTimes.length === 0 || (this.selectedTime.length === undefined || 
      else if (this.selectedTime.length === 0) {
        this.snackbarService.openSnackBar("Please select time slot", {
          panelClass: "snackbarerror"
        });
      } else if ((this.selectedConsumer === undefined || this.selectedConsumer === "")) {
        this.snackbarService.openSnackBar("Please search consumer", {
          panelClass: "snackbarerror"
        });
      } else if ((form_data.sms === false && form_data.email === false && form_data.phoneNumber === false)) {
        this.snackbarService.openSnackBar("Select atleat one reminder source", {
          panelClass: "snackbarerror"
        });
      }
       else {
        const postData = {
          schedule: {
            // recurringType: "Once",
            // repeatIntervals: [1, 2, 3, 4, 5, 6],
            recurringType: "Weekly",
            //daystr
            repeatIntervals: daystr,
            startDate: fromDate,
            terminator: {
              endDate: toDate,
              noOfOccurance: "1"
            },
            timeSlots:this.selectedTime
            // [
            //   {
            //     sTime: this.selectedTime,
            //     eTime: this.selectedTime
            //   }
              
            // ]
          },
          provider:{
              id:this.providerId,
              firstName:this.providerFirstName,
              lastName:this.providerLastName,
          } ,
          providerConsumer:{
                id:this.selectedConsumer.id,
                firstName:this.selectedConsumer.firstName,
                lastName:this.selectedConsumer.lastName,
                email:this.selectedConsumer.email,
                phoneNo:this.selectedConsumer.phoneNo
          } ,
          message: form_data.message,
          reminderName: form_data.name,
          reminderSource: {
            Sms: form_data.sms ? "1" : "0",
            Email: form_data.email ? "1" : "0",
            PushNotification: form_data.phoneNumber ? "1" : "0"
          }
        };
        console.log("Posting Updated Data ;", postData);

        // this.amForm.reset();
        // if ((postData['timeSlots'] === 0)) {
        //   this.snackbarService.openSnackBar("Please select time slot", {
        //     panelClass: "snackbarerror"
        //   });
        // }
        // else{
          this.providerService
          .updateReminder(postData, this.reminderId)
          .subscribe(
            (res: any) => {
              console.log("Reminder res :", res);
             // this.getReminders();
             this.getActiveReminders();
              //this.getReminderCounts();
              this.getCompletedReminderCount();
              this.getAllReminderCount();
              this.isCreate = false;
              // this.isEdit = false;
              this.snackbarService.openSnackBar(
                "Reminder Updated Successfully",
                { panelClass: "snackbarnormal" }
              );
            },
            error => {
              this.snackbarService.openSnackBar(error, {
                panelClass: "snackbarerror"
              });
            }
          );
      //  }
      
      }
    } else {
      // if(this.selectedConsumer.id){
      //   postData['providerConsumer'] = this.selectedConsumer.id;
      // }
      const daystr: any = [];
      // const today = cdate.getFullYear() + '-' + mon + '-' + cdate.getDate();
      for (const cday of this.selday_arr) {
        daystr.push(cday);
      }
      if(form_data.name === "" || form_data.name === undefined){
        this.snackbarService.openSnackBar("Please enter reminder name", {
          panelClass: "snackbarerror"
        });
      }
     else if (form_data.message === "") {
        this.snackbarService.openSnackBar("Please enter reminder message", {
          panelClass: "snackbarerror"
        });
      } 
       // Check whether atleast one day is selected
       else if (this.selday_arr.length === 0) {
        const error = 'Please select the days';
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
      else if (form_data.fromDate === "" || form_data.fromDate === undefined) {
        this.snackbarService.openSnackBar("Please select from date", {
          panelClass: "snackbarerror"
        });
      }
      else if (form_data.toDate === "" || form_data.toDate === undefined) {
        this.snackbarService.openSnackBar("Please select to date", {
          panelClass: "snackbarerror"
        });
      }
      //this.selectedTime === undefined
      else if ((this.selectedTime.length === 0)) {
        this.snackbarService.openSnackBar("Please select time slot", {
          panelClass: "snackbarerror"
        });
      } else if ((this.selectedConsumer === undefined || this.selectedConsumer === "")) {
        this.snackbarService.openSnackBar("Please search consumer", {
          panelClass: "snackbarerror"
        });
      } else if ((form_data.sms === false && form_data.email === false && form_data.phoneNumber === false)) {
        this.snackbarService.openSnackBar("Select atleat one reminder source", {
          panelClass: "snackbarerror"
        });
      }
      // else{
      //   postData['reminderSource'].Sms = form_data.sms ? "1" : "0"
      //   postData['reminderSource'].Email = form_data.email ? "1" : "0"
      //   postData['reminderSource'].PushNotification = form_data.phoneNumber ? "1" : "0"

      // }
      else {
        const postData = {
          schedule: {
            // recurringType: "Once",
            // repeatIntervals: [1, 2, 3, 4, 5, 6],
            recurringType: "Weekly",
            //daystr
            repeatIntervals: daystr,
            startDate: fromDate,
            terminator: {
              endDate: toDate,
              noOfOccurance: "1"
            },
            timeSlots:this.selectedTime
            // [
              // {
              //   sTime: this.selectedTime,
              //   eTime: this.selectedTime
              // }
            //]
            // timeSlots:
            // [
            //   {
            //     sTime: this.selectedTime,
            //     eTime: this.selectedTime
            //   }
              
            // ]
          },
          // provider: this.providerId,
          // providerConsumer: this.selectedConsumer.id,
          provider:{
            id:this.providerId,
            firstName:this.providerFirstName,
            lastName:this.providerLastName,
        } ,
        providerConsumer:{
              id:this.selectedConsumer.id,
              firstName:this.selectedConsumer.firstName,
              lastName:this.selectedConsumer.lastName,
              email:this.selectedConsumer.email,
              phoneNo:this.selectedConsumer.phoneNo
        } ,
          message: form_data.message,
          reminderName:form_data.name,
          reminderSource: {
            Sms: form_data.sms ? "1" : "0",
            Email: form_data.email ? "1" : "0",
            PushNotification: form_data.phoneNumber ? "1" : "0"
          }
        };
        // this.amForm.reset();
        console.log("Posting Data ;", postData);
        // if ((postData['timeSlots'] === 0)) {
        //   this.snackbarService.openSnackBar("Please select time slot", {
        //     panelClass: "snackbarerror"
        //   });
        // }
        // else{
          this.providerService.postReminder(postData).subscribe(
            (res: any) => {
              console.log("Reminder res :", res);
              //this.getReminders();
              this.getActiveReminders();
              //this.getReminderCounts();
              this.getCompletedReminderCount();
              this.getAllReminderCount();
              this.selectedId = 0;
              this.isCreate = false;
              this.snackbarService.openSnackBar("Reminder Created Successfully", {
                panelClass: "snackbarnormal"
              });
              this.router.navigate(["provider", "settings","comm","reminder"]);
            },
            error => {
              this.snackbarService.openSnackBar(error, {
                panelClass: "snackbarerror"
              });
            }
          );
       // }

      
      }
    }

    // this.disableButton = true;
    // if (this.questionnaireList && this.questionnaireList.labels) {
    //   this.validateQnr(form_data);
    // } else {
    //   this.customerActions(form_data);
    // }
  }

 
  remove(consumer: string): void {
    const index = this.selectedConsumers.indexOf(consumer);
    if(this.isEdit && index === 0){
      this.selectedConsumer = '';
      this.snackbarService.openSnackBar("Select atleat one consumer", {
        panelClass: "snackbarerror"
      });
    }
    if (index >= 0) {
      this.selectedConsumers.splice(index, 1);
    }
  }
  removeTime(index: any): void {
    // const index = this.selectedTimes.indexOf(time);
    // const index1 = this.selectedTime.indexOf(this.reminderDetails.schedule.timeSlots);
    console.log("Index :",index)

    //this.selectedTimes.length === 0 && this.selectedTime.length === 0
    if(this.isEdit && (index === 0) ){
      this.isTimeNotSelected = true;
      // this.selectedTime = [];
      // this.selectedTimes = [];
      this.snackbarService.openSnackBar("Select atleat one time slot", {
        panelClass: "snackbarerror"
      });
    }
    this.selectedTimes.splice(index, 1);
    this.selectedTime.splice(index,1);

    // if (index >= 0) {
    //   this.selectedTimes.splice(index, 1);
    // }
   
    //   if(index1 >= 0){
    //     this.selectedTime.splice(index1,1);

    //   }
      
    
    
  }
  searchCustomerByPhone(phoneNumber, event?) {
    // Check min length
    this.providerService
      .getSearchCustomer(this.tempAcId, "phoneNumber", phoneNumber)
      .subscribe((res: any) => {
        console.log("res", res);
        // this.options = res;
        // if(res.phoneNo === this.filteredCustomers[0].phoneNo){
        //   this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
        // }
        // else{
        this.filteredCustomers = res;
        
        // console.log("Filtered Res :",this.filteredCustomers);
        //  }
      });
  }
  searchCustomerLucene(searchCriteria) {
    let searchBy: any;
    if (this.categoryvalue && this.categoryvalue === 'Search with Name or ID') {
        searchBy = 'name';
    }
    else if (this.categoryvalue && this.categoryvalue === 'Search with Email ID') {
        searchBy = 'emailId';
    }
    this.providerService.getSearchCustomer(this.tempAcId, searchBy, searchCriteria.search_input).subscribe((res: any) => {
        console.log('res', res);
        this.options = res;
        this.filteredCustomers = res;
    })
}
  selectedCustomerViaPhoneSearch(customer,mode?) {
    this.selectedPhone = customer.phoneNo;
    console.log("Selected consumer :", customer);
    this.selectedConsumer = customer;
    const existConsumerData = this.selectedConsumers.find(x => x.id === customer.id);
    if(existConsumerData){
      if(mode === 'edit'){
       // this.selectedConsumers[0] = customer;
        return false;
      }
      else{
      this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
      }
    }
    else{
      // if(mode === 'edit' && this.reminderId){
      //   return this.selectedConsumers[0] = customer;
      // }
      // else{
        return this.selectedConsumers.push(customer);

     // }
    }
  
  }

  onSubmitData(form_data) {
    //let endDate;
    // const startDate = this.convertDate(form_data.startdate);
    // if (form_data.enddate) {
    //   endDate = this.convertDate(form_data.enddate);
    // } else {
    //   endDate = '';
    // }
    if (!form_data.qname.replace(/\s/g, "").length) {
      const error = "Please enter schedule name";
      this.snackbarService.openSnackBar(error, { panelClass: "snackbarerror" });
      return;
    }
    // start and end date validations
    // const cdate = new Date();
    // let mon;
    // mon = (cdate.getMonth() + 1);
    // if (mon < 10) {
    //   mon = '0' + mon;
    // }
    // const daystr: any = [];
    // const curdate = new Date();
    // curdate.setHours(this.dstart_time.hour);
    // curdate.setMinutes(this.dstart_time.minute);
    // const enddate = new Date();
    // enddate.setHours(this.dend_time.hour);
    // enddate.setMinutes(this.dend_time.minute);
    // const starttime_format = moment(curdate).format('hh:mm A') || null;
    // const endtime_format = moment(enddate).format('hh:mm A') || null;
    // // building the schedule json section
    // schedulejson = {
    //   'recurringType': 'Weekly',
    //   'repeatIntervals': daystr,
    //   'startDate': startDate,
    //   'terminator': {
    //     'endDate': endDate,
    //     'noOfOccurance': ''
    //   },
    //   'timeSlots': [{
    //     'sTime': starttime_format,
    //     'eTime': endtime_format
    //   }]
    // };

    // // generating the data to be posted
    // // const post_data = {
    // //   'name': form_data.qname,
    // //   'apptSchedule': schedulejson,
    // //   'apptState': 'ENABLED',
    // //   'parallelServing': form_data.qserveonce,
    // //   'consumerParallelServing': form_data.maxOnlineConsumers,
    // //   // 'capacity': form_data.qcapacity,
    // //   'location': this.selected_locationId,
    // //   'services': selser,
    // //   // 'tokenStarts': form_data.tokennum,
    // //   'timeDuration': form_data.timeSlot,
    // //   'batchEnable': this.sbatchStatus,
    // //   'batchName': {
    // //     'prefix': this.sprefixName,
    // //     'suffix': this.ssuffixName
    // //   }
    // // };

    // if (this.action === 'edit') {
    //   this.Schedulescaption = 'Schedule Details';
    //   this.editProviderSchedule(post_data);
    // } else {
    //   this.addProviderSchedule(post_data);
    // }
  }

  convertDate(date?) {
    // let today;
    let mon;
    let cdate;
    if (date) {
      cdate = new Date(date);
    } else {
      cdate = new Date();
    }
    mon = cdate.getMonth() + 1;
    if (mon < 10) {
      mon = "0" + mon;
    }
    return cdate.getFullYear() + "-" + mon + "-" + cdate.getDate();
  }


      /**
     * 
     * @param data 
     * @param form_data 
     */
       selectedCustomerViaEmail_Name_ID(data, form_data?,mode?) {
        console.log(data);
        console.log(form_data)
        if (data && data['firstName'] && data['lastName'] && data['lastName'] !== 'null') {
            this.totalName = (data['firstName'][0].toUpperCase() + data['firstName'].slice(1)) + ' ' + (data['lastName'][0].toUpperCase() + data['lastName'].slice(1));
            if (this.categoryvalue && this.categoryvalue === 'Search with Name or ID') {
                if (this.totalName) {
                    this.searchForm.controls.search_input.setValue(this.totalName);
                }
            }
        }
        else if (data && data['firstName'] && data['lastName'] && data['lastName'] === 'null') {
            this.totalName = (data['firstName'][0].toUpperCase() + data['firstName'].slice(1));
            if (this.categoryvalue && this.categoryvalue === 'Search with Name or ID') {
                if (this.totalName) {
                    this.searchForm.controls.search_input.setValue(this.totalName);
                }
            }
        }
        this.customer_data = data;
        console.log("Selected consumer By email name id:", data);
       this.selectedConsumer =  this.customer_data;
       const existConsumerData = this.selectedConsumers.find(x => x.id === this.customer_data.id);
    if(existConsumerData){
      if(mode === 'edit'){
        return false;
      }
      else{
      this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
    }
    }
    else{
      // mode === 'edit' && 
      if(mode === 'edit' && this.reminderId){
        return this.selectedConsumers[0] =  this.customer_data;
      }
      else{
        return this.selectedConsumers.push(this.customer_data);

      }
    }
        //this.initConsumerAppointment(data);
        // this.tempDataCustomerInfo = data;
        // this.searchCustomer(form_data);
    }

    /**
     * 
     * @param form_data 
     * @param event 
     */
    findCustomer(form_data, event) {
        this.showBlockHint = false;
        if (event.key === 'Enter') {
            this.searchCustomer(form_data);
        }
    }

    /**
     * 
     * @param form_data 
     */
    searchCustomer(form_data) {
      console.log("Form input :",form_data);
        this.emptyFielderror = false;
        if (form_data && form_data.search_input === '') {
            this.emptyFielderror = true;
        } else {
            this.qParams = {};
            let mode = 'id';
            this.form_data = null;
            this.create_new = false;
            let post_data = {};
            const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
            const isEmail = emailPattern.test(form_data.search_input);
            if (isEmail) {
                mode = 'email';
            }
            else {
                mode = 'id';
            }
           // this.qParams['source'] = 'reminder';
            switch (mode) {
                case 'phone':
                    post_data = {
                        'phoneNo-eq': form_data.search_input
                    };
                    this.qParams['phone'] = form_data.search_input;
                    break;
                case 'email':
                    this.qParams['email'] = form_data.search_input;
                    post_data = {
                        'email-eq': form_data.search_input
                    };
                    break;
                case 'id':
                    post_data['or=jaldeeId-eq'] = form_data.search_input + ',firstName-eq=' + form_data.search_input;
                    break;
            }
     
     
            this.initCustomerDetails(post_data);
        }
    //    let post_data = {
    //     'jaldeeId-eq': form_data.search_input + ',firstName-eq=' + form_data.search_input,
    // };
    }
    /**
     * 
     * @param postData 
     */
    initCustomerDetails(postData,mode?) {
      console.log("Post by id data :",postData);
        this.providerService.getCustomer(postData).subscribe(
            (customer: any) => {
              console.log("Customer By Id :",customer);
                // if (customers.length === 0) {
                //     this.createNew('create');
                // } else {
                //     if (customers.length === 1) {
                //         this.customer_data = customers[0];
                //         this.foundMultipleCustomers = false;
                //     } else {
                //         this.customer_data = customers.filter(member => !member.parent)[0];
                //         this.foundMultipleCustomers = true; 
                //     }
                //     this.initConsumerAppointment(this.customer_data);
                // }
                if(customer.length >0){
                console.log("Selected consumer :", customer[0]);
                this.selectedConsumer = customer[0];
                const existConsumerData = this.selectedConsumers.find(x => x.id === customer.id);
                if(existConsumerData){
                  if(mode === 'edit'){
                   // this.selectedConsumers[0] = customer;
                    return false;
                  }
                  else{
                  this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
                  }
                }
                else{
                  if(mode === 'edit' && this.reminderId){
                    return this.selectedConsumers[0] = customer[0];
                  }
                  else{
                    return this.selectedConsumers.push(customer[0]);
            
                  }
                }
              }
                
            }, error => {
                this.wordProcessor.apiErrorAutoHide(this, error);
            }
        );
    }

    serchCustomerByPhone(val) {
        let post_data = {
            'phoneNo-eq': val,
            'countryCode-eq': this.countryCodePhone
        };
        // this.qParams['phone'] = val;
        // this.qParams['countryCode'] = this.countryCodePhone;
        this.initCustomerDetails(post_data);
    }
}
