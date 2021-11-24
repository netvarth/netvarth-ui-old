import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProvidersignupComponent } from './providersignup.component';
import { providersignupRoutingModule } from './providersignup.routing.module';
import { HeaderModule } from '../../header/header.module';
import { FormMessageDisplayModule } from '../../form-message-display/form-message-display.module';
import { SalesChannelModule } from '../../saleschannel/saleschannel.module';
import { LoadingSpinnerModule } from '../../loading-spinner/loading-spinner.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
    imports: [
       CommonModule,
       FormsModule,
       HeaderModule,
       providersignupRoutingModule,
       ReactiveFormsModule,
       FormMessageDisplayModule,
       SalesChannelModule,
       LoadingSpinnerModule,
       MatFormFieldModule,
       MatOptionModule,
       MatDialogModule,
       MatCheckboxModule,
       MatSelectModule
    ],
    declarations: [
        ProvidersignupComponent
    ],
    entryComponents: [],
    exports: [ProvidersignupComponent]
})
export class ProvidersignupModule {}
