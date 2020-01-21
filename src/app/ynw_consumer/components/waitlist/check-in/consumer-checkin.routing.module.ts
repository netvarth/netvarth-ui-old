import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
const routes: Routes = [
    { path: '', component: ConsumerCheckinComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerCheckinRoutingModule { }
