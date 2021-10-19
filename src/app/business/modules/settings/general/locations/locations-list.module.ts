import { NgModule } from '@angular/core';
import { LocationsListComponent } from './locations-list.component';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: LocationsListComponent },
    { path: ':id', loadChildren: ()=> import('./location-details/location-details.module').then(m=>m.LocationDetailsModule) }
];
@NgModule({
    imports: [
        LoadingSpinnerModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        ReactiveFormsModule,
        OrderModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        LocationsListComponent
    ],
    exports: [
        LocationsListComponent
    ]
})

export class LocationListModule { }
