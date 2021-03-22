import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';
import { JDNComponent } from './jdn/jdn.component';

import { SaleschannelSettingsComponent } from './saleschannel/sc-settings.component';

const routes: Routes = [
  { path: '', component: MiscellaneousComponent },
  {
    path: 'saleschannel',
    component: SaleschannelSettingsComponent
  },
  {
    path: 'jdn',
    component: JDNComponent
  },
  { path: 'corporate', loadChildren: () => import('./corporate/corporate.module').then(m => m.CorporateModule) }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MiscellaneousRoutingModule { }
