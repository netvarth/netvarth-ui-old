import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ConsumerLearnmoreComponent } from './consumer-learnmore.component';
const routes: Routes = [
    { path: '', component: ConsumerLearnmoreComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerLearnmoreRoutingModule {
}
