import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BProfileComponent } from './bprofile.component';
import { MediaComponent } from './media/media.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { LanguagesComponent } from './languages/languages.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';

const routes: Routes = [
    {path: '', component: BProfileComponent },
    {path: '', children : [
        {path: 'media', component: MediaComponent },
        {path: 'specializations', component: SpecializationsComponent },
        {path: 'languages', component: LanguagesComponent },
        {path: 'additionalinfo', component: AdditionalInfoComponent },
    ]},
    {
        path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BProfileRoutingModule {}
