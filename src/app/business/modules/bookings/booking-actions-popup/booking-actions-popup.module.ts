import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingActionsPopupComponent } from './booking-actions-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';



@NgModule({
  declarations: [
    BookingActionsPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormMessageDisplayModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule
  ]
})
export class BookingActionsPopupModule { }
