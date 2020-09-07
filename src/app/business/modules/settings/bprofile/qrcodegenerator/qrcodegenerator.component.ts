import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { projectConstants } from '../../../../../app.component';
import {  Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-qrcodegenerator',
  templateUrl: './qrcodegenerator.component.html'
})
export class QRCodeGeneratorComponent implements OnInit , OnDestroy {
  accuid: any;
  qr_code_cId = false;
  qr_code_oId = false;
  qr_value;
  qrCodePath: string;
  wpath: any;
  imageUrl: string;
  description: string;
  shareLink: any;
  window_path: any;
  customId: any;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<QRCodeGeneratorComponent>,
    private angular_meta: Meta,
    private titleService: Title ,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  private qrCodeParent: ElementRef;
  @ViewChild('qrCodeOnlineId', { static: false, read: ElementRef }) set content1(content1: ElementRef) {
    if (content1) { // initially setter gets called with undefined
      this.qrCodeParent = content1;
    }
  }
  // private qrCodeCustId: ElementRef;

  @ViewChild('qrCodeCustId', { static: false }) set content2(content2: ElementRef) {
    if (content2) { // initially setter gets called with undefined
      this.qrCodeParent = content2;
    }
  }
  // ngAfterViewChecked() {
  //     this.changeDetectorRef.detectChanges();
  // }
  ngOnInit() {
    this.accuid = this.data.accencUid;
    this.wpath = this.data.path;

    this.customId = this.data.customId;
    // this.window_path = this.data.pathUrl;
    console.log(this.wpath + this.accuid);
    this.shareLink = this.wpath + this.accuid;
    this.description = 'You can book my services by just clicking this link';
    this.imageUrl = this.wpath + 'assets/images/logo.png';
    this.qrCodegenerateOnlineID(this.accuid);
  }
  ngOnDestroy() {
    this.titleService.setTitle('Jaldee');
  }
  qrCodegenerateOnlineID(valuetogenerate) {
    this.qr_value = projectConstants.PATH + valuetogenerate;
    this.qr_code_oId = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.qrCodePath = this.qrCodeParent.nativeElement.getElementsByTagName('img')[0].src;
      this.angular_meta.addTags([
         { property: 'og:title', content: this.data.businessName },
        { property: 'og:image', content: this.imageUrl },
        { property: 'og:type', content: 'link' },
        { property: 'og:description', content: this.description },

      ]);
    }, 50);

    console.log('sharelink...' + this.shareLink);
    console.log('qrcode...' + this.qrCodePath);

  }
  // qrCodegenerateCustID(valuetogenerate) {
  //     this.qr_value = projectConstants.PATH + valuetogenerate;
  //     this.qr_code_cId = true;
  //     this.changeDetectorRef.detectChanges();
  //     setTimeout(() => {
  //       this.qrCodePath = this.qrCodeParent.nativeElement.getElementsByTagName('img')[0].src;
  //     }, 50);
  // }
  //   closeOnlineQR() {
  //     this.qr_code_oId = false;
  //   }
  //   closeCustomQR() {
  //     this.qr_code_cId = false;
  //   }
  //   showPasscode() {
  //     this.show_passcode = !this.show_passcode;
  //   }
  printQr(printSectionId) {
    const printContent = document.getElementById(printSectionId);
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write('<html><head><title></title>');
    WindowPrt.document.write('</head><body style="border-style: dashed;width:500px;height:600px">');
    WindowPrt.document.write('<div style="padding-left:190px;padding-top: 50px;">');
    WindowPrt.document.write('<p style="font-size: xx-large;padding-left:24px;font-weight: 700;color: #183e7a;">Jaldee</p>');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.write('</div>');
    WindowPrt.document.write('</body></html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  downloadQR() {

  }
}



