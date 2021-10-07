import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderFaqComponent } from './provider-faq.component';
import { RouterModule, Routes } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
const routes: Routes = [
    { path: '', component: ProviderFaqComponent }
];
@NgModule({
    imports: [
        CommonModule,
        ScrollToModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ProviderFaqComponent
    ],
    exports: [ProviderFaqComponent]
})
export class ProviderFaqModule {}

