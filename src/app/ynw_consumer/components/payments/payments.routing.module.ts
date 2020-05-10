import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerPaymentsComponent } from './payments.component';
const routes: Routes = [
    {
        path: '', component: ConsumerPaymentsComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerPaymentsRoutingModule {
}
