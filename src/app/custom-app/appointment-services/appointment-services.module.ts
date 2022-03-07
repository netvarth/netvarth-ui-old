import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentServicesComponent } from './appointment-services.component';
import { CardModule } from '../../shared/components/card/card.module';
import { ServiceDetailModule } from '../../shared/components/service-detail/service-detail.module';
import { CheckavailabilityModule } from '../../shared/components/checkavailability/checkavaiablity.module';
import { ConsumerJoinModule } from '../../ynw_consumer/components/consumer-join/join.component.module';



@NgModule({
  declarations: [
    AppointmentServicesComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ServiceDetailModule,
    CheckavailabilityModule,
    ConsumerJoinModule
  ],
  exports: [
    AppointmentServicesComponent
  ]
})
export class AppointmentServicesModule { }
