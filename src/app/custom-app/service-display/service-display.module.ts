import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceDisplayComponent } from './service-display.component';
import { CardModule } from '../../shared/components/card/card.module';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CapitalizeFirstPipeModule } from '../../shared/pipes/capitalize.module';
import { CheckavailabilityModule } from '../../shared/components/checkavailability/checkavaiablity.module';
import { ServiceDetailModule } from '../../shared/components/service-detail/service-detail.module';
import { ConsumerJoinModule } from '../../ynw_consumer/components/consumer-join/join.component.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DonationServicesComponent } from '../donation-services/donation-services.component';
import { AppointmentServicesComponent } from '../appointment-services/appointment-services.component';
import { CheckinServicesComponent } from '../checkin-services/checkin-services.component';
import { OrdersModule } from '../orders/orders.module';



@NgModule({
  declarations: [
    ServiceDisplayComponent,
    DonationServicesComponent,
    AppointmentServicesComponent,
    CheckinServicesComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    ServiceDetailModule,
    CapitalizeFirstPipeModule,
    ConsumerJoinModule,
    CheckavailabilityModule,
    MatDialogModule,
    OrdersModule
  ],
  exports: [
    ServiceDisplayComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ServiceDisplayModule { }
