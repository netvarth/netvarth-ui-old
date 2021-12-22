import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
@Component({
  selector: 'app-imagesview',
  templateUrl: './imagesview.component.html'
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
      this.title = this.imgDetails.title;
      this.locationImg = this.showimg(this.imgDetails.url);
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
