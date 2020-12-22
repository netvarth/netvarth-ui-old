import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditStoreDetailsComponent } from './details/edit-store-details.component';
import { StoreDetailsComponent } from './store-details.component';
const routes: Routes = [
    { path: '', component: StoreDetailsComponent },
    { path: ':id', component: EditStoreDetailsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoreDetailsRoutingModule {}