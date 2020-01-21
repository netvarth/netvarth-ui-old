import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/modules/common/shared.module';
import { ContainersComponent } from './containers.component';
import { ContainerDetailComponent } from './detail/container-detail.component';
import { ContainerRoutingModule } from './container.routing.module';

@NgModule({
    declarations: [
        ContainersComponent,
        ContainerDetailComponent
    ],
    imports: [
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        SharedModule,
        ContainerRoutingModule
    ],
    exports: [ContainersComponent]
})
export class ContainerModule { }
