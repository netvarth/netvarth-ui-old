import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-voicecall-confirm-box',
  templateUrl: './voicecall-confirm-box.component.html',
  styleUrls: ['./voicecall-confirm-box.component.css']
})

export class VoicecallConfirmBoxComponent {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';

  constructor(public dialogRef: MatDialogRef<VoicecallConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.type) {
    }
  }
  ngOnInit() {
  }
  onClick() {
    this.dialogRef.close();
  }
}
