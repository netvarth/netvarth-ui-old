import { RouterModule, Routes } from '@angular/router';
import { LearnmoreComponent } from '../../../shared/modules/learnmore/learnmore.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: LearnmoreComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearnmoreRoutingModule {

}
