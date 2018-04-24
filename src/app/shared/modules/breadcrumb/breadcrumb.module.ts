import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';


import { BreadCrumbComponent } from './breadcrumb.component';
import { ProviderSubeaderComponent } from '../../../ynw_provider/components/provider-subheader/provider-subheader.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [
        BreadCrumbComponent
    ],
    exports: [BreadCrumbComponent]
})
export class BreadCrumbModule {
}
