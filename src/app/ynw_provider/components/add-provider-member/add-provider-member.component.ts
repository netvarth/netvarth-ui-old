import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-add-member',
  templateUrl: './add-provider-member.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderMemberComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id ;

  constructor(
    public dialogRef: MatDialogRef<AddProviderMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices
    ) {
        console.log(data);
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

  onSubmit (form_data) {

        const post_data = {
        'userProfile': {
                          'firstName': form_data.first_name,
                          'lastName':  form_data.last_name,
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
           this.api_success = Messages.MEMBER_CREATED;
           setTimeout(() => {
             const response = { response: 'reloadlist',
                                new_member_id: data };
            this.dialogRef.close(response);
           }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          }
        );
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
