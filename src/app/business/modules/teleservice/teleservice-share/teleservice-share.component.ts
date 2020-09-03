
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-teleservice-share',
  templateUrl: './teleservice-share.component.html',
  styleUrls: ['./teleservice-share.component.css']
})

export class TeleServiceShareComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TeleServiceShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }
}
