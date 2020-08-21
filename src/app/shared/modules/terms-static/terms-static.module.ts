import { NgModule } from '@angular/core';
import { TermsStaticComponent } from './terms-static.component';
import { TermsRoutingModule } from './terms-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
      TermsRoutingModule,
      RouterModule,
      CommonModule
    ],
    declarations: [TermsStaticComponent]
})

export class TermsStaticModule {}
