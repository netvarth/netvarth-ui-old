import { Component, Inject, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CrmService } from "../../../crm.service";
import { Observable } from "rxjs";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { SnackbarService } from "../../../../../../shared/services/snackbar.service";
import { SharedServices } from "../../../../../../shared/services/shared-services";
import { FileService } from "../../../../../../shared/services/file-service";
import { projectConstantsLocal } from "../../../../../../shared/constants/project-constants";
// import { Router } from '@angular/router';

@Component({
  selector: "app-select-attachment",
  templateUrl: "./select-attachment.component.html",
  styleUrls: ["./select-attachment.component.css"]
})
export class SelectAttachmentComponent implements OnInit {
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  imgCaptions: any = [];

  source:any;
  selectedFiles: FileList;
  progressInfos = [];
  message = "";
  fileInfos: Observable<any>;
  action: string;
  public fileInput:any;
  public fileSelectErrorMsg:any;
  public bUploadFileError:boolean=false
  constructor(
    public _location: Location,
    public dialogRef: MatDialogRef<SelectAttachmentComponent>,
    private uploadService: CrmService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    public shared_services: SharedServices,
    private fileService: FileService
  ) // private router: Router,

  { 
    console.log('this.source',this.data)
    this.source = this.data.source
    console.log("Source Type :",this.source)
  }

  ngOnInit(): void {

   
    // this.fileInfos = this.uploadService.getFiles();
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  uploadFiles() {
    this.message = "";
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.uploadService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event instanceof HttpResponse) {
          // this.fileInfos = this.uploadService.getFiles();
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = "Could not upload the file : " + file.name;
      }
    );
  }

  filesSelected(event, type?) {
    const input = event.target.files;
    this.fileInput=input;
    console.log(' this.fileInput', this.fileInput)
    //let taskid = this.data.taskuid;
    console.log("input : ", input);
    // this.bUploadFileError=false;
    //   this.fileSelectErrorMsg=''
  
    if (input.length===1) {
      for (const file of input) {
        if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar(
            "Please upload images with size < 10mb",
            { panelClass: "snackbarerror" }
          );
          return;
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = e => {
            this.selectedMessage.base64.push(e.target["result"]);
          };
          console.log(' this.selectedMessage', this.selectedMessage.files)

          reader.readAsDataURL(file);
          this.action = "attachment";

          if (this.selectedMessage.caption) {
            return this.imgCaptions;
          } else {
            return (this.imgCaptions = "");
          }
        }
      }
      // this.saveFile()
    }
    else {
      if (event && event.target && event.target.files && event.target.files.length) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.selectedMessage.files.push(event.target.files[i]);
          const reader = new FileReader();
          reader.onload = e => {
            this.selectedMessage.base64.push(e.target["result"]);
          };
          reader.readAsDataURL(event.target.files[i]);
          this.action = "attachment";
        }
      }

      console.log('this.selectedMessage', this.selectedMessage)
    }
    // if( this.fileInput.length>0){
    //   this.bUploadFileError=false;
    //   this.fileSelectErrorMsg=''
    // }
    // else{
    //   this.bUploadFileError=true;
    //   this.fileSelectErrorMsg='Please select atleast one file'
    // }
  }

  saveFile(fileDes:any) {
    const _this = this;
    // console.log('this.fileInput',this.fileInput.length)
    console.log('file', this.selectedMessage.files)
    if(this.selectedMessage.files.length >0){
      this.bUploadFileError=false;
      this.fileSelectErrorMsg=''
      this.dialogRef.close();
      console.log("The data is : ", this.data.source);
      if (this.data.source == "Lead") {
        var id = this.data.leaduid;
        console.log("This is Lead id : ", id);
      } else {
        var id = this.data.taskuid;
        console.log("This is Task id : ", id);
      }
      return new Promise(function(resolve, reject) {
        const dataToSend: FormData = new FormData();
        const captions = {};
        let i = 0;
        if (_this.selectedMessage) {
          for (const pic of _this.selectedMessage.files) {
            console.log('pic',pic)
            dataToSend.append("attachments", pic, pic["name"]);
            captions[i] = _this.imgCaptions[i] ? _this.imgCaptions[i] : "";
            i++;
          }
        }
        const blobPropdata = new Blob([JSON.stringify(captions)], {
          type: "application/json"
        });
        dataToSend.append("captions", blobPropdata);
        _this.sendWLAttachment(id, dataToSend).then(() => {                                                                         
          resolve(true);
        
        });
      });
    }
    else{
      this.bUploadFileError=true;
      this.fileSelectErrorMsg='Please select atleast one file to upload' ;
    }
    
  }
  getImage(url, file) {
    console.log('url,url',url)
    console.log("File :", file);
    this.bUploadFileError=false;
    this.fileSelectErrorMsg=''
    return this.fileService.getImage(url, file);
  }
  //   getImage(url, file) {
  //     if (file.type == 'application/pdf') {
  //         return './assets/images/pdf.png';
  //     }
  //     else if (file.type == 'audio/mp3' || file.type == 'audio/mpeg' || file.type == 'audio/ogg') {
  //         return './assets/images/audio.png';

  //     }
  //     else if (file.type == 'video/mp4' || file.type == 'video/mpeg') {
  //         return './assets/images/video.png';
  //     }
  //     else {
  //         return url;
  //     }
  // }

  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.imgCaptions[i] = "";
    console.log('this.selectedMessage.files',this.selectedMessage.files.length)
    if( this.selectedMessage.files.length>0){
      this.bUploadFileError=false;
      this.fileSelectErrorMsg=''
    }
    else{
      this.bUploadFileError=true;
      this.fileSelectErrorMsg='Please select atleast one file to upload'
    }
  }

  sendWLAttachment(Uid, dataToSend) {
    const _this = this;
    console.log("Data Testing", this.data.source);
    if (this.data.source != "Lead") {
      return new Promise(function(resolve, reject) {
        _this.shared_services.addfiletotask(Uid, dataToSend).subscribe(
          () => {
            resolve(true);
            console.log("Sending Attachment Success");
          },
          error => {
            reject(error);
            console.log("Sending Task Attachment Fail");
            this.snackbarService.openSnackBar(
              "Please select atleast one file to upload",
              { panelClass: "snackbarerror" }
            );
          }
        );
      });
    } else {
      return new Promise(function(resolve, reject) {
        _this.shared_services.addfiletolead(Uid, dataToSend).subscribe(
          () => {
            resolve(true);
            console.log("Sending Attachment Success");
          },
          error => {
            reject(error);
            console.log("Sending Lead Attachment Fail");
            this.snackbarService.openSnackBar(
              "Please select atleast one file to upload",
              { panelClass: "snackbarerror" }
            );
          }
        );
      });
    }
  }

  dialogClose() {
    this.dialogRef.close('close');
  }

  goBack() {
    this._location.back();
  }
}
