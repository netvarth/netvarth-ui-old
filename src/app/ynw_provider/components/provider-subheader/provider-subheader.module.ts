import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderSubeaderComponent } from './provider-subheader.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        MaterialModule,
        RouterModule
    ],
    declarations: [ProviderSubeaderComponent],
    exports: [ProviderSubeaderComponent]
})

export class ProviderSubeaderModule { }
