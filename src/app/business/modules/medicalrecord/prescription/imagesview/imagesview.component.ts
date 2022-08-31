import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
@Component({
  selector: 'app-imagesview',
  templateUrl: './imagesview.component.html',
  styleUrls:['./imagesview.component.css']
})
export class ImagesviewComponent implements OnInit {
  imgDetails: any;
  locationImg: any;
  cacheavoider = '';
  title = '';
  constructor(
    public dialogRef: MatDialogRef<ImagesviewComponent>,
    public sharedfunctionObj: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imgDetails = this.data;
  }
  ngOnInit() {
      console.log(this.imgDetails);
      const cnow = new Date();
      const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
      this.cacheavoider = dd;
      if(this.imgDetails && this.imgDetails.title){
        this.title = this.imgDetails.title;
      }
      if(this.imgDetails && this.imgDetails.url){
        this.locationImg = this.showimg(this.imgDetails.url);
      }
  }
  showimg(imgurl) {
    let logourl = '';
      if (imgurl) {
        logourl = (imgurl) ? imgurl  : '';
      }
      return this.sharedfunctionObj.showlogoicon(logourl);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
