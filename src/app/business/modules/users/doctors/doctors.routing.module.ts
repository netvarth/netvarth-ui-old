import { Routes, RouterModule } from '@angular/router';
import { DoctorsComponent } from './doctors.component';
import { NgModule } from '@angular/core';
import { BranchDoctorDetailComponent } from './details/doctors-detail.component';

const routes: Routes = [
    { path: '', component: DoctorsComponent },
    { path: ':add', component: BranchDoctorDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DoctorsRoutingModule {}
