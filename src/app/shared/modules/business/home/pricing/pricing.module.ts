import { NgModule } from '@angular/core';
// import { PhomeRoutingModule } from '../phome-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingComponent } from './pricing.component';
import { PricingRoutingModule } from './pricing.routing.module';
import { HeaderModule } from '../../../header/header.module';
import { MaterialModule } from '../../../common/material.module';
import { FooterModule } from '../../../footer/footer.module';
@NgModule({
    imports: [
       CommonModule,
       FormsModule,
       PricingRoutingModule,
       HeaderModule,
       MaterialModule,
       FooterModule
    ],
    declarations: [
        PricingComponent
    ],
    entryComponents: [],
    exports: [PricingComponent]
})
export class PricingModule {}

