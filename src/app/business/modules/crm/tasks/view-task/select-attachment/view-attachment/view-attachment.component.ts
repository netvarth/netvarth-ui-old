import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.css']
})
export class ViewAttachmentComponent implements OnInit {
  type: string;
  filePath: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ViewFileRef: MatDialogRef<ViewAttachmentComponent>,
  ) { }

  ngOnInit(): void {
    console.log("this.data.attachmentDetails", this.data.attachmentDetails)
    let filetype;
    if (this.data.attachmentDetails.type) {
      filetype = this.data.attachmentDetails.type
    } else if (this.data.attachmentDetails.fileType) {
      filetype = this.data.attachmentDetails.fileType;
    }
    this.filePath = this.data.attachmentDetails.s3path
    if (filetype == 'jpeg' || filetype == 'jpg' || filetype == 'png' || filetype == 'gif') {
      this.type = "image"
    }
    else {
      this.type = "file"
    }

  }

  goBack() {
    this.ViewFileRef.close()
  }

}
