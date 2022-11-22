import { Component, OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ProviderServices } from "../../../../services/provider-services.service";
import { Observable } from "rxjs";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import {
  FormGroup,
  FormBuilder
  // Validators,
  //FormControl
} from "@angular/forms";
import { FormMessageDisplayService } from "../../../../../shared/modules/form-message-display/form-message-display.service";
import { CreateReminderComponent } from "./create-reminder/create-reminder.component";
import { GroupStorageService } from "../../../../../shared/services/group-storage.service";
import { ConfirmBoxComponent } from "../../../../../business/shared/confirm-box/confirm-box.component";
import * as moment from "moment";

@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  styleUrls: ["./reminder.component.css"]
})
export class ReminderComponent implements OnInit {
  isCreate: boolean = false;
  amForm: FormGroup;
  tempAcId: any;
  phone: any;
  filteredCustomers: Observable<string[]>;
  selectedConsumers: any[] = [];
  date = new Date();
  serializedDate = new Date().toISOString();
  selectedTimes: any[] = [];
  providerId: any;
  selectedConsumer: any;
  reminders: any[] = [];
  reminderCounts: any = 0;
  selectedTime: any;
  reminderdialogRef: any;
  reminderDetails: any;
  reminderId: any;
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
  isEdit: boolean = false;
  selectedDay: string;
  selectedPhone: any;
  isTimeClicked: boolean = false;
  selectedId:any;

  constructor(
    private router: Router,
    public fed_service: FormMessageDisplayService,
    public location: Location,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private providerService: ProviderServices,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private activated_route: ActivatedRoute,

  ) {
    this.activated_route.queryParams.subscribe(qparams => {
        if(qparams.id){
          this.selectedId = qparams.id;
          // console.log("from patientsss :",this.selectedId);
          // this.editReminder(this.selectedId)
        }
    });
  }

  ngOnInit(): void {
    
    this.bisinessProfile();
    if(this.selectedId ){
      console.log("from patientsss :",this.selectedId);
      this.getCustomerbyId(this.selectedId);
      this.editReminder();
    }
    this.getReminders();
    this.getReminderCounts();
    const user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.providerId = user.id;
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
    const seldate =
      futrDte.getFullYear() + "-" + cmonth + "-" + futrDte.getDate();
    this.selectedDay = seldate;
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
      this.selectedTime =
        result.hour +
        ":" +
        result.minute +
        " " +
        (result.hour > 12 ? "PM" : "AM");
      console.log("selected time :", this.selectedTime);
      if (result !== undefined) {
        this.selectedTimes.push(result);
        console.log("slot:", this.selectedTimes);
      }
    });
  
  }
  getReminders() {
    this.providerService.getReminders().subscribe((res: any) => {
      console.log("Reminders :", res);
      this.reminders = res;
    });
  }
  getReminderCounts() {
    this.providerService.getRemindersCount().subscribe(res => {
      console.log("Reminder count :", res);
      this.reminderCounts = res;
    });
  }

  bisinessProfile() {
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
    if (!this.isCreate) {
      this.router.navigate(["provider", "settings"]);
    } else {
      this.isCreate = false;
      // this.isEdit = false;
    }
  }
  stopprop(event) {
    event.stopPropagation();
  }
  deleteReminder(id, reminderName) {
    console.log("ID : ", id);
    this.reminderdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "30%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        message: "Do you really want to delete " + reminderName + " ?"
      }
    });
    this.reminderdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 1) {
          this.providerService.deleteReminder(id).subscribe((data: any) => {
            this.snackbarService.openSnackBar("Deleted Reminder Successfully");
            this.getReminders();
            this.getReminderCounts();
          });
        }
      }
    });
  }
  editReminder(reminderId?) {
    this.isCreate = true;
    this.reminderId = reminderId;
    this.providerService.getReminderById(reminderId).subscribe((data: any) => {
      console.log("Reminder Details Id :", data);
      this.reminderDetails = data;
      this.isEdit = true;
      // this.updateForm();
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
      (this.reminder.name = this.reminderDetails.name),
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
      if (sttime) {
        // this.selectedTime = sttime;
        this.selectedTime =
          sttime.hour +
          ":" +
          sttime.minute +
          " " +
          (sttime.hour > 12 ? "PM" : "AM");
        console.log("selected time :", this.selectedTime);
        // const existConsumerData = this.selectedTimes.find(x => x.hour === sttime.hour);
        // if(existConsumerData){
        //   // this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
        //   return false;
        // }
        // else{
        //  return this.selectedTimes.push(sttime);
        // }
       
        this.selectedTimes.push(sttime);
      }
      if(this.reminderDetails.providerConsumer.id){
        // this.getCustomerbyId(this.reminderDetails.providerConsumer.id);
        const filter = { 'id-eq': this.reminderDetails.providerConsumer.id };
        this.providerService.getCustomer(filter)
        .subscribe(
            (data: any) => {
              console.log("Respooooos :",data);
              //this.selectedConsumers = data;
              this.selectedCustomerViaPhoneSearch(data[0]);
              
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
  //getReminderById
  onCancel() {
    // this.router.navigate(['provider', 'settings', 'comm', 'reminder']);
    this.isCreate = false;
    // this.location.back();
  }
  createAddRemainder() {
    this.isCreate = true;
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
  }

  createForm() {
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
    if (this.reminderId !== 0) {
      if (form_data.message === "") {
        this.snackbarService.openSnackBar("Please enter reminder message", {
          panelClass: "snackbarerror"
        });
      } else if ((this.selectedTime === undefined || this.selectedTime === "")) {
        this.snackbarService.openSnackBar("Please select time slot", {
          panelClass: "snackbarerror"
        });
      } else if ((this.selectedConsumer === undefined ||this.selectedConsumer === "")) {
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
            recurringType: "Once",
            repeatIntervals: [1, 2, 3, 4, 5, 6],
            startDate: form_data.fromDate,
            terminator: {
              endDate: form_data.toDate,
              noOfOccurance: "1"
            },
            timeSlots: [
              {
                sTime: this.selectedTime,
                eTime: this.selectedTime
              }
            ]
          },
          provider: this.providerId,
          providerConsumer: this.selectedConsumer.id,
          message: form_data.message,
          name: form_data.name,
          reminderSource: {
            Sms: form_data.sms ? "1" : "0",
            Email: form_data.email ? "1" : "0",
            PushNotification: form_data.phoneNumber ? "1" : "0"
          }
        };
        console.log("Posting Updated Data ;", postData);

        // this.amForm.reset();
        this.providerService
          .updateReminder(postData, this.reminderId)
          .subscribe(
            (res: any) => {
              console.log("Reminder res :", res);
              this.getReminders();
              this.getReminderCounts();
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
      }
    } else {
      // if(this.selectedConsumer.id){
      //   postData['providerConsumer'] = this.selectedConsumer.id;
      // }
      if (form_data.message === "") {
        this.snackbarService.openSnackBar("Please enter reminder message", {
          panelClass: "snackbarerror"
        });
      } else if ((this.selectedTime === undefined || this.selectedTime === "")) {
        this.snackbarService.openSnackBar("Please select time slot", {
          panelClass: "snackbarerror"
        });
      } else if ((this.selectedConsumer === undefined ||this.selectedConsumer === "")) {
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
            recurringType: "Once",
            repeatIntervals: [1, 2, 3, 4, 5, 6],
            startDate: form_data.fromDate,
            terminator: {
              endDate: form_data.toDate,
              noOfOccurance: "1"
            },
            timeSlots: [
              {
                sTime: this.selectedTime,
                eTime: this.selectedTime
              }
            ]
          },
          provider: this.providerId,
          providerConsumer: this.selectedConsumer.id,
          message: form_data.message,
          name:form_data.name,
          reminderSource: {
            Sms: form_data.sms ? "1" : "0",
            Email: form_data.email ? "1" : "0",
            PushNotification: form_data.phoneNumber ? "1" : "0"
          }
        };
        // this.amForm.reset();
        console.log("Posting Data ;", postData);

        this.providerService.postReminder(postData).subscribe(
          (res: any) => {
            console.log("Reminder res :", res);
            this.getReminders();
            this.getReminderCounts();
            this.isCreate = false;
            this.snackbarService.openSnackBar("Reminder Created Successfully", {
              panelClass: "snackbarnormal"
            });
          },
          error => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror"
            });
          }
        );
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

    if (index >= 0) {
      this.selectedConsumers.splice(index, 1);
    }
  }
  removeTime(time: any): void {
    const index = this.selectedTimes.indexOf(time);

    if (index >= 0) {
      this.selectedTimes.splice(index, 1);
    }
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
  selectedCustomerViaPhoneSearch(customer,mode?) {
    this.selectedPhone = customer.phoneNo;
    console.log("Selected consumer :", customer);
    this.selectedConsumer = customer;
    const existConsumerData = this.selectedConsumers.find(x => x.id === customer.id);
    if(existConsumerData){
      if(mode === 'edit'){
        this.selectedConsumers = customer;
        return false;
      }
      else{
      this.snackbarService.openSnackBar('Consumer already selected', { 'panelClass': 'snackbarerror' });
      }
    }
    else{
     return this.selectedConsumers.push(customer);
    }
   
    //console.log("Selected consumersss :", this.selectedConsumers);
    //this.customer_data = customer;
    // this.foundMultipleCustomers = false;
    // this.initConsumerAppointment(this.customer_data);
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
}
