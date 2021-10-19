import { NgModule } from '@angular/core';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { GlobalSettingsComponent } from './global-settings.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
// const routes: Routes = [
//     { path: '', component: GlobalSettingsComponent}
// ];
@NgModule({
    declarations: [
        GlobalSettingsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CKEditorModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule
        // [RouterModule.forChild(routes)]
    ],
    exports: [GlobalSettingsComponent]
})
export class GlobalSettingsModule { }
