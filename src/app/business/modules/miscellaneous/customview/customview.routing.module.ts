import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomViewListComponent } from './customview-list/custom-view-list.component';
import { CustomViewComponent } from './customview-create/custom-view.component';

const routes: Routes = [
    { path: '', component: CustomViewListComponent},
    { path: ' :id', component: CustomViewComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomViewroutingmodule {}
