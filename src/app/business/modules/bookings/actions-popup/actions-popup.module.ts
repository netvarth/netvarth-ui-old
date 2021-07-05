import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsPopupComponent } from './actions-popup.component';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';



@NgModule({
  declarations: [
    ActionsPopupComponent
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule
  ],
  exports: [ActionsPopupComponent]
})
export class ActionsPopupModule {
}
