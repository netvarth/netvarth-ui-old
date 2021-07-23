import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { JaldeeCashComponent } from './jaldee-cash/jaldee-cash.component';
import { StoreCreditComponent } from './store-credit/store-credit.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { SpentListComponent } from './jaldee-cash/spent-list/spent-list.component';
import { TermsConditionComponent } from './jaldee-cash/terms-condition/terms-condition.component';



@NgModule({
  declarations: [ WalletComponent, JaldeeCashComponent, StoreCreditComponent,SpentListComponent,TermsConditionComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    HeaderModule,
    LoadingSpinnerModule
  ],
  
  entryComponents: [
    TermsConditionComponent,
    SpentListComponent
  ],
  exports:[
    JaldeeCashComponent]
})
export class WalletModule { }
