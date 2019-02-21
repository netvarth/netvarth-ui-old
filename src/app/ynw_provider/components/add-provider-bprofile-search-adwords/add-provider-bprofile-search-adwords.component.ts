import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import {projectConstants} from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages} from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-addprovider-bprofile-search-adwords',
  templateUrl: './add-provider-bprofile-search-adwords.component.html',
  styleUrls: ['./add-provider-bprofile-search-adwords.component.css']
})

export class AddProviderBprofileSearchAdwordsComponent implements OnInit {

  add_adword_cap = Messages.ADD_ADWORD_CAP;
  adword_cap = Messages.ADWORD_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap =Messages.SAVE_BTN;
  adword_errmsg = Messages.ADWORD_ERRMSG;

  amForm: FormGroup;
  api_error = null;
  api_success = null;

  constructor(
    public dialogRef: MatDialogRef<AddProviderBprofileSearchAdwordsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
    ) {}

  ngOnInit() {
     this.createForm();
  }

  createForm() {
    this.amForm = this.fb.group({
    adwordname: ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit (form_data) {
    this.resetApiErrors();
    this.addAdword(form_data.adwordname);
  }

  addAdword(post_data) {
    this.provider_services.addAdwords(post_data)
        .subscribe(
          data => {
           this.api_success = this.shared_functions.getProjectMesssages('ADWORD_CREATED');
           setTimeout(() => {
            this.dialogRef.close('reloadlist');
           }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.shared_functions.apiErrorAutoHide(this, error);
          }
        );
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
