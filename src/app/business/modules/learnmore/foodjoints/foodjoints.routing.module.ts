import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoodJointComponent } from './foodjoints.component';

const routes: Routes = [
    { path: ':parent', component: FoodJointComponent },
    { path: ':/help', component: FoodJointComponent },
    // { path: ':/parent', component: FoodJointComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FoodjointsRoutingModule {
}
