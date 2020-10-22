import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-imagesview',
  templateUrl: './imagesview.component.html'
})
export class ImagesviewComponent implements OnInit {
  imgDetails: any;
  locationImg: any;
  constructor(
    public dialogRef: MatDialogRef<ImagesviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imgDetails = this.data;
  }
  ngOnInit() {
      console.log(this.imgDetails);
    this.locationImg = this.imgDetails.url;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
