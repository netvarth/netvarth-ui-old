import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-rx',
  templateUrl: './view-rx.component.html',
  styleUrls: ['./view-rx.component.css']
})
export class ViewRxComponent implements OnInit {
  wpath: any;
  description: string;
  imageUrl: string;
  accuid: any;
  window_path: any;
  qrCodePath: string;
  qr_code_cId = false;
  qr_code_oId = false;
  qr_value;
  shareLink: any;
 
  constructor(private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ViewRxComponent>,
    private angular_meta: Meta,
    private titleService: Title ,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  private qrCodeParent: ElementRef;
  @ViewChild('qrCodeOnlineId', { read: ElementRef }) set content1(content1: ElementRef) {
    if (content1) { // initially setter gets called with undefined
      this.qrCodeParent = content1;
    }
  }
  // private qrCodeCustId: ElementRef;

  @ViewChild('qrCodeCustId') set content2(content2: ElementRef) {
    if (content2) { // initially setter gets called with undefined
      this.qrCodeParent = content2;
    }
  }


  ngOnInit() {
    this.accuid = this.data.accencUid;
    // this.wpath = this.data.path;
  
    this.shareLink =  this.accuid;
    // this.description = 'You can book my services by just clicking this link';
    // this.imageUrl = this.wpath + 'assets/images/logo.png';
    this.qrCodegenerateOnlineID(this.accuid);
  }
  ngOnDestroy() {
    this.titleService.setTitle('Jaldee');
  }
  qrCodegenerateOnlineID(valuetogenerate) {
    this.qr_value =  valuetogenerate;
    this.qr_code_oId = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.qrCodePath = this.qrCodeParent.nativeElement.getElementsByTagName('img')[0].src;
      this.angular_meta.addTags([
        //  { property: 'og:title', content: this.data.businessName },
        // { property: 'og:image', content: this.imageUrl },
        // { property: 'og:type', content: 'link' },
        // { property: 'og:description', content: this.description },

      ]);
    }, 50);
  }

}
