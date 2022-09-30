import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../../../business/services/provider-services.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-manage-template',
  templateUrl: './manage-template.component.html',
  styleUrls: ['./manage-template.component.css']
})
export class ManageTemplateComponent implements OnInit {
  showTemplate: any;
  templateId: any;
  headerTitle: any;
  drugList: any;
  templateName: any;
  constructor(
    public dialogRef: MatDialogRef<ManageTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private providerservices: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.type && this.data.type == 'view') {
      this.showTemplate = true;
      this.headerTitle = 'Viewing Template';
    }
    if (this.data && this.data.type && this.data.id) {
      this.templateId = this.data.id;
      this.providerservices.getTemplateById(this.templateId)
        .subscribe((data: any) => {
          this.drugList = data.prescriptionDto;
          this.templateName = data.templateName;
        },
          error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  close() {
    this.dialogRef.close()
  }
}
