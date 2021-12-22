import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { EducationComponent } from './education.component';
import { EducationRoutingModule } from './education.routing.module';
@NgModule({
    imports: [ 
      EducationRoutingModule,
      MatExpansionModule,
      CommonModule
    ],
    declarations: [EducationComponent],
    exports: [EducationComponent],
    providers: []
})

export class EducationModule {
}
