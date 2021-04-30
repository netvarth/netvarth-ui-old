import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletComponent } from './wallet.component';

const routes: Routes = [
  {path:'',component:WalletComponent,children:[
    {path:'jaldee-cash',loadChildren: () =>  import('./jaldee-cash/jaldee-cash.module').then(m => m.JaldeeCashModule) },
    {path:'store-credit',loadChildren: () =>  import('./store-credit/store-credit.module').then(m => m.StoreCreditModule) },
  
  ]}
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
