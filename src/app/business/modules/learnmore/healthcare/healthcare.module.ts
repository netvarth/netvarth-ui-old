import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HealthCareComponent } from './healthcare.component';
import { HealthcareRoutingModule } from './healthcare.routing.module';
@NgModule({
    imports: [
      CommonModule,
      MatExpansionModule,
      HealthcareRoutingModule
    ],
    declarations: [HealthCareComponent],
    exports: [HealthCareComponent],
    providers: []
})

export class HealthcareModule {
}
