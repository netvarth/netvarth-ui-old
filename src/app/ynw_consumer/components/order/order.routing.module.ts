import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderPaymentDetailsComponent } from './order-payment-details/order-payment-details.component';
import { OrderBillComponent } from './order-bill/order-bill.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: '', component: OrderComponent
  },

  {
    path: 'item-details', component: ItemDetailsComponent
  },
  {
    path: 'order-history', component: OrderHistoryComponent
  },
  {
    path: 'order-payments', component: OrderPaymentDetailsComponent
  },
  {
    path: 'order-bill', component: OrderBillComponent
  },
  {
    path: 'payment' , component: PaymentComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerOrderRoutingModule {
}
