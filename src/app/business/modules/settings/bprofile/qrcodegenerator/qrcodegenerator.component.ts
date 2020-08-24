import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { projectConstants } from '../../../../../app.component';
declare let cordova: any;
@Component({
    selector: 'app-qrcodegenerator',
    templateUrl: './qrcodegenerator.component.html'
})
export class QRCodeGeneratorComponent implements OnInit {
    accuid: any;
    qr_code_cId = false;
    qr_code_oId = false;
    qr_value;
    qrCodePath: string;
    wpath: any;
    constructor(private changeDetectorRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<QRCodeGeneratorComponent>,
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
        this.qrCodegenerateOnlineID(this.accuid);
    }
    qrCodegenerateOnlineID(valuetogenerate) {
        this.qr_value = projectConstants.PATH + valuetogenerate;
        this.qr_code_oId = true;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
            this.qrCodePath = this.qrCodeParent.nativeElement.getElementsByTagName('img')[0].src;
        }, 50);
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
        setTimeout(() => {
            // const params = [
            //     'height=' + screen.height,
            //     'width=' + screen.width,
            //     'fullscreen=yes'
            // ].join(',');
            // const printWindow = window.open('', '', params);
            let printsection = '<html><head><title></title>';
            printsection += '</head><body style="margin-top:200px">';
            printsection += '<div style="text-align:center!important">';
            printsection += printContent.innerHTML;
            printsection += '</div>';
            printsection += '</body></html>';
            cordova.plugins.printer.print(printsection);
            // printWindow.print();
        });
    }
    downloadQR() {
    }
}
