import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../../business/services/provider-services.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-prescription-select',
  templateUrl: './prescription-select.component.html',
  styleUrls: ['./prescription-select.component.css']
})
export class PrescriptionSelectComponent implements OnInit {
  templates: any;
  constructor(
    public dialogRef: MatDialogRef<PrescriptionSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private providerservices: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
  ) { }

  ngOnInit(): void {

    this.providerservices.getTemplate()
      .subscribe((data: any) => {
        this.templates = data;
        console.log("Template Data", data);
      },
        error => {
          this.snackbarService.openSnackBar("Template Data Error", { 'panelClass': 'snackbarerror' });
        });

  }

  close() {
    this.dialogRef.close();
  }

  createNew() {
    let data =
    {
      type: "createnew"
    }
    this.dialogRef.close(data);
  }


  templateSelected(id) {
    let data =
    {
      type: "templateselected",
      id: id
    }
    this.dialogRef.close(data);
  }

  deleteTemplate(id) {
    this.providerservices.deleteTemplateById(id)
      .subscribe((data: any) => {
        this.snackbarService.openSnackBar('Template Deleted Succesfully');
        this.dialogRef.close();
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
}
