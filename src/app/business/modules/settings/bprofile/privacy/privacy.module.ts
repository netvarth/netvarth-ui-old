import { NgModule } from '@angular/core';
import { PrivacyComponent } from './privacy.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmBoxModule } from '../../../../shared/confirm-box/confirm-box.module';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: PrivacyComponent },
    { path: ':id', loadChildren: ()=> import('./privacydetail/privacy-detail.module').then(m=>m.PrivacyDetailModule) }
];

@NgModule({
    declarations: [
        PrivacyComponent
    ],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        ConfirmBoxModule,
        LoadingSpinnerModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatTooltipModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [PrivacyComponent]
})
export class PrivacyModule {}
