import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../functions/shared-functions';
import { ShowuploadfileComponent } from '../showuploadfile/showuploadfile.component';
@Component({
  selector: 'app-attachment-popup',
  templateUrl: './attachment-popup.component.html',
  styleUrls: ['./attachment-popup.component.css']
})
export class AttachmentPopupComponent implements OnInit {
  cacheavoider: string;
  attachments: any;
  showError:any;
  mediafiles: any=[];
  docfiles: any=[];
  fileviewdialogRef: any;
  

  constructor(

      public dialogRef: MatDialogRef<AttachmentPopupComponent>,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  
    this.attachments=this.data.attachments;
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
    if(attachments.length>0){
    for(let attachment of attachments){
      let fileType :any;
      if(attachment.type){
      fileType = attachment.type.split("/");
     // console.log(type[0]);
      if(fileType[0] == 'video' || fileType[0] =='audio'|| fileType[0] =='image'){
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
  showFile(file){
  

    this.fileviewdialogRef = this.dialog.open(ShowuploadfileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'uploadfilecomponentclass'],
      disableClose: true,
      data: {
        file: file,
        
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
  getImageSource(file) {
    let imgsrc='/assets/images/pdf.png';
   // console.log(file);
    let type = '';
              type = file.type.split("/");
             // console.log(type[0]);
              if(type[0] == 'video'){
                imgsrc='/assets/images/video.png';
              } else if( type[0] == 'audio') {
                imgsrc='/assets/images/audio.png';
              }else if( type[0] == 'image') {
                imgsrc='/assets/images/imageexamle.png';
              }

    return imgsrc;

  }
  cancel(){

  }
  submit() {

  }

}
