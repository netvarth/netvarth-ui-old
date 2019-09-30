import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CheckInsDashboardComponent } from './check-ins/check-ins.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    {
        path: '',
        children: [
            { path: 'check-ins', component: CheckInsDashboardComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
