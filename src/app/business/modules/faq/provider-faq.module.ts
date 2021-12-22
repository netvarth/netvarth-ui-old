import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderFaqComponent } from './provider-faq.component';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: ProviderFaqComponent }
];
@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ProviderFaqComponent
    ],
    exports: [ProviderFaqComponent]
})
export class ProviderFaqModule {}

