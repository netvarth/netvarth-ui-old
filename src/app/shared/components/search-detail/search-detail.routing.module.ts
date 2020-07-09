import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchDetailComponent } from './search-detail.component';
import { ProviderDetailComponent } from '../provider-detail/provider-detail.component';
import { ConsumerWaitlistHistoryComponent } from '../consumer-waitlist-history/consumer-waitlist-history.component';
import { SearchProviderComponent } from '../search-provider/search-provider.component';

const routes: Routes = [
    { path: '', component: SearchDetailComponent },
    {
        path: '', children: [
            {
                path: ':id', component: ProviderDetailComponent
            },
            {
                path: ':id/history', component: ConsumerWaitlistHistoryComponent
            },
            {
                path: ':id/:deptId', component: SearchProviderComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchDetailRoutingModule {
}
