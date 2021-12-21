import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinCommunicationsComponent } from './checkin-communications.component';
import { FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';



@NgModule({
  declarations: [
    CheckinCommunicationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormMessageDisplayModule
  ],
  exports: [
    CheckinCommunicationsComponent
  ]
})
export class CheckinCommunicationsModule { }
