import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { FormMessageDisplayModule } from '../../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { AddProviderUserBprofileSpokenLanguagesComponent } from './addprovideuserbprofilespokenlanguages.component';
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        LoadingSpinnerModule,
        MatCheckboxModule,
        MatButtonModule,
        FormMessageDisplayModule
    ],
    declarations: [
        AddProviderUserBprofileSpokenLanguagesComponent
    ],
    exports: [AddProviderUserBprofileSpokenLanguagesComponent]
})
export class UserSpokenLanguagesModule { }
