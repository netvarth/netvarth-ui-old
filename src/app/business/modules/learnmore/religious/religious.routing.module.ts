import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReligiousComponent } from './religious.component';

const routes: Routes = [
    // { path: ':id', component: ReligiousComponent },
    { path: ':/help', component: ReligiousComponent },
    { path: ':parent', component: ReligiousComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReligiousRoutingModule {
}
