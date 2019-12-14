import { Routes, RouterModule } from '@angular/router';
import { LocationsListComponent } from './locations-list.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: LocationsListComponent },
    { path: ':id', component: LocationDetailsComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LocationsListRoutingModule { }
