import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
// import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../functions/shared-functions';
import { WordProcessor } from '../../services/word-processor.service';

@Component({
  selector: 'app-checkin-consumer-add-member',
  templateUrl: './checkin-add-member.component.html',
  // styleUrls: ['./home.component.scss']
})
export class CheckinAddMemberComponent implements OnInit {
  fill_fol_det_cap = Messages.FILL_FOLL_DETAILS_CAP;
  first_name_cap = Messages.F_NAME_CAP;
  last_name_cap = Messages.L_NAME_CAP;
  firstname = '';
  lastname = '';
  mobile = '';
  gender = '';
  dob = '';
  dobholder = '';
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  tday = new Date();
  customer_label = '';
  jaldeeid = '';
  @Input() calledFrom: any;
  @Output() returnDetails = new EventEmitter<any>();
  @Input() globalsettings: any;
  constructor(
    public fed_service: FormMessageDisplayService,
    public sharedservice: SharedServices, public shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor
  ) {
  }

  ngOnInit() {
    console.log(this.globalsettings);
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  valuechange() {
    const retobj = {
      'fname': this.firstname || '',
      'lname': this.lastname || '',
      'mobile': this.mobile || '',
      'gender': this.gender || '',
      'dob': this.dobholder || '',
      'jaldeeid': this.jaldeeid || ''
    };
    this.returnDetails.emit(retobj);
  }
  dateChanged(e) {
    if (e) {
      if (e._i) {
        let cday = e._i.date;
        let cmon = (e._i.month + 1);
        const cyear = e._i.year;
        if (cday < 10) {
          cday = '0' + cday;
        }
        if (cmon < 10) {
          cmon = '0' + cmon;
        }
        this.dobholder = cyear + '-' + cmon + '-' + cday;
      }
    } else {
      this.dobholder = '';
    }
    this.valuechange();
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
