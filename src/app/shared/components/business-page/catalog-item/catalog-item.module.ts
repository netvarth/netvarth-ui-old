import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogItemComponent } from './catalog-item.component';
import { RouterModule, Routes } from '@angular/router';
import { OrderService } from '../../../../shared/services/order.service';
import { HeaderModule } from '../../../../shared/modules/header/header.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MatDialogModule } from '@angular/material/dialog';
import { OwlModule } from 'ngx-owl-carousel';
import { ConsumerJoinModule } from '../../../../ynw_consumer/components/consumer-join/join.component.module';
import { SignupModule } from '../../signup/signup.module';

const routes: Routes = [
  { path: '', component: CatalogItemComponent}
];

@NgModule({
  declarations: [
    CatalogItemComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    CapitalizeFirstPipeModule,
    MatDialogModule,
    ConsumerJoinModule,
    SignupModule,
    LoadingSpinnerModule,
    OwlModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CatalogItemComponent
  ],
  providers: [
    OrderService
  ]
})
export class CatalogItemModule { }
