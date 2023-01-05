import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';

import {MatDialog} from '@angular/material/dialog';
import { AddnewsfeeddialogComponent } from './addnewsfeed/addnewsfeeddialog.component';

@Component({
    selector: 'app-newsfeed',
    templateUrl: './newsfeed.component.html',
    styleUrls: ['./newsfeed.component.css']
  })
  export class NewsfeedComponent implements OnInit {
    newsfeedform:UntypedFormGroup;
    disableform=true;
    newsfeeddisplay=false;
    constructor(private fb: UntypedFormBuilder,public dialog: MatDialog){}
    ngOnInit(): void {
      this.newsfeedform = this.fb.group({
        newsarray: new UntypedFormArray([
          // this.initNewsfeed(),
        ]),
      })
      console.log('form length',this.newsfeedform.value.newsarray.length)
    }
    deletefromnewsfeed(i:any) {
      const control = <UntypedFormArray>this.newsfeedform.get('newsarray');
      control.removeAt(i);
    }
    openDialog() {
      const dialogRef = this.dialog.open(AddnewsfeeddialogComponent);
      
      dialogRef.afterClosed().subscribe(res => {
        console.log("dialog-box-values",res.data)
        if(res.data!="dialogboxcancelled") {
          this.addnewsform(res.data);
          this.newsfeeddisplay=true;
          console.log("form-value",this.newsfeedform.value);
        }
      })
    }
    // createnews() {
    //   this.disableform=false;
    //   this.newsfeeddisplay=false;
    //   this.addnewsform()
    // }
    initNewsfeed(data) {
      return new UntypedFormGroup({
        newsfeedImage: new UntypedFormControl(data.newsfeedImage, Validators.required),
        newsfeedTitle: new UntypedFormControl(data.newsfeedTitle, Validators.required),
        newsfeedDescription: new UntypedFormControl(data.newsfeedDescription, Validators.required),
        newsfeedLink: new UntypedFormControl(data.newsfeedLink, Validators.required),
        category: new UntypedFormControl(data.category, Validators.required),
      });
    }
    submit(){
      console.log("newsfeed",this.newsfeedform.value);
      this.newsfeeddisplay=true;
    }
    addnewsform(data:any) {
      const control = <UntypedFormArray>this.newsfeedform.get('newsarray');
      control.push(this.initNewsfeed(data))
      console.log("form checking",this.newsfeedform.value);
    }
    getnewsform(form) {
      return form.controls.newsarray.controls;
    }
    selectFile(event,i) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0]
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.newsfeedform.value['newsarray'][i].newsfeedImage =  event.target.result;
        }
        reader.readAsDataURL(file); 
      }
    }
}