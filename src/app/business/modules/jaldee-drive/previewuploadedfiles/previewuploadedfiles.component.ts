
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
//import { FileService } from "../../../../shared/services/file-service";
import { FileService } from "../../../../shared/services/file-service";
import { ShowuploadfileComponent } from '../../../../../app/business/modules/medicalrecord/uploadfile/showuploadfile/showuploadfile.component';

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
    private fileService: FileService,
    private dialog: MatDialog,
 
  ) {
    this.details = this.data.file;
    this.sortMediaFiles(this.details)
    //console.log("Caption :",this.details.caption);
   // console.log("Path :",this.details.filePath);
    console.log("Type :",this.details.fileType);
  }
  ngOnInit() {
  }

  // showimg(imgurl) {
  //   let logourl = '';
  //   if (imgurl) {
  //     logourl = (imgurl) ? imgurl + '?' + this.cacheavoider : '';
  //   }
  //   return this.sharedfunctionObj.showlogoicon(logourl);
  // }
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

  getImage(fileType) {
    console.log(fileType);
    return this.fileService.getImageByType(fileType);
}


showFile(file) {
  this.fileviewdialogRef = this.dialog.open(ShowuploadfileComponent, {
    width: '50%',
    panelClass: ['popup-class', 'commonpopupmainclass', 'uploadfilecomponentclass'],
    disableClose: true,
    data: {
      file: file
    }
  });
  this.fileviewdialogRef.afterClosed().subscribe(result => {
    if (result) {

    }
  });
}
}

