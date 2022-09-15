
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { FileService } from "../../../../shared/services/file-service";
import { FileService } from "../../../../shared/services/file-service";

@Component({
  selector: 'app-previewuploadedfiles',
  templateUrl: './previewuploadedfiles.component.html',
  styleUrls: ['./previewuploadedfiles.component.css']
})
export class PreviewuploadedfilesComponent implements OnInit {
  details: any = [];
  attachments: any;
  showError: any;
  mediafiles: any = [];
  docfiles: any = [];
  fileviewdialogRef: any;
  constructor(
    public dialogRef: MatDialogRef<PreviewuploadedfilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService 
  ) {
    this.details = this.data.file;
    this.sortMediaFiles(this.details);
  }
  ngOnInit() {
  }

  getImageType(fileType) {
     return this.fileService.getImageByType(fileType);
 }
  closeDialog() {
    this.dialogRef.close();
  }
  sortMediaFiles(attachments) {
    if (attachments.length > 0) {
      for (let attachment of attachments) {
        let fileType: any;
        if (attachment.type) {
          fileType = attachment.type.split("/");
          if (fileType[0] == 'video' || fileType[0] == 'audio' || fileType[0] == 'image' || fileType[0] == 'jpg' || fileType[0] == 'png' || fileType[0] == 'jpeg' || fileType[0] == 'gif') {
            this.mediafiles.push(attachment);
          }
          else {           
            this.docfiles.push(attachment);
          }
        } else {
        
          this.docfiles.push(attachment);
        }
      }
    }
  }
}
