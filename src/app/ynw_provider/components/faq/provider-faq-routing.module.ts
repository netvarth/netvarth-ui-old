import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ProviderFaqComponent } from './provider-faq.component';

const routes: Routes = [
    { path: '', component: ProviderFaqComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderFaqRoutingModule {
}

