import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ProviderSkinsComponent } from './provider-skins.component';

const routes: Routes = [
    { path: '', component: ProviderSkinsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderSkinsRoutingModule {
}


