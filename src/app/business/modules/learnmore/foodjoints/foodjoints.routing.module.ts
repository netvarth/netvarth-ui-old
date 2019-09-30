import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoodJointComponent } from './foodjoints.component';

const routes: Routes = [
    { path: ':id', component: FoodJointComponent },
    { path: ':/help', component: FoodJointComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FoodjointsRoutingModule {
}
