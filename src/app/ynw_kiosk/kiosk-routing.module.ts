import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { KioskComponent } from './kiosk.component';
import { KioskHomeComponent } from './components/home/kiosk-home.component';

// import { AuthGuardProviderHome, AuthGuardNewProviderHome, AuthGuardLogin } from '../shared/guard/auth.guard';

const routes: Routes = [
    {
        path: '', component: KioskComponent, children: [
            {
                path: '', component: KioskHomeComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class KioskRouterModule {

}
