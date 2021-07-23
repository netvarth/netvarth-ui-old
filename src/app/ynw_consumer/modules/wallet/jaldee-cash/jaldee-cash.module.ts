import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JaldeeCashRoutingModule } from './jaldee-cash-routing.module';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { SpentListComponent } from './spent-list/spent-list.component';
import { JaldeeCashComponent } from './jaldee-cash.component';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';



@NgModule({
  declarations: [TermsConditionComponent,
    SpentListComponent,
    JaldeeCashComponent
    ],
  imports: [
    CommonModule,
    JaldeeCashRoutingModule,
    LoadingSpinnerModule

  ],
  entryComponents: [
    TermsConditionComponent,
    SpentListComponent
  ],
  exports:[
    JaldeeCashComponent]
})
export class JaldeeCashModule { }
