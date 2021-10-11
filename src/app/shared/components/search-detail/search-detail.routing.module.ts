import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchDetailComponent } from './search-detail.component';

const routes: Routes = [
    { path: '', component: SearchDetailComponent },
    { path: ':id', loadChildren:() => import('../provider-detail/provider-detail.module').then(m=>m.ProviderDetailModule) },
    { path: ':id/history', loadChildren: () => import('../consumer-waitlist-history/consumer-waitlist-history.module').then(m=>m.ConsumerWaitlistHistoryModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchDetailRoutingModule {
}
