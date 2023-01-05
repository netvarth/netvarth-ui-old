import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'app-addnewsfeeddialog',
    templateUrl: './addnewsfeeddialog.component.html',
    styleUrls: ['./addnewsfeeddialog.component.css']
  })
  export class AddnewsfeeddialogComponent implements OnInit {
    newsfeedform:UntypedFormGroup;
    
    constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<'addnews'>, @Inject(MAT_DIALOG_DATA) public data: any){

    }
    ngOnInit(): void {
        this.newsfeedform = this.fb.group({
        newsfeedImage: new UntypedFormControl('../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.jpg', Validators.required),
        newsfeedTitle: new UntypedFormControl('Newsfeed title', Validators.required),
        newsfeedDescription: new UntypedFormControl('Lorem ipsum dolor sit amet consectetur adipisicing elit.e optio atque', Validators.required),
        newsfeedLink: new UntypedFormControl('www.google.com', Validators.required),
        category: new UntypedFormControl('Category', Validators.required),
        })
    }
    NewsfeedTitlerrormessage() {
      if(this.newsfeedform.get('newsfeedTitle').hasError('required')) {
        return 'newsfeedTitle is required'

      }
    }
    Newsfeedlinkerrormessage() {
      if(this.newsfeedform.get('newsfeedLink').hasError('required')) {
        return 'newsfeedLink is required'

      }
    }
    NewsfeedDescriptionerrormessage() {
      if(this.newsfeedform.get('newsfeedDescription').hasError('required')) {
        return 'newsfeedDescription is required'

      }
    }   
    Newsfeedcategoryerrormessage() {
      if(this.newsfeedform.get('category').hasError('required')) {
        return 'category is required'

      }
    }
    cancel(){
        this.dialogRef.close({ data: "dialogboxcancelled" })
        
    }
    submit() {
        // closing itself and sending data to parent component
        this.dialogRef.close({ data: this.newsfeedform.value })
      }
    selectFile(event) {
        if (event.target.files.length > 0) {
          const file = event.target.files[0]
          var reader = new FileReader();
          reader.onload = (event: any) => {
              this.newsfeedform.value.newsfeedImage =  event.target.result;
          }
          reader.readAsDataURL(file); 
        }
      }
}
