import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CorporateSettingsComponent } from './corporate-settings.component';

const routes: Routes = [
    { path: '', component: CorporateSettingsComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CorporateRoutingModule {}
