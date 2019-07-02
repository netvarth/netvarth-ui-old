import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthcareLearnmoreComponent } from '../../../../ynw_provider/components/healthcare_learnmore/healthcare_learnmore.component';


const routes: Routes = [
    { path: '', component: HealthcareLearnmoreComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearnmoreRoutingModule {
}
