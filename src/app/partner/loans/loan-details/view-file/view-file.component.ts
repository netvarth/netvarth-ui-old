import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.css']
})
export class ViewFileComponent implements OnInit {
  type: any;
  constructor(
    public dialogRef: MatDialogRef<ViewFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    console.log("Type", this.type)
  }

  close() {
    this.dialogRef.close();
  }

}
