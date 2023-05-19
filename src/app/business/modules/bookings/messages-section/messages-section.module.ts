import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesSectionComponent } from './messages-section.component';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';



@NgModule({
  declarations: [
    MessagesSectionComponent
  ],
  imports: [
    CommonModule,
    LoadingSpinnerModule
  ],
  exports: [
    MessagesSectionComponent
  ]
})
export class MessagesSectionModule { }
