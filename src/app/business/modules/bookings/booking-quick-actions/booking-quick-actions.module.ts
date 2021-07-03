import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { BookingQuickActionsComponent } from './booking-quick-actions.component';



@NgModule({
  declarations: [BookingQuickActionsComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    CapitalizeFirstPipeModule
  ],
  exports: [BookingQuickActionsComponent]
})
export class BookingQuickActionsModule {
}
