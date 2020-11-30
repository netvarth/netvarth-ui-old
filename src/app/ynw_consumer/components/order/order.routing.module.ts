import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ItemDetailsComponent } from './item-details/item-details.component';

const routes: Routes = [
  {
    path: '', component: OrderComponent
  },
  {
    path: 'cart', component: ShoppingCartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'item-details', component: ItemDetailsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerOrderRoutingModule {
}
