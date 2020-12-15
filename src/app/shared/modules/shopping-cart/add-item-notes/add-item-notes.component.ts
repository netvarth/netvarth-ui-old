import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-item-notes',
  templateUrl: './add-item-notes.component.html',
  styleUrls: ['./add-item-notes.component.css']
})
export class AddItemNotesComponent implements OnInit {

  notes: any;
  itemNotes: any;

  constructor(
    public dialogRef: MatDialogRef<AddItemNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemNotes = this.data;
  }
  ngOnInit() {
    this.notes = this.itemNotes.notes;
  }
  closeDialog() {
    this.dialogRef.close();
  }

}
