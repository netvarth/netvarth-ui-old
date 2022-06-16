
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { FileService } from "../../../../shared/services/file-service";

@Component({
  selector: 'app-previewpdf',
  templateUrl: './previewpdf.component.html',
  styleUrls: ['./previewpdf.component.css']
})
export class PreviewpdfComponent implements OnInit {
  crifHTML;
  attachments: any;
  showError: any;
  mediafiles: any = [];
  docfiles: any = [];
  fileviewdialogRef: any;
  type: any;
  constructor(
    public dialogRef: MatDialogRef<PreviewpdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
 
  ) {
    this.crifHTML = this.data.crif;
    this.type = this.data.type;
  }
  ngOnInit() {
  }

  printCRIF() {
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);
    printWindow.document.write(this.crifHTML);    
    printWindow.moveTo(0, 0);
    printWindow.print();
    printWindow.document.close();
    setTimeout(() => {
      printWindow.close();
    }, 500);
   
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

