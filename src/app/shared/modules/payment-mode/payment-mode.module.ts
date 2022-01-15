import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { PaymentModeComponent } from './payment-mode.component';

@NgModule({
  declarations: [PaymentModeComponent],
  exports: [PaymentModeComponent],
  imports: [
    CommonModule,
    MatRadioModule
  ]
})
export class PaymentModeModule { }
