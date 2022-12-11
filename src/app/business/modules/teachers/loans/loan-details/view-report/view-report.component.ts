import { Component, Inject, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
  timetype: number = 1;
  from: any;
  type: any;
  user: any;
  reportData: any;
  constructor(
    public dialogRef: MatDialogRef<ViewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupStorageService
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.data && this.data.type) {
      this.type = this.data.type
    }
    if (this.data && this.data.data) {
      this.reportData = this.data.data
    }
  }

  goHome() {

  }

  goBack() {
    this.dialogRef.close()
  }

}
