import { NgModule } from '@angular/core';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { GlobalSettingsComponent } from './global-settings.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FileService } from '../../../../../../shared/services/file-service';
// const routes: Routes = [
//     { path: '', component: GlobalSettingsComponent}
// ];

@NgModule({
    declarations: [
        GlobalSettingsComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        FormsModule,
        CKEditorModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        // [RouterModule.forChild(routes)]
    ],
    providers: [
        FileService
    ],
    exports: [GlobalSettingsComponent]
})
export class GlobalSettingsModule { }
