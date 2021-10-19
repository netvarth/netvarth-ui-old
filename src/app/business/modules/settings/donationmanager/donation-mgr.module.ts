import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../../../shared/modules/service/services.service';
import { DonationMgrComponent } from './donation-mgr.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: DonationMgrComponent },
    { path: 'causes', loadChildren: ()=> import('./causes/causes.module').then(m=>m.DonationCauseListModule)},
    { path: 'causes/:id', loadChildren: ()=> import('./causes/detail/cause-details.module').then(m=>m.CauseDetailModule)},
];
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        DonationMgrComponent
    ],
    exports: [
        DonationMgrComponent
    ],
    providers: [
        ServicesService
    ]
})
export class DonationMgrModule { }
