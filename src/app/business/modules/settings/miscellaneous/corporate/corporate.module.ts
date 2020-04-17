import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { CorporateSettingsComponent } from './corporate-settings.component';
import { CorporateRoutingModule } from './corporate.routing.module';

@NgModule({
    declarations: [
        CorporateSettingsComponent
    ],
    imports: [
        CorporateRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CommonModule,
        FormMessageDisplayModule,
        FormsModule,
        LoadingSpinnerModule,
        ReactiveFormsModule
    ],
    entryComponents: [],
    exports: [CorporateSettingsComponent]
})
export class CorporateModule {}
