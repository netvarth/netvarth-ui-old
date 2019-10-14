import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VastuComponent } from './vastu.component';

const routes: Routes = [
    // { path: ':id', component: VastuComponent },
    { path: '\help', component: VastuComponent },
    { path: ':parent', component: VastuComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VastuRoutingModule {
}
