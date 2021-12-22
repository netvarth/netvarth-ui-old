import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { VeterinaryComponent } from './veterinary.component';
import { VeterinaryRoutingModule } from './veterinary.routing.module';
@NgModule({
    imports: [ 
      CommonModule,
      MatExpansionModule,
      VeterinaryRoutingModule
    ],
    declarations: [VeterinaryComponent],
    exports: [VeterinaryComponent],
    providers: []
})

export class VeterinaryModule {
}
