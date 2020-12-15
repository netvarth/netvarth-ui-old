import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartSharedComponent } from './shopping-cart.component';

const routes: Routes = [
  { path: '', component: ShoppingCartSharedComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingCartRoutingModule {
}
