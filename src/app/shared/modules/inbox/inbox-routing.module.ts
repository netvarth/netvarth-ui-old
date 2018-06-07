import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { InboxOuterComponent } from './inbox-outer/inbox-outer.component';

const routes: Routes = [
    { path: '', component: InboxOuterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule {
}
