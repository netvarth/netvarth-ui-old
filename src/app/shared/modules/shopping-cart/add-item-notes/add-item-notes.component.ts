import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-item-notes',
  templateUrl: './add-item-notes.component.html',
  styleUrls: ['./add-item-notes.component.css']
})
export class AddItemNotesComponent implements OnInit {

  item: any;
  notes: any;
  btnTitle = 'Add';


  constructor(
    public dialogRef: MatDialogRef<AddItemNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.item = this.data;
  }
  ngOnInit() {

    if (this.item.consumerNote) {
      this.btnTitle = 'Edit';

      this.notes = this.item.consumerNote;
    }
  }
  closeDialog(notes) {
    this.dialogRef.close(notes);
  }

}
