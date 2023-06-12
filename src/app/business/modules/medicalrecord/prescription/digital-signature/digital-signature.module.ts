import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureComponent } from './digital-signature.component';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    DigitalSignatureComponent
  ],
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  exports: [
    DigitalSignatureComponent
  ]
})
export class DigitalSignatureModule { }
