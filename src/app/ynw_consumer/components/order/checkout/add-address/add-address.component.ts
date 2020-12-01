import { Component, OnInit, Inject } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
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

  constructor(
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
  ) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {

    this.amForm = this.fb.group({
      pnone_number: ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.minLength(10),Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
        first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        email_id:  ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],

        address:  ['', Validators.compose([ Validators.required ])],
        city:  ['', Validators.compose([ Validators.required,  Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        postal_code:  ['', Validators.compose([ Validators.required,  Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
        landmark:  ['', Validators.compose([ Validators.required ])],

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
  
  this.dialogRef.close();

}

}
