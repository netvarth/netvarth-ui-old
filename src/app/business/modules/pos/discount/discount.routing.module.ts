import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { discountcomponent } from './discount.component';
import { discountdetailscomponent } from './details/discountdetails.component';


const routes: Routes = [
    { path: '', component: discountcomponent },
    { path: ':id', component: discountdetailscomponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class discountRoutingModule {}
