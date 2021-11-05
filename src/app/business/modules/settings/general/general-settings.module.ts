import { NgModule } from '@angular/core';
import { GeneralSettingsComponent } from './general-settings.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmBoxModule } from '../../../../shared/components/confirm-box/confirm-box.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: GeneralSettingsComponent },
    { path: 'locations', loadChildren: () => import('../../../../business/modules/settings/general/locations/locations-list.module').then(m => m.LocationListModule) },
    { path: 'holidays', loadChildren: () => import('./holiday/holiday-list/holiday.module').then(m => m.HolidayModule) },
    { path: 'labels', loadChildren: () => import('../../settings/general/labels/labels.module').then(m => m.LabelsModule) },
    { path: 'customview', loadChildren: () => import('./customview/customview-list/customview-list.module').then(m => m.CustomViewListModule) },
    { path: 'users', loadChildren: () => import('../../settings/general/users/users.module').then(m => m.UsersModule) },
    { path: 'livetrack', loadChildren: () => import('../../settings/general/livetrack/livetrack-settings.module').then(m => m.LiveTrackSettingsModule) },
    { path: 'departments', loadChildren: ()=> import('./departments/departments.module').then(m=>m.DepartmentsModule)},
    { path: 'departments/list', loadChildren: ()=> import('./departments/department-list/department-list.module').then(m=>m.DepartmentListModule)},
    { path: 'department/:id', loadChildren: ()=> import('./departments/details/department-details.module').then(m=>m.DepartmentDetailsModule)},
    { path: 'questionnaire', loadChildren: () => import('../../settings/general/questionnaire/questionnaire.module').then(m => m.QuestionnaireListModule)},
    { path: 'templates', loadChildren: ()=> import('../../../../custom-templates/custom-templates.module').then(m=> m.CustomTemplatesModule)},
    { path: 'newsfeed', loadChildren: ()=> import('../../../../news-feed/newsfeed.component.module').then(m=> m.NewsfeedModule)}
];
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)],
        CapitalizeFirstPipeModule
    ],
    declarations: [
        GeneralSettingsComponent
    ],
    exports: [
        GeneralSettingsComponent
    ]
})
export class GeneralSettingsModule { }
