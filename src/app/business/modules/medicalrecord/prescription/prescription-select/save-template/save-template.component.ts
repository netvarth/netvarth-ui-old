import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
@Component({
  selector: 'app-save-template',
  templateUrl: './save-template.component.html',
  styleUrls: ['./save-template.component.css']
})
export class SaveTemplateComponent implements OnInit {
  templateName: any = false;
  name: any = '';
  constructor(
    public dialogRef: MatDialogRef<SaveTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {

  }

  close() {
    let data = {
      type: 'close'
    }
    this.dialogRef.close(data);
  }

  dontSave() {
    this.dialogRef.close();
  }

  saveTemplate() {
    if (this.name != '') {
      let data = {
        type: 'saveastemplate',
        templateName: this.name
      }
      this.dialogRef.close(data);
    }
    else {
      this.snackbarService.openSnackBar("Please fill the template name", { 'panelClass': 'snackbarerror' });
    }
  }

  save() {
    this.templateName = true;
  }
  cancel() {
    this.templateName = false;
  }

  templateNameSave(event) {
    this.name = event.target.value;
    console.log(this.name)
  }
}
