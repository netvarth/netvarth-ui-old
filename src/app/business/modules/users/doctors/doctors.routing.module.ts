import { Routes, RouterModule } from '@angular/router';
import { DoctorsComponent } from './doctors.component';
import { NgModule } from '@angular/core';
import { BranchDoctorDetailComponent } from './details/doctors-detail.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';

const routes: Routes = [
    { path: '', component: DoctorsComponent },
    { path: 'add', component: BranchDoctorDetailComponent },
    { path: 'additionalinfo', component: AdditionalInfoComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DoctorsRoutingModule {}
