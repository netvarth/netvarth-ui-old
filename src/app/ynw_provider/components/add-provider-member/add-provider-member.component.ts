import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Component({
  selector: 'app-provider-add-member',
  templateUrl: './add-provider-member.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderMemberComponent implements OnInit {

  f_name_cap = Messages.F_NAME_CAP;
  l_name_cap = Messages.L_NAME_CAP;
  mob_no_cap = Messages.MOBILE_NO_CAP;
  submit_btn_cap = Messages.SUBMIT_CAP;

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;

  constructor(
    public dialogRef: MatDialogRef<AddProviderMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    public sharedfunctionObj: SharedFunctions
  ) {
  }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required])]
    });

    if (this.data.type === 'edit') {
      // this.updateForm();
    }
  }

  onSubmit(form_data) {
    this.resetApiErrors();

    const post_data = {
      'userProfile': {
        'firstName': form_data.first_name,
        'lastName': form_data.last_name,
        'primaryMobileNo': form_data.mobile,
        'countryCode': '+91',
      }
    };

    if (this.data.parent_id) {
      post_data['parent'] = this.data.parent_id;
    }

    if (this.data.type === 'edit') {
      // this.editMember(post_data);
    } else if (this.data.type === 'add') {
      this.addMember(post_data);
    }
  }

  addMember(post_data) {

    this.provider_services.addMembers(post_data)
      .subscribe(
        data => {
          this.api_success = this.wordProcessor.getProjectMesssages('MEMBER_CREATED');
          setTimeout(() => {
            const response = {
              response: 'reloadlist',
              new_member_id: data
            };
            this.dialogRef.close(response);
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
        }
      );
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
