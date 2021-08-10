import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordsDatagridComponent } from './records-datagrid.component';

const routes: Routes = [
    { path: '', component: RecordsDatagridComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RecordsDatagridRoutingModule { }
