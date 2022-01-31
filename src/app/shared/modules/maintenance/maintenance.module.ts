import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { MaintenanceComponent } from './maintenance.component';
const routes: Routes = [
  { path: '', component: MaintenanceComponent}
]
@NgModule({
    imports: [
      CommonModule,
      LoadingSpinnerModule,
      [RouterModule.forChild(routes)]
    ],
    declarations: [MaintenanceComponent],
    exports: [MaintenanceComponent],
    providers: [SharedServices]
})

export class MaintenanceModule {}
