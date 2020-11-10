
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance-msg',
  templateUrl: './maintenance-msg.component.html'
})
export class MaintenanceMsgComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, public dialogRef: MatDialogRef<MaintenanceMsgComponent>) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
}

