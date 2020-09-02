import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallingModesComponent } from './calling-modes.component';
const routes: Routes = [
    { path: '', component: CallingModesComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CallingModesRoutingModule { }
