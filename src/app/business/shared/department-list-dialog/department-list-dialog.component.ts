import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Component({
  selector: 'app-department-list-dialog',
  templateUrl: './department-list-dialog.component.html',
  styleUrls: ['./department-list-dialog.component.css']
})
export class DepartmentListDialogComponent implements OnInit ,OnDestroy{
  deptObj: any;
  former_chosen_departments: any = [];
  department_list: any = [];
  selectedDepartments: any = [];
  loading = true;
  subscription: Subscription;
  mode: any;
  constructor(
    public dialogRef: MatDialogRef<DepartmentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wordProcessor: WordProcessor,
    public dialog: MatDialog,
 
    private provider_services: ProviderServices) {
      this.mode=this.data.mode;
  }

  ngOnInit(): void {
    this.former_chosen_departments = this.data.departments;
    this.getDepartments();

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getDepartments() {

    this.subscription=this.provider_services.getDepartments()
      .subscribe(
        data => {
          this.deptObj = data;
          this.department_list = this.deptObj.departments;
          this.loading = false;

        },
        error => {
           this.wordProcessor.apiErrorAutoHide(this, error);
           this.loading = false;
        }
      );
  }
  close() {
    this.dialogRef.close();
  }
  onDepartmentChange(event) {
    console.log(event);
  }

  onConfirm(deptObject) {
    const departments = deptObject.selected.map(dept => dept.value);
    const result = departments.map(a => a.departmentId);
    this.dialogRef.close(result);

  }
  isSelected(dept) {

    if (this.former_chosen_departments.some(e => e === dept.departmentId)) {
      /* former_chosen_services contains the service we're looking for */

      return true;
    } else {

      return false;
    }
  }
}
