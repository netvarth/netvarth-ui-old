import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SnackbarService } from "../../../../../../shared/services/snackbar.service";

@Component({
  selector: "app-create-reminder",
  templateUrl: "./create-reminder.component.html",
  styleUrls: ["./create-reminder.component.css"]
})
export class CreateReminderComponent implements OnInit {
  mode;
  time = { hour: 9, minute: 10 };
  //,mode:'AM'
  hourStep = 1;
	minuteStep = 10;
	// secondStep = 30;
  meridian = true;
  constructor(
    public dialogRef: MatDialogRef<CreateReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService
  ) {
    this.mode = this.data.mode;
  }

  ngOnInit(): void {}
  onSubmitTime(time) {
    // let timeSlot = {};
    // timeSlot = {
    //   time:time,
    //   // mode:mode
    // }
    console.log("meridian :",this.meridian);
    if(time.hour >= 12){
      time['mode']='PM'
      // const isPm = time.hour > 12;
      //       return `${time.hour > 12 ? time.hour - 12 : time.hour}:${time.minute} {isPm ? time['mode']='PM' : time['mode']='AM'}`
       //return (time.hour > 12 ? time.hour - 12 : time.hour) {time.hour > 12 ? time['mode']='PM' : time['mode']='AM'}`
    }
    else{
      time['mode']='AM'

    }
    
    console.log("time :", time);

    if (time) {
      this.dialogRef.close(time);
    } else {
      this.snackbarService.openSnackBar("please select time", {
        panelClass: "snackbarerror"
      });
    }
  }
  cancelTime() {
    this.dialogRef.close();
  }
  // getTimeinMin() {
  //   const time_min = this.time.hour * 60 + this.time.minute;
  //   return typeof time_min === "number" ? time_min : 0;
  // }
  // convertTime(time) {
  //   this.time.hour = Math.floor(time / 60);
  //   this.time.minute = time % 60;
  //   this.amForm.get("delay").setValue(this.time);
  // }
}
