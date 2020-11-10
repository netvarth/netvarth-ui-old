import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-help-pop-up',
  templateUrl: './help-pop-up.component.html',
  styleUrls: ['./help-pop-up.component.css']
})
export class HelpPopUpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HelpPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
