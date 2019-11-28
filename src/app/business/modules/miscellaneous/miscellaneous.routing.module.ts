import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';
import { ProviderNonworkingdaysComponent } from '../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { SaleschannelComponent } from './saleschannel/saleschannel.component';
import { JDNComponent } from './jdn/jdn.component';

const routes: Routes = [
    { path: '', component: MiscellaneousComponent },
    {
      path: 'holidays',
      component: ProviderNonworkingdaysComponent
    },
    {
      path: 'saleschannel',
      component: SaleschannelComponent
    },
    {
      path: 'jdn',
      component: JDNComponent
    },
    { path: 'labels', loadChildren: './labels/labels.module#LabelsModule'},
    { path: 'skins', loadChildren: './skins/provider-skins.module#ProviderSkinsModule' },
    { path: 'users', loadChildren: './users/users.module#UsersModule' },
    { path: 'corporate', loadChildren: './corporate/corporate.module#CorporateModule' },
    { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsModule'}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MiscellaneousRoutingModule {}
