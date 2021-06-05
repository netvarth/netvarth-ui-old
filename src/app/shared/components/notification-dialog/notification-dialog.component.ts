import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-notification-dialog',
    templateUrl: './notification-dialog.component.html'
})
export class NotificationDialogComponent {
    ok_btn_cap;
    // cancel_btn_cap = 'NO';

    constructor(public dialogRef: MatDialogRef<NotificationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (this.data.type) {
            this.ok_btn_cap = '';
        }
    }

    onClick(data) {
        this.dialogRef.close(data);
    }
}