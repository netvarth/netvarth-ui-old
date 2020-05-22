import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';
// import { ProviderNonworkingdaysComponent } from '../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { JDNComponent } from './jdn/jdn.component';

import { SaleschannelSettingsComponent } from './saleschannel/sc-settings.component';

const routes: Routes = [
    { path: '', component: MiscellaneousComponent },
    // {
    //   path: 'holidays',
    //   component: ProviderNonworkingdaysComponent
    // },
    {
      path: 'saleschannel',
      component: SaleschannelSettingsComponent
    },
    {
      path: 'jdn',
      component: JDNComponent
    },

    // { path: 'holidays', loadChildren: () => import('./NonWorkingDay/NonWorkingDay.module').then(m => m.NonWorkingDaymodule)},
    // { path: 'labels', loadChildren: () => import('../settings/general/labels/labels.module').then(m => m.LabelsModule)},
    // { path: 'skins', loadChildren: () => import('../settings/general/skins/provider-skins.module').then(m => m.ProviderSkinsModule) },
    // { path: 'users', loadChildren: () => import('../general/users/users.module').then(m => m.UsersModule) },
    // { path: 'customview', loadChildren: () => import('../settings/general/customview/customview.module').then(m => m.CustomViewmodule) },

    { path: 'corporate', loadChildren: () => import('./corporate/corporate.module').then(m => m.CorporateModule) },
    { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule)}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MiscellaneousRoutingModule {}
