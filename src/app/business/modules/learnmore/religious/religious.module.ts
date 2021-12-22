import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReligiousComponent } from './religious.component';
import { ReligiousRoutingModule } from './religious.routing.module';
@NgModule({
    imports: [ 
      CommonModule,
      MatExpansionModule,
      ReligiousRoutingModule
    ],
    declarations: [ReligiousComponent],
    exports: [ReligiousComponent],
    providers: []
})

export class ReligiousModule {
}
