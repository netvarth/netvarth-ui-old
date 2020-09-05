import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-visualize',
    templateUrl: './visualize.component.html'
})
export class VisualizeComponent {
    htmlContent: any;
    constructor(
        public dialogRef: MatDialogRef<VisualizeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.htmlContent = data.displayContent;
    }
}
