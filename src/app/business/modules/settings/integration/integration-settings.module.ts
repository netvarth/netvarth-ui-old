import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { IntegrationSettingsRoutingModule } from './integration-settings.routing.module';
import { IntegrationSettingsComponent } from './integration-settings.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        BreadCrumbModule,
        IntegrationSettingsRoutingModule
    ],
    declarations: [
        IntegrationSettingsComponent,
    ],
    exports: [
        IntegrationSettingsComponent
    ]
})
export class IntegrationSettingsModule {}
