import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ProviderLearnmoreComponent } from './provider-learnmore.component';

const routes: Routes = [
    { path: ':parent', component: ProviderLearnmoreComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderLearnmoreRoutingModule {
}
