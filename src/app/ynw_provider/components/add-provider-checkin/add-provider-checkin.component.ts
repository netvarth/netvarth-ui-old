import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import * as moment from 'moment';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AddProviderMemberComponent } from '../add-provider-member/add-provider-member.component';
@Component({
  selector: 'app-add-provider-checkin',
  templateUrl: './add-provider-checkin.component.html',
  styleUrls : ['./add-provider-checkin.component.css']
})

export class AddProviderCheckinComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  step = 1;

  customer_data: any = [];
  locations = [];
  selected_location = null;
  services: any = [];
  selected_service = null;
  queues: any = [];
  selected_queue = null;
  members: any = null;
  checkin_date = moment(new Date()).format('YYYY-MM-DD');
  waiting_time = null ;

  dropdownList = [
  ];
  selectedItems = [
  ];
  dropdownSettings = {
        singleSelection: false,
        text: 'Members',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: ''
      };

  constructor(
    public dialogRef: MatDialogRef<AddProviderCheckinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions
    ) {}

  ngOnInit() {
    this.changeStep(1);
    this.locations = this.data.locations || [];
    this.selected_location = this.data.selected_location || null;
    this.queues = this.data.queues || [];
    this.selected_queue = this.data.selected_queue || null;
    this.getServiceList();

    if (this.selected_queue && this.selected_queue.id) {
      this.sharedfunctionObj.repeatFunction(this);
    }

  }

  repeatFunctions() {
    this.checkWaitingTimeNow();
  }

  createForm() {

    switch (this.step) {
      case 1:     this.amForm = this.fb.group({
                    mobile: ['',  Validators.compose(
                      [Validators.required,  Validators.pattern('\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})')])],
                    name:  ['', Validators.compose([Validators.required])],
                  }); break;
    }
  }

  findCustomer (form_data) {

    const post_data = {
      'firstName-eq': form_data.name,
      'primaryMobileNo-eq': form_data.mobile
    };

    this.provider_services.getCustomer(post_data)
    .subscribe(
      data => {
        this.customer_data = data[0] || null;
        if (this.customer_data  !== null) {
          this.changeStep(2);
          this.getFamilyMembersList();
        }
      },
      error => {
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
      }
    );
  }

  changeStep(step) {
    this.step = step;
    this.createForm();
  }

  onChangeLocationSelect(event) {
    const value = event.target.value;
    this.selected_location = this.locations[value];
    this.getQueueList();
  }

  getQueueList() {
    this.selected_queue = null;
    if (this.selected_location.id) {
      this.provider_services.getProviderLocationQueues(this.selected_location.id)
      .subscribe(
        data => {
          this.queues = data;
          if (this.queues[0]) {
            this.onChangeQueueSelect(0);
          }
        },
        error => {
        }
      );
    }
  }

  onChangeQueueSelect(value) {
    this.selected_queue = this.queues[value];
  }

  getServiceList() {
    this.provider_services.getServicesList()
    .subscribe(
      data => {
        this.services = data;
        if (this.services[0]) {
          this.onChangeService(0);
        }
      },
      error => {

      }
    );
  }

  getFamilyMembersList(new_member_id = null) {
    this.provider_services.getMembers(this.customer_data.id)
    .subscribe(
      data => {
        this.members = data;
        this.setMembers(data, new_member_id);
      },
      error => {

      }
    );
  }

  setMembers(members, new_member_id = null) {
    this.dropdownList = [];
    this.dropdownList.push( {'id': -1, 'itemName': 'self' });
    let i = 0;

    if (this.selectedItems.length === 0) {
      this.selectedItems.push( {'id': -1, 'itemName': 'self' });
    }

    for (const member of members) {
      const push_data = {'id': i, 'itemName': member['userProfile']['firstName'] || '' };
      this.dropdownList.push(push_data);

      if (new_member_id && new_member_id === member.user) {
        this.selectedItems.push( push_data);
      }

      i++;
    }
  }

  onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.signupForm.get('selectedSubDomains').value);

  }

  addMember() {
    const dialogRef = this.dialog.open(AddProviderMemberComponent, {
      width: '50%',
      data: {
        parent_id: this.customer_data.id,
        type : 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => { console.log(result);
      if ( result.response === 'reloadlist') {
        this.getFamilyMembersList(result.new_member_id);
      }
    });
  }

  onChangeService(value) {
    this.selected_service = this.services[value];
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

  checkWaitingTimeNow() {


    this.provider_services.getQueueWaitingTime(this.selected_queue.id, this.checkin_date)
    .subscribe(
      data => {
        console.log('here');
      },
      error => {

      }
    );
  }

  addWaitlist() {
    const waitlistingFor = this.getWaitlistingFor();
    const post_data = {
                        'queue': {
                          'id': this.selected_queue.id || null
                        },
                        'date': this.checkin_date || null,
                        'consumer': {
                          'id': this.customer_data.id
                        },
                        'service': {
                          'id': this.selected_service.id
                        },
                        'consumerNote': 'hai',
                        'waitlistingFor': waitlistingFor,
                        'ignorePrePayment': true
                      };
    this.provider_services.addCustomerWaitlist(post_data)
    .subscribe(
      data => {
        this.sharedfunctionObj.apiSuccessAutoHide(this, Messages.ADD_PROVIDER_CUSTOMER_WAITLIST);
        this.dialogRef.close('add_wailist');
      },
      error => {
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
      }
    );
  }

  getWaitlistingFor() {
    const waitlistingFor = [];
    for (const selected of this.selectedItems) {
      if (selected.id === -1) {
        waitlistingFor.push({'id': this.customer_data.id});
      } else {
        if (this.members[selected.id]) {
          waitlistingFor.push({'id': this.members[selected.id]['user']});
        }
      }
    }
    return waitlistingFor;
  }

}
