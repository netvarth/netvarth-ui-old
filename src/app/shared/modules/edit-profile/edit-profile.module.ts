import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { EditProfileComponent } from './edit-profile.component';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        HeaderModule,
        FormsModule
    ],
    declarations: [
        EditProfileComponent
    ],
    exports: [EditProfileComponent]
})
export class EditProfileModule {
}
