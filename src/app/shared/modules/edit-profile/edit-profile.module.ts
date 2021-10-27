import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { EditProfileComponent } from './edit-profile.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { HeaderModule } from '../header/header.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
const routes: Routes = [
    { path: '', component: EditProfileComponent }
];
@NgModule({
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)],
        ReactiveFormsModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        HeaderModule,
        FormsModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatDialogModule
    ],
    declarations: [
        EditProfileComponent
    ],
    exports: [EditProfileComponent]
})
export class EditProfileModule {
}
