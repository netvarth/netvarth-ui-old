import { NgModule } from '@angular/core';
import { BuserProfileComponent } from './buserprofile.component';
import { LoadingSpinnerModule } from '../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CommonModule } from '@angular/common';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { UserBprofileSearchDynamicModule } from './additionalinfo/provider-userbprofile-search-dynamic.component/provider-userbrofile-search-dynamic.module';
import { QRCodeGeneratorModule } from '../../../../bprofile/qrcodegenerator/qrcodegenerator.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CapitalizeFirstPipeModule } from '../../../../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { UserBprofileSearchPrimaryModule } from './user-bprofile-search-primary/user-bprofile-search-primary.module';
const routes: Routes = [
    {path: '', component: BuserProfileComponent },
    {path: '', children : [
        {path: 'media', loadChildren: ()=> import('./media/media.module').then(m=>m.MediaModule)},
        {path: 'specializations', loadChildren: ()=> import('./specializations/specializations.module').then(m=>m.SpecializationsModule) },
        {path: 'languages', loadChildren: ()=> import('./languages/languages.module').then(m=>m.LanguagesModule) },
        {path: 'additionalinfo', loadChildren: ()=> import('./additionalinfo/additionalinfo.module').then(m=>m.AdditionalInfoModule) },
        {path: 'aboutme', loadChildren: ()=> import('./aboutme/aboutme.module').then(m=>m.AboutmeModule)}
    ]}
];
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        ShareButtonsModule,
        ShareIconsModule,
        UserBprofileSearchDynamicModule,
        QRCodeGeneratorModule,
        NgxQRCodeModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        UserBprofileSearchPrimaryModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        BuserProfileComponent
    ],
    exports: [
        BuserProfileComponent
    ]
})
export class BuserProfileModule { }
