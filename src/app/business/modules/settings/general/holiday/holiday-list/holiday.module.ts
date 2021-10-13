import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HolidayListComponent } from './holiday-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmBoxModule } from '../../../../../../shared/components/confirm-box/confirm-box.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
const routes: Routes = [
    { path: '', component: HolidayListComponent },
    { path: ':id',  loadChildren: ()=> import('../holiday-details/holiday-details.module').then(m=>m.HolidayDetailsBoxModule)},
];
@NgModule({ 
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ConfirmBoxModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        HolidayListComponent
    ],
    exports: [HolidayListComponent]
})

export class HolidayModule {}
