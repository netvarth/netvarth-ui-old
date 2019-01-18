import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
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
  send_message_cap = Messages.SEND_MSG_CAP;
  messgae_cap = Messages.MESSAGE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  delay_cap = Messages.DELAY_CAP;
  amForm: FormGroup;
  queues: any = [];
  api_success = null;
  api_error = null;
  time = {hour: 0, minute: 0};
  default_message = '';
  selected_queue = 0;
  placeholder = Messages.ADJUSTDELAY_PLACEHOLDER;
  arrived_cnt = 0;
  checkedin_cnt = 0;
  tot_checkin_count = 0;

  constructor(
    public dialogRef: MatDialogRef<AdjustQueueDelayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private provider_datastorageobj: ProviderDataStorageService,
    private sharedfunctionObj: SharedFunctions
    ) {
     }

     ngOnInit() {
      this.arrived_cnt = this.data.arrived_count;
      this.checkedin_cnt = this.data.checkedin_count;
      this.tot_checkin_count = this.checkedin_cnt+this.arrived_cnt;
      this.queues = this.data.queues;

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


     }

     getDefaultMessages () {
       this.provider_services.getProviderMessages()
       .subscribe(
         (data: any) => {
          // this.default_message = data.delay || '';
         },
         error => {

         }
       );
     }

     onSubmit (form_data) {
       const time = this.getTimeinMin();
       // console.log('time', time);
       if (time !== 0) {
        const post_data = {
                              'delayDuration': time,
                              'sendMsg': form_data.send_message,
                              'message': form_data.message || '',
                          };
        // this.provider_services.addQueueDelay(form_data.queue_id, post_data)
        this.provider_services.addQueueDelay(this.selected_queue, post_data)
        .subscribe(
          data => {
            // console.log(data);
            this.api_success = this.sharedfunctionObj.getProjectMesssages('ADD_DELAY');
            this.closePopup('reloadlist');
          },
          error => {
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
          }
        );
        } else {
          this.sharedfunctionObj.apiErrorAutoHide(this, this.sharedfunctionObj.getProjectMesssages('ADD_DELAY_TIME_ERROR'));
        }
     }

     getQueueDelay(queue_id) {
       this.provider_services.getQueueDelay(queue_id)
       .subscribe(
         data => {
           // console.log('ddata', data);
          this.convertTime(data['delayDuration'] || 0);
          this.amForm.get('send_message').setValue(data['sendMsg']);
         },
         error => {

         }
       );
     }

     getTimeinMin() {

       const time_min = ( this.time.hour * 60  ) + this.time.minute ;
      return (typeof(time_min) === 'number') ? time_min : 0;
     }

     convertTime(time) {
      this.time.hour = Math.floor(time / 60);
      this.time.minute = time % 60;
      // console.log(this.time);
      this.amForm.get('delay').setValue(this.time);
     }

     closePopup(message) {
      setTimeout(() => {
        this.dialogRef.close(message);
        }, projectConstants.TIMEOUT_DELAY);
     }

     changeCheckbox(data) {
      if (data) {
        /*this.amForm.addControl('message',
        new FormControl(this.default_message, Validators.compose([Validators.required])));*/
        this.amForm.addControl('message',
        new FormControl(this.default_message));
      } else {
        this.amForm.removeControl('message');
      }
     }
     handle_queue_sel(queueid) {
       this.selected_queue = queueid;
       this.getQueueDelay(this.selected_queue);
       // console.log('selected queue', this.selected_queue);
     }

}
