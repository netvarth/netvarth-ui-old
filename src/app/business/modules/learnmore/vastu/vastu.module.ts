import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { VastuComponent } from './vastu.component';
import { VastuRoutingModule } from './vastu.routing.module';
@NgModule({
    imports: [ 
      VastuRoutingModule,
      MatExpansionModule,
      CommonModule
    ],
    declarations: [VastuComponent],
    exports: [VastuComponent],
    providers: []
})

export class VastuModule {
}
