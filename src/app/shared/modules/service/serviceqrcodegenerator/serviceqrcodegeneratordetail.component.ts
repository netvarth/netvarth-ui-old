import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-serviceqrcodegenerator',
  templateUrl: './serviceqrcodegeneratordetail.component.html',
  // styleUrls: ['./serviceqrcodegeneratordetail.component.css']
})
export class ServiceQRCodeGeneratordetailComponent implements OnInit, OnDestroy {
  elementType = 'url';
  accuid: any;
  qr_code_cId = false;
  qr_code_oId = false;
  qr_value;
  qrCodePath: string;
  wpath: any;
  description: string;
  shareLink: any;
  window_path: any;
  customId: any;
  serviceId;
  userId;
  catalogId: any;
  itemId: any;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ServiceQRCodeGeneratordetailComponent>,
    private angular_meta: Meta,
    private titleService: Title,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  private qrCodeParent: ElementRef;
  @ViewChild('qrCodeOnlineId', { read: ElementRef }) set content1(content1: ElementRef) {
    if (content1) { // initially setter gets called with undefined
      this.qrCodeParent = content1;
    }
  }
  ngOnInit() {
    this.accuid = this.data.accencUid;
    this.wpath = this.data.path;
    this.serviceId = this.data.serviceid;
    this.customId = this.data.customId;
    this.userId = this.data.userid;
    this.catalogId = this.data.catalogId;
    this.itemId = this.data.itemId;

     
     if(this.data.serviceid){
      this.shareLink = this.wpath + this.accuid + '/service/' + this.serviceId + '/';
      }
      
    if (this.data.userId) {
    
      this.shareLink = this.wpath + this.accuid + '/' + this.userId + '/service/' + this.serviceId + '/';
    }

    //else {
    if(this.data.itemId && this.data.catalogId){
      this.shareLink = this.wpath +  this.accuid  + '/catalog/' + this.catalogId + '/item/' + this.itemId;
     }

     if(this.data.catalogId && this.data.requestType == 'shareCatalog'){
      this.shareLink = this.wpath +  this.accuid  + '/catalog/' + this.catalogId;

     }
    this.description = 'You can book my services by just clicking this link';
    this.qrCodegenerateOnlineID(this.shareLink);
  }
  ngOnDestroy() {
    this.titleService.setTitle('Jaldee');
  }
  qrCodegenerateOnlineID(valuetogenerate) {
    this.qr_value = valuetogenerate;
    this.qr_code_oId = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.qrCodePath = this.qrCodeParent.nativeElement.getElementsByTagName('img')[0].src;
      this.angular_meta.addTags([
        { property: 'og:title', content: this.data.businessName ? this.data.businessName : '' },
        // { property: 'og:image', content: this.imageUrl },
        { property: 'og:type', content: 'link' },
        { property: 'og:description', content: this.description },

      ]);
    }, 50);
  }
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
