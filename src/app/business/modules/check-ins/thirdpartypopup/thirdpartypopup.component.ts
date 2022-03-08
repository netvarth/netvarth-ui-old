import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'app-thirdpartypopup',
    templateUrl: './thirdpartypopup.component.html',
    styleUrls: ['./thirdpartypopup.component.css']
})
export class ThirdpartypopupComponent implements OnInit {
    domain: any;
    showOther: any;
    customer_label: any;
    constructor(
        public dialogRef: MatDialogRef<ThirdpartypopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ){
        this.domain = data.domain;
        this.showOther=data.showOther;
        this.customer_label=data.customer_label;
    }

    ngOnInit() { }
    buttonclicked(res) {
        this.dialogRef.close(res)
    }
    closetab(){
        this.dialogRef.close('')
    }


}