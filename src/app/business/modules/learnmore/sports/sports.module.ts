import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { SportsComponent } from './sports.component';
import { SportsRoutingModule } from './sports.routing.module';
@NgModule({
    imports: [ 
      CommonModule,
      MatExpansionModule,
      SportsRoutingModule
    ],
    declarations: [SportsComponent],
    exports: [SportsComponent],
    providers: []
})

export class SportsModule {
}
