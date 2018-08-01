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

  amForm: FormGroup;
  queues: any = [];
  api_success = null;
  api_error = null;
  time = {hour: 0, minute: 0};
  default_message = '';

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
      this.queues = this.data.queues;

      if (!this.data.queues || !this.data.queue_id) {
        this.closePopup('error');
      }

      this.getDefaultMessages();

      this.amForm = this.fb.group({
        queue_id: ['', Validators.compose([Validators.required])],
        delay: ['', Validators.compose([Validators.required])],
        send_message: [false],
        message: ['', Validators.compose([Validators.required])],
      });

      this.amForm.get('queue_id').valueChanges
      .subscribe(
        data => {
          this.getQueueDelay(data);
        }
      );

      this.amForm.get('send_message').valueChanges
      .subscribe(
        data => {
          this.changeCheckbox(data);
        }
      );

      this.amForm.get('queue_id').setValue(this.data.queue_id);


     }

     getDefaultMessages () {
       this.provider_services.getProviderMessages()
       .subscribe(
         (data: any) => {
          this.default_message = data.delay || '';
         },
         error => {

         }
       );
     }

     onSubmit (form_data) {
       const time = this.getTimeinMin();
       console.log(form_data);
       const post_data = {
                            'delayDuration': time,
                            'sendMsg': form_data.send_message,
                            'message': form_data.message || '',
                         };
      this.provider_services.addQueueDelay(form_data.queue_id, post_data)
      .subscribe(
        data => {
          console.log(data);
          this.api_success = this.sharedfunctionObj.getProjectMesssages('ADD_DELAY');
          this.closePopup('reloadlist');
        },
        error => {
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
        }
      );
     }

     getQueueDelay(queue_id) {

       this.provider_services.getQueueDelay(queue_id)
       .subscribe(
         data => {
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
        this.amForm.addControl('message',
        new FormControl(this.default_message, Validators.compose([Validators.required])));
      } else {
        this.amForm.removeControl('message');
      }
     }

}
