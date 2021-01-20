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
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderItemsComponent } from './order-items/order-items.component';

@NgModule({
  declarations: [
    OrderDashboardComponent,
    OrderDetailsComponent,
    OrderActionsComponent,
    OrderEditComponent,
    OrderItemsComponent
  ],
  entryComponents: [
    OrderActionsComponent,
    OrderItemsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrderDashboardRoutingModule,
    MatTabsModule,
    LoadingSpinnerModule,
    CapitalizeFirstPipeModule,
    CardModule,
    Nl2BrPipeModule,
    ModalGalleryModule
  ],
  exports: [
    OrderDashboardComponent
  ]
})
export class OrderDashboardModule { }
