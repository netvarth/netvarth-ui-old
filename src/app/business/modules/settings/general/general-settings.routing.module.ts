import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralSettingsComponent } from './general-settings.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentDetailComponent } from './departments/details/department.details.component';

const routes: Routes = [
    {path: '', component: GeneralSettingsComponent},
    {path: 'locations', loadChildren: () => import('../../../../business/modules/settings/general/locations/locations-list.module').then(m => m.LocationListModule)},
    { path: 'holidays', loadChildren: () => import('../../settings/general/holiday/holiday.module').then(m => m.HolidayModule)},
    { path: 'labels', loadChildren: () => import('../../settings/general/labels/labels.module').then(m => m.LabelsModule)},
    { path: 'skins', loadChildren: () => import('../../settings/general/skins/provider-skins.module').then(m => m.ProviderSkinsModule) },
    { path: 'customview', loadChildren: () => import('../../settings/general/customview/customview.module').then(m => m.CustomViewModule)},
    { path: 'users', loadChildren: () => import('../../settings/general/users/users.module').then(m => m.UsersModule) },
    {path: 'departments', component: DepartmentsComponent },
    {path: 'department/:id', component: DepartmentDetailComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneralSettingsRoutingModule {}
