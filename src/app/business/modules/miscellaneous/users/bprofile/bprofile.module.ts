import { NgModule } from '@angular/core';
import { BProfileRoutingModule } from './bprofile.routing.module';
import { BProfileComponent } from './bprofile.component';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { AddProviderBprofileSpokenLanguagesComponent } from '../../../../../ynw_provider/components/add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';
import { MediaComponent } from './media/media.component';
import { LanguagesComponent } from './languages/languages.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { ProviderBprofileSearchDynamicComponent } from '../../../../../ynw_provider/components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { DynamicFormModule } from '../../../dynamic-form/dynamic-form.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
@NgModule({
    imports: [
        BProfileRoutingModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        ModalGalleryModule,
        Nl2BrPipeModule,
        DynamicFormModule,
        GalleryModule,
        NgxQRCodeModule
    ],
    declarations: [
        BProfileComponent,
        MediaComponent,
        AddProviderBprofileSpokenLanguagesComponent,
        ProviderBprofileSearchDynamicComponent,
        LanguagesComponent,
        AdditionalInfoComponent,
        SpecializationsComponent,
    ],
    entryComponents: [
        AddProviderBprofileSpokenLanguagesComponent,
        ProviderBprofileSearchDynamicComponent
    ],
    exports: [
        BProfileComponent
    ]
})
export class BProfileModule {}
