import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { CrmService } from '../../../crm.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-select-attachment',
  templateUrl: './select-attachment.component.html',
  styleUrls: ['./select-attachment.component.css']
})
export class SelectAttachmentComponent implements OnInit {



selectedFiles: FileList;
progressInfos = [];
message = '';
fileInfos: Observable<any>;
  
  constructor(
    public _location: Location,
    public dialogRef: MatDialogRef<SelectAttachmentComponent>,
    private uploadService: CrmService,
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


















  
  
  dialogClose() {
    this.dialogRef.close();
  }
  
 

goBack()
{
  this._location.back();
}


}
