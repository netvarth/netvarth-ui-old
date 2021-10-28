import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrivacyStaticComponent } from './privacy-static.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PrivacyStaticComponent],
  exports: [PrivacyStaticComponent]
})

export class PrivacyStaticModule {
}
