import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { CorporateSettingsComponent } from './corporate-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
const routes: Routes = [
    { path: '', component: CorporateSettingsComponent }
];
@NgModule({
    declarations: [
        CorporateSettingsComponent
    ],
    imports: [
        CommonModule,
        FormMessageDisplayModule,
        FormsModule,
        LoadingSpinnerModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [CorporateSettingsComponent]
})
export class CorporateModule {}
