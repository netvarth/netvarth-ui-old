
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-force-dialog',
  templateUrl: './force-dialog.component.html'
})
export class ForceDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  forceUpdate () {
    window.location.href = this.data.versionInfo.playstore.link;
  }
  // forceUpdate () {
  //   window.location.href = '';
  // }
}

