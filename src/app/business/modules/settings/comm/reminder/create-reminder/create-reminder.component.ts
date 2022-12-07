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
  time = { hour: new Date().getHours() , minute: new Date().getMinutes() };
  newtime = new Date();
  CurrentTime = new Date().getHours() + ':' + new Date().getMinutes() + ':'+  new Date().getSeconds();
  //,mode:'AM'
  hourStep = 1;
	minuteStep = 10;
	// secondStep = 30;
  meridian = true;
  spinners = true;

  constructor(
    public dialogRef: MatDialogRef<CreateReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService
  ) {
    this.mode = this.data.mode;
  }

  ngOnInit(): void {
    // console. log(
    //   newtime. toLocaleString(‘en-US’, { hour: ‘numeric’, hour12: true })
    //   );
      console.log("Current time :",this.CurrentTime);

  }
  onSubmitTime(time) {
    // let timeSlot = {};
    // timeSlot = {
    //   time:time,
    //   // mode:mode
    // }
    // let output = {hour: 16, minute: 3, second: 0};
    // let outputDate = new Date();

    // outputDate.setHours(output.hour);
    // outputDate.setMinutes(output.minute);
    // outputDate.setSeconds(output.second);

    if (time.hour >= new Date().getHours()) {
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
      }
      return true;
    } else {
      
        this.snackbarService.openSnackBar("Cannot set past time select valid slot", {
          panelClass: "snackbarerror"
        });
      
      return false;
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
