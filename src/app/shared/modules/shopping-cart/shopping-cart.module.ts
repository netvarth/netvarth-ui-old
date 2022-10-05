import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoppingCartSharedComponent } from './shopping-cart.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HeaderModule } from '../header/header.module';
import { FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { ConfirmBoxModule } from '../../components/confirm-box/confirm-box.module';
import { AddItemNotesModule } from './add-item-notes/add-item-notes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { OrderConsumerComponent } from './order-consumer/order-consumer.component';
import { OrderConsumerModule } from './order-consumer/order-consumer.module';
import { SkeletonLoadingModule } from '../skeleton-loading/skeleton-loading.module';

const routes: Routes = [
  { path: '', component: ShoppingCartSharedComponent },
  { path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule) },
];
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    MatRadioModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatChipsModule,
    FormsModule,
    FormMessageDisplayModule,
    ConfirmBoxModule,
    LoadingSpinnerModule,
    AddItemNotesModule,
    OrderConsumerModule,
    SkeletonLoadingModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    ShoppingCartSharedComponent
  ],
  declarations: [ShoppingCartSharedComponent, OrderConsumerComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})

export class ShoppingCartModule { }
