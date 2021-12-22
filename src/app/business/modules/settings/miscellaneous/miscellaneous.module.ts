import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscellaneousComponent } from './miscellaneous.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: MiscellaneousComponent },
    { path: 'saleschannel', loadChildren: ()=> import('./saleschannel/sc-settings.module').then(m=>m.SCSettingsModule) },
    { path: 'jdn', loadChildren: ()=> import('./jdn/jdn.module').then(m=>m.JDNModule) },
    { path: 'corporate', loadChildren: () => import('./corporate/corporate.module').then(m => m.CorporateModule) }
  ];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        MiscellaneousComponent
    ],
    exports: [MiscellaneousComponent]
})
export class MiscellaneousModule { }
