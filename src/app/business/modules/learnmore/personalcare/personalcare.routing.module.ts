import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCareComponent } from './personalcare.component';

const routes: Routes = [
    // { path: ':id', component: PersonalCareComponent },
    { path: ':/help', component: PersonalCareComponent },
    { path: ':parent', component: PersonalCareComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonalcareRoutingModule {
}
