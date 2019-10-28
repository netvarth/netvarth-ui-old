import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';
import { ProviderNonworkingdaysComponent } from '../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { ProviderNotificationsComponent } from '../../../ynw_provider/components/provider-notifications/provider-notifications.component';
import { SaleschannelComponent } from './saleschannel/saleschannel.component';
import { JDNComponent } from './jdn/jdn.component';

const routes: Routes = [
    { path: '', component: MiscellaneousComponent },
    {
      path: 'holidays',
      component: ProviderNonworkingdaysComponent
    },
    {
      path: 'notifications',
      component: ProviderNotificationsComponent
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
    { path: 'skins', loadChildren: './skins/provider-skins.module#ProviderSkinsModule' }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MiscellaneousRoutingModule {}
