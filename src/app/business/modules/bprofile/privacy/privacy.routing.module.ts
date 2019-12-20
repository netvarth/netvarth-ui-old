import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivacyComponent } from './privacy.component';
import { PrivacyDetailComponent } from './privacydetail/privacy-detail.component';

const routes: Routes = [
    { path: '', component: PrivacyComponent },
    { path: ':id', component: PrivacyDetailComponent }
 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyRoutingModule {}
