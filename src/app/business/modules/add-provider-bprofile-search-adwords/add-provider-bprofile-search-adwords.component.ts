import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-addprovider-bprofile-search-adwords',
  templateUrl: './add-provider-bprofile-search-adwords.component.html',
  styleUrls: ['./add-provider-bprofile-search-adwords.component.css']
})

export class AddProviderBprofileSearchAdwordsComponent implements OnInit {
  adword_cap = Messages.ADWORD_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  adword_errmsg = Messages.ADWORD_ERRMSG;
  disableButton = false;
  api_loading = true;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  constructor(
    public dialogRef: MatDialogRef<AddProviderBprofileSearchAdwordsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor
  ) { }
  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      adwordname: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])]
    });
    this.api_loading = false;
  }

  onSubmit(form_data) {
    if (!form_data.adwordname.replace(/\s/g, '').length) {
      const error = 'Please enter a keyword';
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    } else {
      this.resetApiErrors();
      this.addAdword(form_data.adwordname.trim());
    }
  }

  addAdword(post_data) {
    this.disableButton = true;
    const adword = post_data.split(' ').join(projectConstants.ADWORDSPLIT);
    post_data = {
      'name': adword
    };
    this.provider_services.addAdwords(post_data)
      .subscribe(
        () => {
          this.api_success = this.wordProcessor.getProjectMesssages('ADWORD_CREATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
          this.disableButton = false;
        }
      );
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
