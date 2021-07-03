import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationPopupComponent } from './communication-popup.component';

@NgModule({
  declarations: [CommunicationPopupComponent],
  imports: [
    CommonModule
  ],
  exports: [CommunicationPopupComponent]
})

export class CommunicationPopupModule {
}
