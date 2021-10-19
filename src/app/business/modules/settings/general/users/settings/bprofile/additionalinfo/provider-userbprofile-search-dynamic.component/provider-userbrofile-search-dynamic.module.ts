import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DynamicFormModule } from '../../../../../../../../../shared/modules/dynamic-form/dynamic-form.module';
import { FormMessageDisplayModule } from '../../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ProviderUserBprofileSearchDynamicComponent } from './provider-userbprofile-search-dynamic.component';
@NgModule({
    imports: [
        CommonModule,
        DynamicFormModule,
        FormMessageDisplayModule,
        MatDialogModule
    ],
    declarations: [
        ProviderUserBprofileSearchDynamicComponent
    ],
    exports: [ProviderUserBprofileSearchDynamicComponent]
})
export class UserBprofileSearchDynamicModule { }
