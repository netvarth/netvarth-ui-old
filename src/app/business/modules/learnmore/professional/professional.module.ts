import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfessionalCareComponent } from './professional.component';
import { ProfessionalcareRoutingModule } from './professional.routing.module';
@NgModule({
    imports: [ 
      CommonModule,
      MatExpansionModule,
      ProfessionalcareRoutingModule
    ],
    declarations: [ProfessionalCareComponent],
    exports: [ProfessionalCareComponent],
    providers: []
})

export class ProfessionalcareModule {
}
