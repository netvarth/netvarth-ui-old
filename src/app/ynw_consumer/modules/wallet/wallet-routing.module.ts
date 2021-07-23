import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletComponent } from './wallet.component';
import { JaldeeCashComponent } from './jaldee-cash/jaldee-cash.component';
import { StoreCreditComponent } from './store-credit/store-credit.component';

const routes: Routes = [
  // {path:'',component:WalletComponent,children:[
  //   {path:'jaldee-cash',loadChildren: () =>  import('./jaldee-cash/jaldee-cash.module').then(m => m.JaldeeCashModule) },
  //   {path:'store-credit',loadChildren: () =>  import('./store-credit/store-credit.module').then(m => m.StoreCreditModule) },
  
  // ]}
  {
    path: '', component: WalletComponent
  },

  {
    path: 'jaldee-cash', component: JaldeeCashComponent
  },
  {
    path: 'store-credit', component: StoreCreditComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
