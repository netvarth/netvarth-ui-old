import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
// import { CrmService } from "../../../crm.service";
import { Observable } from "rxjs";
// import { HttpEventType, HttpResponse } from "@angular/common/http";
import { SnackbarService } from "../../../../../../shared/services/snackbar.service";
import { SharedServices } from "../../../../../../shared/services/shared-services";
import { FileService } from "../../../../../../shared/services/file-service";
import { projectConstantsLocal } from "../../../../../../shared/constants/project-constants";

@Component({
  selector: "app-select-attachment",
  templateUrl: "./select-attachment.component.html",
  styleUrls: ["./select-attachment.component.css"]
})
export class SelectAttachmentComponent implements OnInit {
  
  @Output() sendInput = new EventEmitter<any>();
  
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  imgCaptions: any = [];

  source: any;
  selectedFiles: FileList;
  progressInfos = [];
  message = "";
  fileInfos: Observable<any>;
  action: string;
  public fileInput: any;
  public fileSelectErrorMsg: any;
  public bUploadFileError: boolean = false;
  // api_loading1:boolean;
  constructor(
    public _location: Location,
    public dialogRef: MatDialogRef<SelectAttachmentComponent>,
    // private uploadService: CrmService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    public shared_services: SharedServices,
    private fileService: FileService
  ) {
    this.source = this.data.source
  }

  ngOnInit(): void {
    // this.api_loading1 = false
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  // uploadFiles() {
  //   this.message = "";
  //   for (let i = 0; i < this.selectedFiles.length; i++) {
  //     this.upload(i, this.selectedFiles[i]);
  //   }
  // }

  // upload(idx, file) {
  //   this.progressInfos[idx] = { value: 0, fileName: file.name };
  //   this.uploadService.upload(file).subscribe(
  //     event => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         this.progressInfos[idx].value = Math.round(
  //           (100 * event.loaded) / event.total
  //         );
  //       } else if (event instanceof HttpResponse) {
  //       }
  //     },
  //     err => {
  //       this.progressInfos[idx].value = 0;
  //       this.message = "Could not upload the file : " + file.name;
  //     }
  //   );
  // }

  filesSelected(event, type?) {
    const input = event.target.files;
    this.fileInput = input;
    if (input.length === 1) {
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
    }
  }

  saveFile(fileDes: any) {
    const _this = this;
    // _this.api_loading1=true;
    console.log('file', this.selectedMessage.files)
    if (this.selectedMessage.files.length > 0) {
      this.bUploadFileError = false;
      this.fileSelectErrorMsg = ''
      // this.dialogRef.close();
      console.log("The data is : ", this.data.source);
      if (this.data.source == "Lead") {
        var id = this.data.leaduid;
        console.log("This is Lead id : ", id);
      } else {
        var id = this.data.taskuid;
        console.log("This is Task id : ", id);
      }
      // // return new Promise(function (resolve, reject) {
      //   const dataToSend: FormData = new FormData();
      //   const captions = {};
      //   let i = 0;
        // if (_this.selectedMessage) {
        //   for (const pic of _this.selectedMessage.files) {
        //     console.log('pic', pic)
        //     dataToSend.append("attachments", pic, pic["name"]);
        //     captions[i] = _this.imgCaptions[i] ? _this.imgCaptions[i] : "";
        //     i++;
        //   }
        // }
        // const blobPropdata = new Blob([JSON.stringify(captions)], {
        //   type: "application/json"
        // });
        // dataToSend.append("captions", blobPropdata);
        this.sendInput.emit(_this.selectedMessage);
        // _this.sendWLAttachment(id, dataToSend).then(() => {
        //   // _this.api_loading1=false;
        //   // _this.dialogRef.close();
        //   // _this.snackbarService.openSnackBar("Sending Attachment Successfully");
        //   // resolve(true);
        // },(error)=>{
        //   _this.api_loading1=false;
        //   // console.log("Sending Task Attachment Fail");
        //   _this.snackbarService.openSnackBar(
        //     error,
        //     { panelClass: "snackbarerror" }
        //   );
        // });
      // });
    }
    else {
      // _this.api_loading1=false;
      this.bUploadFileError = true;
      this.fileSelectErrorMsg = 'Please select atleast one file to upload';
    }

  }
  getImage(url, file) {
    this.bUploadFileError = false;
    this.fileSelectErrorMsg = ''
    return this.fileService.getImage(url, file);
  }
  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.imgCaptions[i] = "";
    console.log('this.selectedMessage.files', this.selectedMessage.files.length)
    if (this.selectedMessage.files.length > 0) {
      this.bUploadFileError = false;
      this.fileSelectErrorMsg = ''
    }
    else {
      this.bUploadFileError = true;
      this.fileSelectErrorMsg = 'Please select atleast one file to upload'
    }
  }

  sendWLAttachment(Uid, dataToSend) {
    // const _this = this;
    // console.log("Data Testing", this.data.source);
    // if (this.data.source != "Lead") {
    //   return new Promise(function (resolve, reject) {
    //     _this.shared_services.addfiletotask(Uid, dataToSend).subscribe(
    //       () => {
    //         resolve(true);
    //         console.log("Sending Attachment Success");
    //         _this.dialogRef.close();
    //       // _this.snackbarService.openSnackBar("Sending Attachment Successfully");
    //         _this.api_loading1=false;
    //       },
    //       error => {
    //         _this.api_loading1=false;
    //         reject(error);
    //         _this.snackbarService.openSnackBar(
    //           error,
    //           { panelClass: "snackbarerror" }
    //         );
    //       }
    //     );
    //   });
    // } else {
    //   return new Promise(function (resolve, reject) {
    //     _this.shared_services.addfiletolead(Uid, dataToSend).subscribe(
    //       () => {
    //         resolve(true);
    //         _this.api_loading1=false;
    //         console.log("Sending Attachment Success");
    //       },
    //       error => {
    //         _this.api_loading1=false;
    //         console.log("Sending Lead Attachment Fail");
    //         _this.snackbarService.openSnackBar(
    //           "Please select atleast one file to upload",
    //           { panelClass: "snackbarerror" }
    //         );
    //         _this.api_loading1=false;
    //         reject(error);
    //         _this.snackbarService.openSnackBar(
    //           error,
    //           { panelClass: "snackbarerror" }
    //         );
    //       }
    //     );
    //   });
    // }
  }
  dialogClose() {
    this.dialogRef.close('close');
  }
  goBack() {
    this._location.back();
  }
}
