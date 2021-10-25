import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingComponent } from './pricing.component';
import { HeaderModule } from '../../header/header.module';
import { FooterModule } from '../../footer/footer.module';
import { OwlModule } from 'ngx-owl-carousel';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { PricingContentDialogModule } from '../pricing-content-dialog/pricing-content-dialog.module';
import { RouterModule, Routes } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
const routes: Routes = [
    { path: '', component: PricingComponent }
];
@NgModule({
    imports: [
       CommonModule,
       FormsModule,
       HeaderModule,
       MatTabsModule,
       FooterModule,
       MatDialogModule,
       OwlModule,
       ScrollToModule,
       PricingContentDialogModule,
       [RouterModule.forChild(routes)]
    ],
    declarations: [
        PricingComponent
    ],
    exports: [PricingComponent]
})
export class PricingModule {}

