import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabelsComponent } from './labels.component';

const routes: Routes = [
    { path: '',  component: LabelsComponent},
    { path: ':id', loadChildren: ()=> import('./detail/label-details.module').then(m=>m.LabelDetailSModule)}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LabelsRoutingModule {}
