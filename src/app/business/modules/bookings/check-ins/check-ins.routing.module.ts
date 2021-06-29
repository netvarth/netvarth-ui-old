import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckinsComponent } from './check-ins.component';

const routes: Routes = [
    { path: '', component: CheckinsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CheckinsRoutingModule { }
