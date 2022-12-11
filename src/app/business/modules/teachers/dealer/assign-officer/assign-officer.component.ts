import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdlService } from '../../cdl.service';

@Component({
  selector: 'app-assign-officer',
  templateUrl: './assign-officer.component.html',
  styleUrls: ['./assign-officer.component.css']
})
export class AssignOfficerComponent implements OnInit {
  type: any;
  OfficersList: any;
  role: any;
  btnDisabled: any = true;
  selectedOfficerIds: any;
  dealerId: any;
  dealerData: any;
  constructor(
    public dialogRef: MatDialogRef<AssignOfficerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdlservice: CdlService
  ) {

  }

  ngOnInit(): void {
    if (this.data.type) {
      this.type = this.data.type
    }
    if (this.data.id) {
      this.dealerId = this.data.id
      this.cdlservice.getDealerById(this.dealerId).subscribe((data: any) => {
        this.dealerData = data;
        if (this.type == 'sales') {
          this.selectedOfficerIds = [this.dealerData.salesOfficers.map((data) => {
            return data.id
          })][0]
        }
        else if (this.type == 'credit') {
          this.selectedOfficerIds = [this.dealerData.creditOfficers.map((data) => {
            return data.id
          })][0]
        }
        console.log("this.dealerData", this.dealerData, this.selectedOfficerIds)
      });
    }
    this.getStaffList(this.type);
  }

  getStaffList(type) {
    this.role;
    if (this.type == 'sales') {
      this.role = 'Sales Officer'
    }
    else if (this.type == 'credit') {
      this.role = 'Branch Credit Head'
    }
    const api_filter = {};
    api_filter['userRoles-eq'] = "roleName::" + this.role;
    this.cdlservice.getStaffList(api_filter).subscribe((data: any) => {
      if (this.role == 'Sales Officer') {
        this.OfficersList = data;
        console.log("this.salesOfficersList", this.OfficersList)
      }
      else if (this.role == 'Branch Credit Head') {
        this.OfficersList = data;
        console.log("this.creditOfficersList", this.OfficersList)
      }
    })
    return null;
  }

  close() {
    this.dialogRef.close();
  }

  handleOfficerIds() {
    console.log(this.selectedOfficerIds)
    if (this.selectedOfficerIds && this.selectedOfficerIds.length > 0) {
      this.btnDisabled = false;
    }
    else {
      this.btnDisabled = true;
    }
  }

  assign() {
    const data = {}
    if (this.selectedOfficerIds && this.selectedOfficerIds.length > 0) {
      data['officerIds'] = this.selectedOfficerIds.map((data) => {
        return { id: data }
      })
    }
    data['type'] = this.type;
    if (data['officerIds'] && data['type']) {
      console.log(data['officerIds']);
      this.dialogRef.close(data);
    }
  }

}
