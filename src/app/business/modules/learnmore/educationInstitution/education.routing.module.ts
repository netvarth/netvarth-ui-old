import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EducationComponent } from './education.component';

const routes: Routes = [
    // { path: ':id', component: ProfessionalCareComponent },
    { path: ':/help', component: EducationComponent },
    { path: ':parent', component: EducationComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EducationRoutingModule {
}
