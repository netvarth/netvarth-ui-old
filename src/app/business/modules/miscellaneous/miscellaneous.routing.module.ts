import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';
import { ProviderNonworkingdaysComponent } from '../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { ProviderNotificationsComponent } from '../../../ynw_provider/components/provider-notifications/provider-notifications.component';
import { SaleschannelComponent } from './saleschannel/saleschannel.component';

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
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MiscellaneousRoutingModule {}
