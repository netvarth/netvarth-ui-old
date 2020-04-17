import { NgModule } from '@angular/core';
import { PrivacyComponent } from './privacy.component';
import { PrivacyDetailComponent } from './privacydetail/privacy-detail.component';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyRoutingModule } from './privacy.routing.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';

@NgModule({
    declarations: [
        PrivacyComponent,
        PrivacyDetailComponent,
    ],
    imports: [
        PrivacyRoutingModule,
        BreadCrumbModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        GalleryModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
    ],
    exports: [PrivacyComponent]
})
export class PrivacyModule {}
