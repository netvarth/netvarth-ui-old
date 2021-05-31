import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
    selector: 'app-usercontact',
    templateUrl: './user-contact-info.component.html',
    styleUrls: ['./user-contact-info.component.css']
})

export class userContactInfoComponent implements OnInit {

users_list: any = [];

    constructor(
        public dialogRef: MatDialogRef<userContactInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

    ) {
       
        this.users_list = data.userData;
        console.log(this.users_list)
    }
    ngOnInit() {

    }
}
