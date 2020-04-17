import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { DisplayboardsComponent } from './displayboards.component';
import { DisplayboardsRoutingModule } from './displayboards.routing.module';
import { DisplayboardDetailComponent } from './detail/displayboard-details.component';
import { GlobalSettingsModule } from './global-settings/global-settings.module';
import { DisplayboardQSetModule } from './q-set/displayboard-qset.module';
import { ContainersComponent } from './containers/containers.component';
import { ContainerDetailComponent } from './containers/detail/container-detail.component';

@NgModule({
    declarations: [
        DisplayboardsComponent,
        DisplayboardDetailComponent
    ],
    imports: [
        DisplayboardsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        DisplayboardQSetModule,
        GlobalSettingsModule
    ],
    exports: [
        DisplayboardsComponent,
    ]
})
export class DisplayboardsModule { }

