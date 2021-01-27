import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-customer-group',
  templateUrl: './customer-group.component.html',
  styleUrls: ['./customer-group.component.css']
})
export class CustomerGroupComponent implements OnInit {
  name;
  description;
  groupDetails;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerGroupComponent>,
    public providerServices: ProviderServices,
    private snackbarService: SnackbarService) {
    console.log(this.data);
    this.groupDetails = this.data.details;
    this.name = this.groupDetails.groupName;
    this.description = this.groupDetails.description;
  }

  ngOnInit() {
  }
  customerGroup() {
    const postData = {
      'groupName': this.name,
      'description': this.description
    };
    if (this.data.type === 'add') {
      this.createGroup(postData);
    } else {
      postData['id'] = this.groupDetails.id;
      this.updateGroup(postData);
    }
  }
  createGroup(data) {
    this.providerServices.createCustomerGroup(data).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  updateGroup(data) {
    this.providerServices.updateCustomerGroup(data).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
}
