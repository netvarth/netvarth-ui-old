import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FoodJointComponent } from './foodjoints.component';
import { FoodjointsRoutingModule } from './foodjoints.routing.module';
@NgModule({
    imports: [ 
      FoodjointsRoutingModule,
      MatExpansionModule,
      CommonModule
    ],
    declarations: [FoodJointComponent],
    exports: [FoodJointComponent],
    providers: []
})

export class FoodjointsModule {
}
