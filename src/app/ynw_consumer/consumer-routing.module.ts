import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ConsumerHomeComponent} from './components/home/consumer-home.component';
import {WaitlistComponent} from './components/waitlist/waitlist.component';
import {MembersComponent } from './components/members/members.component';

import { WaitlistDetailResolver } from './services/waitlist-detail-resolver.service';
const routes: Routes = [
  {path: '', component: ConsumerHomeComponent},
  {path: 'waitlist', component: WaitlistComponent, resolve: {
    waitlist_detail: WaitlistDetailResolver
  }},
  {path: 'members', component: MembersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}
