import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JaldeeCashRoutingModule } from './jaldee-cash-routing.module';
import { JaldeeCashComponent } from './jaldee-cash.component';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { SpentListModule } from './spent-list/spent-list.module';
import { TermsConditionModule } from './terms-condition/term-condition.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';



@NgModule({
  declarations: [JaldeeCashComponent],
  imports: [
    CommonModule,
    JaldeeCashRoutingModule,
    LoadingSpinnerModule,
    SpentListModule,
    TermsConditionModule,
    HeaderModule
  ],
  exports:[JaldeeCashComponent]
})
export class JaldeeCashModule { }
