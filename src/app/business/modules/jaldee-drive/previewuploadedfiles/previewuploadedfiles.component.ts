
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-previewuploadedfiles',
  templateUrl: './previewuploadedfiles.component.html',
  styleUrls: ['./previewuploadedfiles.component.css']
})
export class PreviewuploadedfilesComponent implements OnInit {
  details: any = [];
  constructor(
    public dialogRef: MatDialogRef<PreviewuploadedfilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.details = this.data.file;
    //console.log("Caption :",this.details.caption);
   // console.log("Path :",this.details.filePath);
    console.log("Type :",this.details.fileType);
  }
  ngOnInit() {
  }
  closeDialog() {
    this.dialogRef.close();
  }
}

