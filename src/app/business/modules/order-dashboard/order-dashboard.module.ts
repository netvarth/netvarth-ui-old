import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDashboardComponent } from './order-dashboard.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderDashboardRoutingModule } from './order-dashboard.routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import { OrderActionsComponent } from './order-actions/order-actions.component';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { CardModule } from '../../../shared/components/card/card.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { DisplaylabelpopupComponent } from './displaylabel/displaylabel.component';
import { OrderWizardComponent } from './order-wizard/order-wizard.component';
import { AddressComponent } from './order-wizard/address/address.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContactInfoComponent } from './order-wizard/contact-info/contact-info.component';

@NgModule({
  declarations: [
    OrderDashboardComponent,
    OrderDetailsComponent,
    OrderActionsComponent,
    OrderEditComponent,
    OrderItemsComponent,
    DisplaylabelpopupComponent,
    OrderWizardComponent,
    AddressComponent,
    ContactInfoComponent


  ],
  entryComponents: [
    OrderActionsComponent,
    OrderItemsComponent,
    DisplaylabelpopupComponent,
    AddressComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrderDashboardRoutingModule,
    MatTabsModule,
    MatBadgeModule,
    LoadingSpinnerModule,
    CapitalizeFirstPipeModule,
    CardModule,
    Nl2BrPipeModule,
    ModalGalleryModule,
    MatDialogModule,
    MatChipsModule,
    MatDatepickerModule
  ],
  exports: [
    OrderDashboardComponent

  ]
})
export class OrderDashboardModule { }
