import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BProfileComponent } from './bprofile.component';
import { MediaComponent } from './media/media.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { LanguagesComponent } from './languages/languages.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
    {path: '', component: BProfileComponent },
    {path: '', children : [
        {path: 'media', component: MediaComponent },
        {path: 'specializations', component: SpecializationsComponent },
        {path: 'languages', component: LanguagesComponent },
        {path: 'additionalinfo', component: AdditionalInfoComponent },
    ]},
    {
        path: 'privacy', loadChildren: './privacy/privacy.module#PrivacyModule'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BProfileRoutingModule {}
