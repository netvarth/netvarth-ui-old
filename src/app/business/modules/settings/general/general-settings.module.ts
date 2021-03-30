import { NgModule } from '@angular/core';
import { GeneralSettingsComponent } from './general-settings.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentModule } from '../../../../ynw_provider/shared/modules/department/department.module';
import { GeneralSettingsRoutingModule } from './general-settings.routing.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentDetailComponent } from './departments/details/department.details.component';
import { DepartmentListComponent } from './departments/department-list/department-list.component';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        DepartmentModule,
        LoadingSpinnerModule,
        BreadCrumbModule,
        GeneralSettingsRoutingModule,
        QuestionnaireModule
    ],
    declarations: [
        GeneralSettingsComponent,
        DepartmentsComponent,
        DepartmentListComponent,
        DepartmentDetailComponent
    ],
    exports: [
        GeneralSettingsComponent
    ]
})
export class GeneralSettingsModule {}

