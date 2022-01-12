import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';

const routes: Routes = [
    { path: '', component: OrderComponent },
    { path: 'item-details', loadChildren: () => import('./item-details/item-details.module').then(m => m.ItemDetailsModule) },
    { path: 'order-history', loadChildren: () => import('./order-history/order-history.module').then(m => m.OrderHistoryModule) },
    { path: 'order-payments', loadChildren: () => import('./order-payment-details/order-payment-details.module').then(m => m.OrderPaymentDetailsModule) },
    { path: 'order-bill', loadChildren: () => import('./order-bill/order-bill.module').then(m => m.OrderBillModule) },
    { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule) }
  ];
@NgModule({
    declarations: [
       OrderComponent
    ],
    imports: [
        [RouterModule.forChild(routes)],
      
    ],
    exports: [
        OrderComponent
    ]
})
export class ConsumerOrderModule { }
