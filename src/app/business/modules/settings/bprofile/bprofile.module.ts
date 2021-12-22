import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BProfileComponent } from './bprofile.component';
import { QRCodeGeneratorModule } from './qrcodegenerator/qrcodegenerator.module';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProPicPopupModule } from './pro-pic-popup/pro-pic-popup.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ProviderBprofileSearchDynamicModule } from '../../provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.module';
import { GalleryService } from '../../../../shared/modules/gallery/galery-service';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AddProviderWaitlistLocationsModule } from '../../add-provider-waitlist-locations/add-provider-waitlist-locations.module';
const routes: Routes = [
    { path: '', component: BProfileComponent },
    { path: '', children: [
        { path: 'specializations', loadChildren: ()=> import('./specializations/specializations.module').then(m=>m.SpecializationsModule)},
        { path: 'languages',loadChildren: ()=> import('./languages/languages.module').then(m=>m.LanguagesModule)},
        { path: 'additionalinfo', loadChildren: ()=> import('./additionalinfo/additionalinfo.module').then(m=>m.AdditionalInfoModule)},
        { path: 'aboutme',loadChildren: ()=> import('./aboutme/aboutme.module').then(m=>m.AboutMeModule) },
        { path: 'jaldeeonline',loadChildren: ()=> import('./jaldee-online/jaldee-online.module').then(m=>m.JaldeeOnlineModule)},
        { path: 'social',loadChildren: ()=> import('./social-media/social-media.module').then(m=>m.SocialMediaModule)}
    ]},
    { path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule)},
    { path: 'jaldee-integration', loadChildren: () => import('./integration/integration-settings.module').then(m => m.IntegrationSettingsModule) }
];
@NgModule({
    imports: [
        CommonModule,
        ProPicPopupModule,
        QRCodeGeneratorModule,
        GalleryModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatMenuModule,
        MatIconModule,
        MatProgressBarModule,
        ImageCropperModule,
        ShareButtonsModule,
        ShareIconsModule,
        NgxQRCodeModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        Nl2BrPipeModule,
        AddProviderWaitlistLocationsModule,
        ProviderBprofileSearchDynamicModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        BProfileComponent
    ],
    exports: [
        BProfileComponent
    ],
    providers: [
        GalleryService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
})
export class BProfileModule {}
