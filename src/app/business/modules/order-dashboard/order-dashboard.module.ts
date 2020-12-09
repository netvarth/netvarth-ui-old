import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDashboardComponent } from './order-dashboard.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderDashboardRoutingModule } from './order-dashboard.routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderActionsComponent } from './order-actions/order-actions.component';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { CardModule } from '../../../shared/components/card/card.module';

@NgModule({
  declarations: [
    OrderDashboardComponent,
    OrderDetailsComponent,
    OrderActionsComponent
  ],
  entryComponents: [
    OrderActionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrderDashboardRoutingModule,
    MatTabsModule,
    LoadingSpinnerModule,
    CapitalizeFirstPipeModule,
    CardModule
  ],
  exports: [
    OrderDashboardComponent
  ]
})
export class OrderDashboardModule { }
