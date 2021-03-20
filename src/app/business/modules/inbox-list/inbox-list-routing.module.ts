import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { InboxListComponent } from './inbox-list.component';

const routes: Routes = [
    { path: '', component: InboxListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule {
}
