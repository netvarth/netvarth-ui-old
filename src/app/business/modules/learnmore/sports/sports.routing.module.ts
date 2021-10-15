import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SportsComponent } from './sports.component';

const routes: Routes = [
    // { path: ':id', component: ProfessionalCareComponent },
    { path: ':/help', component: SportsComponent },
    { path: ':parent', component: SportsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SportsRoutingModule {
}
