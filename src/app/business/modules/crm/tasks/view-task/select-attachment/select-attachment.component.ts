import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrmService } from '../../../crm.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { projectConstants } from '../../../../../../../../src/app/app.component';
import { SharedServices } from '../../../../../../shared/services/shared-services';
// import { Router } from '@angular/router';


@Component({
  selector: 'app-select-attachment',
  templateUrl: './select-attachment.component.html',
  styleUrls: ['./select-attachment.component.css']
})
export class SelectAttachmentComponent implements OnInit {

selectedMessage = {
  files: [],
  base64: [],
  caption: []
};
imgCaptions: any = [];
  

selectedFiles: FileList;
progressInfos = [];
message = '';
fileInfos: Observable<any>;
  action: string;
  
  constructor(
    public _location: Location,
    public dialogRef: MatDialogRef<SelectAttachmentComponent>,
    private uploadService: CrmService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    public shared_services: SharedServices,
    // private router: Router,


  ) { }

  ngOnInit(): void {
    // this.fileInfos = this.uploadService.getFiles();
  }



  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  uploadFiles() {
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }


  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.uploadService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          // this.fileInfos = this.uploadService.getFiles();
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file : ' + file.name;
      });
  }


  filesSelected(event, type?) {
    const input = event.target.files;
    //let taskid = this.data.taskuid;
    console.log("input : ",input)
    if (input) {
        for (const file of input) {
            // if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
            //     this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
            //     return;
            // } else
  
            if (file.size > projectConstants.FILE_MAX_SIZE) {
                this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
                return;
            } else {
                this.selectedMessage.files.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.selectedMessage.base64.push(e.target['result']);
                };
                reader.readAsDataURL(file);
                this.action = 'attachment';
                
                if (this.selectedMessage.caption) {
                    return this.imgCaptions;
                }
                else {
                    return this.imgCaptions = '';
                }
            }
            
        }
        // this.saveFile()
        if (type && this.selectedMessage.files && this.selectedMessage.files.length > 0 && input.length > 0) {
        }
    }
  }


  saveFile()
  {
    const _this = this;
    let taskid = this.data.taskuid;
    return new Promise(function (resolve, reject) {
        const dataToSend: FormData = new FormData();
        const captions = {};
        let i = 0;
        if (_this.selectedMessage) {
            for (const pic of _this.selectedMessage.files) {
                dataToSend.append('attachments', pic, pic['name']);
                captions[i] = (_this.imgCaptions[i]) ? _this.imgCaptions[i] : '';
                i++;
            }
        }
        const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
        dataToSend.append('captions', blobPropdata);

        _this.sendWLAttachment(taskid,dataToSend).then(
            () => {
                        resolve(true);
                    }
        )
        
    });
    
  }

  getImage(url, file) {
    if (file.type == 'application/pdf') {
        return './assets/images/pdf.png';
    }
    else if (file.type == 'audio/mp3' || file.type == 'audio/mpeg' || file.type == 'audio/ogg') {
        return './assets/images/audio.png';

    }
    else if (file.type == 'video/mp4' || file.type == 'video/mpeg') {
        return './assets/images/video.png';
    }
    else {
        return url;
    }
}


  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.imgCaptions[i] = '';
}

  sendWLAttachment(taskUid, dataToSend) {
    const _this = this;
    return new Promise(function (resolve, reject) {
        _this.shared_services.addfiletotask(taskUid, dataToSend).subscribe(
            () => {
                resolve(true);
                console.log("Sending Attachment Success")
            }, (error) => {
                reject(error);
                console.log("Sending Attachment Fail")
                this.snackbarService.openSnackBar('Please select atleast one file to upload', { 'panelClass': 'snackbarerror' });
            });
    });
  }


  
  
  dialogClose() {
    this.dialogRef.close();
  }

 

goBack()
{
  this._location.back();
}


}
