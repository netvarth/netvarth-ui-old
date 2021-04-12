import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProviderLoginComponent } from './provider-login.component';
import { HeaderModule } from '../../header/header.module';
import { FormMessageDisplayModule } from '../../form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../loading-spinner/loading-spinner.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { providerLoginRoutingModule } from './provider-login.routing.module';
import { MatInputModule } from '@angular/material/input';
@NgModule({
    imports: [
       CommonModule,
       FormsModule,
       HeaderModule,
       ReactiveFormsModule,
       FormMessageDisplayModule,
       LoadingSpinnerModule,
       MatFormFieldModule,
       MatInputModule,
       MatDialogModule,
       providerLoginRoutingModule
    ],
    declarations: [
        ProviderLoginComponent
    ],
    entryComponents: [],
    exports: [ProviderLoginComponent]
})
export class ProviderLoginModule {}
