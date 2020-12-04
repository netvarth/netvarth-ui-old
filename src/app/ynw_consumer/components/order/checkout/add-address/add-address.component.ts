import { Component, OnInit, Inject } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ConsumerServices } from '../../../../../ynw_consumer/services/consumer-services.service';
// import { projectConstantsLocal } from 'src/app/shared/constants/project-constants';


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  address_add: any =  [];
  formMode: any;
  exist_add: any;

  constructor(
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private consumer_services: ConsumerServices,
  ) {
    this.formMode = data.type;
    this.exist_add = data.address;
    console.log(this.address_add);
    this.address_add = this.exist_add;
    console.log(this.address_add);
   }

  ngOnInit() {
    this.createForm();
  }
  createForm() {

    this.amForm = this.fb.group({
      phoneNumber: ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.minLength(10),Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      email:  ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],

      address:  ['', Validators.compose([ Validators.required ])],
      city:  ['', Validators.compose([ Validators.required,  Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      postalCode:  ['', Validators.compose([ Validators.required,  Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      landMark:  ['', Validators.compose([ Validators.required ])]


    });


   

  // if (this.formMode === 'edit') {
  //   this.updateForm();
  // }
}
close() {
    this.dialogRef.close();
}
onSubmit(form_data) {
  console.log(form_data);
  this.address_add.push(form_data);
  console.log(this.address_add);
  this.consumer_services.updateConsumeraddress(this.address_add)
      .subscribe(
        data => {
          const history: any = data;
        console.log(history);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

}

}
