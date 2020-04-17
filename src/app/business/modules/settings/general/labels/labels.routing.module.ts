import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabelsComponent } from './labels.component';
import { LabelComponent } from './detail/label.component';

const routes: Routes = [
    { path: '', component: LabelsComponent},
    { path: ':id', component: LabelComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LabelsRoutingModule {}
