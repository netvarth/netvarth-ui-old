import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormMessageDisplayModule } from '../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { UserBprofileSearchPrimaryComponent } from './user-bprofile-search-primary.component';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule
    ],
    declarations: [
        UserBprofileSearchPrimaryComponent
    ],
    exports: [UserBprofileSearchPrimaryComponent]
})
export class UserBprofileSearchPrimaryModule { }
