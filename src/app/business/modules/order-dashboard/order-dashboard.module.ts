import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDashboardComponent } from './order-dashboard.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderDashboardRoutingModule } from './order-dashboard.routing.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    OrderDashboardComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    OrderDashboardRoutingModule,
    MatTabsModule
  ],
  exports: [
    OrderDashboardComponent
  ]
})
export class OrderDashboardModule { }
