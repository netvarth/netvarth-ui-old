import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { PersonalCareComponent } from './personalcare.component';
import { PersonalcareRoutingModule } from './personalcare.routing.module';
@NgModule({
    imports: [ 
      CommonModule,
      MatExpansionModule,
      PersonalcareRoutingModule
    ],
    declarations: [PersonalCareComponent],
    exports: [PersonalCareComponent],
    providers: []
})

export class PersonalcareModule {
}
