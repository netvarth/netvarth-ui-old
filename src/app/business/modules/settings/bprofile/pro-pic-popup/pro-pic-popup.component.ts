import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
    selector: 'app-pro-pic-pop',
    templateUrl: './pro-pic-popup.component.html'
})
export class ProPicPopupComponent implements OnInit {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    constructor(public activateroute: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ProPicPopupComponent>) {
        }
    ngOnInit() {
    }

    imageSelect(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }
}
