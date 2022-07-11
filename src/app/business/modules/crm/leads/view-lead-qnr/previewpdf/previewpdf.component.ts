
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileService } from '../../../../../../shared/services/file-service';

@Component({
  selector: 'app-previewpdf',
  templateUrl: './previewpdf.component.html',
  styleUrls: ['./previewpdf.component.css']
})
export class PreviewpdfComponent implements OnInit {
  type: any;
  dialogTYpe:any;
  imgSrc:any;
  api_loading:boolean;
  fileTYpe:any;
  constructor(
    public dialogRef: MatDialogRef<PreviewpdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService,
 
  ) {
    console.log('data',data);
  }
  ngOnInit() {
    this.api_loading=false;
    if(this.data && this.data.requestType){
      this.dialogTYpe= this.data.requestType;
    }
    if(this.data && this.data.type){
      this.fileTYpe= this.data.data.type;
      this.getImageType(this.fileTYpe)
    }
  }
  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}

