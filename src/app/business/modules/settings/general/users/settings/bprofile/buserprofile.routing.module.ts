import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuserProfileComponent } from './buserprofile.component';
import { MediaComponent } from './media/media.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { LanguagesComponent } from './languages/languages.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';
import { AboutmeComponent } from './aboutme/aboutme.component';

const routes: Routes = [
    {path: '', component: BuserProfileComponent },
    {path: '', children : [
        {path: 'media', component: MediaComponent },
        {path: 'specializations', component: SpecializationsComponent },
        {path: 'languages', component: LanguagesComponent },
        {path: 'additionalinfo', component: AdditionalInfoComponent },
        {path: 'aboutme', component: AboutmeComponent }
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BuserProfileRoutingModule {}
