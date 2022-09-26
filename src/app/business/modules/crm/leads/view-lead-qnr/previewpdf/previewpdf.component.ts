
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
  pdfUrl:any;
  mrid:any;
  thumbnail: any;
  constructor(
    public dialogRef: MatDialogRef<PreviewpdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService,
  ) {
    console.log('data',data);
  }
  ngOnInit() {
    // this.api_loading=false;
    if(this.data && this.data.requestType){
      this.dialogTYpe= this.data.requestType;
    }
    if(this.data && this.data.type){
      this.fileTYpe= this.data.data.type;
      this.getImageType(this.fileTYpe)
    }
    if(this.data && this.data.mrId){
      this.mrid = this.data.mrId;
    }
    if(this.dialogTYpe==='priviewFilePrescription'){
      if(this.data && this.data.data && this.data.data.type ==='.pdf'){
        if(this.data && this.data.data && this.data.data.url){
          this.pdfUrl= this.data.data.url;
          this.api_loading=false;
  
        }
  
  
      }
    }
    
  }

  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  getFileType(type){
    // console.log('type',type)
    if(type){
      if(type==='image/png' || type ==='.png'){
        return './assets/images/ImgeFileIcon/png.png'
      }
      else if(type==='application/pdf' || type==='.pdf'){
        return './assets/images/ImgeFileIcon/pdf.png'
      }
      else if(type==='image/bmp' || type==='.bmp'){
        return './assets/images/ImgeFileIcon/bmp.png'
      }
      else if(type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
        return './assets/images/ImgeFileIcon/docsWord.png'
      }
      else if(type==='video/mp4'){
        return './assets/images/ImgeFileIcon/video.png'
      }
      else if(type==='image/jpg' || type==='.jpg'){
        return './assets/images/ImgeFileIcon/jpg.png'
      }
      else if(type==='.jpeg'){
        return './assets/images/ImgeFileIcon/jpeg.png'
      }
      else{
        return './assets/images/ImgeFileIcon/othersFile.png'
      }

    }
  }
  download(pdfUrl:any){
    if(pdfUrl){
      window.open(pdfUrl)

    }
  }
}

