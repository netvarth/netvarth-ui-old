import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CapitalizeFirstPipeModule } from '../../../../../../../../shared/pipes/capitalize.module';
import { BreadCrumbModule } from '../../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { AdditionalInfoComponent } from './additionalinfo.component';
import { UserBprofileSearchDynamicModule } from './provider-userbprofile-search-dynamic.component/provider-userbrofile-search-dynamic.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {path:'', component: AdditionalInfoComponent}
]
@NgModule({
    imports: [
        CommonModule,
        UserBprofileSearchDynamicModule,
        BreadCrumbModule,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        AdditionalInfoComponent
    ],
    exports: [AdditionalInfoComponent]
})
export class AdditionalInfoModule { }
