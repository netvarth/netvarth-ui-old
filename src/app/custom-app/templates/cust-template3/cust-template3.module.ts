import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustTemplate3Component } from './cust-template3.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { SafeHtmlModule } from '../../../shared/pipes/safe-html/safehtml.module';
import { RouterModule, Routes } from '@angular/router';
import { ServiceDisplayModule } from '../../service-display/service-display.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DonationServicesComponent } from '../../donation-services/donation-services.component';
import { CardModule } from '../../../shared/components/card/card.module';
import { AppointmentServicesComponent } from '../../appointment-services/appointment-services.component';
import { CheckinServicesComponent } from '../../checkin-services/checkin-services.component';
import { OrdersModule } from '../../orders/orders.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ConsDepartmentsModule } from '../../cons-departments/cons-departments.module';
import { PictureGalleryModule } from '../../picture-gallery/picture-gallery.module';

const routes: Routes = [
  { path: '', component: CustTemplate3Component }
];

@NgModule({
  declarations: [
    CustTemplate3Component,
    DonationServicesComponent,
    AppointmentServicesComponent,
    CheckinServicesComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    SafeHtmlModule,
    ServiceDisplayModule,
    MatTabsModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    CardModule,
    OrdersModule,
    ConsDepartmentsModule,
    PictureGalleryModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CustTemplate3Component
  ]
})
export class CustTemplate3Module { }
