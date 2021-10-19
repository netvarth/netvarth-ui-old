import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDetailsComponent } from './store-details.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
const routes: Routes = [
    { path: '', component: StoreDetailsComponent },
    { path: ':id', loadChildren: ()=> import('./details/edit-store-details.module').then(m=>m.EditStoreDetailsModule)},
];
@NgModule({
    declarations: [
        StoreDetailsComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [StoreDetailsComponent]
})
export class StoreDetailsModule {}
