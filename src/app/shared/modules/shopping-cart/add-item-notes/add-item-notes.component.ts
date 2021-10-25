import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-add-item-notes',
  templateUrl: './add-item-notes.component.html',
  styleUrls: ['./add-item-notes.component.css']
})
export class AddItemNotesComponent implements OnInit {

  item: any;
  notes: any;
  btnTitle = 'Add';
  btndisabled=true;

  constructor(
    public dialogRef: MatDialogRef<AddItemNotesComponent>,
    private snackbarService:SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.item = this.data;
  }
  ngOnInit() {

    if (this.item.consumerNote) {
      this.btnTitle = 'Update';

      this.notes = this.item.consumerNote;
    }
  }
  closeDialog(notes) {
    if(this.notes!==undefined&& this.notes.trim()!==''){
    this.dialogRef.close(notes);
    }else{
      console.log('inside');
      this.snackbarService.openSnackBar('Please enter notes', { 'panelClass': 'snackbarerror' });
    }
  }
  cancelDialog() {
    this.dialogRef.close();
  
 }

}
