import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../functions/shared-functions';
import { ShowuploadfileComponent } from '../../../../app/business/modules/medicalrecord/uploadfile/showuploadfile/showuploadfile.component';
import { FileService } from '../../services/file-service';

@Component({
  selector: 'app-attachment-popup',
  templateUrl: './attachment-popup.component.html',
  styleUrls: ['./attachment-popup.component.css']
})
export class AttachmentPopupComponent implements OnInit {
  cacheavoider: string;
  attachments: any;
  showError: any;
  mediafiles: any = [];
  docfiles: any = [];
  fileviewdialogRef: any;
  constructor(
    public dialogRef: MatDialogRef<AttachmentPopupComponent>,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.attachments = this.data.attachments;
    console.log(this.attachments);
    this.sortMediaFiles(this.attachments);
  }
  ngOnInit() {
    console.log('attachments');
    const cnow = new Date();
    const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
    this.cacheavoider = dd;
  }
  showimg(imgurl) {
    let logourl = '';
    if (imgurl) {
      logourl = (imgurl) ? imgurl + '?' + this.cacheavoider : '';
    }
    return this.sharedfunctionObj.showlogoicon(logourl);
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
  showFile(file) {

    this.fileviewdialogRef = this.dialog.open(ShowuploadfileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
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
  closeDialog() {
    this.dialogRef.close();
  }
  getImage(fileType) {
    console.log(fileType);
    return this.fileService.getImageByType(fileType);
  }
}
