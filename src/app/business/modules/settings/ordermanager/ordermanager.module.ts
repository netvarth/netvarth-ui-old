import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { OrdermanagerRoutingModule } from './ordermanager.routing.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { SalesChannelModule } from '../../../../shared/modules/saleschannel/saleschannel.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { OwlModule } from 'ngx-owl-carousel';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormsModule } from '@angular/forms';
import { OrdermanagerComponent } from './ordermanager.component';
import { CatalogComponent } from './catalog/catalog.component';
import { StoreDetailsComponent } from './store-details/store-details.component';



@NgModule({
  imports: [
      CommonModule,
      BreadCrumbModule,
      OrdermanagerRoutingModule,
      MaterialModule,
      FormsModule,
      LoadingSpinnerModule,
      FormMessageDisplayModule,
      NgbTimepickerModule,
      SharedModule,
      SalesChannelModule,
      Nl2BrPipeModule,
      OwlModule,
      CapitalizeFirstPipeModule
  ],
  declarations: [
    OrdermanagerComponent,
    CatalogComponent,
    StoreDetailsComponent
  ],
  entryComponents: [
     // AddProviderNonworkingdaysComponent
  ],
  exports: [OrdermanagerComponent]
})
export class OrdermanagerModule { }
