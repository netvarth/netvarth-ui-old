import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Observer } from 'rxjs';
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
  base64Image: string;
  loading:boolean;
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
  downLoad(data){
    console.log(data)
    // window.open()
    let imageUrl =data.url;
    this.loading= true;
  this.getBase64ImageFromURL(imageUrl,data.type).subscribe(base64data => {
    // console.log(base64data);
    const new1= data.type.slice(1,data.type.length)
    console.log(new1)
    this.base64Image = 'data:image/'+new1+';base64,' + base64data;
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.setAttribute("href", this.base64Image);
    link.setAttribute("download", data.originalName);
    link.click();
    this.loading=false;
  });
  }
  getBase64ImageFromURL(url: string,type?) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img,type));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img,type));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement,type?) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
   
  }
   copyImage1(url){
    var img=document.createElement('img');
    img.src=url;
    document.body.appendChild(img);
    var r = document.createRange();
    r.setStartBefore(img);
    r.setEndAfter(img);
    r.selectNode(img);
    var sel = window.getSelection();
    sel.addRange(r);
    document.execCommand('Copy');
}


copyImage(data,event) {
  // console.log(data)
  // console.log(event)
}

}
