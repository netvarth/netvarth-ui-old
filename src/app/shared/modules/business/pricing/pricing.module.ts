import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingComponent } from './pricing.component';
import { PricingRoutingModule } from './pricing.routing.module';
import { HeaderModule } from '../../header/header.module';
import { FooterModule } from '../../footer/footer.module';
import { OwlModule } from 'ngx-owl-carousel';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { PricingContentDialog } from '../pricing-content-dialog/pricing-content-dialog.component';
@NgModule({
    imports: [
       CommonModule,
       FormsModule,
       PricingRoutingModule,
       HeaderModule,
       MatTabsModule,
       FooterModule,
       MatDialogModule,
       OwlModule
    ],
    declarations: [
        PricingComponent,
        PricingContentDialog
    ],
    entryComponents: [PricingContentDialog],
    exports: [PricingComponent]
})
export class PricingModule {}

