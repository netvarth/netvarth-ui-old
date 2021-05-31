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
    getLanguages(languages) {
        languages = JSON.parse(languages);
        for (let i = 0; i < languages.length; i++) {
            languages[i] = languages[i].charAt(0).toUpperCase() + languages[i].slice(1).toLowerCase();
        }
        languages = languages.toString();
        if (languages.length > 1) {
            languages = languages.replace(/,/g, ", ");
        }
        return languages;
    }
}
