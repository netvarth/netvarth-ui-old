import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../../business/services/provider-services.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { ManageTemplateComponent } from './manage-template/manage-template.component';

@Component({
  selector: 'app-prescription-select',
  templateUrl: './prescription-select.component.html',
  styleUrls: ['./prescription-select.component.css']
})
export class PrescriptionSelectComponent implements OnInit {
  templates: any;
  removeprescriptiondialogRef: any;
  viewprescriptiondialogRef: any;
  constructor(
    public dialogRef: MatDialogRef<PrescriptionSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private providerservices: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private dialog: MatDialog
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
    this.removeprescriptiondialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to delete this template ?',
        'type': 'deleteTemplate'
      }
    });
    this.removeprescriptiondialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.providerservices.deleteTemplateById(id)
          .subscribe((data: any) => {
            this.snackbarService.openSnackBar('Template Deleted Succesfully');
            this.dialogRef.close();
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }

    })

  }


  viewTemplate(id) {
    this.viewprescriptiondialogRef = this.dialog.open(ManageTemplateComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'type': 'view',
        'id': id
      }
    });
    this.viewprescriptiondialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.providerservices.deleteTemplateById(id)
          .subscribe((data: any) => {
            this.snackbarService.openSnackBar('Template Deleted Succesfully');
            this.dialogRef.close();
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }

    })

  }


}




