
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-force-dialog',
  templateUrl: './force-dialog.component.html'
})
export class ForceDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  forceUpdate () {
    window.location.href = 'https://play.google.com/store/apps/details?id=com.jaldeeinc.jaldeebusiness';
  }
  // forceUpdate () {
  //   window.location.href = 'https://apps.apple.com/us/app/jaldee-for-business/id1475235232?ls=1';
  // }
}

