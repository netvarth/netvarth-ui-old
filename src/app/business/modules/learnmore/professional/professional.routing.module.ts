import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfessionalCareComponent } from './professional.component';

const routes: Routes = [
    // { path: ':id', component: ProfessionalCareComponent },
    { path: ':/help', component: ProfessionalCareComponent },
    { path: ':parent', component: ProfessionalCareComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfessionalcareRoutingModule {
}
