import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ConsumerFaqComponent } from './consumer-faq.component';
const routes: Routes = [
    { path: '', component: ConsumerFaqComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerFaqRoutingModule {
}