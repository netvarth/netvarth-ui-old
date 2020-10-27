import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceSelectionComponent } from './service-selection.component';
const routes: Routes = [
    {
      path: '', component: ServiceSelectionComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceSelectionRoutingModule {}
