import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BProfileRoutingModule } from './bprofile.routing.module';
import { BProfileComponent } from './bprofile.component';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { AddProviderBprofileSpokenLanguagesComponent } from '../../../../ynw_provider/components/add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';
import { MediaComponent } from './media/media.component';
import { LanguagesComponent } from './languages/languages.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { ProviderBprofileSearchDynamicComponent } from '../../../../ynw_provider/components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { DynamicFormModule } from '../../dynamic-form/dynamic-form.module';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { ProPicPopupModule } from './pro-pic-popup/pro-pic-popup.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { QRCodeGeneratorComponent } from './qrcodegenerator/qrcodegenerator.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AboutMeComponent } from './aboutme/aboutme.component';
import { JaldeeOnlineComponent } from './jaldee-online/jaldee-online.component';

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
        ProPicPopupModule,
        NgxQRCodeModule,
        ShareButtonsModule,
        ShareIconsModule
    ],
    declarations: [
        BProfileComponent,
        MediaComponent,
        AddProviderBprofileSpokenLanguagesComponent,
        ProviderBprofileSearchDynamicComponent,
        LanguagesComponent,
        QRCodeGeneratorComponent,
        AdditionalInfoComponent,
        SpecializationsComponent,
        AboutMeComponent,
        JaldeeOnlineComponent
    ],
    entryComponents: [
        AddProviderBprofileSpokenLanguagesComponent,
        QRCodeGeneratorComponent,
        ProviderBprofileSearchDynamicComponent
    ],
    exports: [
        BProfileComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
})
export class BProfileModule {}
