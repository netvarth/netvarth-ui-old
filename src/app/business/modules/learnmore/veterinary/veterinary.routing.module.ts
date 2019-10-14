import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VeterinaryComponent } from './veterinary.component';

const routes: Routes = [
    // { path: ':id', component: VeterinaryComponent },
    { path: '\help', component: VeterinaryComponent },
    { path: ':parent', component: VeterinaryComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VeterinaryRoutingModule { 
}
