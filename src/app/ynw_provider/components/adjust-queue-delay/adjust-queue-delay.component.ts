import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
@Component({
  selector: 'app-adjust-queue-delay',
  templateUrl: './adjust-queue-delay.component.html'
})
export class AdjustQueueDelayComponent implements OnInit {
  adjust_delay_cap = Messages.ADJUST_DELAY_CAP;
  service_window_cap = Messages.SERV_TIME_WINDOW_CAP;
  send_message_cap = '';
  messgae_cap = Messages.MESSAGE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  delay_cap = Messages.DELAY_CAP;
  amForm: FormGroup;
  queues: any = [];
  api_success = null;
  api_error = null;
  time = { hour: 0, minute: 0 };
  default_message = '';
  selected_queue = 0;
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  queue_name = '';
  queue_schedule = '';
  placeholder = Messages.ADJUSTDELAY_PLACEHOLDER;
  arrived_cnt = 0;
  checkedin_cnt = 0;
  tot_checkin_count = 0;
  customer_label = '';
  frm_adjust_del_cap = '';
  disableButton = false;
  constructor(
    public dialogRef: MatDialogRef<AdjustQueueDelayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions
  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }
  ngOnInit() {
    this.send_message_cap = Messages.DELAY_SEND_MSG.replace('[customer]', this.customer_label);
    this.arrived_cnt = this.data.arrived_count;
    this.checkedin_cnt = this.data.checkedin_count;
    this.tot_checkin_count = this.checkedin_cnt + this.arrived_cnt;
    this.queues = this.data.queues;
    this.queue_name = this.data.queue_name;
    this.queue_schedule = this.data.queue_schedule;
    if (!this.data.queues || !this.data.queue_id) {
      this.closePopup('error');
    }
    this.getDefaultMessages();
    this.amForm = this.fb.group({
      // queue_id: ['', Validators.compose([Validators.required])],
      delay: ['', Validators.compose([Validators.required])],
      send_message: [false],
      // message: ['', Validators.compose([Validators.required])],
      message: [''],
    });
    /*this.amForm.get('queue_id').valueChanges
    .subscribe(
      data => {
        this.getQueueDelay(data);
      }
    );*/
    this.getQueueDelay(this.data.queue_id);
    this.amForm.get('send_message').valueChanges
      .subscribe(
        data => {
          this.changeCheckbox(data);
        }
      );
    // this.amForm.get('queue_id').setValue(this.data.queue_id);
    this.selected_queue = this.data.queue_id;
    this.frm_adjust_del_cap = Messages.FRM_LEVEL_ADJ_DELAY_MSG.replace('[customer]', this.customer_label);
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amForm.get('message').value.length;
  }
  lostDescFocus() {
    this.isfocused = false;
  }
  setCharCount() {
    this.char_count = this.max_char_count - this.amForm.get('message').value.length;
  }
  getDefaultMessages() {
    this.provider_services.getProviderMessages()
      .subscribe(
        () => {
          // this.default_message = data.delay || '';
        },
        () => {
        }
      );
  }
  onSubmit(form_data) {
    this.disableButton = true;
    const time = this.getTimeinMin();
    // if (time !== 0) {
    const post_data = {
      'delayDuration': time,
      'sendMsg': form_data.send_message,
      'message': form_data.message || '',
    };
    // this.provider_services.addQueueDelay(form_data.queue_id, post_data)
    this.provider_services.addQueueDelay(this.selected_queue, post_data)
      .subscribe(
        () => {
          if (this.arrived_cnt !== 0 || this.checkedin_cnt !== 0) {
            this.api_success = this.sharedfunctionObj.getProjectMesssages('ADD_DELAY');
          this.closePopup('reloadlist');
          } else {
            this.api_success = this.sharedfunctionObj.getProjectMesssages('ADD_DELAY_NO_MSG');
            this.closePopup('reloadlist');
          }
        },
        error => {
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
        }
      );
    // } else {
    //   this.sharedfunctionObj.apiErrorAutoHide(this, this.sharedfunctionObj.getProjectMesssages('ADD_DELAY_TIME_ERROR'));
    // }
  }
  getQueueDelay(queue_id) {
    this.provider_services.getQueueDelay(queue_id)
      .subscribe(
        data => {
          this.convertTime(data['delayDuration'] || 0);
          this.amForm.get('send_message').setValue(data['sendMsg']);
        },
        () => {
        }
      );
  }
  getTimeinMin() {
    const time_min = (this.time.hour * 60) + this.time.minute;
    return (typeof (time_min) === 'number') ? time_min : 0;
  }
  convertTime(time) {
    this.time.hour = Math.floor(time / 60);
    this.time.minute = time % 60;
    this.amForm.get('delay').setValue(this.time);
  }
  closePopup(message) {
    setTimeout(() => {
      this.dialogRef.close(message);
    }, projectConstants.TIMEOUT_DELAY);
  }
  changeCheckbox(data) {
    if (data) {
      this.amForm.addControl('message',
        new FormControl(this.default_message));
    } else {
      this.amForm.removeControl('message');
    }
  }
  handle_queue_sel(queueid) {
    this.selected_queue = queueid;
    this.getQueueDelay(this.selected_queue);
  }
  isInRange(evt) {
    return this.sharedfunctionObj.isInRange(evt);
  }
  // isNumeric(evt) {
  //   return this.sharedfunctionObj.isNumeric(evt);
  // }
}
