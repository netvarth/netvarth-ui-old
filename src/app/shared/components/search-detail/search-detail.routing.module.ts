import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchDetailComponent } from './search-detail.component';
import { ConsumerWaitlistHistoryComponent } from '../consumer-waitlist-history/consumer-waitlist-history.component';

const routes: Routes = [
    { path: '', component: SearchDetailComponent },
    {
        path: '', children: [
            {
                path: ':id/history', component: ConsumerWaitlistHistoryComponent
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
