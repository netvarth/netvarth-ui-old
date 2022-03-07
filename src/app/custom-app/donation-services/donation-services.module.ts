import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationServicesComponent } from './donation-services.component';
import { CardModule } from '../../shared/components/card/card.module';
import { ServiceDetailModule } from '../../shared/components/service-detail/service-detail.module';
import { ConsumerJoinModule } from '../../ynw_consumer/components/consumer-join/join.component.module';



@NgModule({
  declarations: [
      DonationServicesComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ServiceDetailModule,
    ConsumerJoinModule
  ],
  exports: [
      DonationServicesComponent
  ]
})
export class DonationServicesModule { }
