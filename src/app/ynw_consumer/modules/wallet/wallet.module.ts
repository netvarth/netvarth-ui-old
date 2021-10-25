import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { SpentListModule } from './jaldee-cash/spent-list/spent-list.module';
import { TermsConditionModule } from './jaldee-cash/terms-condition/term-condition.module';



@NgModule({
  declarations: [ WalletComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    HeaderModule,
    LoadingSpinnerModule,
    SpentListModule,
    TermsConditionModule
  ],
  exports:[WalletComponent]
})
export class WalletModule { }
