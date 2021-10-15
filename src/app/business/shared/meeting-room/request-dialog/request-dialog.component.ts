import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-request-dialog',
    templateUrl: './request-dialog.component.html',
    styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent {
    mode: string;
    constructor(
        public dialogRef: MatDialogRef<RequestDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        console.log(data);
        this.mode = data.mode;
    }
    dismissModal() {
        this.dialogRef.close('');
    }
}
