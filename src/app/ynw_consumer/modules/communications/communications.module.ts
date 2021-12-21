import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationsComponent } from './communications.component';
import { FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';



@NgModule({
  declarations: [
    CommunicationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormMessageDisplayModule
  ],
  exports: [
    CommunicationsComponent
  ]
})
export class CommunicationsModule { }
