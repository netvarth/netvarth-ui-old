import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { JaldeeCashComponent } from './jaldee-cash/jaldee-cash.component';
import { StoreCreditComponent } from './store-credit/store-credit.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';


@NgModule({
  declarations: [ WalletComponent, JaldeeCashComponent, StoreCreditComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    HeaderModule
  ]
})
export class WalletModule { }
