import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthCareComponent } from './healthcare.component';

const routes: Routes = [
    { path: ':id', component: HealthCareComponent },
    { path: ':/help', component: HealthCareComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HealthcareRoutingModule {
}
