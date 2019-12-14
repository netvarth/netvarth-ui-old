import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { version } from '../../constants/version';

@Component({
  selector: 'app-force-dialog',
  templateUrl: './force-dialog.component.html'
})
export class ForceDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ForceDialogComponent>) { }

  ngOnInit() {
  }
  forceUpdate() {
    this.dialogRef.close('true');
    window.location.href = version.updateUrl;
  }
}
