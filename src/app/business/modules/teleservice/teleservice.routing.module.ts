import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeleServiceComponent } from './teleservice.component';
const routes: Routes = [
    { path: '', component: TeleServiceComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeleServiceRoutingModule { }
