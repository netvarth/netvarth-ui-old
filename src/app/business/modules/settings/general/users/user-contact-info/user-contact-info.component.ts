import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
    selector: 'app-usercontact',
    templateUrl: './user-contact-info.component.html',
    styleUrls: ['./user-contact-info.component.css']
})

export class userContactInfoComponent implements OnInit {

users_list: any = [];
screenWidth;
no_of_grids = 3;
    constructor(
        public dialogRef: MatDialogRef<userContactInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

    ) {
       
        this.users_list = data.userData;
        console.log(this.users_list)
    }
    ngOnInit() {

    }
    @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 375) {
      this.no_of_grids = 2;
    }
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
    getUserImg(user) {
        if (user.profilePicture) {
            const proImage = user.profilePicture;
            return proImage.url;
        } else {
            return '../../../.././assets/images/avatar5.png';
        }
    }
}
