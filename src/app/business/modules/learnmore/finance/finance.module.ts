import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FinanceComponent } from './finance.component';
import { FinanceRoutingModule } from './finance.routing.module';
@NgModule({
  imports: [
    FinanceRoutingModule,
    MatExpansionModule,
    CommonModule
  ],
  declarations: [FinanceComponent],
  exports: [FinanceComponent],
  providers: []
})

export class FinanceModule {
}
