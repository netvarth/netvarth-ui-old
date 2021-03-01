import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-department-list-dialog',
  templateUrl: './department-list-dialog.component.html',
  styleUrls: ['./department-list-dialog.component.css']
})
export class DepartmentListDialogComponent implements OnInit {
  deptObj: any;
  former_chosen_departments: any = [];
  department_list: any = [];
  selectedDepartments: any = [];

  constructor(
    public dialogRef: MatDialogRef<DepartmentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {

  }

  ngOnInit(): void {
    this.former_chosen_departments = this.data.departments;
    this.getDepartments();

  }

  getDepartments() {

    this.provider_services.getDepartments()
      .subscribe(
        data => {
          this.deptObj = data;
          this.department_list = this.deptObj.departments;

        },
        error => {
         // this.wordProcessor.apiErrorAutoHide(this, error);
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
  const result = departments.map(a => a.id);
  this.dialogRef.close(result);

  }
  isSelected(dept) {

    if (this.former_chosen_departments.some(e => e === dept.id)) {
      /* former_chosen_services contains the service we're looking for */

      return true;
    } else {

      return false;
    }
  }
}
