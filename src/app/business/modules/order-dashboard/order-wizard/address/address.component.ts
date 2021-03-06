import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  customer: any;
  disableSave: boolean;
  amForm: FormGroup;
  formMode: any;
  exist_add: any = [];
  edit_address: any;
  address_title;
  index: any;
  source: any;
  api_error = null;
  api_success = null;
  constructor(
    public dialogRef: MatDialogRef<AddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private snackbarService: SnackbarService
  ) {
    this.address_title = 'Add New Address';
    this.formMode = data.type;
    this.customer = data.customer;
    if (this.formMode === 'edit') {
      this.edit_address = data.update_address;
      this.address_title = 'Edit Address';
    }
    if (data.address !== null) {
      this.exist_add = data.address;
    }

    this.edit_address = data.update_address;
    this.index = data.edit_index;

  }

  ngOnInit(): void {
    this.createForm();
  }
  close(){
    this.dialogRef.close();
  }
  createForm() {

    this.amForm = this.fb.group({
      phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],

      address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      postalCode: ['', Validators.compose([Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      landMark: ['', Validators.compose([Validators.required])],
      countryCode: ['+91'],
    });
    if (this.formMode === 'edit') {
      this.updateForm();
    }
  }
  updateForm() {
    this.amForm.setValue({
      'phoneNumber': this.edit_address.phoneNumber || null,
      'firstName': this.edit_address.firstName || null,
      'lastName': this.edit_address.lastName || null,
      'email': this.edit_address.email || null,
      'address': this.edit_address.address || null,
      'city': this.edit_address.city || null,
      'postalCode': this.edit_address.postalCode || null,
      'landMark': this.edit_address.landMark || null,
      'countryCode': '+91',
    });
  }
  onSubmit(form_data) {

    console.log(JSON.stringify(form_data));
    this.disableSave = true;
    // if (this.formMode === 'edit') {
    //   this.exist_add.splice(this.index, 1);
    // }
    this.exist_add.push(form_data);

    this.provider_services.updateDeliveryaddress(this.customer.id, this.exist_add)
      .subscribe(
        data => {
          this.disableSave = false;
          // if (this.formMode === 'edit') {
          //   this.snackbarService.openSnackBar('Address Updated successfully');
          // } else {
          //   this.snackbarService.openSnackBar('Address Added successfully');
          // }

          this.dialogRef.close();
        },
        error => {
          this.disableSave = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
}
