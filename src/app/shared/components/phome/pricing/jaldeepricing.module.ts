import { NgModule } from '@angular/core';
// import { PhomeRoutingModule } from '../phome-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JaldeepricingComponent } from './jaldeepricing.component';
import { jaldeepricingRoutingModule } from './jaldeepricing.routing.module';
import { HeaderModule } from '../../../modules/header/header.module';
import { MaterialModule } from '../../../modules/common/material.module';
import { FooterModule } from '../../../modules/footer/footer.module';
@NgModule({
    imports: [
       CommonModule,
       FormsModule,
       jaldeepricingRoutingModule,
       HeaderModule,
       MaterialModule,
       FooterModule
    ],
    declarations: [
        JaldeepricingComponent
    ],
    entryComponents: [],
    exports: [JaldeepricingComponent]
})
export class JaldeePricingModule {}

