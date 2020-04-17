import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscountComponent } from './discount.component';
import { DiscountDetailsComponent } from './details/discountdetails.component';


const routes: Routes = [
    { path: '', component: DiscountComponent },
    { path: ':id', component: DiscountDetailsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DiscountRoutingModule {}
