import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-video-player-dialog',
  templateUrl: './list-recordings-dialog.component.html'
})
export class ListRecordingsDialogComponent implements OnInit {
  recordingUrls: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.recordingUrls = this.data.recordingUrls;
  }

  ngOnInit(): void {
   
  }

}
