import { Component, OnInit, Inject } from '@angular/core';
import { SharedFunctions } from '../../../../functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { FormMessageDisplayService } from '../../../../modules/form-message-display/form-message-display.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../constants/project-constants';
import { SharedServices } from '../../../../services/shared-services';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {
  disableSave: boolean;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  address_add: any = [];
  formMode: any;
  exist_add: any = [];
  edit_address: any;
  address_title;
  index: any;
  source: any;

  constructor(
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private shared_services: SharedServices,
    private snackbarService: SnackbarService
  ) {
    this.address_title = 'Add New Address';
    this.formMode = data.type;
    this.source = data.source;
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

  ngOnInit() {
    this.createForm();
  }
  createForm() {

    this.amForm = this.fb.group({
      phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],

      address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      postalCode: ['', Validators.compose([Validators.required,Validators.maxLength(6), Validators.minLength(6), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
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
  close() {
    this.dialogRef.close();
  }
  onSubmit(form_data) {
    console.log(this.source);
    if (this.source === 'provider') {
      console.log(form_data);
      this.dialogRef.close(form_data);
    }
    this.disableSave = true;
    if (this.formMode === 'edit') {
      this.exist_add.splice(this.index, 1);
    }
    this.exist_add.push(form_data);
    console.log(this.exist_add);
    this.shared_services.updateConsumeraddress(this.exist_add)
      .subscribe(
        data => {
          console.log(data);
          this.disableSave = false;
          if (this.formMode === 'edit') {
            this.snackbarService.openSnackBar('Address Updated successfully');
          } else {
            this.snackbarService.openSnackBar('Address Added successfully');
          }
          this.dialogRef.close();
        },
        error => {
          this.disableSave = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
}
