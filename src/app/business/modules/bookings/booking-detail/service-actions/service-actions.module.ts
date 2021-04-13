import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { ServiceActionsComponent } from './service-actions.component';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';



@NgModule({
  declarations: [ServiceActionsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,

  ],
  exports:[ServiceActionsComponent]
})
export class ServiceActionModule {
}
