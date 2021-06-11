import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
@Component({
  selector: 'app-showuploadfile',
  templateUrl: './showuploadfile.component.html'
})
export class ShowuploadfileComponent implements OnInit {
  details: any;
  locationImg: any;
  cacheavoider = '';
  title = '';
  constructor(
    public dialogRef: MatDialogRef<ShowuploadfileComponent>,
    public sharedfunctionObj: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.details = this.data.file;
  }
  ngOnInit() {
      console.log(this.details);
      const cnow = new Date();
      const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
      this.cacheavoider = dd;
      
  }
  showimg(imgurl) {
    let logourl = '';
      if (imgurl) {
        logourl = (imgurl) ? imgurl + '?' + this.cacheavoider : '';
      }
      return this.sharedfunctionObj.showlogoicon(logourl);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
