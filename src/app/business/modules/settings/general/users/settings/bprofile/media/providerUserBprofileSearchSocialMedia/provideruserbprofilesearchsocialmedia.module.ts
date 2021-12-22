import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LoadingSpinnerModule } from '../../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ProviderUserBprofileSearchSocialMediaComponent } from './providerUserBprofileSearchSocialMedia.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeFirstPipeModule } from '../../../../../../../../../shared/pipes/capitalize.module';
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatIconModule,
        LoadingSpinnerModule,
        FormsModule,
        CapitalizeFirstPipeModule
    ],
    declarations: [
        ProviderUserBprofileSearchSocialMediaComponent
    ],
    exports: [ProviderUserBprofileSearchSocialMediaComponent]
})
export class UserSearchSocialMediaModule { }
