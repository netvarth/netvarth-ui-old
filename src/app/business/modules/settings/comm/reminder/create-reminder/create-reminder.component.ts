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
  time = { hour: 9, minute: 0 };
  constructor(
    public dialogRef: MatDialogRef<CreateReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService
  ) {
    this.mode = this.data.mode;
  }

  ngOnInit(): void {}
  onSubmitTime(time) {
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
